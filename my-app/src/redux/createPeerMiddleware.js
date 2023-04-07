import {
  Peer
} from "peerjs";
import {
  getMessage,
  sendName
} from "./store";
import nameGenerator from "../features/nameGenerator";

export const createPeerMiddleware = () => {
  const connList = []
  let conn; //я хост
  let peer; // открываем 
  let myConn; //я клиент
  return ({
    getState,
    dispatch
  }) => {
    peer = new Peer("92fa63e6-6ed4-4216-8ec3-5798b0306038main");
    peer.on("open", function (ID) {
      console.log("СОЕДИНЕНИЕ ОТКРЫТО ....... ПОЛУЧЕНО И СОХРАНЕНО АЙДИ");
      dispatch(sendName(nameGenerator()));
    });
    peer.on("connection", function (c) {
      console.log("КТОТО ПОДКЛЮЧИЛСЯ .......... СОХРАНЕНО ПОДКЛЮЧЕНИЕ");
      conn = c;
      connList.push(c)
      c.on("data", (data) => {
        console.log("СОБЫТИЕ DATA");
        connList.forEach(con => {
          if (c.peer !== con.peer) {
            con.send(data)
          }
        })
        dispatch(getMessage(data));
      });
    });

    return (next) => (action) => {
      if (conn) {
        //ЕСЛИ К НАМ ПОДКЛЮЧИЛИСЬ. И ПЕРЕМЕННАЯ ОПРЕДЕЛЕНА . РАБОТАЕМ В ЭТОМ БЛОКЕ
        //ЭТА ХЕРНЯ ДЛЯ ОТПРАВКИ ДАННЫХ ПОДКЛЮЧЕННЫМ К НАМ КЛИЕНТАМ
        connList.forEach((con) => {
          switchAction(con, action);
        });
      }
      if (!myConn) {
        //ЕСЛИ МЫ ПОДКЛЮЧИЛИСЬ. и мы клиент.  РАБОТАЕМ В ЭТОМ БЛОКЕ
        //ОТЛАВЛИВАЕМ ПОДКЛЮЧЕНИЕ И АЙДИШНИК С action.payload  ПРИЛЕТЕВШИЙ С ФОРМЫ
        if (action.type === "chat/connectToPeer") {
          myConn = peer.connect(action.payload);
          myConn.on("open", function () {
            console.log("ПОДКЛЮЧИЛСЯ К ДРУГОМУ КЛИЕНТУ");
            //СОБЫТИЯ НА ПРИЕМ ДАННЫХ
            myConn.on("data", (data) => {
              console.log("ПОЛУЧИЛ ДАННЫЕ С СЕРВЕРА");
              //ОТПРАВЛЯЕМ ДАННЫЕ С СЕРВЕРА В РЕДАКС
              dispatch(getMessage(data));
            });
          });
        }
      } else {
        //ЗА ОТПРАКУ ДАННЫХ ПОДЕЛЮЧЕННЫМ К НАМ ОТВЕЧАЕТ ЭТА ЧАСТь В ЭТОМ БЛОКЕ
        switchAction(myConn, action);
      }
      next(action);
    };
  };
};

const switchAction = (conn, action) => {
  switch (action.type) {
    case "chat/sendName":
      break;
    case "chat/sendMessage":
      conn.send(action.payload);
      break;
    default:
      break;
  }
};