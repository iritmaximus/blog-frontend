import React from "react";
import { useState, useEffect } from "react";

import { Blogs, BlogForm } from "./components/Blog";
import { LoginForm } from "./components/Login";
import { Togglable } from "./components/Togglable";
import blogService from "./services/blogs";

const App = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const checkToken = () => {
      const tokenFromStorage = window.localStorage.getItem("token");
      if (tokenFromStorage) {
        const user = JSON.parse(tokenFromStorage);
        console.info("Logged in as:", user);
        setUser(user);
      }
    };

    checkToken();
  }, []);

  useEffect(() => {
    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }
  }, [message]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const sortByLikes = (blogA, blogB) => {
        if (blogA.likes > blogB.likes) {
          return 1;
        }
        if (blogA.likes < blogB.likes) {
          return -1;
        }
        return 0;
      };

      console.log("Fetching blogs...");
      const fetchedBlogs = await blogService.getAll();
      if (!fetchedBlogs) {
        console.warn("No blogs gotten from fetch...");
        setBlogs(blogs);
        return;
      }
      fetchedBlogs.sort(sortByLikes).reverse();
      console.info("Blogs:", fetchedBlogs);
      setBlogs(fetchedBlogs);
    };
    fetchBlogs();
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    window.localStorage.removeItem("token");
    setUser(null);
    setMessage("Logged out");
  };

  const handleCreate = async (blogObject) => {
    const title = blogObject.title;
    const author = blogObject.author;
    const url = blogObject.url;

    const result = await blogService.create(
      { title: title, author: author, url: url },
      user.token,
    );
    if (result) {
      setMessage(`${title} by ${author} was added`);
      setBlogs(blogs.concat(result));
    } else {
      console.error("Something weird happened...", result);
    }
  };

  const showIfLoggedIn = { display: user === null ? "none" : "" };
  const showIfLoggedOut = { display: user === null ? "" : "none" };

  return (
    <div>
      <h1>Blogs</h1>
      <div>
        <h3>{message}</h3>
      </div>
      <div style={showIfLoggedOut}>
        <Togglable buttonLabel="login">
          <LoginForm setUser={setUser} setMessage={setMessage} />
        </Togglable>
      </div>
      <div style={showIfLoggedIn}>
        {user === null ? "No-one" : user.name} logged in
        <button id="logout" type="button" onClick={handleLogout}>
          logout
        </button>
        <Togglable buttonLabel="create new">
          <BlogForm createBlog={handleCreate} user={user} />
        </Togglable>
      </div>
      <Blogs user={user} blogs={blogs} setBlogs={setBlogs} />
    </div>
  );
};

export default App;
