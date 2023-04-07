import {
  configureStore,
  createSlice,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import { createMySocketMiddleware } from "./createMySocketMiddleware";
import { createPeerMiddleware } from "./createPeerMiddleware";
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
  messages: Awaited<Promise<Array<TMessage>>>;
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
  },
});

const chatReducer = chatSlice.reducer;
export const {
  sendMessage,
  updateMessages,
  sendName,
  replyMessage,
  getMessage,
  getUsers,
  connectToPeer
} = chatSlice.actions;
export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    // getDefaultMiddleware().concat(createMySocketMiddleware()),
    getDefaultMiddleware().concat(createPeerMiddleware()),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
