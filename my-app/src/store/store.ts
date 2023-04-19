import { configureStore, createSlice } from "@reduxjs/toolkit";
import createPeerMiddlewareWithStore from "../middleware/createPeerMiddlewareWithStore";
import { ChatState } from "../types/chat";

const initialState: ChatState = {
  connected: false,
  peerId: null,
  WEBcreator: false,
  replyMessage: null,
  messages: [],
  userList: [],
  userName: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    getMessage(state, action) {
      state.messages = [...state.messages, action.payload];
    },
    sendMessage(state, action) {
      state.messages = [...state.messages, action.payload];
    },
    connectToPeer(state, action) {
      state.connected = true;
    },
    savePeerId(state, action) {
      state.peerId = action.payload;
    },
    WEBCreator(state, action) {
      state.WEBcreator = action.payload;
    },
    getUsers(state, action) {
      state.userList = action.payload;
    },
    saveUserName(state, action) {
      state.userName = action.payload;
    },
    getMessages(state, action) {
      state.messages = action.payload;
    },
    replyMessage(state, action) {
      state.replyMessage = action.payload;
    },
  },
});
const chatReducer = chatSlice.reducer;
export const {
  sendMessage,
  saveUserName,
  savePeerId,
  getMessage,
  connectToPeer,
  getMessages,
  replyMessage,
  WEBCreator,
  getUsers,
} = chatSlice.actions;

const peerMiddleware = createPeerMiddlewareWithStore();
export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: [peerMiddleware],
});
