import React from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

const SocialButton = (props:any) => {
  const { children, triggerLogin, ...rest } = props;
  return (
    <LoginSocialFacebook {...rest}>
      <FacebookLoginButton />
    </LoginSocialFacebook>
  );
};

export default SocialButton;
