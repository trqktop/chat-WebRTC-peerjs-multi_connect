import { Middleware } from "@reduxjs/toolkit";
import Peer, { DataConnection } from "peerjs";
import { savePeerId } from "../store/store";

const STORE_ID = 'powerangers';

interface WebInterface {
  store: Peer | null;
  createStore: () => void;
  storeListeners: () => void;
}

const WEB: WebInterface = {
  store: null,
  createStore() {
    if (!this.store) {
      this.store = new Peer(STORE_ID)
      this.storeListeners()
    }
  },
  storeListeners() {
    this.store?.on('open', (id: string) => {
      console.log('Store was created:', id)
    })
    this.store?.on('connection', (connect) => {
      console.log('some connected to store, his id:' + connect.peer)

      connect.on('error', (err) => {
        console.log('connect error from store:', err)
      })

      connect.on('data', (data) => {
        console.log(data)
      })
    })
    this.store?.on('error', (err) => {
      console.log('error from store :', err)
    })
  }
}

interface PeerInterface {
  peerConnection: Peer | null;
  dataConnection: DataConnection | null;
  peerId: string | null | undefined;
  connectId: string | null | undefined;
  initPeer: (id: string | undefined) => void;
  peerConnectionListeners: () => void;
  handlePeerError: (err: Error) => void;
  connectTo: (id: string) => void;
  dataConnectionListeners: () => void;
}

const peer: PeerInterface = {
  peerConnection: null,
  dataConnection: null,
  peerId: null,
  connectId: null,

  initPeer(id) {
    this.peerId = id
    if (!this.peerConnection) {
      const options = id ? { key: id } : {}
      this.peerConnection = new Peer(options);
      this.peerConnectionListeners();
    }
  },

  peerConnectionListeners() {
    this.peerConnection?.on('open', (id) => {
      this.peerId = id
      console.log('Peer opened:', id)
      if (this.connectId) {
        console.log('try to connect store')
        // this.connectTo(this.connectId)
      }
    })
    this.peerConnection?.on('error', (err: Error) => {
      this.handlePeerError(err)
    })
  },

  handlePeerError(err: Error) {
    if ('type' in err && err.type === 'peer-unavailable' && this.connectId) {
      if (this.dataConnection) {
        this.dataConnection?.close()
        this.dataConnection?.removeAllListeners()
        this.dataConnection = null
      }
      WEB.createStore();
      if (WEB.store) {
        this.connectTo(this.connectId)
      }
    } else {
      console.error(err);
    }
  },

  connectTo(id: string) {
    if (!this.dataConnection) {
      this.connectId = id
      if (this.peerConnection) {
        this.dataConnection = this.peerConnection.connect(id)
        this.dataConnectionListeners()
      }
    }
  },
  dataConnectionListeners() {
    if (this.dataConnection) {
      this.dataConnection.on('open', () => {
        console.log('Connected to:', this.connectId)
      })
      this.dataConnection.on('error', (err: Error) => {
        console.log(err)
        if ('type' in err) {
          console.log('Connection error:', err.type)
        }
      })
      this.dataConnection.on('data', (data) => {
        console.log(data)
      })
    }
  }
}

const createPeerMiddlewareWithStore = (): Middleware => {
  peer.initPeer(undefined)


  return ({ dispatch, getState }) => {
    if (peer.peerId) {
      dispatch(savePeerId(peer.peerId))
    }
    return next => (action: any) => {
      if (action.type === 'chat/connectToPeer') {
        peer.connectTo(action.payload)
      }
      if (action.type === 'chat/sendMessage') {
        peer.dataConnection?.send(action.payload)
      }
      next(action)
    }

  }
}

export default createPeerMiddlewareWithStore;