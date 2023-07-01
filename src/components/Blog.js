import React, { useState, useEffect } from "react"; 
import axios from "axios";
import PropTypes from "prop-types";

import blogService from "../services/blogs";
import { parseToken, createConfig } from "../services/token";


export const Blog = props => {
  const [showBlog, setShowBlog] = useState(false);
  const [sameUserStyle, setSameUserStyle] = useState({display: "none"});

  const toggleShowItem = () => {
    setShowBlog(!showBlog);
  };

  const showBlogStyle = { display: showBlog ? "" : "none" };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  useEffect(() => {
    if (props.user && props.blog) {
      setSameUserStyle({ display: props.user.username === props.blog.user.username ? "" : "none" });
    }
  }, []);

  const handleLike = async props => {
    if (!props.user) {
      console.error("Not logged in");
      return;
    }
    const newBlog = await blogService.update(props.blog, props.blog.likes + 1, props.user.token);
    const updatedBlogs = props.blogs.map(blog => {
      if (blog.id === newBlog.id) { 
        blog.likes = newBlog.likes;
        return blog;
      } else {
        return blog;
      }});
    props.setBlogs(updatedBlogs);
    console.log("Liked post");
  };
  
  const handleRemove = async props => {
    if (!window.confirm(`Remove blog ${props.blog.title} by ${props.blog.author}?`)) {
      return;
    }

    const config = createConfig(parseToken(props.user.token));
    try {
      const result = await axios.delete("/api/blogs/" + props.blog.id, config);
      console.log(result.data.message);
      props.setBlogs(props.blogs.filter(blog => blog.id !== props.blog.id));
    } catch (e) {
      console.error("Failed to remove blog", e);
    }
  };

  return (
    <div style={blogStyle}>
      {props.blog.title}, {props.blog.author}
      <button onClick={toggleShowItem}>{showBlog ? "hide" : "view"}</button>
      <div style={showBlogStyle}>
        <div>
          {props.blog.url}
        </div>
        <div>
          likes {props.blog.likes}
          <button onClick={() => handleLike(props)}>like</button>
        </div>
        <div>
          {props.blog.user.name}
        </div>
        <button style={sameUserStyle} onClick={() => handleRemove(props)}>remove</button>
      </div>
    </div>
  );
};

export const Blogs = props => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
      const sortByLikes = (blogA, blogB) => {
        if (blogA.likes > blogB.likes) { return 1; }
        if (blogA.likes < blogB.likes) { return -1; }
        return 0;
      };

    console.log("Fetching blogs...");
    const blogs = await blogService.getAll();
    blogs.sort(sortByLikes).reverse();
    setBlogs(blogs);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div>
      <h3>List of blogs</h3>
      <div style={{display: props.user ? "" : "none"}}>
      </div>
      {blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          blogs={blogs}
          user={props.user} 
          updateBlogs={fetchBlogs} 
          setBlogs={setBlogs}
        />
      )}
    </div>
  );
};


export const BlogForm = props => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async event => {
    event.preventDefault();
    console.log("Creating new blog...");
    const result = await blogService.create({title: title, author: author, url: url}, props.user.token);
    if (result) {
      props.setMessage(`${title} by ${author} was added`);
    }
  };
          
  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title: 
          <input
            type="text"
            value={title}
            name="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author: 
          <input
            type="text"
            value={author}
            name="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url: 
          <input
            type="text"
            value={url}
            name="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
  updateBlogs: PropTypes.func.isRequired,
  setBlogs: PropTypes.func.isRequired,
};

Blogs.propTypes = {
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
};

BlogForm.propTypes = {
  user: PropTypes.object,
  setMessage: PropTypes.func.isRequired,
};
