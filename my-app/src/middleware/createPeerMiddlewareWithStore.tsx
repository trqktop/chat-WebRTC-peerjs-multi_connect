import { Middleware } from "@reduxjs/toolkit";
import { peer } from "../utils/peerFunctions/peerFunctions";
import { getUsers, savePeerId, saveUserName } from "../store/store";
import nameGenerator from "../utils/nameGenerator";


const createPeerMiddlewareWithStore = (): Middleware => {
  peer.initPeer(undefined)
  return ({ dispatch, getState }) => {
    peer.dispatch = dispatch
    peer.getState = getState
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
