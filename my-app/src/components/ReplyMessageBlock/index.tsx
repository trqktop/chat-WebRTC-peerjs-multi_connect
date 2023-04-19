import "./ReplyMessageBlock.css";
// import getTypeFile from "../../utils/getTypeFile";
import React, { useState } from "react";
import { messageInterfase } from "../../types";
interface Props {
  reply: messageInterfase;
  borderLeftColor: number;
}
const ReplyMessageBlock: React.FC<Props> = ({ reply, borderLeftColor }) => {
  const [state, setState] = useState({
    isHover: false,
  });
  // const file = reply?.file
  //   ? getTypeFile(reply.file.type, reply.file.src, {
  //       width: "120px",
  //       height: "120px",
  //     })
  //   : null;

  // const scrollToElHandler = (e: any) => {
  //   e.preventDefault();
  //   document.getElementById(reply.id)?.scrollIntoView({ behavior: "smooth" });
  // };
  // onClick={scrollToElHandler}

  const onMouseEnterHandler = (e: any) => {
    e.nativeEvent.stopImmediatePropagation();
    setState((prev) => ({ ...prev, isHover: true }));
  };

  return (
    <div
      className="reply-message-container"
      style={{
        borderLeftColor: `rgb(40, 40, ${borderLeftColor})`,
        backgroundColor: `rgb(79, 78, ${borderLeftColor / 2})`,
        transform: `scale(${state.isHover ? 1.04 : 1})`,
      }}
      onMouseMove={onMouseEnterHandler}
      onMouseLeave={() => setState((prev) => ({ ...prev, isHover: false }))}
    >
      <span className="message__username">{reply.author.userName}</span>
      <span>{reply.text}</span>
      {reply.reply && (
        <ReplyMessageBlock
          reply={reply.reply}
          borderLeftColor={borderLeftColor - 55}
        />
      )}
      {/* <span className="reply-message__file">{file}</span> */}
    </div>
  );
};

export default ReplyMessageBlock;
