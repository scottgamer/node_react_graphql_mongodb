import React, { useState, useRef, useContext } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

import axios from "axios";

const Auth = () => {
  const [isLogin, setLogin] = useState(false);

  const emailEl = useRef(null);
  const passwordEl = useRef(null);

  const contextType = useContext(AuthContext);

  const switchModeHandler = () => {
    setLogin(!isLogin);
  };

  const submitHandler = async event => {
    event.preventDefault();

    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    console.log(email, password);

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}"){
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}){
              _id
              email
            }
          }
        `
      };
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/graphql",
        JSON.stringify(requestBody),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed");
      }
      console.log(response.data.data);

      if (response.data.data.login.token) {
        contextType.login(
          response.data.data.login.token,
          response.data.data.login.userId,
          response.data.data.login.tokenExpiration
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="auth-form" onSubmit={e => submitHandler(e)}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? "Signup" : "Login"}
        </button>
      </div>
    </form>
  );
};

export default Auth;
