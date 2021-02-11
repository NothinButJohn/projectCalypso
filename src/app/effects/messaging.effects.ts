import { Injectable } from "@angular/core";
import { MessagingService } from '../services/messaging.service'


import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';

import * as MessagingActions from '../actions/messaging.actions'
import { QueryDocumentSnapshot } from "@angular/fire/firestore";

@Injectable({
    providedIn: 'root'
})
export class MessagingEffects {
    constructor(
        private msg: MessagingService,
        private actions$: Actions
    ){}

    loadChatrooms$ = createEffect(() =>{
        return this.actions$.pipe(
        ofType('[Messaging] get chatrooms'),
        switchMap(() => this.msg.queryChatroomsOnce().pipe(
            map((qds: QueryDocumentSnapshot<unknown>[]) => {
                console.log("in effect",qds)
                return MessagingActions.getChatroomsSuccess({ qds })
            }),
            catchError((error) => of(MessagingActions.getChatroomsError({error})))
        ))
    )}
    )

    // loadSelectedChatroom$ = createEffect(() => this.actions$.pipe())

}