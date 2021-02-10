import {createAction, props} from '@ngrx/store';

export const SetSelectedConversationId = createAction(
    '[Default] Set Selected Conversation Id',
    props<{conversationId:string}>()
)



export const GetData = createAction(
    '[Message Page] Get Data',
    // props<{data: any}>()
)

export const GetDataSuccess = createAction(
    '[Message Api] Get Data Success',
    props<{response: any}>()
)
export const GetDataError = createAction(
    '[Message Api] Get Data Error',
    props<{error: any}>()
)