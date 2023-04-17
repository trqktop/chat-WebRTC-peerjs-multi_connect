"use strict"
import Peer from "peerjs";
import { PeerInterface } from "../../types";
import WEB from "./WEB";

const peer: PeerInterface = {
  peerConnection: null,
  dataConnection: null,
  peerId: null,
  connectId: null,
  handleConnectEvent: null,
  dataFromListener: null,
  initPeer(id) {
    this.peerId = id;
    if (!this.peerConnection) {
      const options = id ? { key: id } : {};
      this.peerConnection = new Peer(options);
      this.peerConnectionListeners();
    }
  },
  peerConnectionListeners() {
    this.peerConnection?.on("open", (id) => {
      this.peerId = id;
      console.log("Peer opened:", id);
    });
    this.peerConnection?.on("error", (err) => {
      this.handlePeerError(err);
    });
  },

  handlePeerError(err) {
    if ("type" in err && err.type === "peer-unavailable" && this.connectId) {
      if (this.dataConnection) {
        this.clearDataConnection();
      }
      WEB.createStore()
      this.connectTo(this.connectId)
    } else {
      console.error(err);
    }
  },
  clearDataConnection() {
    this.dataConnection?.close();
    this.dataConnection?.removeAllListeners();
    this.dataConnection = null;
  },
  connectTo(id) {
    if (!this.dataConnection) {
      this.connectId = id;
      if (this.peerConnection) {
        this.dataConnection = this.peerConnection.connect(id);
        this.dataConnectionListeners();
      }
    } else {
      this.clearDataConnection();
      this.connectTo(id);
    }
  },
  dataConnectionListeners() {
    if (this.dataConnection) {
      this.dataConnection.on("open", () => {
        console.log("Connected to:", this.connectId);
        this.dataConnection?.on("data", (data: any) => {
          if (this.handleConnectEvent) {
            if (data.type === "WEBClose") {
              this.clearDataConnection();
              WEB.createStore();
              if (WEB.store) {
                this.connectTo(data.WEBid);
              }
            }
            this.handleConnectEvent(data);
          }
        });
      });
      this.dataConnection.on("error", (err) => {
        if ("type" in err) {
          console.log("Connection error:", err.type);
        }
      });
    }
  },
};

export { peer };
