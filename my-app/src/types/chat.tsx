import { store } from "../store/store";
import { ThunkAction, Action } from "@reduxjs/toolkit";
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
    messages: any[];
    userList: string[];
    userName: null | string
}


