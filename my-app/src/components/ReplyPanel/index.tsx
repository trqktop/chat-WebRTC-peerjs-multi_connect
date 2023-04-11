import { useDispatch, useSelector } from "react-redux";
import getTypeFile from "../../utils/getTypeFile";
import "./ReplyPanel.css";
import { replyMessage, RootState } from "../../store/store";

const ReplyPanel = () => {
  const messegeData = useSelector((state: RootState) => state.chat.reply);
  const dispatch = useDispatch();
  const closeHandler = () => {
    dispatch(replyMessage(null));
  };

  if (messegeData) {
    const { user, message, file } = messegeData;
    return (
      <div className="reply">
        <div>
          {file
            ? getTypeFile(file.type, file.src, {
                width: "100px",
                height: "100px",
              })
            : null}
        </div>
        <ul className="reply__text">
          <li> {user}</li>
          <li> {message}</li>
        </ul>
        <button className="reply__close" onClick={closeHandler}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="45"
            height="45"
            viewBox="0 0 24 24"
          >
            <path
              fill="rgb(40, 40, 252)"
              d="m17.705 7.705l-1.41-1.41L12 10.59L7.705 6.295l-1.41 1.41L10.59 12l-4.295 4.295l1.41 1.41L12 13.41l4.295 4.295l1.41-1.41L13.41 12l4.295-4.295z"
            />
          </svg>
        </button>
      </div>
    );
  }
  return null;
};

export default ReplyPanel;
