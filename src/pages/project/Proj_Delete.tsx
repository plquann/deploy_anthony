import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { http } from "../../util/config";
import { toast } from "react-toastify";
import { ICustomErrType } from "../../util/config";
import { NavLink } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";

type Props = {};

const Proj_Delete = (props: Props) => {
  const { project } = useSelector((state: RootState) => state.projectReducer);

  const handleDel = async () => {
    try {
      let des = "";
      if (editorRef.current) {
        des = editorRef.current.getContent();
      }

      const data = await http.delete(
        `/Project/deleteProject?projectId=${project?.id}`
      );

      if (data && data.data.statusCode === 200) {
        toast.success("Delete success");
      }
    } catch (e) {
      const error = e as ICustomErrType as any;

      if (error && error.response) {
        toast.error(error.response.data.message);
      }
    }
  };

  const editorRef = useRef<any>(null);

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };

  return (
    <div className="content-box">
      <ul className="breadcrumb">
        <li>
          <a href="...">Project</a>
        </li>
        <li>
          <a href="...">Cyber learn</a>
        </li>
        <li>
          <a href="...">Project settings</a>
        </li>
      </ul>
      <h2 className="content-title">Project Confirm Delete</h2>
      <form action="">
        <div className="mb-4">
          <label className="form-label">
            Project ID <span>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="userid"
            name="userid"
            value={project?.id}
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="form-label">
            Project name <span>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={project?.projectName}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">
            Project category <span>*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={project?.categoryName}
          />
        </div>
        <div className="mb-4">
          <label className="form-label">Description</label>
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={project?.description}
            disabled
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
        <div className="d-flex justify-content-end">
          <NavLink to="/project" aria-current="page">
            <button
              type="submit"
              className="btn btn-1"
              onClick={() => handleDel()}
            >
              Delete
            </button>
          </NavLink>
          <NavLink to="/project" aria-current="page">
            <button type="button" className="btn btn-outline-light text-dark">
              Cancel
            </button>
          </NavLink>

          
        </div>
      </form>
    </div>
  );
};

export default Proj_Delete;
