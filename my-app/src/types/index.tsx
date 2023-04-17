import Peer, { DataConnection } from "peerjs";

export interface userInterface {
  id: string;
  userName: string;
}

export interface messageInterfase {
  author: userInterface;
  text: string;
  type: "message";
}

export interface WebInterface {
  store: Peer | null;
  connectList: DataConnection[];
  connectIdList: Array<userInterface>;
  createStore: () => any;
  storeListeners: () => void;
}

export interface PeerInterface {
  peerConnection: Peer | null;
  handleConnectEvent: null | ((data: any) => void);
  dataConnection: DataConnection | null;
  peerId: string | null | undefined;
  connectId: string | null | undefined;
  initPeer: (id: string | undefined) => void;
  peerConnectionListeners: () => void;
  handlePeerError: (err: Error) => void;
  connectTo: (id: string) => any;
  dataConnectionListeners: () => void;
  dataFromListener: any;
  clearDataConnection: () => void;
}
