import { useEffect, useRef } from "react";
import { messageInterfase, userInterface } from "../../types";
import Message from "../Message";
import "./Messages.css";

type MyProps = {
  messages: Array<messageInterfase>;
  myName: userInterface;
};

const Messages: React.FunctionComponent<MyProps> = ({ messages, myName }) => {
  const lastMessageRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    if (lastMessageRef.current)
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ul className="messages-container">
      {messages.map((message: messageInterfase, index: number) => {
        const classes =
          myName.userName === message.author.userName
            ? "message__item"
            : "message__item message__item_get";
        return (
          <li className={classes} key={index} ref={lastMessageRef}>
            <Message message={message} />
          </li>
        );
      })}
    </ul>
  );
};
export default Messages;
