import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import blogService from "../services/blogs";

export const Blog = ({ user, blog, handleLike, handleRemove }) => {
  const [showBlog, setShowBlog] = useState(false);
  const [sameUserStyle, setSameUserStyle] = useState({ display: "none" });

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
      setSameUserStyle({
        display: user.username === blog.user.username ? "" : "none",
      });
    }
  }, []);

  return (
    <div style={blogStyle} className="blog">
      {blog.title}, {blog.author}
      <button className="toggle-blog-visibility" onClick={toggleShowItem}>
        {showBlog ? "hide" : "view"}
      </button>
      <div style={showBlogStyle}>
        {blog.url}
        <br />
        likes {blog.likes}
        <button className="like-blog" onClick={() => handleLike(blog, user)}>
          like
        </button>
        <br />
        {blog.user == null ? "No-one" : blog.user.name}
        <button
          className="remove-blog"
          style={sameUserStyle}
          onClick={() => handleRemove(blog, user)}
        >
          remove
        </button>
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
      setBlogs(blogs.filter((blog) => blog.id !== blog.id));
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
    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === newBlog.id) {
        blog.likes = newBlog.likes;
        return blog;
      } else {
        return blog;
      }
    });
    setBlogs(updatedBlogs);
    console.log("Liked post");
  };

  return (
    <div>
      <h3>List of blogs</h3>
      <div style={{ display: user ? "" : "none" }}></div>
      {blogs.length === 0 ? (
        <p>No blogs</p>
      ) : (
        blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
            handleLike={handleLike}
            handleRemove={handleRemove}
          />
        ))
      )}
    </div>
  );
};

export const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const addBlog = async (event) => {
    event.preventDefault();
    console.log("Creating new blog...");

    console.log(event.target.elements);

    console.log(event.target.author, typeof event.target.author);
    console.log(event.target.author.value, typeof event.target.author.value);

    const title = event.target.title.value;
    const author = event.target.author.value;
    const url = event.target.url.value;

    await createBlog({ title: title, author: author, url: url });
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            id="blog-title"
            type="text"
            value={title}
            name="title"
            placeholder="title"
            onChange={({ target }) => setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            id="blog-author"
            type="text"
            value={author}
            name="author"
            placeholder="author"
            onChange={({ target }) => setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            id="blog-url"
            type="text"
            value={url}
            name="url"
            placeholder="url"
            onChange={({ target }) => setUrl(target.value)}
          />
        </div>
        <button id="create-blog" type="submit">
          create
        </button>
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
  setBlogs: PropTypes.func.isRequired,
};

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired,
};
