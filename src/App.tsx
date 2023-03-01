import {
  Routes,
  Route,
  unstable_HistoryRouter as HistoryRouter,
  Navigate,
} from "react-router-dom";

// import ResponsiveItem from './hoc/ResponsiveItem';
import LoginTemplate from "./template/LoginTemplate";
import ManageTemplate from "./template/ManageTemplate";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Projects from "./pages/project/Projects";
import QlyUsers from "./pages/user/QlyUsers";
import "./assets/scss/style.scss";
import UserSettings from "./pages/user/UserSettings";
import ProjectSettings from "./pages/project/ProjectSettings";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { DispatchType, RootState } from "./redux/configStore";
import Proj_Create from "./pages/project/Proj_Create";
import Proj_Detail from "./pages/project/Proj_Detail";
import Proj_Delete from "./pages/project/Proj_Delete";
type Props = {};

const App = (props: Props) => {
  const { userLogin } = useSelector((state: RootState) => state.userReducer);
  if (userLogin) {
    return (
      <Routes>
        <Route path="" element={<ManageTemplate />}>
          <Route index element={<Projects />} />
          <Route path="project" element={<Projects />} />
          <Route path="qlyUsers" element={<QlyUsers />} />
          <Route path="userSettings" element={<UserSettings />} />
          <Route path="projectSettings" element={<ProjectSettings />} />
          <Route path="projDelete" element={<Proj_Delete />} />
          <Route path="projCreate" element={<Proj_Create />} />
          <Route path="projDetail" element={<Proj_Detail />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        <Route path="" element={<LoginTemplate />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
      </Routes>
    );
  } else {
    return (
      <Routes>
        <Route path="" element={<LoginTemplate />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Route>
        <Route path="" element={<ManageTemplate />}>
          <Route path="project" element={<Projects />} />
          <Route path="projectSettings" element={<ProjectSettings />} />
          <Route path="qlyUsers" element={<QlyUsers />} />
          <Route path="userSettings" element={<UserSettings />} />
        </Route>
      </Routes>
    );
  }
};

export default App;
