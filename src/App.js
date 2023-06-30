import React from "react";
import { useState, useEffect } from "react";

import { Blogs, BlogForm } from "./components/Blog";
import { LoginForm } from "./components/Login";
import { Togglable } from "./components/Togglable";

import blogService from "./services/blogs";


const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState("");
  const [message, setMessage] = useState(null);

  // TODO fix notifications, trigger all useEffect things each time there is a notification
  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll();
      setBlogs(blogs);
    };

    const checkToken = () => {
      const tokenFromStorage = window.localStorage.getItem("token");
      if (tokenFromStorage) {
        const user = JSON.parse(tokenFromStorage);
        console.info("Logged in as:", user);
        setUser(user);
      }
    };

    if (message) {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    }

    fetchBlogs();
    checkToken();

  }, [message]);


  const handleLogout = () => {
    console.info("Logging out...");
    window.localStorage.removeItem("token");
    setUser(null);
    setMessage("Logged out");
  };

  return (
    <div>
      <h1>Blogs</h1>
      <div>
        <h3>{message}</h3>
      </div>
      <div style={{display: user ? "none" : ""}}>
        <Togglable buttonLabel="login">
          <LoginForm 
            setUser={setUser}
            setMessage={setMessage}
          />
        </Togglable>
      </div>
      <div style={{display: user ? "" : "none"}}>
        {user === null ? "No-one" : user.name} logged in
        <button type="button" onClick={handleLogout}>logout</button>
        <Togglable buttonLabel="create new">
          <BlogForm 
            setMessage={setMessage}
            user={user}
          />
        </Togglable>
      </div>
      <Blogs 
        user={user}
        blogs={blogs}
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default App;
