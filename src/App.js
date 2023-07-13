import React from "react";
import { useState, useEffect } from "react";

import { Blogs, BlogForm } from "./components/Blog";
import { LoginForm } from "./components/Login";
import { Togglable } from "./components/Togglable";


const App = () => {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

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


  const handleLogout = () => {
    console.log("Logging out...");
    window.localStorage.removeItem("token");
    setUser(null);
    setMessage("Logged out");
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
          <LoginForm 
            setUser={setUser}
            setMessage={setMessage}
          />
        </Togglable>
      </div>
      <div style={showIfLoggedIn}>
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
        handleLogout={handleLogout}
      />
    </div>
  );
};

export default App;
