import { Middleware } from "@reduxjs/toolkit";
import Peer, { DataConnection } from "peerjs";
import { getMessage, savePeerId, sendMessage } from "../../store/store";
const peerMiddleware = (): Middleware => {
  let sender: any;
  let reciver: any;
  const clients: any = [];
  const listId: any = [];
  let newReciverId: any;
  const recivers: any = [];
  const senders: any = [];
  return ({ getState, dispatch }) => {
    const enableListeners = (conn: any) => {
      conn.on("data", (data: any) => {
        if (data.message) {
          console.log(data);
          dispatch(getMessage(data));
          // resendMessages(data, conn);
        } else {
          updateConnectState(data);
        }
      });
      if (reciver) {
        disconnectReciverListener(conn);
      }
    };

    const disconnectReciverListener = (conn: any) => {
      window.onbeforeunload = () => {
        swapReciver(conn);
      };
    };

    const updateConnectState = (data: any) => {
      console.log(data);
      switch (data.type) {
        case "reciver":
          initReciver(data.reciverId);
          break;
        case "sender":
          initSender(data.reciverId);
          break;
        default:
          break;
      }
    };

    const swapReciver = (conn: any) => {
      // const newReciver = clients.pop();
      // newReciverId = newReciver.peer;
      // newReciver.send({ type: "reciver", reciverId: newReciverId });
      // clients.forEach((cl: any) => {
      //   cl.send({ type: "sender", reciverId: newReciverId });
      // });

      clients.forEach((reciver: any) => {
        reciver.send({ type: "reciver", reciverId: reciver.peer });
        clients.forEach((sender: any) => {
          if (sender.peer !== reciver.peer) {
            sender.send({ type: "sender", reciverId: reciver.peer });
          }
        });
      });
    };

    const resendMessages = (data: any, conn: any) => {
      clients.forEach((cl: any) => {
        if (cl.peer !== conn.peer) {
          cl.send(data);
        }
      });
    };

    const initReciver = (id: any) => {
      reciver = new Peer(id);
      recivers.push(reciver);
      recivers.forEach((reciver: any) => {
        reciver.on("open", (id: string) => {
          dispatch(savePeerId(id));
        });
        reciver.on("connection", (client: any) => {
          console.log("client is connected");
          clients.push(client);
          listId.push(client.peer);
          enableListeners(client);
        });

        // clients.forEach((client: any) => {
        //   initReciver(client.peer);
        //   clients.forEach((cl: any) => {
        //     initSender(cl.peer);
        //   });
        // });
      });
      // sender = null;
    };

    const initSender = (id: any) => {
      recivers.forEach((reciver: any) => {
        sender = reciver.connect(id);
        senders.push(sender);
      });
      senders.forEach((sender: any) => {
        sender.on("open", () => {
          enableListeners(sender);
          console.log("connected to reciver");
        });
      });
    };

    initReciver(undefined);

    return (next) => (action) => {
      if (action.type === "chat/connectToPeer") {
        initSender(action.payload);
      }
      if (action.type === "chat/sendMessage") {
        if (senders.length && !clients.length) {
          senders.forEach((sender: any) => {
            sender.send(action.payload);
          });
        }
        if (clients.length) {
          clients.forEach((client: any) => {
            client.send(action.payload);
          });
        }
        //  else {
        //   clients.forEach((client: any) => {
        //     client.send(action.payload);
        //   });
        // }
      }
      next(action);
    };
  };
};

export default peerMiddleware;
