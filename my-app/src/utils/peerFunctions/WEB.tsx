import Peer from "peerjs";
import { WebInterface } from "../../types";
import nameGenerator from "../nameGenerator";







const WEB_ID = "111";
const WEB: WebInterface = {
  store: null,
  connectList: [],
  connectIdList: [],
  createStore() {
    if (!this.store) {
      this.store = new Peer(WEB_ID);
      this.storeListeners();
    } else if (this.store.disconnected) {
      this.store.reconnect();
    }//todo НЕ РАЮОТАЕТ БЛОК ЕЛСЕ ИФ
  },
  storeListeners() {
    this.store?.on("open", (id) => {
      console.log("Store was created:", id);
      WEB.store?.on("connection", (conn) => {
        conn.on("open", () => {
          console.log("some connected id:", conn.peer);
          const idx = WEB.connectList.indexOf(conn);
          WEB.connectList.push(conn);
          WEB.connectIdList.push({ id: conn.peer, userName: nameGenerator() });
          WEB.connectList.forEach((c) => {
            c.send({ type: "idList", data: WEB.connectIdList });
          });
          conn.on("data", (data) => {
            WEB.connectList.forEach((c) => {
              if (c !== conn) {
                c.send({ type: "message", data: data });
              }
            });
            conn.on("close", () => {
              WEB.connectList.splice(idx, 1);
              WEB.connectIdList.splice(idx, 1);
              console.log("connection closed:", conn.peer);
            });
          });
        });
      });
      WEB.store?.on("error", (err) => {
        console.log("error from store :", err);
        if ("type" in err) {
          WEB.store?.removeAllListeners();
          WEB.store?.destroy();
          WEB.store = null;
        }
      });
      window.onbeforeunload = () => {
        WEB.connectList.forEach((c) => {
          c.send({ type: "WEBClose", WEBid: WEB.store?.id });
        });
      };
    });
  },
};

export default WEB;

// В WEB.ts:

// const store = new Peer(WEB_ID);

// const WEB: WebInterface = {
//   store: store,
//   ...
// }

// export default WEB;
// В peer.ts:

// import WEB from "./WEB";

// const peer: PeerInterface = {
//   ...
//   initPeer(id) {
//     this.peerId = id;
//     if (!this.peerConnection) {
//       const options = id ? { key: id } : {};
//       this.peerConnection = new Peer(options);
//       this.peerConnectionListeners();
//     }
//     // Импортировать и установить тот же экземпляр store из WEB
//     WEB.store = this.peerConnection;
//   },
//   ...
// }

// export { peer };
