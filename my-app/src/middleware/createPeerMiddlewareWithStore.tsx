import { Middleware, MiddlewareAPI } from "@reduxjs/toolkit";
import { peer } from "../utils/peerFunctions/peer";
import {
  savePeerId,
  getMessage,
  saveUserName,
  getUsers,
  getMessages,
  sendMessage,
  WEBCreator,
} from "../store/store";
import { messageInterfase, FileInterface } from "../types";
import { userInterface } from "../types";
import WEB from "../utils/peerFunctions/WEB";
import decentralizedConnect from "../utils/peerFunctions/decentralizedConnect";

const createPeerMiddlewareWithStore = (): Middleware => {
  peer.initPeer(undefined);
  return ({ dispatch, getState }: MiddlewareAPI) => {
    peer.handleWEBConnectEvent = (event) => {
      switch (event.type) {
        case "WEBClose":
          if (event.WEBid.id === peer.peerConnection?.id) {
            dispatch(WEBCreator(true));
          }
          break;
        case "idList":
          decentralizedConnect.peer = peer.peerConnection;
          decentralizedConnect.connectToList(event.data);
          dispatch(getUsers(event.data));
          if (WEB.connectList.length && !getState().chat.WEBcreator) {
            dispatch(WEBCreator(true));
          }
          if (!getState().chat.userName) {
            const myName: userInterface = event.data.find(
              (user: userInterface) => user.id === peer.peerId
            );
            dispatch(saveUserName(myName));
          }
          break;
        default:
          break;
      }
    };
    decentralizedConnect.handleConnectNewClient = (connect) => {
      const state = getState().chat;
      if (state.WEBcreator) {
        connect.send({ type: "messages", data: state.messages });
      }
    };
    decentralizedConnect.handleConnectEvent = (event) => {
      switch (event.type) {
        case "message":
          dispatch(getMessage(event));
          break;
        case "messages":
          dispatch(getMessages(event.data));
          break;
        default:
          break;
      }
    };

    return (next) => (action) => {
      switch (action.type) {
        case "chat/connectToPeer":
          //подключаемся к комнате
          WEB.webID = action.payload;
          peer.connectTo(action.payload);
          next(savePeerId(peer.peerId));
          break;
        case "chat/sendMessage":
          const chat = getState().chat;
          const userName = chat.userName;
          const reply = chat.replyMessage;
          if (userName) {
            const { text, file, reply }: messageInterfase = {
              ...action.payload,
            };
            const message = messageConstructor(text!, userName!, file!, reply!);
            //всем децентрализированным пользователем рассылаем сообщения
            decentralizedConnect.connectList.forEach((connect) => {
              connect.send(message);
            });
            return next(sendMessage(message));
          }
          break;
      }
      return next(action);
    };
  };
};

const messageConstructor = (
  text: string,
  author: userInterface,
  file: FileInterface,
  reply: messageInterfase
): messageInterfase => ({
  author,
  text,
  file,
  type: "message",
  reply,
});

export default createPeerMiddlewareWithStore;
