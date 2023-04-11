import { Middleware } from "@reduxjs/toolkit";
import { io } from "socket.io-client";
import localforage from "localforage";
import { RootState, TMessage } from "./store";
import { sendName } from "./store";
import nameGenerator from "../features/nameGenerator";
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


const addToStorage = async (file: any) => {
  await localforage.getItem('files').then(async (files: any) => {
    const store = files ? [...files, file] : [file]
    await localforage.setItem("files", store)
  })
}

const createStorage = async (messages: any) => {
  await localforage.setItem("files", messages)
}

const messageConstructor = (data: any, getState: () => RootState) => {
  const id = uniqid()
  return {
    message: data.inputValue,
    user: getState().chat.myName,
    reply: getState().chat.reply ?? null,
    file: data.fileData ? { ...data.fileData, id: id } : null,
    id: id,
  };
};


export const createMySocketMiddleware = (): Middleware => {
  return ({ getState, dispatch }) => {
    const url = "http://localhost:8888";
    let socket = io(url);
    socket.on('GET_USERS', (names) => {
      dispatch({
        type: 'chat/getUsers',
        payload: names,
      });
    });
    socket.on("GET_MESSAGES", async (message) => {
      if (message.file) {
        const file = { ...message.file }
        await addToStorage(file)
        delete message.file.src
      }
      dispatch({
        type: "chat/getMessage",
        payload: message,
      });
    });
    socket.on("REQUEST_MESSAGES", async (messages) => {
      const files = []
      for (let i = 0; i <= messages.length - 1; i++) {
        if (messages[i].file) {
          const file = { ...messages[i].file, id: messages[i].id }
          files.push(file)
          delete messages[i].file.src
        }
      }
      if (files.length) {
        await createStorage(files)
      }
      dispatch({
        type: "chat/updateMessages",
        payload: messages,
      });
    });

    return (next) => (action) => {
      if (action.type) {
        if (action.type === "chat/joinChat") {
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

