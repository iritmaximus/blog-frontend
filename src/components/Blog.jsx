import React, { useState, useEffect } from "react"; 
import PropTypes from "prop-types";

import blogService from "../services/blogs";


export const Blog = ({ user, blog, handleLike, handleRemove}) => {
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
    if (user && blog && blog.user) {
      setSameUserStyle({ display: user.username === blog.user.username ? "" : "none" });
    }
  }, []);


  return (
    <div style={blogStyle}>
      {blog.title}, {blog.author}
      <button onClick={toggleShowItem}>{showBlog ? "hide" : "view"}</button>
      <div style={showBlogStyle}>
        {blog.url}<br/>
        likes {blog.likes}
        <button onClick={() => handleLike(blog, user)}>like</button><br/>
        {blog.user == null ? "No-one" : blog.user.name}
        <button style={sameUserStyle} onClick={() => handleRemove(blog, user)}>remove</button>
      </div>
    </div>
  );
};

export const Blogs = ({ user, blogs, setBlogs }) => {
  const handleRemove = async (blog, user) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return;
    }

    try {
      const deletedBlog = await blogService.deleteBlog(blog, user.token);
      console.log("Blog deleted");
      console.info("DELETE response", deletedBlog);
      setBlogs(blogs.filter(blog => blog.id !== blog.id));
    } catch (e) {
      console.error("Failed to remove blog", e);
    }
  };

  const handleLike = async (blog, user) => {
    if (!user) {
      console.error("Not logged in");
      return;
    }
    const newBlog = await blogService.update(blog, blog.likes + 1, user.token);
    const updatedBlogs = blogs.map(blog => {
      if (blog.id === newBlog.id) { 
        blog.likes = newBlog.likes;
        return blog;
      } else {
        return blog;
      }});
    setBlogs(updatedBlogs);
    console.log("Liked post");
  };

  return (
    <div>
      <h3>List of blogs</h3>
      <div style={{display: user ? "" : "none"}}>
      </div>
      {blogs.length === 0 ? <p>No blogs</p> : blogs.map(blog =>
        <Blog 
          key={blog.id} 
          blog={blog} 
          user={user} 
          handleLike={handleLike} 
          handleRemove={handleRemove}
        />
      )}
    </div>
  );
};


export const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

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
  user: PropTypes.object,
  blog: PropTypes.object.isRequired,
  handleLike: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

Blogs.propTypes = {
  user: PropTypes.object,
  blogs: PropTypes.array,
  setBlogs: PropTypes.func.isRequired
};

BlogForm.propTypes = {
  user: PropTypes.object,
  addBlog: PropTypes.func.isRequired,
};
