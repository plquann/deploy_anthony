import React, { useEffect, useRef} from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ICustomErrType } from "../../util/config";
import { DispatchType, RootState } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { getCategoryApi } from "../../redux/reducers/projectReducer";
import { http } from "../../util/config";
import { Editor } from '@tinymce/tinymce-react';


type Props = {};

export interface CatForm {
  projectName: string;
  description: string;
  categoryName: string;
  alias: string;
}

const Proj_Create = (props: Props) => {
  const { arrCategory } = useSelector(
    (state: RootState) => state.projectReducer
  );
  const navigate = useNavigate();
  
  // const getCatId = (name: string) => {
  //   for (let i = 0; i < arrCategory.length; i++) {
  //     if (arrCategory[i].projectCategoryName === name) {
  //       return arrCategory[i].id;
  //     }
  //   }
  // };

  const frmProject = useFormik<CatForm>({
    enableReinitialize: true,
    initialValues: {
      projectName: "",
      description: "",
      categoryName: arrCategory[0] ? arrCategory[0].projectCategoryName : "",
      alias: "",
    },
    validationSchema: Yup.object().shape({
      projectName: Yup.string().required("Project name cannot be blank!"),
      categoryName: Yup.string().required("Category cannot be blank!"),
    }),
    onSubmit: async (value: CatForm) => {
      try {
        let des = ''
        if (editorRef.current) {
          des = editorRef.current.getContent()
        }

        const data = await http.post("/Project/createProjectAuthorize", {
          projectName: frmProject.values.projectName,
          description: des,
          categoryId: frmProject.values.categoryName,
          alias: frmProject.values.projectName,
        });

        if (data && data.data.statusCode === 200) {
          toast.success("Create project success");
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
      <h2 className="content-title">Create project</h2>
      
      <form className="container" onSubmit={frmProject.handleSubmit}>
        <div className="mb-4">
          <label className="form-label">
            Project name <span>*</span>
          </label>
          <input
            value={frmProject.values.projectName}
            type="text"
            className="form-control"
            name="projectName"
            onChange={frmProject.handleChange}
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
            value={frmProject.values.categoryName}
            onChange={frmProject.handleChange}

          >
            {arrCategory.map((cat, idx) => {
              return <option value={cat.id} key={idx}>{cat.projectCategoryName}</option>;
            })}
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Description</label>

        <Editor
         onInit={(evt, editor) => editorRef.current = editor}
         initialValue="<p>This is the initial content of the editor.</p>"
         init={{
           height: 250,
           menubar: false,
           plugins: [
             'advlist autolink lists link image charmap print preview anchor',
             'searchreplace visualblocks code fullscreen',
             'insertdatetime media table paste code help wordcount'
           ],
           toolbar: 'undo redo | formatselect | ' +
           'bold italic backcolor | alignleft aligncenter ' +
           'alignright alignjustify | bullist numlist outdent indent | ' +
           'removeformat | help',
           content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
         }}
        />
        </div>
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-1">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

export default Proj_Create;
