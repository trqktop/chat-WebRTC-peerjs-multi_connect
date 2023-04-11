import { Peer } from "peerjs";

import { getMessage, sendName, savePeerId } from "../store/store";
import nameGenerator from "../utils/nameGenerator";

export const createPeerMiddleware = () => {
  const connList = []; //список подключенных ко мне
  const idList = [];
  let peerServer;
  let myConn; //если я подключен

  return ({ getState, dispatch }) => {
    initMyPeer();
    function initMyPeer(id) {
      peerServer = new Peer(id);
      peerServer.on("open", function (ID) {
        dispatch(sendName(nameGenerator()));
        dispatch(savePeerId(ID));
        // idList.push(ID);
        console.log(
          "СОЕДИНЕНИЕ ОТКРЫТО . ПОЛУЧЕНО И СОХРАНЕНО АЙДИ , ИМЯ ПОЛЬЗОВАТЕЛЯ"
        );
      });

      peerServer.on("connection", function (client) {
        console.log("КТОТО ПОДКЛЮЧИЛСЯ .. СОХРАНЕНО ПОДКЛЮЧЕНИЕ");
        connList.push(client);
        idList.push(client.peer);

        client.on("data", (data) => {
          console.log("СОБЫТИЕ DATA");
          switch (data.label) {
            case "message":
              console.log("ПРИЛЕТЕЛО СООБЩЕНИЕ. РАЗДАЮ ЕГО КЛИЕНТАМ");
              connList.forEach((conn) => {
                if (client.peer !== conn.peer) {
                  conn.send(data);
                }
              });
              break;
            default:
              break;
          }
          dispatch(getMessage(data));
        });
      });
    }

    function initMyConn(id) {
      myConn = peerServer.connect(id);
      myConn.on("open", function () {
        console.log("ПОДКЛЮЧИЛСЯ К ДРУГОМУ КЛИЕНТУ");
      });

      myConn.on("data", (data) => {
        console.log("ПОЛУЧИЛ ДАННЫЕ С СЕРВЕРА");
        dispatch(getMessage(data));
      });
      myConn.on("close", () => {
        // initMyConn(lastId);
        const peerId = myConn.peer;
        initMyPeer(peerId);
        initMyConn(peerId);
        console.log("close");
      });
    }

    window.addEventListener("beforeunload", (e) => {
      peerServer.destroy();
    });

    return (next) => (action) => {
      if (connList.length) {
        connList.forEach((conn) => {
          switchActions(action, getState, conn);
        });
      }
      if (!myConn) {
        //ЕСЛИ МЫ ПОДКЛЮЧИЛИСЬ. и мы клиент.  РАБОТАЕМ В ЭТОМ БЛОКЕ
        if (action.type === "chat/connectToPeer") {
          initMyConn(action.payload);
        }
      } else {
        switchActions(action, getState, myConn);
      }
      next(action);
    };
  };
};

const switchActions = (action, getState, conn) => {
  switch (action.type) {
    case "chat/sendName":
      break;
    case "chat/sendMessage":
      const message = messageConstructor(action, getState, conn);
      conn.send(message);
      break;
    default:
      break;
  }
};

const messageConstructor = (action, getState, conn) => {
  return {
    message: action.payload.message,
    file: action.payload.file,
    user: getState().chat.myName,
    reply: action.payload.reply,
    id: conn.peer,
    label: "message",
  };
};
