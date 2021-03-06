import { createAction, props } from '@ngrx/store';
import { message, messengerChatroom } from 'src/app/services/messaging.service';

export const getAllUsernames = createAction(
    '[Messaging] get all usernames'
)

export const getAllUsernamesSuccess = createAction(
    '[Messaging] get all usernames success',
    props<{ allUsers: string[] }>()
)

export const getChatrooms = createAction(
    '[Messaging] get chatrooms',
)

export const getChatroomsSuccess = createAction(
    '[Messaging] get chatrooms success',
    props<{ messengerChatrooms: messengerChatroom[] }>()
)

export const getChatroomsError = createAction(
    '[Messaging] get chatrooms error',
    props<{ error }>()
)

export const getChatroomHistory = createAction(
    '[Messaging] get chatroom history',
    props<{ docId: string }>()
)

export const getChatroomHistorySuccess = createAction(
    '[Messaging] get chatroom history success',
    props<{ result: message[], selectedDoc: string }>()
)

export const sendMessageToChatroom = createAction(
    '[Messaging] send message',
    props<{ payload: message }>()
)

export const addMemberToNewChatroom = createAction(
    '[Messaging Dialog] add member to new chatroom',
    props<{ member: string }>()
)
export const removeMemberFromNewChatroom = createAction(
    '[Messaging Dialog] remove member from new chatroom',
    props<{ member: string }>()
)

export const createNewChatroom = createAction(
    '[Messaging Dialog] create new chatroom',
    props<{ payload: message }>()
)
export const createNewChatroomTemp = createAction(
    '[Messaging Dialog] create new chatroom temp'
)

export const firstMessageNewChatroom = createAction(
    '[Messaging] persist new chatroom',
    props<{ payload: message }>()
)

export const setChatroomTitle = createAction(
    '[Messaging] set chatroom title',
    props<{ title: string, docId: string }>()
)
// export const setChatroomTitleSuccess = createAction(
//     '[Messaging] set chatroom title',
//     props<{ title: string }>()
// )

