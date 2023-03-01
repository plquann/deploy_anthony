import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { ICustomErrType } from "../../util/config";
import { usersApi, User, setUser } from "../../redux/reducers/userReducer";
import { http } from "../../util/config";
import { Table, Space } from "antd";


type Props = {};

const QlyUsers = (props: Props) => {
  const [page, setPage] = useState(1);
  const { arrUsers, user } = useSelector(
    (state: RootState) => state.userReducer
  );
  const dispatch: DispatchType = useDispatch();

  const [searchName, setSearchName] = useState("");
 
  const getUsers = () => {
    try {
      dispatch(usersApi());
    } catch (e) {
      const error = e as ICustomErrType as any;
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const delUser = async (obj: User) => {
    try {
      const data = await http.delete(`/Users/deleteUser?id=${obj.userId}`);

      if (data && data.data.statusCode === 200) {
        toast.success("Delete success");
        dispatch(usersApi());
      }
    } catch (e) {
      const error = e as ICustomErrType as any;

      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  const columns = [
    {
      title: "Index",
      key: "index",
      // dataIndex: "index",
      // sorter: (a, b) => a.index.localeCompare(b.index),
      render: (_, record, index) => {
        return (page - 1) * 10 + index + 1;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (text) => <a>{text}</a>,
    },

    {
      title: "User Id",
      dataIndex: "userId",
      key: "userId",
      sorter: (a, b) => a.userId - b.userId,
      render: (text) => <a>{text}</a>,
      // sorter: (a, b) => { return a.userId > b.userId },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record, userId) => (
        <Space size="middle">
          <NavLink
            className="btn-2 btn edit"
            to="/userSettings"
            aria-current="page"
            onClick={() => {
              dispatch(setUser(record));
            }}
          >
            <i className="fa-regular fa-pen-to-square"></i>
          </NavLink>
          <button
            className="btn-2 btn delete"
            onClick={(e) => {
              e.preventDefault();
              delUser(record);
            }}
          >
            <i className="fa-regular fa-trash-can"></i>
          </button>
        </Space>
      ),
    },
  ];

  const searchUsers = arrUsers.filter((obj) => {
    return obj.name.toLowerCase().includes(searchName);
  });
  return (
    <div className="content-right">
      <ul className="breadcrumb">
        <li>
          <a href="...">Project</a>
        </li>
        <li>
          <a href="...">Cyber learn</a>
        </li>
        <li>
          <a href="...">User management</a>
        </li>
      </ul>
      <div className="search">
        <input
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          type="text"
          className="form-control"
          placeholder="User name..."
        />
        <button className="btn-2 btn">Search</button>
      </div>

      
        <Table
          columns={columns}
          pagination={{ 
            position: ["bottomRight"],
            onChange(current) {
              setPage(current);
            }
        }}
          dataSource={searchUsers}
        />
        <div className="table-mobile">
            <div className="list-info">
                <ul>
                    <li><span>STT: </span> <span>1</span></li>
                    <li><span>Email: </span> <span>khai@gmail.com</span></li>
                    <li><span>Name: </span> <span>Khải</span></li>
                    <li><span>User id: </span> <span>123</span></li>
                    <li>
                        <span>Action: </span>
                        <div className="action">
                            <a href="user-update.html" className="btn-2 btn edit"><i className="fa-regular fa-pen-to-square"></i></a> <button className="btn-2 btn delete"><i className="fa-regular fa-trash-can"></i></button>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="list-info">
                <ul>
                    <li><span>STT: </span> <span>1</span></li>
                    <li><span>Email: </span> <span>khai@gmail.com</span></li>
                    <li><span>Name: </span> <span>Khải</span></li>
                    <li><span>User id: </span> <span>123</span></li>
                    <li>
                        <span>Action: </span>
                        <div className="action">
                            <a href="user-update.html" className="btn-2 btn edit"><i className="fa-regular fa-pen-to-square"></i></a> <button className="btn-2 btn delete"><i className="fa-regular fa-trash-can"></i></button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
  );
};

export default QlyUsers;
