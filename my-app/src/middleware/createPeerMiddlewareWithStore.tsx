import { Middleware } from "@reduxjs/toolkit";
import { peer } from "../utils/peerFunctions/peerFunctions";
import { savePeerId } from "../store/store";


const createPeerMiddlewareWithStore = (): Middleware => {
  peer.initPeer(undefined)
  return ({ dispatch, getState }) => {
    peer.dispatch = dispatch
    return next => (action) => {
      if (action.type === 'chat/connectToPeer') {
        peer.connectTo(action.payload)
        dispatch(savePeerId(peer.peerId))
      }
      if (action.type === 'chat/sendMessage') {
        peer.dataConnection?.send(action.payload)
      }
      next(action)
      console.log(action.type)
    }
  }
}

export default createPeerMiddlewareWithStore;
