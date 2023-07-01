import React, { useState, useEffect } from "react"; 
import axios from "axios";
import PropTypes from "prop-types";

import blogService from "../services/blogs";
import { parseToken, createConfig } from "../services/token";


export const Blog = ({ blog, user, updateBlogs }) => {
  const [showBlog, setShowBlog] = useState(false);
  const [likes, setLikes] = useState(null);
  const [sameUserStyle, setSameUserStyle] = useState({display: "none"});


  const showBlogStyle = { display: showBlog ? "" : "none" };
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  useEffect(() => {
    if (!likes) {
      setLikes(blog.likes);
    }
    if (user && blog) {
      setSameUserStyle({ display: user.username === blog.user.username ? "" : "none" });
    }
  }, []);

  const toggleShowItem = () => {
    setShowBlog(!showBlog);
  };

  const handleLike = async (blog, token) => {
    console.log("Liked post");
    let newLikes = 0;

    const config = createConfig(parseToken(token));
    if (!likes) {
      newLikes = blog.likes + 1;
    } else {
      newLikes = likes + 1;
    }

    try {
      const result = await axios.put("/api/blogs/" + blog.id, { likes: newLikes }, config);
      console.log(result.data);
      if (result.data.likes) {
        setLikes(result.data.likes);
      }
    } catch (e) {
      console.error("Couldn't update likes", e);
    }
  };
  
  const handleRemove = async (blog, token, updateBlogs) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return;
    }
    console.log("Pressed remove");
    const config = createConfig(parseToken(token));
    try {
      const result = await axios.delete("/api/blogs/" + blog.id, config);
      console.log(result.data);
      // this could be a bad idea but it works...
      await updateBlogs();
    } catch (e) {
      console.error("Failed to remove blog", e);
    }
  };

  return (
    <div style={blogStyle}>
      {blog.title}, {blog.author}
      <button onClick={toggleShowItem}>{showBlog ? "hide" : "view"}</button>
      <div style={showBlogStyle}>
        <div>
          {blog.url}
        </div>
        <div>
          likes {likes}
          <button onClick={() => handleLike(blog, user.token)}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <button style={sameUserStyle} onClick={() => handleRemove(blog, user.token, updateBlogs)}>remove</button>
      </div>
    </div>
  );
};

export const Blogs = props => {
  const [blogs, setBlogs] = useState([]);

  const fetchBlogs = async () => {
      const sortByLikes = (blogA, blogB) => {
        if (blogA.likes < blogB.likes) {
          return -1;
        }
        if (blogA.likes > blogB.likes) {
          return 1;
        }
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
        <Blog key={blog.id} blog={blog} user={props.user} updateBlogs={fetchBlogs}/>
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
  user: PropTypes.object.isRequired,
  updateBlogs: PropTypes.func.isRequired,
};

Blogs.propTypes = {
  user: PropTypes.object.isRequired,
  handleLogout: PropTypes.func.isRequired,
};

BlogForm.propTypes = {
  user: PropTypes.object.isRequired,
  setMessage: PropTypes.func.isRequired,
};
