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

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs( blogs );
    };
    fetchBlogs();

    const tokenFromStorage = window.localStorage.getItem("token");
    if (tokenFromStorage) {
      const user = JSON.parse(tokenFromStorage);
      console.log(user);
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

  if (!user) {
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
  } else {
    return (
      <div>
        <h2>blogs</h2>
        <p>{user.name} logged in</p>
        <button type="button" onClick={handleLogout}>logout</button>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} />
        )}
      </div>
    );
  }
};

export default App;
