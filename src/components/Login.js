import React, { useState } from "react";

import { login } from "../services/login";


export const LoginForm = props => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    console.info("Login pressed...");

    const userForToken = {
      username: username,
      password: password
    };

    const token = await login(userForToken);
    if (token) {
      props.setUser(token);
      window.localStorage.setItem("token", token);
      props.setMessage("Login successful");
    } else {
      props.setMessage("Incorrect username or password");
    }
  };

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
