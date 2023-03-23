import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import React, { useState } from "react";
import { authService, googleProvider, githubProvider } from "../myBase";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const onChange = (event) => {
    const { name, value } = event.target;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(
          authService,
          email,
          password
        );
      } else {
        data = await signInWithEmailAndPassword(authService, email, password);
      }
      console.log(data);
    } catch (error) {
      setError(error.message);
      console.log(error);
    }
  };
  const toggleBtn = () => {
    setNewAccount((current) => !current);
  };

  const onSocial = async (event) => {
    const { name } = event.target;
    let provider;
    if (name === "google") {
      provider = googleProvider;
    } else if (name === "github") {
      provider = githubProvider;
    }
    await signInWithPopup(authService, provider);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="email"
          required
          placeholder="email"
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          required
          placeholder="password"
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log in"} />
      </form>
      <button onClick={toggleBtn}>로그인/가입 버튼바꾸기</button>
      <div>
        <button onClick={onSocial} name="github">
          깃헙
        </button>
        <button onClick={onSocial} name="google">
          구글
        </button>
      </div>
      <h3>{error}</h3>
    </div>
  );
};

export default Auth;
