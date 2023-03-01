import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { DispatchType, RootState } from "../../redux/configStore";
import { http } from "../../util/config";
import { toast } from "react-toastify";
import { ICustomErrType } from "../../util/config";
import { NavLink, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
type Props = {};

export interface EditForm {
  id?: number;
  projectName?: string;
  categoryName?: string;
  description?: string;
}

const ProjectSettings = (props: Props) => {
  const { arrCategory } = useSelector(
    (state: RootState) => state.projectReducer
  );

  const { project } = useSelector((state: RootState) => state.projectReducer);
  const navigate = useNavigate();

  const getCatId = (name: string) => {
    for (let i = 0; i < arrCategory.length; i++) {
      if (arrCategory[i].projectCategoryName === name) {
        return arrCategory[i].id;
      }
    }
  };

  console.log('abcd');

  const frmEdit = useFormik<EditForm>({
    enableReinitialize: true,
    initialValues: {
      id: project?.id,
      projectName: project?.projectName,
      categoryName: project?.categoryName,
      description: project?.description,
    },
    validationSchema: Yup.object().shape({
      projectName: Yup.string().required("Project name cannot be blank!"),
      categoryName: Yup.string().required("Category cannot be blank!"),
    }),
    onSubmit: async (value: EditForm) => {
      try {
        let des = "";
        if (editorRef.current) {
          des = editorRef.current.getContent();
        }

        const data = await http.put(
          `/Project/updateProject?projectId=${project?.id}`,
          {
            id: frmEdit.values.id,
            projectName: frmEdit.values.projectName,
            creator: project?.creator.id,
            description: des,
            categoryId: getCatId(frmEdit.values.categoryName!),
          }
        );

        if (data && data.data.statusCode === 200) {
          toast.success("Update project success");
          navigate("/project");
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

  return (
    <div className="content-box">
      <ul className="breadcrumb">
        <li>
          <a href="">Project</a>
        </li>
        <li>
          <a href="">Cyber learn</a>
        </li>
        <li>
          <a href="">Project settings</a>
        </li>
      </ul>
      <h2 className="content-title">Project Update</h2>
      <form className="container" onSubmit={frmEdit.handleSubmit}>
        <div className="mb-4">
          <label className="form-label">
            Project ID <span>*</span>
          </label>
          <input
            value={frmEdit.values.id}
            type="text"
            className="form-control"
            name="id"
            id="id"
            disabled
          />
        </div>
        <div className="mb-4">
          <label className="form-label">
            Project name <span>*</span>
          </label>
          <input
            value={frmEdit.values.projectName}
            type="text"
            className="form-control"
            name="projectName"
            onChange={frmEdit.handleChange}
            id="name"
          />
        </div>

        <div className="mb-4">
          <label className="form-label">
            Project category <span>*</span>
          </label>
          <select
            className="form-select"
            name="categoryName"
            value={frmEdit.values.categoryName}
            onChange={frmEdit.handleChange}
          >
            {arrCategory.map((cat, idx) => {
              return <option value={cat.projectCategoryName} key={idx}>{cat.projectCategoryName}</option>;
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Description</label>
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue={project?.description}
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
            <button type="submit" className="btn btn-1">
              Update
            </button>
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

export default ProjectSettings;
