import React, { useState } from "react";
import PropTypes from "prop-types";

import { login } from "../services/login";

export const LoginForm = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    console.info("Login pressed...");

    const userForToken = {
      username: username,
      password: password,
    };

    const token = await login(userForToken);
    if (token) {
      const tokenJSON = JSON.stringify(token);

      props.setUser(token);
      props.setMessage("Login successful");
      window.localStorage.setItem("token", tokenJSON);
      console.log("Logged in");
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
            id="username"
            type="text"
            value={username}
            name="username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <input
            id="password"
            type="password"
            value={password}
            name="password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id="login-button" type="submit">
          login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  setUser: PropTypes.func.isRequired,
  setMessage: PropTypes.func.isRequired,
};
