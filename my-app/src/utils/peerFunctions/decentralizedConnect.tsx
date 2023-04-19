import { decentralizedConnectInterface } from "../../types";
import { peer } from "./peer";
import WEB from "./WEB";

const decentralizedConnect: decentralizedConnectInterface = {
  idList: [],
  connectList: [],
  peer: null,
  handleConnectEvent: null,
  handleConnectNewClient: null,

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
    this.idList.forEach(({ id }) => {
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
      if (this.handleConnectNewClient) {
        this.handleConnectNewClient(connect);
      }
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

export default decentralizedConnect;
