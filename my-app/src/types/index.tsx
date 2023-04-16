import Peer, { DataConnection } from "peerjs";
import { Dispatch } from "@reduxjs/toolkit";
import { RootState } from "./chat";

export interface WebInterface {
    store: Peer | null;
    connectList: DataConnection[],
    connectIdList: string[],
    createStore: () => void;
    storeListeners: () => void;
}

export interface PeerInterface {
    peerConnection: Peer | null;
    dataConnection: DataConnection | null;
    peerId: string | null | undefined;
    connectId: string | null | undefined;
    initPeer: (id: string | undefined) => void;
    peerConnectionListeners: () => void;
    handlePeerError: (err: Error) => void;
    connectTo: (id: string) => void;
    dataConnectionListeners: () => void;
    dispatch: Dispatch | null,
    getState: (() => RootState) | null
}
