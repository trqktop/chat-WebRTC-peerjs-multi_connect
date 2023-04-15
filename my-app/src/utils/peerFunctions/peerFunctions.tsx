import Peer from "peerjs";
import { WebInterface, PeerInterface } from "../../types";
import { WEBCreator, getMessage } from "../../store/store";
const WEB_ID = '111';
const WEB: WebInterface = {
  store: null,
  connectList: [],
  connectIdList: [],
  createStore() {
    if (!this.store) {
      this.store = new Peer(WEB_ID)
      this.storeListeners()
    }
  },
  storeListeners() {
    this.store?.on('open', (id) => {
      console.log('Store was created:', id)
      WEB.store?.on('connection', (conn) => {
        conn.on('open', () => {
          console.log('some connected id:', conn.peer)
          const idx = WEB.connectList.indexOf(conn);
          WEB.connectList.push(conn)
          WEB.connectIdList.push(conn.peer);
          WEB.connectList.forEach(c => {
            c.send({ type: 'idList', data: WEB.connectIdList });
          });
          conn.on('data', (message) => {
            WEB.connectList.forEach(c => {
              if (c !== conn) {
                c.send({ type: 'message', data: message });
              }
            });
            conn.on('close', () => {
              WEB.connectList.splice(idx, 1);
              WEB.connectIdList.splice(idx, 1);
              console.log('connection closed:', conn.peer);
            });
          });
        })
      });
    })
    WEB.store?.on('error', (err) => {
      console.log('error from store :', err)
    })
  }
}

const peer: PeerInterface = {
  peerConnection: null,
  dataConnection: null,
  peerId: null,
  connectId: null,
  dispatch: null,

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
    })
    this.peerConnection?.on('error', (err) => {
      this.handlePeerError(err)
    })
  },

  handlePeerError(err) {
    if ('type' in err && err.type === 'peer-unavailable' && this.connectId) {
      if (this.dataConnection) {
        this.dataConnection?.close()
        this.dataConnection?.removeAllListeners()
        this.dataConnection = null
      }
      WEB.createStore();
      if (this.dispatch) {
        this.dispatch(WEBCreator(true))
      }
      if (WEB.store) {
        this.connectTo(this.connectId)
      }
    } else {
      console.error(err);
    }
  },

  connectTo(id) {
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
        this.dataConnection?.on('data', (data: any) => {
          switch (data.type) {
            case 'idList':
              console.log(data, 'idList')
              break
            case 'message':
              if (this.dispatch) {
                this.dispatch(getMessage({ message: data.data.message }))
              }
              break
            default:
              break
          }
        })
      })
      this.dataConnection.on('error', (err) => {
        console.log(err)
        if ('type' in err) {
          console.log('Connection error:', err.type)
        }
      })
    }
  }
}

export { peer, WEB }