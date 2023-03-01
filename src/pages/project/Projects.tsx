import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { http } from "../../util/config";
import { getProjectApi, ProjectModel, Creator, Member, setProject } from "../../redux/reducers/projectReducer";
import { usersApi } from "../../redux/reducers/userReducer";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ICustomErrType } from "../../util/config";
import { Table, Space } from "antd";

type Props = {};

const Projects: React.FC = (props: Props): JSX.Element => {
    const [page, setPage] = useState(1);
    const { arrProject, project } = useSelector((state: RootState) => state.projectReducer);
    const { arrUsers } = useSelector((state: RootState) => state.userReducer);
    const dispatch: DispatchType = useDispatch();

    const [searchName, setSearchName] = useState("");
    const projects = arrProject.filter((proj) => {
        return proj.projectName.toLowerCase().includes(searchName);
    });

    const [userName, setUserName] = useState("");
    const searchUsers = arrUsers.filter((u) => {
        return u.name.toLowerCase().includes(userName);
    });

    const getProjects = () => {
        try {
            dispatch(getProjectApi());
        } catch (e) {
            const error = e as ICustomErrType as any;
            if (error && error.response) {
                toast.error(error.response.data.message);
            }
        }
    };
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
    const handleSetProject = (record: ProjectModel) => {
        dispatch(setProject(record));
    };
    useEffect(() => {
        getProjects();
        getUsers();
    }, []);

    const columns = [
        {
            title: "Index",
            key: "index",
            // dataIndex: "index",
            // sorter: (a, b) => a.index.localeCompare(b.index),
            render: (_: any, record: ProjectModel, index: number) => {
                return (page - 1) * 10 + index + 1;
            },
        },
        {
            title: "Project Name",
            dataIndex: "projectName",
            key: "projectName",
            sorter: (a, b) => a.projectName.localeCompare(b.projectName),
            render: (text: string, record: ProjectModel) => (
                <NavLink to="/projDetail" style={{ color: "#2684ff", textDecoration: "underline" }} className="table-link" onClick={() => handleSetProject(record)}>
                    {text}
                </NavLink>
            ),
        },

        {
            title: "Category ",
            dataIndex: "categoryName",
            key: "categoryName",
            sorter: (a, b) => a.categoryName.localeCompare(b.categoryName),
            render: (text: string) => <a>{text}</a>,
        },
        {
            title: "Creator",
            dataIndex: "creator",
            key: "creator",
            sorter: (a, b) => a.creator.localeCompare(b.creator),

            // sorter: (c, d) => c.creator - d.creator,
            render: (obj: Creator) => <a>{obj.name}</a>,
        },
        {
            title: "Members",
            dataIndex: "members",
            key: "members",
            render: (arr: Member[], record: ProjectModel) => {
                return (
                    <ul className="member">
                        <li className="memberlist">
                            {arr.map((mem, idx) => {
                                return (
                                    <div className="membertitle" key={idx}>
                                        {mem.name.slice(0, 2).toUpperCase()}
                                    </div>
                                );
                            })}

                            <div className="listuser">
                                <h3 className="title">Member</h3>
                                <ul>
                                    {arr.map((mem, idx) => {
                                        return (
                                            <li key={idx}>
                                                <div className="carduser">
                                                    <div className="left">
                                                        <div className="avatar">{mem.name.slice(0, 2).toUpperCase()}</div>
                                                        <div className="info">
                                                            <h3>{mem.name}</h3>
                                                            <p>{mem.userId}</p>
                                                        </div>
                                                    </div>
                                                    <div className="right">
                                                        <button
                                                            className="btn-2 btn delete"
                                                            onClick={async () => {
                                                                try {
                                                                    const data = await http.post(`/Project/removeUserFromProject`, {
                                                                        projectId: record.id,
                                                                        userId: mem.userId,
                                                                    });
                                                                    if (data && data.data.statusCode === 200) {
                                                                        toast.success("Delete member success");
                                                                        getProjects();
                                                                    }
                                                                } catch (e) {
                                                                    console.log(e);
                                                                    const error = e as ICustomErrType as any;
                                                                    if (error && error.response) {
                                                                        toast.error(error.response.data.message);
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </li>
                        <li onClick={() => handleSetProject(record)} data-bs-toggle="modal" data-bs-target="#modalProject">
                            <div className="membertitle">+</div>
                        </li>
                    </ul>
                );
            },
        },

        {
            title: "Action",
            key: "action",
            render: (_, record: ProjectModel, userId: number) => (
                <Space size="middle">
                    <NavLink to="/projectSettings" aria-current="page" className="btn-2 btn edit" onClick={() => handleSetProject(record)}>
                        <i className="fa-regular fa-pen-to-square"></i>
                    </NavLink>

                    <NavLink to="/projDelete" aria-current="page" className="btn-2 btn delete" onClick={() => handleSetProject(record)}>
                        <i className="fa-regular fa-trash-can"></i>
                    </NavLink>
                </Space>
            ),
        },
    ];

    return (
        <div className="content-right">
            <ul className="breadcrumb">
                <li>
                    <a href="project.html">Project</a>
                </li>
                <li>
                    <a href="">Cyber learn</a>
                </li>
                <li>
                    <a href="">Project management</a>
                </li>
            </ul>

            <div className="search">
                <input value={searchName} onChange={(e) => setSearchName(e.target.value)} type="text" className="form-control" placeholder="Project name..." />
                <button className="btn-2 btn">Search</button>
            </div>

            <Table
                columns={columns}
                pagination={{
                    position: ["bottomRight"],
                    onChange(current) {
                        setPage(current);
                    },
                }}
                dataSource={projects}
            />

            <div className="table-mobile">
                {arrProject.map((pro, idx) => {
                    return (
                        <div className="list-info">
                            <div className="listuser">
                                <ul>
                                    <li>
                                        <span>Id: </span> <span>{pro.id}</span>
                                    </li>
                                    <li>
                                        <span>Project name: </span> <span>{pro.projectName}</span>
                                    </li>
                                    <li>
                                        <span>Category: </span> <span>{pro.categoryName}</span>
                                    </li>
                                    <li>
                                        <span>Creator: </span> <span>{pro.creator.name}</span>
                                    </li>
                                    <li>
                                        <span>Members: </span>
                                        <span>
                                            <ul className="member">
                                                <li className="memberlist">
                                                    {pro.members.map((mem, idx) => {
                                                        return (
                                                            <div className="membertitle" key={idx}>
                                                                {mem.name.slice(0, 2).toUpperCase()}
                                                            </div>
                                                        );
                                                    })}

                                                    <div className="listuser">
                                                        <ul>
                                                            {pro.members.map((mem, idx) => {
                                                                return (
                                                                    <li key={idx}>
                                                                        <div className="carduser">
                                                                            <div className="left">
                                                                                <div className="avatar">{mem.name.slice(0, 2).toUpperCase()}</div>
                                                                                <div className="info">
                                                                                    <h3>{mem.name}</h3>
                                                                                    <p>{mem.userId}</p>
                                                                                </div>
                                                                            </div>
                                                                            <div className="right">
                                                                                <button
                                                                                    className="btn-2 btn delete"
                                                                                    onClick={async () => {
                                                                                        try {
                                                                                            const data = await http.post(`/Project/removeUserFromProject`, {
                                                                                                projectId: pro.id,
                                                                                                userId: mem.userId,
                                                                                            });
                                                                                            if (data && data.data.statusCode === 200) {
                                                                                                toast.success("Delete member success");
                                                                                                getProjects();
                                                                                            }
                                                                                        } catch (e) {
                                                                                            console.log(e);
                                                                                            const error = e as ICustomErrType as any;
                                                                                            if (error && error.response) {
                                                                                                toast.error(error.response.data.message);
                                                                                            }
                                                                                        }
                                                                                    }}
                                                                                >
                                                                                    <i className="fa-solid fa-xmark"></i>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                );
                                                            })}
                                                        </ul>
                                                    </div>
                                                </li>
                                                <li onClick={() => handleSetProject(pro)} data-bs-toggle="modal" data-bs-target="#modalProject">
                                                    <div className="membertitle">+</div>
                                                </li>
                                            </ul>
                                        </span>
                                    </li>
                                    <li>
                                        <span>Action: </span>
                                        <div className="action">
                                            <NavLink to="/projectSettings" aria-current="page" className="btn-2 btn edit" onClick={() => handleSetProject(pro)}>
                                                <i className="fa-regular fa-pen-to-square"></i>
                                            </NavLink>
                                            <NavLink to="/projDelete" aria-current="page" className="btn-2 btn delete" onClick={() => handleSetProject(pro)}>
                                                <i className="fa-regular fa-trash-can"></i>
                                            </NavLink>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="modal" id="modalProject">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">
                                Add members to project <span> {project?.projectName} </span>
                            </h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="col-md-7">
                                    <div className="search">
                                        <input value={userName} onChange={(e) => setUserName(e.target.value)} type="text" className="form-control" placeholder="Search users..." />
                                    </div>
                                    <div className="listuser">
                                        <h3 className="title">Not yet added</h3>

                                        <ul>
                                            {searchUsers.map((user, idx) => {
                                                if (!project?.members.map((x) => x.name)!.includes(user.name)) {
                                                    return (
                                                        <li key={idx}>
                                                            <div className="carduser">
                                                                <div className="left">
                                                                    <div className="avatar">{user.name.slice(0, 2).toUpperCase()}</div>
                                                                    <div className="info">
                                                                        <h3>{user.name}</h3>
                                                                        <p>{user.userId}</p>
                                                                    </div>
                                                                </div>
                                                                <div className="right">
                                                                    <button
                                                                        className="btn-2 btn"
                                                                        onClick={async () => {
                                                                            try {
                                                                                const data = await http.post(`/Project/assignUserProject`, {
                                                                                    projectId: project?.id,
                                                                                    userId: user.userId,
                                                                                });
                                                                                if (data && data.data.statusCode === 200) {
                                                                                    toast.success("Add member success");
                                                                                    const newProjectMembers = [...project?.members!];
                                                                                    newProjectMembers.push(user as unknown as Member);

                                                                                    const newProject = {
                                                                                        ...project,
                                                                                        members: newProjectMembers,
                                                                                    } as ProjectModel;

                                                                                    dispatch(setProject(newProject));

                                                                                    getProjects();
                                                                                }
                                                                            } catch (e) {
                                                                                console.log(e);
                                                                                const error = e as ICustomErrType as any;
                                                                                if (error && error.response) {
                                                                                    toast.error(error.response.data.message);
                                                                                }
                                                                            }
                                                                        }}
                                                                    >
                                                                        Add
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                }
                                            })}
                                        </ul>
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="listuser mrt100">
                                        <h3 className="title">Already in project</h3>
                                        <ul>
                                            {project?.members.map((mem, idx) => {
                                                return (
                                                    <li key={idx}>
                                                        <div className="carduser">
                                                            <div className="left">
                                                                <div className="avatar">{mem.name.slice(0, 2).toUpperCase()}</div>
                                                                <div className="info">
                                                                    <h3>{mem.name}</h3>
                                                                    <p>{mem.userId}</p>
                                                                </div>
                                                            </div>
                                                            {/* <div className="right">
                                <button className="btn-2 btn delete">
                                  Delete
                                </button>
                              </div> */}
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;
