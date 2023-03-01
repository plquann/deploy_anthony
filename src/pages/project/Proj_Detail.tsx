import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { ICustomErrType } from "../../util/config";
import { Editor } from "@tinymce/tinymce-react";
import { LstTask, getCommentApi, Comment } from "../../redux/reducers/taskReducer";
import {
  getProjectDetailApi,
  Member,
  ProjectDetail,
  getProjectDetailAction,
} from "../../redux/reducers/projectReducer";
// import { getTaskStatusApi } from "../../redux/reducers/taskReducer";
import { TaskForm } from "../../components/left_pane/Pane";
import { NavLink, useNavigate } from "react-router-dom";
import { http } from "../../util/config";
import { Result, Select, Space, Avatar } from "antd";
import type { SelectProps } from "antd";
import { LstTaskDeTail } from "../../redux/reducers/taskReducer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { CommentComponent } from "./comment/Comment";

type Props = {};

const Proj_Detail = (props: Props) => {
  const [task, setTask] = useState<LstTaskDeTail>();
  const { arrUsers, userLogin } = useSelector(
    (state: RootState) => state.userReducer
  );
  const { arrTaskStatus, arrPriority, arrTaskType, arrComment } = useSelector(
    (state: RootState) => state.taskReducer
  );
  const { project, projectDetail } = useSelector(
    (state: RootState) => state.projectReducer
  );

  const dispatch: DispatchType = useDispatch();
  const navigate = useNavigate();
  const [asnOptions, setAsnOptions] = useState<SelectProps["options"]>([]);
  const [userName, setUserName] = useState("");

  const searchUsers = arrUsers.filter((u) => {
    return u.name.toLowerCase().includes(userName);
  });

  const getProjectDetail = () => {
    try {
      dispatch(getProjectDetailApi(project!.id));
    } catch (e) {
      const error = e as ICustomErrType as any;
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    getProjectDetail();
  }, []);

  const frmTask = useFormik<TaskForm>({
    enableReinitialize: true,
    initialValues: {
      listUserAsign: task?.assigness.map((x) => x.name)!,
      taskId: task?.taskId!,
      taskName: task?.taskName!,
      description: task?.description!,
      statusId: task?.statusId!,
      originalEstimate: task?.originalEstimate!,
      timeTrackingSpent: task?.timeTrackingSpent!,
      timeTrackingRemaining: task?.timeTrackingRemaining!,
      projectId: task?.projectId!,
      typeId: task?.taskTypeDetail.id!, ///////////////////
      priorityId: task?.priorityTask.priorityId!, ////////////////////
    },
    validationSchema: Yup.object().shape({
      taskName: Yup.string().required("Task name cannot be blank!"),
      statusId: Yup.string().required("Task name cannot be blank!"),
      priorityId: Yup.string().required("Task name cannot be blank!"),
      typeId: Yup.string().required("Task name cannot be blank!"),
      listUserAsign: Yup.array().required("Task name cannot be blank!"),
    }),
    onSubmit: async (value: TaskForm) => {
      try {
        const arrId: number[] = [];
        for (let obj of task?.assigness!) {
          for (let ten of frmTask.values.listUserAsign) {
            if (obj.name === ten) {
              arrId.push(obj.id);
            }
          }
        }

        const payload = {
          listUserAsign: arrId,
          taskId: task?.taskId.toString(),
          taskName: frmTask.values.taskName,
          description: frmTask.values.description,
          statusId: frmTask.values.statusId,
          originalEstimate: frmTask.values.originalEstimate,
          timeTrackingSpent: frmTask.values.timeTrackingSpent,
          timeTrackingRemaining:
            frmTask.values.originalEstimate - frmTask.values.timeTrackingSpent,
          projectId: frmTask.values.projectId,
          typeId: frmTask.values.typeId,
          priorityId: frmTask.values.priorityId,
        };

        const data = await http.post("/Project/updateTask", payload);

        if (data && data.data.statusCode === 200) {
          toast.success("Update task success");
          navigate("/projDetail");
        }
      } catch (e) {
        const error = e as ICustomErrType as any;
        if (error && error.response) {
          toast.error(error.response.data.message);
        }
      }
    },
  });
  const editorRef = useRef<any>(null);

  const commentOneRef = useRef<any>(null);

  const commentTwoRef = useRef<any>(null);

  const [editComment, setEditComment] = useState<Comment | null>(null);

  const handleChange = (value: string[]) => {
    frmTask.setFieldValue("listUserAsign", value);
  };

  useEffect(() => {
    const membersSelected: Member[] = [];
    projectDetail?.members.forEach((m) => {
      if (!task?.assigness.map((x) => x.name).includes(m.name)) {
        membersSelected.push(m);
      }
    });
    const options = membersSelected.map((mem) => ({
      label: mem.name,
      value: mem.userId,
    }));

    setAsnOptions(options);
  }, [frmTask.values.listUserAsign, projectDetail]);

  const showcmt = () => {
    let boxinput: any = document.querySelector(".boxinput");
    let boxeditor: any = document.querySelector(".boxeditor");
    boxinput.classList.add("active");
    boxeditor.classList.add("active");
  };
  const closecmt = () => {
    let boxinput: any = document.querySelector(".boxinput");
    let boxeditor: any = document.querySelector(".boxeditor");
    boxinput.classList.remove("active");
    boxeditor.classList.remove("active");
  };

  const getTaskStatusById = (id: string) => {
    const result = projectDetail?.lstTask.find(
      (status) => status.statusId === id
    );

    return result;
  };

  useEffect(() => {
    if (task && task.taskId) {
      dispatch(getCommentApi(task?.taskId!));
    }
  }, [task]);

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result["sourceList"] = sourceClone;
    result["targetList"] = destClone;

    return result;
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    if (source.droppableId === destination.droppableId) {
      const reorderItem = getTaskStatusById(destination.droppableId);
      const taskListOfReorderItem = [...reorderItem?.lstTaskDeTail!];
      const items = reorder(
        taskListOfReorderItem,
        source.index,
        destination.index
      );

      const newTasksItem = {
        ...reorderItem,
        lstTaskDeTail: items,
      };

      const taskItemIndex = projectDetail?.lstTask.findIndex(
        (status) => status.statusId === newTasksItem.statusId
      );

      const newListTask = [...projectDetail?.lstTask!];

      newListTask[taskItemIndex!] = {
        ...newTasksItem,
      } as unknown as LstTask;

      const newProjectDetail = {
        ...projectDetail,
        lstTask: newListTask,
      };

      dispatch(getProjectDetailAction(newProjectDetail as ProjectDetail));
    } else {
      const targetList = getTaskStatusById(destination.droppableId);

      const sourceList = getTaskStatusById(source.droppableId);

      http.put("/Project/updateStatus", {
        taskId: sourceList?.lstTaskDeTail[source.index].taskId,
        statusId: destination.droppableId,
      });

      const result = move(
        sourceList?.lstTaskDeTail,
        targetList?.lstTaskDeTail,
        source,
        destination
      ) as { targetList: LstTaskDeTail[]; sourceList: LstTaskDeTail[] };

      const newTargetList = {
        ...targetList,
        lstTaskDeTail: result.targetList,
      };

      const newSourceList = {
        ...sourceList,
        lstTaskDeTail: result.sourceList,
      };

      console.log(newTargetList, newSourceList);

      const targetItemIndex = projectDetail?.lstTask.findIndex(
        (status) => status.statusId === newTargetList.statusId
      );

      const sourceItemIndex = projectDetail?.lstTask.findIndex(
        (status) => status.statusId === newSourceList.statusId
      );

      const newListTask = [...projectDetail?.lstTask!];

      newListTask[targetItemIndex!] = {
        ...newTargetList,
      } as unknown as LstTask;

      newListTask[sourceItemIndex!] = {
        ...newSourceList,
      } as unknown as LstTask;

      const newProjectDetail = {
        ...projectDetail,
        lstTask: newListTask,
      };

      dispatch(getProjectDetailAction(newProjectDetail as ProjectDetail));
    }
  };

  const handleRefreshProj = () => {
    dispatch(getProjectDetailApi(projectDetail?.id!));
  };

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
          <a href="...">Project detail</a>
        </li>
      </ul>
      <div className="project-heading">
        <div className="row d-flex align-items-center">
          <div className="col-md-5">
            <h1>{projectDetail?.projectName}</h1>
          </div>
          <div className="col-md-7">
            <div
              className="project-member"
              data-bs-toggle="modal"
              data-bs-target="#modalProject"
            >
              {projectDetail?.members.map((mem, idx) => {
                return (
                  <div className="member" key={idx}>
                    {mem.name.slice(0, 2).toUpperCase()}
                  </div>
                );
              })}
              <div className="member">
                <i className="fa-regular fa-pen-to-square"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="project-info">
        <div className="row d-flex align-items-center">
          <div className="col-md-4">
            <h6>Creator: {projectDetail?.creator.name}</h6>
          </div>
          <div className="col-md-4">
            <h6>Category: {projectDetail?.projectCategory.name}</h6>
          </div>
          <div className="col-md-4 text-end">
            {/* <button type="submit" className="btn btn-1 btn-small">
              Create task
            </button> */}
          </div>
        </div>
      </div>

      <div className="project-detail mt-5">
        <DragDropContext onDragEnd={onDragEnd}>
          {projectDetail?.lstTask.map((status, idx) => {
            return (
              <Droppable droppableId={status.statusId} direction="vertical">
                {(provided) => (
                  <div
                    className="table"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <h3 className="title text-bg-secondary">
                      {status.statusName}
                    </h3>
                    <div className="column">
                      {status.lstTaskDeTail.map((task, idx) => {
                        return (
                          <Draggable
                            draggableId={task.taskId.toString()}
                            index={idx}
                            key={task.taskId}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div
                                  onClick={async () => {
                                    // setTask(task);
                                    const taskItem = await http.get(
                                      `/Project/getTaskDetail?taskId=${task.taskId}`
                                    );

                                    const {
                                      data: { content },
                                    } = taskItem;

                                    setTask(content);
                                  }}
                                  key={task.taskId}
                                  className="list-group-item handle"
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalProjectDetail"
                                >
                                  <h4 className="item-title">
                                    Task: {task.taskName}
                                  </h4>

                                  <div className="item-content mt-2">
                                    <div className="item-priority br-high">
                                      {task.priorityTask.priority}
                                    </div>
                                    {task.assigness.map((m, kdx) => {
                                      return (
                                        <div className="item-user" key={m.id}>
                                          <div>
                                            {m.name.slice(0, 2).toUpperCase()}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </div>

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
      <div className="modal" id="modalProject">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Add members to project <span>{projectDetail?.projectName}</span>
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="search">
                    <input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      type="text"
                      className="form-control"
                      placeholder="Search users..."
                    />
                  </div>
                  <div className="listuser">
                    <h3 className="title">Not yet added</h3>

                    <ul>
                      {searchUsers.map((user, idx) => {
                        if (
                          !projectDetail?.members
                            .map((x) => x.name)!
                            .includes(user.name)
                        ) {
                          return (
                            <li key={idx}>
                              <div className="carduser">
                                <div className="left">
                                  <div className="avatar">
                                    {user.name.slice(0, 2).toUpperCase()}
                                  </div>
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
                                        const data = await http.post(
                                          `/Project/assignUserProject`,
                                          {
                                            projectId: projectDetail?.id,
                                            userId: user.userId,
                                          }
                                        );
                                        if (
                                          data &&
                                          data.data.statusCode === 200
                                        ) {
                                          toast.success("Add member success");
                                          const newProjectMembers: Member[] = [
                                            ...projectDetail?.members!,
                                          ];
                                          const newMember: Member = {
                                            userId: user.userId,
                                            name: user.name,
                                            avatar: user.avatar,
                                            email: user.email!,
                                            phoneNumber: user.phoneNumber,
                                          };
                                          newProjectMembers.push(newMember);

                                          const newProjectDetail = {
                                            ...projectDetail,
                                            members: newProjectMembers,
                                          } as ProjectDetail;

                                          dispatch(
                                            getProjectDetailAction(
                                              newProjectDetail
                                            )
                                          );

                                          getProjectDetail();
                                        }
                                      } catch (e) {
                                        console.log(e);
                                        const error =
                                          e as ICustomErrType as any;
                                        if (error && error.response) {
                                          toast.error(
                                            error.response.data.message
                                          );
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
                <div className="col-md-6">
                  <div className="listuser mrt100">
                    <h3 className="title">Already in project</h3>
                    <ul>
                      {projectDetail?.members.map((mem, idx) => {
                        return (
                          <li key={idx}>
                            <div className="carduser">
                              <div className="left">
                                <div className="avatar">
                                  {mem.name.slice(0, 2).toUpperCase()}
                                </div>
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
                                      const data = await http.post(
                                        `/Project/removeUserFromProject`,
                                        {
                                          projectId: projectDetail.id,
                                          userId: mem.userId,
                                        }
                                      );
                                      if (
                                        data &&
                                        data.data.statusCode === 200
                                      ) {
                                        toast.success("Delete member success");

                                        const newProjectMembers: Member[] =
                                          projectDetail?.members.filter(
                                            (value, index, arr) => value != mem
                                          );

                                        const newProjectDetail = {
                                          ...projectDetail,
                                          members: newProjectMembers,
                                        } as ProjectDetail;

                                        dispatch(
                                          getProjectDetailAction(
                                            newProjectDetail
                                          )
                                        );
                                        getProjectDetail();
                                      }
                                    } catch (e) {
                                      console.log(e);
                                      const error = e as ICustomErrType as any;
                                      if (error && error.response) {
                                        toast.error(
                                          error.response.data.message
                                        );
                                      }
                                    }
                                  }}
                                >
                                  Delete
                                </button>
                              </div>
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
      <div className="modal" id="modalProjectDetail">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={frmTask.handleSubmit}>
              <div className="modal-heading d-flex align-items-center justify-content-between">
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  onClick={handleRefreshProj}
                />
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="modal-icon d-flex align-items-center ms-auto mb-4">
                      <h3 className="modal-name">Editable Task Info</h3>
                      <button className="btn ms-auto mx-4" type="submit">
                        <i className="fa-regular fa-pen-to-square"></i>
                        <div className="btnoverlay">Update task</div>
                      </button>
                      <button
                        className="btn"
                        onClick={async () => {
                          try {
                            const data = await http.delete(
                              `/Project/removeTask?taskId=${task?.taskId}`
                            );

                            if (data && data.data.statusCode === 200) {
                              toast.success("Delete task success");
                              navigate("/projDetail");
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
                        <i className="fa-regular fa-trash-can" />
                        <div className="btnoverlay">Delete task</div>
                      </button>
                    </div>
                    <div className="row mb-4">
                      <div className="col-md-3">
                        <label className="task-heading">Project:</label>
                      </div>
                      <div className="col-md-9">
                        <label
                          style={{ fontSize: "16px", fontWeight: "600" }}
                          className="task-heading"
                        >
                          {projectDetail?.projectName}
                        </label>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="form-label">Description</label>
                      <Editor
                        onInit={(evt, editor) => (editorRef.current = editor)}
                        initialValue={frmTask.values.description}
                        init={{
                          height: 160,
                          menubar: false,
                          plugins: [
                            "advlist autolink lists link image charmap print preview anchor",
                            "searchreplace visualblocks code fullscreen",
                            "insertdatetime media table paste code help wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | " +
                            "bold italic backcolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                          content_style:
                            "body { font-family:Helvetica,Arial,sans-serif; font-size:12px }",
                        }}
                      />
                    </div>

                    <div className="task-cmt mt-2">
                      <h4 className="task-heading">Comments</h4>
                      <div className="task-postcmt">
                        <div className="row">
                          <div className="col-md-1">
                            <div className="boxavatar">
                              {userLogin?.name.slice(0, 2).toUpperCase()}
                            </div>
                          </div>
                          <div className="col-md-11">
                            <div className="boxcmt">
                              <div
                                className="boxinput"
                                onClick={() => showcmt()}
                              >
                                Add a comment
                              </div>
                              <div className="boxeditor">
                                <Editor
                                  onInit={(evt, editor) =>
                                    (commentOneRef.current = editor)
                                  }
                                  initialValue=""
                                  init={{
                                    height: 120,
                                    menubar: false,
                                    plugins: [
                                      "advlist autolink lists link image charmap print preview anchor",
                                      "searchreplace visualblocks code fullscreen",
                                      "insertdatetime media table paste code help wordcount",
                                    ],
                                    toolbar:
                                      "undo redo | formatselect | " +
                                      "bold italic backcolor | alignleft aligncenter " +
                                      "alignright alignjustify | bullist numlist outdent indent | " +
                                      "removeformat | help",
                                    content_style:
                                      "body { font-family:Helvetica,Arial,sans-serif; font-size:10px }",
                                  }}
                                />
                                <div className="d-flex mt-4">
                                  <button
                                    onClick={async () => {
                                      try {
                                        let des = "";
                                        if (commentOneRef.current) {
                                          des =
                                            commentOneRef.current.getContent();
                                        }

                                        const data = await http.post(
                                          "/Comment/insertComment",
                                          {
                                            taskId: task?.taskId,
                                            contentComment: des,
                                          }
                                        );
                                        if (
                                          data &&
                                          data.data.statusCode === 200
                                        ) {
                                          await dispatch(
                                            getCommentApi(task?.taskId!)
                                          );

                                          toast.success(
                                            "Insert comment success"
                                          );
                                          closecmt();
                                        }
                                      } catch (e) {
                                        console.log(e);
                                        const error =
                                          e as ICustomErrType as any;
                                        if (error && error.response) {
                                          toast.error(
                                            error.response.data.message
                                          );
                                        }
                                      }
                                    }}
                                    type="button"
                                    className="btn btn-1"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={() => closecmt()}
                                    type="button"
                                    className="btn btn-outline-light text-dark"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="boxlist">
                          {/* {arrComment?.map((com, idx) => {
                              return ( */}
                          {arrComment &&
                            arrComment?.map((comment, index) => {
                              return (
                                <CommentComponent commentProp={comment} task={task!} />
                              );
                            })}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="task-detail">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="mb-4 w-70">
                          <label className="form-label">Task name</label>
                          <input
                            type="text"
                            className="form-control"
                            id="taskname"
                            name="taskName"
                            value={frmTask.values.taskName}
                            onChange={frmTask.handleChange}
                          />
                        </div>
                        <div className="mb-4 w-30 ms-3">
                          <label className="form-label">Task type</label>
                          <select
                            className="form-select"
                            name="typeId"
                            value={frmTask.values.typeId}
                            onChange={frmTask.handleChange}
                          >
                            {arrTaskType.map((type, idx) => {
                              return (
                                <option value={type.id} key={idx}>
                                  {type.taskType}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Status</label>
                        <select
                          className="form-select"
                          name="statusId"
                          value={frmTask.values.statusId}
                          onChange={frmTask.handleChange}
                        >
                          {arrTaskStatus.map((status, idx) => {
                            return (
                              <option value={status.statusId} key={idx}>
                                {status.statusName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Assignees</label>
                        <Space style={{ width: "100%" }} direction="vertical">
                          <Select
                            className="form-select"
                            mode="multiple"
                            allowClear
                            onChange={handleChange}
                            placeholder="Please select"
                            value={frmTask.values.listUserAsign}
                            options={asnOptions}
                            dropdownStyle={{
                              zIndex: 99999999999999,
                            }}
                          />
                        </Space>
                      </div>
                      <div className="mb-4">
                        <label className="form-label">Priority</label>
                        <select
                          className="form-select"
                          name="priorityId"
                          value={frmTask.values.priorityId}
                          onChange={frmTask.handleChange}
                        >
                          {arrPriority.map((p, idx) => {
                            return (
                              <option value={p.priorityId} key={idx}>
                                {p.priority}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <label className="form-label">
                            Total Estimated Hours
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            id="estimated"
                            name="originalEstimate"
                            value={frmTask.values.originalEstimate}
                            onChange={frmTask.handleChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Hours spent</label>
                          <input
                            type="number"
                            className="form-control"
                            id="spent"
                            name="timeTrackingSpent"
                            value={frmTask.values.timeTrackingSpent}
                            onChange={frmTask.handleChange}
                          />
                        </div>
                      </div>
                      <div className="rangeslider">
                        <div className="range">
                          <div
                            className="line"
                            style={{
                              width: frmTask.values.originalEstimate
                                ? (frmTask.values.timeTrackingSpent /
                                    frmTask.values.originalEstimate) *
                                    100 +
                                  "%"
                                : "0%",
                            }}
                          ></div>
                        </div>
                        <div className="info">
                          <div className="spent">
                            <span>{frmTask.values.timeTrackingSpent}</span>{" "}
                            hour(s) spent
                          </div>
                          <div className="remaining">
                            <span>
                              {frmTask.values.originalEstimate -
                                frmTask.values.timeTrackingSpent}
                            </span>{" "}
                            hour(s) remaining
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proj_Detail;
