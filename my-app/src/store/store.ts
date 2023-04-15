import {
  configureStore,
  createSlice,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";

// import createPeerMiddleware from "../middleware/createPeerMiddleware";
// import createSimplePeerMiddleware from "../middleware/createSimplePeerMIddleware";
// import peerMiddleware from "../middleware/inprogressMiddelwares/peerMiddleware";
import createPeerMiddlewareWithStore from "../middleware/createPeerMiddlewareWithStore";
export type TMessage = {
  user: string | null;
  message: string;
  id: string;
  file: {
    type: string;
    src: string;
  };
};
export interface Chat {
  messages: any;
  update: boolean;
  connected: boolean;
  users: Awaited<Promise<Array<string>>>;
  myName: string | null;
  thread: any;
  reply: null | TMessage;
  conn: any;
  peerId: null | string;
  connId: any;
  peer: any;
  id: any;
}

const initialState: Chat = {
  update: false,
  messages: [],
  reply: null,
  thread: [],
  users: [],
  myName: null,
  peerId: null,
  peer: null,
  conn: null,
  connId: null,
  connected: false,
  id: null,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendName(state, action) {
      return {
        ...state,
        myName: action.payload,
        users: [...state.users, action.payload],
      };
    },
    getUsers(state, action) {
      return {
        ...state,
        users: [...action.payload, state.myName],
      };
    },
    updateMessages(state, action) {
      return {
        ...state,
        messages: action.payload,
      };
    },
    getMessage(state, action) {
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    },
    sendMessage(state, action): any {
      state.messages = [...state.messages, action.payload];
    },
    replyMessage(state, action) {
      state.reply = action.payload;
    },
    connectToPeer(state, action) {
      state.connected = true;
    },
    savePeerId(state, action) {
      state.peerId = action.payload;
    },
  },
});
const chatReducer = chatSlice.reducer;
export const {
  sendMessage,
  updateMessages,
  sendName,
  savePeerId,
  replyMessage,
  getMessage,
  getUsers,
  connectToPeer,
} = chatSlice.actions;

const peerMiddleware = createPeerMiddlewareWithStore();
export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: [peerMiddleware]
});




export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
