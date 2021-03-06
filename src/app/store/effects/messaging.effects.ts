import { Injectable } from "@angular/core";
import { MessagingService, messengerChatroom } from '../../services/messaging.service'


import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, Observable, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap, concatAll, withLatestFrom, concatMap, combineAll, mergeAll, exhaustMap } from 'rxjs/operators';

import * as MessagingActions from '../actions/messaging.actions'
import { QueryDocumentSnapshot } from "@angular/fire/firestore";
import { Store } from "@ngrx/store";
import { usernameSelector } from "../selectors/profile.selectors";
import { Action } from "rxjs/internal/scheduler/Action";
import { chatroomsSelector, newChatMembers, selectedChatroomId } from "../selectors/messaging.selectors";
import { Y } from "@angular/cdk/keycodes";

@Injectable({
    providedIn: 'root'
})
export class MessagingEffects {
    constructor(
        private msg: MessagingService,
        private actions$: Actions,
        private store: Store
    ){}

    loadChatrooms$ = createEffect(() => {
        return this.actions$.pipe(
            ofType('[Messaging] get chatrooms'),
            withLatestFrom(this.store.select(usernameSelector)),
            map(([,currentUserUsername]) => {
                return this.msg.queryChatrooms(currentUserUsername).pipe(
                    map((messengerChatrooms: messengerChatroom[])=>{
                        console.log("within loadChatrooms$ effect, dispatching getChatroomsSuccess with:", messengerChatrooms)
                        return MessagingActions.getChatroomsSuccess({ messengerChatrooms }) 
                    })
                )
            }),concatAll()
        )
    })

    loadChatroomHistory$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(MessagingActions.getChatroomHistory),
            switchMap(action => {
                return this.msg.queryChatroomHistory(action.docId).pipe(
                    map((messageHistory) => {
                        console.log('messageHistory', messageHistory)
                        return MessagingActions.getChatroomHistorySuccess({result: messageHistory, selectedDoc: action.docId})
                    })
                )
            })
        )
    })

    sendMessage$ = createEffect(() => 
        this.actions$.pipe(
            ofType(MessagingActions.sendMessageToChatroom),
            withLatestFrom(this.store.select(selectedChatroomId)),
            map(([action, id]) => {
                this.msg.sendMessage(action.payload, id)
            })
        ), { dispatch: false }
    )

    loadAllUsernames$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(MessagingActions.getAllUsernames),
            switchMap(() => {
                return this.msg.queryAllUsernames().pipe(
                    map((allUsers) => {
                        return MessagingActions.getAllUsernamesSuccess({allUsers})
                    })
                )
            })
        )
    })

    createNewChatroom$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(MessagingActions.createNewChatroom),
            withLatestFrom(this.store.select<string[]>(newChatMembers)),
            switchMap(([action, newChatMembers]) => {
                return this.msg.createNewChatroom({title: 'new chatroom', members: newChatMembers}, action.payload).then(
                    (docRefId: string) => { return MessagingActions.getChatroomHistory({docId: docRefId})}
                )
            })
        )
    })

    changeChatroomTitle$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(MessagingActions.setChatroomTitle),
            switchMap((action) => {
                return this.msg.setChatroomTitle(action.docId, action.title).then(
                    () => {return MessagingActions.getChatrooms()}
                )
            })
        )
    })

}

