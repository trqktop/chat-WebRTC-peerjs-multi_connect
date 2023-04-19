import Peer, { DataConnection } from "peerjs";

export type FileInterface = {
  src: string | ArrayBuffer;
  type: string;
};
export interface userInterface {
  id: string;
  userName: string;
}

export interface messageInterfase {
  author: userInterface;
  text: string;
  type: "message";
  reply: null | messageInterfase;
  file: FileInterface | null;
}

export interface WebInterface {
  webID: any | string;
  store: Peer | null;
  connectList: DataConnection[];
  connectIdList: Array<userInterface>;
  createStore: () => void;
  storeListeners: () => void;
  errorHandleListener: null | ((err: Error) => void);
  initWebHandler: null | ((id: any) => void);
  clearWEB: () => void;
  uniqNameCreator: () => string;
}

export interface PeerInterface {
  peerConnection: Peer | null;
  handleWEBConnectEvent: null | ((data: any) => void);
  dataConnection: DataConnection | null;
  peerId: string | null | undefined;
  connectId: string | null | undefined;
  initPeer: (id: string | undefined) => void;
  peerConnectionListeners: () => void;
  handlePeerError: (err: Error) => void;
  connectTo: (id: string) => void;
  dataConnectionListeners: () => void;
  dataFromListener: any;
  clearDataConnection: () => void;
  rebaseWEB: () => void;
  idIsTaken: boolean;
}

export interface FormState {
  messageInputValue: string;
  filePath: string | null;
  selectedFile: File | null;
}

export interface FormMessage {
  text: string;
  file: FileInterface | null;
  reply: null | messageInterfase;
}

export interface decentralizedConnectInterface {
  idList: Array<userInterface>;
  peer: Peer | null;
  connectList: Array<DataConnection>;
  connectToList: (idList: Array<userInterface>) => void;
  connectTo: (id: string) => void;
  connectListeners: (connect: DataConnection) => void;
  peerListeners: (peer: Peer) => void;
  handleConnectEvent: ((data: any) => void) | null;
  isConnectedTo: (id: string) => boolean;
  updatePeerListeners: () => void;
  handleConnectNewClient: null | ((client: DataConnection) => void);
}
