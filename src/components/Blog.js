import React, { useState } from "react"; 
import blogService from "../services/blogs";

export const Blog = ({ blog }) => (
  <div>
    {blog.title} {blog.author}
  </div>  
);

export const Blogs = props => {
  return (
    <div>
      <div style={{display: props.user ? "" : "none"}}>
      </div>
      {props.blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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
