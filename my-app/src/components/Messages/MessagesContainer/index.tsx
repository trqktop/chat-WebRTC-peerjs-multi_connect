import React, { useEffect } from "react";
import { RootState } from "../../../redux/store";
import { useSelector } from "react-redux";
import Message from "../Message/index";

const MessagesContainer = (ReactElement: any) => {
  const messages = useSelector((state: RootState) => state.chat.messages);
  const myName = useSelector((state: RootState) => state.chat.myName);
  const lastMessageRef: React.RefObject<HTMLLIElement> = React.useRef(null);
  // const [messagesWithFiles, setMessagesWithFiles]: Awaited<Promise<any>> =
  //   useState(null);
  // useEffect(() => {
  //   if (messages.length) {
  //     const getMessages = mergeMessagesWithIDB(messages);
  //     getMessages.then((mergedMessages) => {
  //       setMessagesWithFiles(mergedMessages);
  //     });
  //   }
  // }, [messages]);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  console.log(messages);
  return (
    <ul className="message">
      {messages.map((data: any, index: any) => {
        const { user }: any = { ...data };
        const classes =
          myName === user ? "message__item" : "message__item message__item_get";
        return (
          <li className={classes} key={index} ref={lastMessageRef}>
            <Message data={data} />
          </li>
        );
      })}
    </ul>
  );
};

export default MessagesContainer;
