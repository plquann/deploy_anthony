import { useFormik } from "formik";
import React, { useState } from "react";
import { useAppDispatch } from "../../redux/reduxHooks";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ICustomErrType } from "../../util/config";
import { NavLink, useNavigate } from "react-router-dom";
import { registerApi } from "../../redux/reducers/userReducer";

export type UserRegisterForm = {
  email: string;
  passWord: string;
  name: string;
  phoneNumber: string;
};
type Props = {};

const Register = (props: Props) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const frmRegister = useFormik<UserRegisterForm>({
    initialValues: {
      email: "",
      passWord: "",
      name: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required("email cannot be blank !")
        .email("email is invalid !"),
      passWord: Yup.string().required("password cannot be blank !"),
      name: Yup.string().required("name cannot be blank !"),
      phoneNumber: Yup.string().required("phone cannot be blank !"),
    }),
    onSubmit: async (value: UserRegisterForm) => {
      try {
        console.log('test log')
        const newUser = {
          ...value,
        };
        await dispatch(registerApi(newUser));
        navigate("/login ");
      } catch (e) {
        const error = e as ICustomErrType as any;

        if (error && error.response) {
          toast.error(error.response.data.message);
        }
      }
    },
  });
  return (
    <div className="form-login">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="thumb">
              <img src="img/register.png" alt="..." />
            </div>
          </div>
          <div className="col-lg-6">
            <div className="box">
              <h2 className="title">Register your account</h2>
              <form className="container" onSubmit={frmRegister.handleSubmit}>
                <div className="mb-3 mt-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter email"
                    name="email"
                    onChange={frmRegister.handleChange}
                    onBlur={frmRegister.handleBlur}
                  />
                  {frmRegister.errors.email && (
                    <p className="text-danger">{frmRegister.errors.email}</p>
                  )}
                </div>
                <div className="mb-3">
                  <div className="d-flex">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      id="passWord"
                      placeholder="Enter password"
                      name="passWord"
                      onChange={frmRegister.handleChange}
                      onBlur={frmRegister.handleBlur}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      style={{
                        textAlign: "center",
                        width: "60px",
                        border: "1px solid #e1eeff",
                        backgroundColor: "#EFF6FF",
                      }}
                    >
                      <i
                        className={
                          showPassword
                            ? "form-eye fa-solid fa-eye-slash"
                            : "form-eye fa-solid fa-eye"
                        }
                      ></i>
                    </button>
                  </div>
                  {frmRegister.errors.passWord && (
                    <p className="text-danger">{frmRegister.errors.passWord}</p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="phone"
                    className="form-control"
                    id="phoneNumber"
                    placeholder="Enter phone number"
                    name="phoneNumber"
                    onChange={frmRegister.handleChange}
                    onBlur={frmRegister.handleBlur}
                  />
                  {frmRegister.errors.phoneNumber && (
                    <p className="text-danger">
                      {frmRegister.errors.phoneNumber}
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <input
                    type="name"
                    className="form-control"
                    id="name"
                    placeholder="Enter name"
                    name="name"
                    onChange={frmRegister.handleChange}
                    onBlur={frmRegister.handleBlur}
                  />
                  {frmRegister.errors.name && (
                    <p className="text-danger">{frmRegister.errors.name}</p>
                  )}
                </div>
                <button type="submit" className="btn btn-1">
                  Register now
                </button>
              </form>
              <div className="login">
                If you have account,
                <NavLink to="/login" aria-current="page">
                  {" sign in "}
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

export default Register;
