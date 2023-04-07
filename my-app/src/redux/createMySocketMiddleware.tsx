import { Middleware } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import { getActions } from "./actions";
import localforage from "localforage";
import { RootState, TMessage } from "./store";

const uniqid = require("uniqid");

export type TFile = {
  file: {
    src: string;
    type: string;
  };
  id: string;
};
export type TMessageWithoutFiles = {
  user: string;
  message: string;
  id: string;
  reply: TMessage | null;
};
//  "proxy": "http://192.168.2.225:8888" my
//  "proxy": "http://192.168.2.159:8000"

export const createMySocketMiddleware = (): Middleware => {
  return ({ getState, dispatch }) => {
    const url = "http://192.168.2.225:8888";

    let socket = io(url);
    const { actions } = getActions();
    actions.forEach(({ reducerAction, socketAction }) => {
      socket.on(socketAction, (data) => {
        dispatch({
          type: reducerAction,
          payload: data,
        });
      });
    });

    socket.on("GET_MESSAGES", (messageFromServer) => {
      const { user, message, thread, id, file } = messageFromServer;
      if (file) {
        const fileData = {
          file,
          id,
        };
        localforage.getItem("files").then((files: any) => {
          const newFiles = [...files, fileData];
          localforage.setItem("files", newFiles, () => {
            const messageWithoutFile = { user, message, thread, id };
            dispatch({
              type: "chat/getMessage",
              payload: messageWithoutFile,
            });
          });
        });
      } else {
        dispatch({
          type: "chat/getMessage",
          payload: messageFromServer,
        });
      }
    });

    socket.on("REQUEST_MESSAGES", (messages) => {
      const files = messages
        .filter((item: TMessage) => item.file)
        .map(({ file, id }: TFile) => {
          return { file, id };
        });

      localforage.setItem("files", files, () => {
        const clearMessages = messages.map(
          ({ user, message, id, reply }: TMessageWithoutFiles) => {
            return {
              user,
              message,
              id,
              reply,
            };
          }
        );
        localforage.setItem("files", files, () => {
          dispatch({
            type: "chat/updateMessages",
            payload: clearMessages,
          });
        });
      });
    });

    return (next) => (action) => {
      if (action.type) {
        if (action.type === "chat/sendName") {
          socket.emit("JOIN_CHAT", { name: action.payload });
        }
        if (action.type === "chat/sendMessage") {
          const message = messageConstructor(action.payload, getState);
          socket.emit("SEND_MESSAGE", message);
        }
      }
      next(action);
    };
  };
};

const messageConstructor = (data: any, getState: () => RootState) => {
  return {
    message: data.inputValue,
    user: getState().chat.myName,
    reply: getState().chat.reply ?? null,
    file: data.fileData ?? null,
    id: data.id ?? uniqid(),
    thread: data.thread ?? null,
  };
};
