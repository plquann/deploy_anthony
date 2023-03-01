import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserLoginForm } from "../../pages/login/Login";
import { UserRegisterForm } from "../../pages/register/Register";
import {
  setStoreJson,
  getStoreJson,
  http,
  USER_LOGIN,
} from "../../util/config";
import { DispatchType } from "../configStore";

export type UserLogin = {
  id: number;
  email: string;
  avatar: string;
  phoneNumber: string;
  name: string;
  accessToken: string;
};
export type UserRegister = {
  email: string;
  passWord: string;
  name: string;
  phoneNumber: string;
};
export type User = {
  userId:      number;
  name:        string;
  avatar:      string;
  email:       string;
  phoneNumber: string;
}

export type UserState = {
  userLogin: UserLogin | null;
  userRegister: UserRegister | null;
  arrUsers: User[];
  user: User | null
};
const initialState: UserState = {
  userLogin: getStoreJson(USER_LOGIN) ? getStoreJson(USER_LOGIN) : null,
  userRegister: null,
  arrUsers: [],
  user: null
};
const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    loginAction: (state: UserState, action: PayloadAction<UserLogin>) => {
      state.userLogin = action.payload;
    },
    registerAction: (state: UserState, action: PayloadAction<UserRegister>) => {
      state.userRegister = action.payload;
    },
    usersAction: (state: UserState, action: PayloadAction<User[]>) => {
      state.arrUsers = action.payload;
    },
    setUser: (state:UserState, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    // delUser: (state:UserState, action: PayloadAction<Number>) => {
    //   let id = action.payload
    //   let prodIndex = state.arrUsers.findIndex((o, i) => {
    //     return o.userId === id;
    //   })
    //   state.arrUsers.splice(prodIndex, 1);
    // },
    // editUser: (state:UserState, action: PayloadAction<User>) => {
    //   let obj = action.payload
    //   let prodIndex = state.arrUsers.findIndex((o, i) => {
    //     return o.userId === obj.userId;
    //   })
    //   state.arrUsers[prodIndex] = obj;
    // },
  },
});

export const { loginAction, registerAction, usersAction, setUser } = userReducer.actions;

export default userReducer.reducer;

// ------------------- async action -----------------

export const loginApi = (userLogin: UserLoginForm) => {
  return async (dispatch: DispatchType) => {
    const result = await http.post("/Users/signin", userLogin);
    const action: PayloadAction<UserLogin> = loginAction(result.data.content);
    dispatch(action);
    setStoreJson(USER_LOGIN, result.data.content);
  };
};

export const usersApi = () => {
  return async (dispatch: DispatchType) => {
    const result = await http.get("/Users/getUser");
    const action: PayloadAction<User[]> = usersAction(result.data.content);

    dispatch(action);
  };
};

export const facebookLogin = (token: any) => {
  return async (dispatch: DispatchType) => {
    let result = await http.post(`/Users/facebooklogin`, {
      facebookToken: token,
    });

    let action = loginAction(result.data.content);
    dispatch(action);

    setStoreJson(USER_LOGIN, result.data.content);
  };
};

export const registerApi = (userRegister: UserRegisterForm) => {
  return async (dispatch: DispatchType) => {
    const result = await http.post("/Users/signup", userRegister);
    const action: PayloadAction<UserRegister> = registerAction(
      result.data.content
    );
    dispatch(action);
  };
};
