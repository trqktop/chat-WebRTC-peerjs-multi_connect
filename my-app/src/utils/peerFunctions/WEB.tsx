import Peer from "peerjs";
import { WebInterface } from "../../types";
import nameGenerator from "../nameGenerator";

const WEB: WebInterface = {
  webID: undefined,
  store: null,
  connectList: [],
  connectIdList: [],
  errorHandleListener: null,
  initWebHandler: null,
  createStore() {
    if (!this.store) {
      this.store = new Peer(this.webID);
      this.storeListeners();
    }
  },
  clearWEB() {
    this.store?.removeAllListeners();
    this.store?.disconnect();
    this.store?.destroy();
    this.store = null;
  },
  uniqNameCreator() {
    const name = nameGenerator();
    const isFound = this.connectIdList.some((user) => user.userName === name);
    if (isFound) {
      return this.uniqNameCreator();
    }
    return name;
  },
  storeListeners() {
    this.store?.on("open", (id) => {
      if (this.initWebHandler) {
        this.initWebHandler(id);
      }
      console.log("Store was created:", id);
      this.store?.on("connection", (conn) => {
        conn.on("open", () => {
          console.log("some connected id:", conn.peer);
          this.connectList.push(conn);
          const uniqName = this.uniqNameCreator();
          this.connectIdList.push({ id: conn.peer, userName: uniqName });
          const idx = this.connectList.indexOf(conn);
          this.connectList.forEach((c) => {
            c.send({ type: "idList", data: this.connectIdList });
          });
          conn.on("close", () => {
            if (idx > -1) {
              this.connectList.splice(idx, 1);
              this.connectIdList.splice(idx, 1);
              this.connectList.forEach((c) => {
                c.send({ type: "idList", data: this.connectIdList });
              });
              console.log("connection closed:", conn.peer);
            }
          });
        });
      });
      window.onbeforeunload = () => {
        this.connectList.forEach((c) => {
          c.send({
            type: "WEBClose",
            WEBid: this.connectIdList[this.connectIdList.length - 1],
          });
        });
      };
    });
    this.store?.on("error", (err) => {
      console.log("error from store :", err.message);
      if (this.errorHandleListener) {
        this.errorHandleListener(err);
      }
    });
  },
};

export default WEB;
