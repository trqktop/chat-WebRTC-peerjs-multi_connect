import { Middleware } from "@reduxjs/toolkit";
import { getMessage, savePeerId, sendMessage } from "../store/store";
import { Peer } from "peerjs";

const createSimplePeerMiddleware = (): Middleware => {
  let sender: any;
  let reciver: any;
  const clients: any = [];
  const listId: any = [];
  return ({ getState, dispatch }) => {
    const enableListeners = (conn: any) => {
      conn.on("data", (data: any) => {
        if (data.message) {
          dispatch(getMessage(data));
          resendMessages(data, conn)
        }
        else {
          if (sender.peer === data) {
            initReciver(data)
          }
          else {
            initSender(data)
          }
        }
      });
      window.onbeforeunload = () => {
        swapReciver(conn)
      }
    };


    const swapReciver = (conn: any) => {
      const newReciver = clients[0]
      const reciverId = newReciver.peer
      clients.forEach((cl: any) => {
        cl.send(reciverId);
      });
      newReciver.send(reciverId)
    }


    const resendMessages = (data: any, conn: any) => {
      clients.forEach((cl: any) => {
        if (cl.peer !== conn.peer) {
          cl.send(data);
        }
      });
    }


    const initReciver = (id: any) => {
      reciver = new Peer(id);
      reciver.on("open", (id: string) => {
        dispatch(savePeerId(id));
      });

      reciver.on("connection", (client: any) => {
        console.log("client is connected");
        clients.push(client);
        listId.push(client.peer);
        enableListeners(client);
      });



    };

    const initSender = (id: any) => {
      sender = reciver.connect(id);
      sender.on("open", () => {
        enableListeners(sender);
        console.log("connected to reciver");
      });
      return sender;
    };

    initReciver(undefined);
    return (next) => (action) => {
      if (action.type === "chat/connectToPeer") {
        initSender(action.payload);
      }
      if (action.type === "chat/sendMessage") {
        if (sender) {
          sender.send(action.payload);
        } else {
          clients.forEach((client: any) => {
            client.send(action.payload);
          });
        }
      }

      next(action);
    };
  };
};

export default createSimplePeerMiddleware;
