import React, { useEffect, useState } from "react";
import { ICustomErrType, http } from "../../../util/config";
import { Comment, getCommentApi } from "../../../redux/reducers/taskReducer";
import { Avatar } from "antd";
import { toast } from "react-toastify";
import { LstTaskDeTail } from "../../../redux/reducers/projectReducer";
import { useAppDispatch } from "../../../redux/reduxHooks";

interface CommentProps {
  commentProp: Comment;
  task: LstTaskDeTail;
}

export const CommentComponent = ({ commentProp, task }: CommentProps) => {
  function createMarkup(string) {
    return { __html: string };
  }

  const dispatch = useAppDispatch();

  const [isShow, setShow] = useState(false);

  const [commentVal, setCommentVal] = useState("");

  useEffect(() => {
    if (commentProp && commentProp.contentComment) {
      setCommentVal(commentProp.contentComment);
    }
  }, [commentProp]);

  return (
    <div className="row">
      <div className="col-md-1">
        <div className="boxavatar">
          <Avatar src={commentProp.user.avatar} />
        </div>
      </div>
      <div className="col-md-11">
        <div className="boxright">
          <div className="boxuser">{commentProp.user.name}</div>
          <div
            className="boxrepcmt"
            dangerouslySetInnerHTML={createMarkup(commentProp.contentComment)}
          ></div>
          {isShow && (
            <div className="boxupate active ">
              <textarea
                className="open-source-plugins"
                value={commentVal}
                onChange={(e) => setCommentVal(e.target.value)}
              />
              <div className="d-flex mt-4">
                <button
                  className="btn btn-1"
                  onClick={async (e) => {
                    e?.preventDefault();
                    try {
                      console.log(commentVal);
                      const data = await http.put(
                        `/Comment/updateComment?id=${commentProp.id}&contentComment=${commentVal}`
                      );
                      if (
                        data &&
                        data.data.statusCode === 200
                      ) {
                        await dispatch(
                          getCommentApi(task?.taskId!)
                        );
                        toast.success(
                          "Update comment success"
                        );
                        setShow(false);
                      }
                    } catch (e) {
                      const error = e as ICustomErrType as any;
                      if (error && error.response) {
                        toast.error(error.response.data.message);
                      }
                    }
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-outline-light text-dark"
                  onClick={(e) => setShow(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="boxbtn d-flex">
            <button
              type="button"
              className="btn btn-outline-light text-dark"
              onClick={(e) => {
                console.log("clicked");
                setShow(true);
                console.log(isShow);
              }}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-outline-light text-dark"
              onClick={async (e) => {
                try {
                  const data = await http.delete(`/Comment/deleteComment?idComment=${commentProp.id}`
                  );
                  if (
                    data &&
                    data.data.statusCode === 200
                  ) {
                    await dispatch(
                      getCommentApi(task?.taskId!)
                    );
                    toast.success(
                      "Delete comment success"
                    );
                    setShow(false);
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
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
