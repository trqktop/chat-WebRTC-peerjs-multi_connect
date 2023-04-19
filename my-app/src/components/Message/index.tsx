import "./Message.css";
import MessageControlPanel from "../MessageControlPanel";
import getTypeFile from "../../utils/getTypeFile";
import { messageInterfase } from "../../types";
import ReplyMessageBlock from "../ReplyMessageBlock";

type MyProps = {
  message: messageInterfase;
};

const Message: React.FunctionComponent<MyProps> = ({ message }) => {
  const { author, text, file, reply } = { ...message };
  const renderFile = file
    ? getTypeFile(file.type, file.src, {
        width: window.innerWidth / 4,
        height: window.innerHeight / 3,
      })
    : null;

  return (
    <>
      {/* {modalIsOpened ? <MessageModal /> : null}  */}
      <div className="message__item-container">
        {/* id={0} */}
        {reply ? (
          <ReplyMessageBlock reply={reply} borderLeftColor={255} />
        ) : null}
        <span className="message__username">{author.userName}</span>
        <span>{text}</span>
        <span className="message__file">{renderFile}</span>
        <MessageControlPanel message={message} />
      </div>
    </>
  );
};

export default Message;
