import "./ReplyMessageBlock.css";
import getTypeFile from "../../features/getTypeFile";
import React from "react";

const ReplyMessageBlock: React.FC<any> = ({ reply }) => {
  const file = reply?.file
    ? getTypeFile(reply.file.type, reply.file.src, {
        width: "120px",
        height: "120px",
      })
    : null;

  const scrollToElHandler = (e: any) => {
    e.preventDefault();
    document.getElementById(reply.id)?.scrollIntoView({ behavior: "smooth" });
  };

  return reply ? (
    <div className="reply-message-container" onClick={scrollToElHandler}>
      <span>{reply.user}</span>
      <span>{reply.message}</span>
      <span className="reply-message__file">{file}</span>
    </div>
  ) : null;
};

export default ReplyMessageBlock;
