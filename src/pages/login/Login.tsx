import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import SocialButton from "../../components/SocialButton/SocialButton";
import { useAppDispatch } from "../../redux/reduxHooks";
import { ICustomErrType } from "../../util/config";
import { facebookLogin, loginApi } from "../../redux/reducers/userReducer";

export type UserLoginForm = {
  email: string;
  password: string;
};
type Props = {};

const Login = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const frmLogin = useFormik<UserLoginForm>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string().email("email is invalid!"),
      password: Yup.string().required("password cannot be blank!"),
    }),
    onSubmit: async (value: UserLoginForm) => {
      try {
        const user = {
          ...value,
        };
        await dispatch(loginApi(user));

        navigate("/project");
      } catch (e) {
        const error = e as ICustomErrType as any;
        if (error && error.response) {
          toast.error(error.response.data.message);
        }
      }
    },
  });
  const responseFacebook = async (response) => {
    await dispatch(facebookLogin(response.data.accessToken));
    navigate("/project");
  };
  return (
    <div className="form-login">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="thumb fix">
              <img src="img/login.png" alt="" />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="box">
              <h2 className="title">Login ALOHA</h2>
              <form className="container" onSubmit={frmLogin.handleSubmit}>
                <div className="mb-3 mt-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={frmLogin.handleChange}
                    onBlur={frmLogin.handleBlur}
                  />
                  {frmLogin.errors.email && (
                    <p className="text-danger">{frmLogin.errors.email}</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Enter password"
                    name="password"
                    onChange={frmLogin.handleChange}
                    onBlur={frmLogin.handleBlur}
                  />
                  
                  {frmLogin.errors.password && (
                    <p className="text-danger">{frmLogin.errors.password}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-1">
                  login
                </button>
              </form>
              <div className="social">
                <SocialButton
                  provider="facebook"
                  appId="857738365307206"
                  onResolve={responseFacebook}
                  onReject={(err) => console.log(err)}
                >
                  Login with facebook
                </SocialButton>
              </div>
              <div className="login">
                If you don't have account,
                <NavLink to="/register" aria-current="page">
                  {" sign up "}
                </NavLink>
                now.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
