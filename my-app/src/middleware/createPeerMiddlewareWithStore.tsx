import { Middleware } from "@reduxjs/toolkit";
import { peer } from "../utils/peerFunctions/peerFunctions";
import { getUsers, savePeerId, saveUserName, getMessage } from "../store/store";
import nameGenerator from "../utils/nameGenerator";


const createPeerMiddlewareWithStore = (): Middleware => {
  peer.initPeer(undefined)
  return ({ dispatch }) => {
    peer.handleConnectEvent = (data) => {
      switch (data.type) {
        case 'idList':
          dispatch(getUsers(data))
          break
        case 'message':
          dispatch(getMessage({ message: data.data.message }))
          break
        default:
          break
      }
    }

    return next => action => {
      switch (action.type) {
        case 'chat/connectToPeer':
          peer.connectTo(action.payload);
          dispatch(saveUserName(nameGenerator()))
          next(savePeerId(peer.peerId));
          break;
        case 'chat/sendMessage':
          peer.dataConnection?.send(action.payload);
          break;
        case 'chat/getUsers':
          return next(getUsers(action.payload))
      }
      return next(action)
    }
  }
}

export default createPeerMiddlewareWithStore;
