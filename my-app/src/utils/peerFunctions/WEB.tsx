import Peer from "peerjs";
import { WebInterface } from "../../types";
import nameGenerator from "../nameGenerator";
import { peer } from "./peer";


const WEB_ID = "111";
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
    this.store?.on("open", (id) => {
      console.log("Store was created:", id);
      this.store?.on("connection", (conn) => {
        conn.on("open", () => {
          console.log("some connected id:", conn.peer);
          const idx = this.connectList.indexOf(conn);
          this.connectList.push(conn);
          this.connectIdList.push({ id: conn.peer, userName: nameGenerator() });
          this.connectList.forEach((c) => {
            c.send({ type: "idList", data: this.connectIdList });
          });
          conn.on("data", (data) => {
            this.connectList.forEach((c) => {
              if (c !== conn) {
                c.send({ type: "message", data: data });
              }
            });
            conn.on("close", () => {
              this.connectList.splice(idx, 1);
              this.connectIdList.splice(idx, 1);
              console.log("connection closed:", conn.peer);
            });
          });
        });
      });
      this.store?.on("error", (err) => {
        console.log("error from store :", err);
        if ("type" in err) {
          this.store?.removeAllListeners();
          this.store?.destroy();
          this.store = null;
        }
      });
      window.onbeforeunload = (e) => {
        e.preventDefault()
        this.connectList.forEach((c) => {
          c.send({ type: "WEBClose", WEBid: this.store?.id });
        });
      };
    });
    this.store?.on("error", (err) => {
      console.log("error from store :", err);
      if ("type" in err) {
        peer.connectTo(WEB_ID)
      }
    });
  },
};

export default WEB;
