import { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import Message from "./Message";
import localforage from "localforage";
import "./Messages.css";
import { TMessage } from "../../redux/store";
import MessagesContainer from "./MessagesContainer";

type TFile = {
  file: {
    file: string;
    type: string;
  };
  id: string;
};

// async function mergeMessagesWithIDB(messages: any) {
//   const result = localforage
//     .getItem("files")
//     .then((dbFiles: any) => {
//       if (dbFiles.length > -1) {
//         const resultMessages = messages.map((message: TMessage) => {
//           const index = dbFiles.findIndex((file: TFile) => {
//             return message.id === file.id;
//           });
//           if (index > -1) {
//             return { ...message, file: dbFiles[index].file };
//           }
//           return message;
//         });
//         return resultMessages;
//       }
//     })
//     .then((localState) => {
//       return localState;
//     });
//   return await result;
// }

const Messages = () => {
  return (
    <ul className="message">
      <MessagesContainer ReactElement={<Message />} />
      {/* {messages.map((data: any, index: number) => {
        const { user }: any = { ...data };
        const classes =
          myName === user ? "message__item" : "message__item message__item_get";
        return (
          <li className={classes} key={index} ref={lastMessageRef}>
            <Message data={data} />
          </li>
        );
      })} */}
    </ul>
  );
};
export default Messages;
