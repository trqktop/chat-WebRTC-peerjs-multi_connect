import {
  configureStore,
  createSlice,
} from "@reduxjs/toolkit";
import createPeerMiddlewareWithStore from "../middleware/createPeerMiddlewareWithStore";
import { ChatState } from '../types/chat';


const initialState: ChatState = {
  connected: false,
  peerId: null,
  WEBcreator: false,
  messages: [],
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getMessage(state, action) {
      state.messages = [...state.messages, action.payload]
    },
    sendMessage(state, action): any {
      state.messages = [...state.messages, action.payload];
    },
    connectToPeer(state, action) {
      state.connected = true;
    },
    savePeerId(state, action) {
      state.peerId = action.payload;
    },
    WEBCreator(state, action) {
      state.WEBcreator = action.payload
    }
  },
});
const chatReducer = chatSlice.reducer;
export const {
  sendMessage,
  savePeerId,
  getMessage,
  connectToPeer,
  WEBCreator
} = chatSlice.actions;

const peerMiddleware = createPeerMiddlewareWithStore();
export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: [peerMiddleware]
});
