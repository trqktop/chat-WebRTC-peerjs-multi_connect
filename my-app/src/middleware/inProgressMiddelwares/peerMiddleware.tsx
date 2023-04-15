import { Middleware } from "@reduxjs/toolkit";
import Peer, { DataConnection } from "peerjs";
import { getMessage, savePeerId, sendMessage } from "../../store/store";
const peerMiddleware = (): Middleware => {
  const peer: Peer = new Peer();
  let peerId: any;
  let connect: any;
  let idList: any = [];
  const connects: any = [];

  return ({ getState, dispatch }) => {
    const saveId = (id: string) => {
      dispatch(savePeerId(id));
      idList.push(id);
    };
    peer.on("open", (id) => {
      saveId(id);
      peerId = id;
    });
    peer.on("connection", (client) => {
      console.log("some connected");
      idList.push(client.peer);
      client.on("data", (data: any) => {
        if (Array.isArray(data)) {
          client.send(idList);
          reconnect(idList);
        } else {
          dispatch(getMessage(data));
        }
      });
    });

    const reconnectListeners = (connect: DataConnection) => {
      connect.on("open", () => {
        console.log("opened another connection");
      });
      connect.on("data", (data) => {
        if (typeof data == typeof "string") {
          dispatch(getMessage(data));
        }
      });
    };

    const reconnect = (idList: string[]) => {
      idList.forEach((id: string) => {
        if (id !== peerId) {
          const connect = peer.connect(id);
          reconnectListeners(connect);
          connects.push(connect);
        }
      });
    };

    return (next) => (action) => {
      if (action.type === "chat/connectToPeer") {
        connect = peer.connect(action.payload);
        connect.on("open", () => {
          connect.send(idList);
          connect.on("data", (newIdList: any) => {
            idList = newIdList;
            reconnect(newIdList);
          });
        });
      }
      if (action.type === "chat/sendMessage") {
        if (connects.length)
          connects.forEach((connect: DataConnection) => {
            connect.send(action.payload);
          });
        else {
          // connect.send(action.payload)
          console.log(connect);
        }
      }
      next(action);
    };
  };
};

export default peerMiddleware;
