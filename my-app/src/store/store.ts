import {
  configureStore,
  createSlice,
  ThunkAction,
  Action,
} from "@reduxjs/toolkit";
import createPeerMiddlewareWithStore from "../middleware/createPeerMiddlewareWithStore";


interface ChatState {
  connected: boolean;
  peerId: string | null;
  WEBcreator: boolean;
  messages: any[];
}

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


export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
