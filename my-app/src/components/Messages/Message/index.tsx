import "./Message.css";
import MessageControlPanel from "../../MessageControlPanel";
import getTypeFile from "../../../features/getTypeFile";
import ReplyMessageBlock from "../../ReplyMessageBlock";
const Message = ({ data }: any) => {
  // const { user, message, file, id, reply }: any = { ...data };
  // const { src, type }: any = { ...file };
  // const renderFile = file
  //   ? getTypeFile(type, src, {
  //       width: window.innerWidth / 4,
  //       height: window.innerHeight / 3,
  //     })
  //   : null;
  return (
    <>
      {/* {modalIsOpened ? <MessageModal /> : null}  */}
      <div className="message__item-container">
        {/* id={0} */}
        {/* <ReplyMessageBlock reply={reply} />
        <span className="message__username">{user}</span> */}
        <span>{data}</span>
        {/* <span className="message__file">{renderFile}</span> */}
        <MessageControlPanel message={data} />
      </div>
    </>
  );
};

export default Message;
