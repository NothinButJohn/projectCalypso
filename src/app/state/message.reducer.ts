import { createReducer, on } from "@ngrx/store";
import { GetData, GetDataSuccess, SetSelectedConversationId } from "./message.actions";

export interface MessageState {
    selectedConversationId: string;
    loadingState: number,
    numberList: number[];
}

const initialState: MessageState = {
    selectedConversationId: null,
    loadingState: 0,
    numberList: [],
}

export const messageReducer = createReducer<MessageState>(
    initialState,
    on(GetData, (state, action): MessageState => {
        return {
            ...state,
            loadingState: 0,
        }
    }),
    on(GetDataSuccess, (state, action): MessageState => {
        return {
            ...state,
            numberList: action.response,
            loadingState: 1,
        }
    }),
);