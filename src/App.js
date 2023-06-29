import React from "react";
import { useState, useEffect } from "react";

import Blog from "./components/Blog";
import blogService from "./services/blogs";
import { login } from "./services/login";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");

  const loginForm = () => {
    return (
      <div>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              value={username}
              name="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              name="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
  };

  const blogForm = () => {
    return (
      <div>
        {user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
        {createNewBlog()}
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    );
  };

  const createNewBlog = () => {
    return (
      <div>
        <form onSubmit={handleNewBlog}>
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

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs( blogs );
    };
    fetchBlogs();

    const tokenFromStorage = window.localStorage.getItem("token");
    if (tokenFromStorage) {
      const user = JSON.parse(tokenFromStorage);
      console.info("Logged in as:", user);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.info("Login pressed...");

    const userForToken = {
      username: username,
      password: password
    };

    const token = await login(userForToken);
    console.info("User:", JSON.parse(token));
    if (token) {
      setUser(token);
      window.localStorage.setItem("token", token);
    }
  };

  const handleLogout = () => {
    console.info("Logging out...");
    window.localStorage.removeItem("token");
    setUser(null);
  };

  const handleNewBlog = async event => {
    event.preventDefault();
    console.log("Creating new blog...");
    blogService.create({title: title, author: author, url: url}, user.token);
  };

  return (
    <div>
      <h1>Blogs</h1>
      {!user && loginForm()}
      {user && blogForm()}
    </div>
  );
};

export default App;
