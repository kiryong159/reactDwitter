import { signInWithPopup } from "firebase/auth";
import React from "react";
import { authService, googleProvider, githubProvider } from "../myBase";
import AuthForm from "../components/AuthForm";
//폰트어썸
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faGoogle } from "@fortawesome/free-brands-svg-icons";

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
    <div className="AuthBigBox">
      <AuthForm />
      <div className="social-login-box">
        <button onClick={onSocial} name="github">
          <FontAwesomeIcon icon={faGithub} />
          　깃헙으로 로그인하기
        </button>
        <button onClick={onSocial} name="google">
          <FontAwesomeIcon icon={faGoogle} />
          　구글로 로그인하기
        </button>
      </div>
    </div>
  );
};

export default Auth;
