import { Middleware } from "@reduxjs/toolkit";
import { peer } from "../utils/peerFunctions/peerFunctions";
import { savePeerId } from "../store/store";


const createPeerMiddlewareWithStore = (): Middleware => {
  peer.initPeer(undefined)
  return ({ dispatch }) => {
    peer.dispatch = dispatch
    return next => action => {
      switch (action.type) {
        case 'chat/connectToPeer':
          peer.connectTo(action.payload);
          dispatch(savePeerId(peer.peerId));
          break;
        case 'chat/sendMessage':
          peer.dataConnection?.send(action.payload);
          break;
        default:
          break;
      }
      return next(action)
    }
  }
}

export default createPeerMiddlewareWithStore;
