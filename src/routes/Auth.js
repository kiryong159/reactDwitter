import { signInWithPopup } from "firebase/auth";
import React from "react";
import { authService, googleProvider, githubProvider } from "../myBase";
import AuthForm from "../components/AuthForm";

const Auth = () => {
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
      <AuthForm />
      <div>
        <button onClick={onSocial} name="github">
          깃헙
        </button>
        <button onClick={onSocial} name="google">
          구글
        </button>
      </div>
    </div>
  );
};

export default Auth;
