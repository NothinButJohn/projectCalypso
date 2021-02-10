import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MessageState } from "./message.reducer";

const messageFeatureState = createFeatureSelector<MessageState>('message');

export const GetSelectedConversationId = createSelector(
    messageFeatureState,
    (state: MessageState):any => {
        return state?.selectedConversationId
    }
)

export const GetLoadingState = createSelector(
    messageFeatureState,
    (state: MessageState):any => {
        return state.loadingState
    }
)
