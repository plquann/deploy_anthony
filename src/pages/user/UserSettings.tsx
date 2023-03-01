import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { toast } from "react-toastify";
import axios from "axios";
import { ICustomErrType } from "../../util/config";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { useAppDispatch } from "../../redux/reduxHooks";
import { setUser } from "../../redux/reducers/userReducer";

export type UserEditForm = {
  id: string;
  email: string;
  name: string;
  phoneNumber: string;
  passWord: string;
};
type Props = {};

const UserSettings = (props: Props) => {
  const { user, userRegister } = useSelector((state: RootState) => state.userReducer);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const frmEdit = useFormik<UserEditForm>({
    initialValues: {
      id: user?.userId,
      email: user?.email,
      name: user?.name,
      phoneNumber: user?.phoneNumber,
      passWord: userRegister?.passWord,
    } as unknown as UserEditForm,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      id: Yup.string().required("ID cannot be blank !"),
      email: Yup.string()
        .required("email cannot be blank !")
        .email("email is invalid !"),

      name: Yup.string().required("name cannot be blank !"),
      phoneNumber: Yup.string().required("phone cannot be blank !"),
    }),
    onSubmit: async (value: UserEditForm) => {
      try {
        const newUser = {
          ...value,
        };
        const data = await axios.put(
          "https://jiranew.cybersoft.edu.vn/api/Users/editUser",
          newUser
        );

        if (data && data.data.statusCode === 200) {
          toast.success("Update success");

          navigate("/project ");
        }
      } catch (e) {
        const error = e as ICustomErrType as any;

        if (error && error.response) {
          toast.error(error.response.data.message);
        }
      }
    },
  });

  return (
    <div className="content-box">
      <ul className="breadcrumb">
        <li>
          <a href="">User</a>
        </li>
        <li>
          <a href="">Cyber learn</a>
        </li>
        <li>
          <a href="">User settings</a>
        </li>
      </ul>
      <h2 className="content-title">User settings</h2>
      <form onSubmit={frmEdit.handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">
                ID <span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="id"
                name="id"
                disabled
                value={frmEdit.values.id}
                onChange={frmEdit.handleChange}
                onBlur={frmEdit.handleBlur}
              />
              {frmEdit.errors.id && (
                <p className="text-danger">{frmEdit.errors.id}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label">
                Email <span>*</span>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={frmEdit.values.email}
                onChange={frmEdit.handleChange}
                onBlur={frmEdit.handleBlur}
              />
              {frmEdit.errors.email && (
                <p className="text-danger">{frmEdit.errors.email}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label">
                Set Password (blank if no change)
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={frmEdit.values.passWord}
                onChange={frmEdit.handleChange}
                onBlur={frmEdit.handleBlur}
              />
            </div>
            
          </div>
          <div className="col-md-6">
            <div className="mb-4">
              <label className="form-label">
                Name <span>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={frmEdit.values.name}
                onChange={frmEdit.handleChange}
                onBlur={frmEdit.handleBlur}
              />
              {frmEdit.errors.name && (
                <p className="text-danger">{frmEdit.errors.name}</p>
              )}
            </div>
            <div className="mb-4">
              <label className="form-label">Phone number</label>
              <input
                type="text"
                className="form-control"
                id="phoneNumber"
                name="phoneNumber"
                value={frmEdit.values.phoneNumber}
                onChange={frmEdit.handleChange}
                onBlur={frmEdit.handleBlur}
              />
              {frmEdit.errors.phoneNumber && (
                <p className="text-danger">{frmEdit.errors.phoneNumber}</p>
              )}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end mt-5">
          <button
            type="submit"
            className="btn btn-1"
            // onClick={() =>
            //   dispatch(
            //     setUser({
            //       userId: Number(frmEdit.values.id),
            //       name: frmEdit.values.name,
            //       avatar: user?.avatar,
            //       email: frmEdit.values.name,
            //       phoneNumber: frmEdit.values.name,
            //     })
            //   )
            // }
          >
            Update
          </button>
          <button
            type="button"
            className="btn btn-outline-light text-dark"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
export default UserSettings;
