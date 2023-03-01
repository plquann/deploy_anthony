import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { toast } from "react-toastify";
import { ICustomErrType } from "../../util/config";
import {
  getProjectApi,
  getProjectDetailApi
} from "../../redux/reducers/projectReducer";
import {
  getTaskStatusApi,
  getPriorityApi,
  getTaskTypeApi,
  
} from "../../redux/reducers/taskReducer";
import { NavLink, useNavigate } from "react-router-dom";
import { Select, Space } from "antd";
import type { SelectProps } from "antd";
import { http } from "../../util/config";
import { Editor } from "@tinymce/tinymce-react";

type Props = {};

export interface TaskForm {
  listUserAsign: string[];
  taskId?: string | number;
  taskName: string;
  description: string;
  statusId: string;
  originalEstimate: number;
  timeTrackingSpent: number;
  timeTrackingRemaining: number;
  projectId: string | number;
  typeId: string | number;
  priorityId: string | number;
}

const Pane = (props: Props) => {
  const { arrProject, project } = useSelector(
    (state: RootState) => state.projectReducer
  );
  const { arrTaskStatus, arrPriority, arrTaskType } = useSelector(
    (state: RootState) => state.taskReducer
  );
  const dispatch: DispatchType = useDispatch();
  const navigate = useNavigate();
  const [asnOptions, setAsnOptions] = useState<SelectProps['options']>([]);
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
  const getStatus = () => {
    try {
      dispatch(getTaskStatusApi());
    } catch (e) {
      const error = e as ICustomErrType as any;
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  const getPriority = () => {
    try {
      dispatch(getPriorityApi());
    } catch (e) {
      const error = e as ICustomErrType as any;
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  const getTaskType = () => {
    try {
      dispatch(getTaskTypeApi());
    } catch (e) {
      const error = e as ICustomErrType as any;
      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };
  // const handleSetProject = (record: ProjectModel) => {
  //   dispatch(setProject(record));
  // };
  useEffect(() => {
    getProjects();
    getStatus();
    getPriority();
    getTaskType();
  }, []);

  const frmTask = useFormik<TaskForm>({
    enableReinitialize: true,
    initialValues: {
      listUserAsign: [],
      taskName: "",
      description: "",
      statusId: arrTaskStatus.length ? arrTaskStatus[0].statusId : '',
      originalEstimate: 0,
      timeTrackingSpent: 0,
      timeTrackingRemaining: 0,
      projectId: "",
      typeId: arrTaskType.length ? arrTaskType[0].id.toString() : '',
      priorityId: arrPriority.length ? arrPriority[0].priorityId.toString() : ''
    },
    validationSchema: Yup.object().shape({
      projectId: Yup.string().required("Project name cannot be blank!"),
      taskName: Yup.string().required("Task name cannot be blank!"),
      statusId: Yup.string().required("Task name cannot be blank!"),
      priorityId: Yup.string().required("Task name cannot be blank!"),
      typeId: Yup.string().required("Task name cannot be blank!"),
      listUserAsign: Yup.array().required("Task name cannot be blank!"),
    }),
    onSubmit: async (value: TaskForm) => {
      try {
        let des = "";
        if (editorRef.current) {
          des = editorRef.current.getContent();
        }
        const payload =  {
          listUserAsign: frmTask.values.listUserAsign,
          taskName: frmTask.values.taskName,
          description: des,
          statusId: frmTask.values.statusId,
          originalEstimate: frmTask.values.originalEstimate,
          timeTrackingSpent: frmTask.values.timeTrackingSpent,
          timeTrackingRemaining:frmTask.values.originalEstimate - frmTask.values.timeTrackingSpent,
          projectId: frmTask.values.projectId,
          typeId: frmTask.values.typeId,
          priorityId: frmTask.values.priorityId,
        }
        console.log(payload)
        const data = await http.post("/Project/createTask", payload);

        if (data && data.data.statusCode === 200) {
          toast.success("Create task success");
          navigate("/projDetail");
        }
      } catch (e) {
        console.log(e);
        const error = e as ICustomErrType as any;
        if (error && error.response) {
          toast.error(error.response.data.message);
        }
      }
    },
  });

  const editorRef = useRef<any>(null);

  const handleChange = (value: string[]) => {
    frmTask.setFieldValue('listUserAsign', value);
  };

  const clearForm = (event: any) => {
    event.preventDefault();
    frmTask.resetForm();
  }

  useEffect(() => {
      if (frmTask.values.projectId) {
        const projSelected = arrProject.find(p => p.id == frmTask.values.projectId);

        const options = projSelected?.members.map((member) => ({
          label: member.name,
          value: member.userId
        }))

        setAsnOptions(options);
      }
      
  }, [frmTask.values.projectId, arrProject])

  return (
    <div className="col-lg-3 sidebarleft" style={{ minHeight: "650px" }}>
      <div className="sidebar">
        <ul className="list">
          <li>
            <NavLink to="/project" aria-current="page">
              <i className="fa-solid fa-list-check" /> Projects management
            </NavLink>
          </li>
          <li>
            <NavLink to="/projCreate" aria-current="page">
              <i className="fa-solid fa-sheet-plastic" /> Create project
            </NavLink>
          </li>
          <li>
            <div className="box">
              <a
                href="..."
                data-bs-toggle="offcanvas"
                data-bs-target="#createtask"
              >
                <i className="fa-solid fa-plus" /> Create task
              </a>
            </div>
          </li>
        </ul>
        <ul className="list">
          <li>
            <NavLink to="/qlyUsers" aria-current="page">
              <i className="fa-solid fa-users" /> Users management
            </NavLink>
          </li>
        </ul>

        <div className="offcanvas offcanvas-end" id="createtask">
        
          <div className="offcanvas-header">
            <h3 className="offcanvas-title">Create task</h3>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              onClick={(event) => {
                dispatch(getProjectDetailApi(project?.id!))
                clearForm(event);
              }}
            ></button>
          </div>
          <div className="offcanvas-content">
            <form id="create_task" onSubmit={frmTask.handleSubmit}>
              <div className="mb-4">
                <label className="form-label">Project Name</label>
                <Select
                  showSearch
                  className="form-select"
                  placeholder="Select a Project"
                  optionFilterProp=""
                  onChange={(value) => { frmTask.setFieldValue('projectId', value) }}
                  // onSearch={() => {})}
                  value={frmTask.values.projectId}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  options={arrProject.map((proj) => {
                    return {
                      label: proj.projectName,
                      value: proj.id,
                    }
                  })}
                />
              </div>
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="statusId"
                  value={frmTask.values.statusId}
                  onChange={frmTask.handleChange}
                >
                  {arrTaskStatus.map((status, idx) => {
                    return <option value={status.statusId} key={idx}>{status.statusName}</option>;
                  })}
                </select>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    name="priorityId"
                    value={frmTask.values.priorityId}
                    onChange={frmTask.handleChange}
                  >
                    {arrPriority.map((p, idx) => {
                      return <option value={p.priorityId} key={idx}>{p.priority}</option>;
                    })}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Task type</label>
                  <select
                    className="form-select"
                    name="typeId"
                    value={frmTask.values.typeId}
                    onChange={frmTask.handleChange}
                  >
                    {arrTaskType.map((type, idx) => {
                      return <option value={type.id} key={idx}>{type.taskType} </option>;
                    })}
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="form-label">Assignees</label>
              <Space style={{ width: "100%" }} direction="vertical">
                <Select
                className="form-select"
                  mode="multiple"
                  allowClear
                  style={{ width: "100%" }}
                  placeholder="Click select"
                  value={frmTask.values.listUserAsign}
                  onChange={handleChange}
                  options={asnOptions}
                />
              </Space>
              </div>
              <div className="row mb-4">
                <div className="col-md-6">
                  <label className="form-label">Total Estimated Hours</label>
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
                                frmTask.values.originalEstimate)*100 + "%" : "0%",
                    }}
                  ></div>
                </div>
                <div className="info">
                  <div className="spent">
                    <span>{frmTask.values.timeTrackingSpent}</span> hour(s)
                    spent
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
              <div className="mb-4">
                <label className="form-label">Description</label>

                <Editor
                  onInit={(evt, editor) => (editorRef.current = editor)}
                  initialValue=""
                  init={{
                    height: 250,
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
                      "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                  }}
                />
              </div>
              <div className="d-flex justify-content-end taskbot">
                <button type="submit" className="btn btn-1 mx-2">
                  Create
                </button>

                <button className="btn btn-1" onClick={(e) => {
                  
                  clearForm(e)
                  }}>
                  Reset
                </button >
              </div>
            </form>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Pane;
