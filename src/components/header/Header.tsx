import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/reduxHooks";
import { useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { huyStore, USER_LOGIN } from "../../util/config";
import { User, setUser } from "../../redux/reducers/userReducer";

type Props = {};

const Header = (props: Props) => {
  const { userLogin } = useSelector(
    (state: RootState) => state.userReducer
  );
  const dispatch = useAppDispatch();

     const darkmode = () => {
      let element:any = document.querySelector(".theme-switch");
      element.classList.toggle("active");
  
      let body:any = document.querySelector("body");
      body.classList.toggle("darkmode");
  }

  const showMenu = () => {
    let menu:any = document.querySelector(".menu-mobile ul");
    menu.classList.toggle("active");
}

  const renderLogin = () => {
    if (userLogin) {
      return (
        <div className="user">
          <div className="avatar">
            <img src="../../img/avatar.png" alt="" />
            <span>Hello {userLogin.name}</span>
          </div>
          <ul>
            <li className="disabled">
              <i className="fa-solid fa-key"></i> Change Password
            </li>
            <li>
              <NavLink
                to="/userSettings"
                aria-current="page"
                onClick={() => {
                  dispatch(
                    setUser({
                      userId: userLogin.id,
                      name: userLogin.name,
                      avatar: userLogin.avatar,
                      email: userLogin.email,
                      phoneNumber: userLogin.phoneNumber,
                    })
                  );
                }}
              >
                <i className="fa-solid fa-gear"></i> Account settings
              </NavLink>
            </li>
            <li
              onClick={() => {
                huyStore(USER_LOGIN);
                // navigate("/login");
                window.location.reload();
              }}
            >
              <NavLink to="/login">
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </NavLink>
            </li>
          </ul>
        </div>
      );
    }

 

    return (
      <div className="menu">
        <ul>
          <li>
            <NavLink to="/login" aria-current="page">
              Login
            </NavLink>
          </li>
          <li>
            <NavLink to="/register" aria-current="page">
              Register
            </NavLink>
          </li>
        </ul>
      </div>
    );
  };
  return (
    <div className="header">
      <div className="container">
        <div className="box">
          <div className="logo">
            <img src="img/logo.png" alt="..." />
          </div>
          <div className="name">ALOHA - Project And Task Management</div>

          {renderLogin()}

          <div className="toggle" onClick={() => darkmode()}>
            <div className="theme-switch">
              <div className="switch" />
            </div>
          </div>

          <div className="menu-mobile">
              <div className="icon" onClick={() => showMenu()}><i className="fa-solid fa-bars"></i></div>
              <ul>
                  <li>
                      <a href=""><i className="fa-solid fa-list-check"></i> Project management</a>
                  </li>
                  <li>
                      <a href=""><i className="fa-solid fa-sheet-plastic"></i> Create project</a>
                  </li>
                  <li>
                      <a href="javascript:;" data-bs-toggle="offcanvas" data-bs-target="#createtask"><i className="fa-solid fa-plus"></i> Create task</a>
                  </li>
                  <li>
                      <a href=""><i className="fa-solid fa-users"></i> User management</a>
                  </li>
                  <li>
                      <a href=""><i className="fa-solid fa-right-to-bracket"></i> Login</a>
                  </li>
                  <li>
                      <a href=""><i className="fa-solid fa-user"></i> Register</a>
                  </li>
                  <li>
                      <a href=""><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</a>
                  </li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
