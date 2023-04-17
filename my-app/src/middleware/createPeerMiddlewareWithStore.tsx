import { Dispatch, Middleware } from "@reduxjs/toolkit";
import { peer } from "../utils/peerFunctions/peer";
import {
  savePeerId,
  getMessage,
  saveUserName,
  getUsers,
  sendMessage,
  WEBCreator,
} from "../store/store";
import { messageInterfase } from "../types";
import { userInterface } from "../types";
import { DataConnection } from "peerjs";
import Peer from "peerjs";
import { AppDispatch, RootState } from "../types/chat";
import WEB from "../utils/peerFunctions/WEB";
interface decentralizedConnectInterface {
  idList: Array<userInterface>;
  peer: Peer | null;
  connectList: Array<DataConnection>;
  connectToList: (idList: Array<userInterface>) => void;
  connectTo: (id: string) => void;
  connectListeners: (connect: DataConnection) => void;
  peerListeners: (peer: Peer) => void;
  handleConnectEvent: ((data: any) => void) | null;
  isConnectedTo: (id: string) => boolean;
  updatePeerListeners: () => void;
}

const decentralizedConnect: decentralizedConnectInterface = {
  idList: [],
  connectList: [],
  peer: null,
  handleConnectEvent: null,

  updatePeerListeners() {
    if (this.peer) {
      this.peer?.removeAllListeners();
      this.peerListeners(this.peer);
      peer.peerConnectionListeners();
    }
  },

  connectToList(idList) {
    this.updatePeerListeners();
    this.idList = idList;
    this.idList.forEach(({ id }: userInterface) => {
      if (this.peer?.id !== id && !this.isConnectedTo(id)) {
        this.connectTo(id);
      }
    });
  },

  isConnectedTo(id) {
    return this.connectList.some((conn) => conn.peer === id);
  },
  connectTo(id) {
    if (!this.isConnectedTo(id)) {
      const connect = this.peer?.connect(id);
      if (connect) {
        this.connectListeners(connect);
        WEB.storeListeners();
      }
    }
  },

  connectListeners(connect) {
    connect.on("open", () => {
      console.log("decentralized connect was opened");
      this.connectList.push(connect);
    });
    connect.on("error", (err) => {
      console.log("decentralized connect err:", err);
    });
  },
  peerListeners(peer) {
    peer.on("connection", (client) => {
      console.log("decentralized connect, some conndected id:", client.peer);
      client.on("open", () => {
        client.on("data", (data) => {
          if (this.handleConnectEvent) {
            this.handleConnectEvent(data);
          }
        });
      });
    });
  },
};

type storeInterface = {
  dispatch: AppDispatch;
  getState: () => RootState;
};

const createPeerMiddlewareWithStore = (): Middleware => {
  peer.initPeer(undefined);
  return ({ dispatch, getState }: storeInterface) => {
    peer.handleConnectEvent = (event) => {
      switch (event.type) {
        case "idList":
          decentralizedConnect.peer = peer.peerConnection;
          decentralizedConnect.connectToList(event.data);
          dispatch(getUsers(event.data));
          const myName = event.data.find(
            (user: userInterface) => user.id === peer.peerId
          );
          dispatch(saveUserName(myName));
          break;
        default:
          break;
      }
    };
    decentralizedConnect.handleConnectEvent = (event) => {
      switch (event.type) {
        case "message":
          dispatch(getMessage(event));
          break;
        default:
          break;
      }
    };
    return (next) => (action) => {
      switch (action.type) {
        case "chat/connectToPeer":
          peer.connectTo(action.payload);
          next(savePeerId(peer.peerId));
          break;
        case "chat/sendMessage":
          const userName = getState().chat.userName;
          if (userName) {
            const message = messageConstructor(action.payload, userName);
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
  author: userInterface
): messageInterfase => {
  return {
    author,
    text,
    type: "message",
  };
};

export default createPeerMiddlewareWithStore;
