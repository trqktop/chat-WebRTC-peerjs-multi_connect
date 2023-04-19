import { store } from "../store/store";
import { ThunkAction, Action } from "@reduxjs/toolkit";
import { messageInterfase, userInterface } from ".";
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
export interface ChatState {
  connected: boolean;
  peerId: string | null;
  WEBcreator: boolean;
  messages: Array<messageInterfase>;
  replyMessage: null | messageInterfase;
  userList: string[];
  userName: userInterface | null;
}
