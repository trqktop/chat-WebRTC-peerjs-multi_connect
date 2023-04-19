import Peer from "peerjs";
import { PeerInterface } from "../../types";
import WEB from "./WEB";

const peer: PeerInterface = {
  peerConnection: null,
  dataConnection: null,
  peerId: null,
  connectId: null,
  handleWEBConnectEvent: null,
  dataFromListener: null,
  idIsTaken: false,
  initPeer(id) {
    this.peerId = id;
    if (!this.peerConnection) {
      const options = id ? { key: id } : {};
      this.peerConnection = new Peer(options);
      this.peerConnectionListeners();
    }
  },
  peerConnectionListeners() {
    if (this.peerConnection) {
      this.peerConnection.on("open", (id) => {
        this.peerId = id;
        console.log("Peer opened:", id);
      });
      this.peerConnection.on("error", (err) => {
        this.handlePeerError(err);
      });
    }
  },

  handlePeerError(err) {
    if (!this.idIsTaken) {
      this.rebaseWEB();
    } else {
      this.connectTo(this.connectId!);
    }
  },
  clearDataConnection() {
    if (this.dataConnection) {
      this.dataConnection.close();
      this.dataConnection.removeAllListeners();
      this.dataConnection = null;
    }
  },
  connectTo(id) {
    if (!this.dataConnection) {
      this.connectId = id;
      if (this.peerConnection) {
        this.dataConnection = this.peerConnection.connect(id);
        this.dataConnectionListeners();
      } else {
        this.initPeer(undefined);
        this.connectTo(id);
      }
    } else {
      this.clearDataConnection();
      this.connectTo(id);
    }
  },
  rebaseWEB() {
    WEB.clearWEB();
    WEB.createStore();
    WEB.initWebHandler = (id) => {
      console.log("WEB was opened , try connect to", id);
      this.connectTo(id);
    };
  },
  dataConnectionListeners() {
    if (this.dataConnection) {
      WEB.errorHandleListener = (err) => {
        console.log("err form peer :" + err.message);
        if (err.message.includes("is taken")) {
          console.log("err from peer ID :" + err.message);
        }
        this.connectTo(this.connectId!);
      };
      this.dataConnection.on("open", () => {
        console.log("Connected to:", this.connectId);
        this.dataConnection?.on("data", (data: any) => {
          if (this.handleWEBConnectEvent) {
            if (data.type === "WEBClose") {
              if (data.WEBid.id === this.peerConnection?.id) {
                this.idIsTaken = false;
                this.rebaseWEB();
              } else {
                this.idIsTaken = true;
                this.connectTo(this.connectId!);
              }
            }
            this.handleWEBConnectEvent(data);
          }
        });
      });
      this.dataConnection.on("error", (err) => {
        console.log(err, err.message);
        console.log(
          "Connection error from DataConnectionListeners:",
          err.message
        );
        this.connectTo(this.connectId!);
      });
      window.onbeforeunload = () => {
        this.dataConnection?.close();
      };
    }
  },
};

export { peer };
