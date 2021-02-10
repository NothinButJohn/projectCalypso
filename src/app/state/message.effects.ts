import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { MessagingService } from "../services/messaging.service";
import { GetData, GetDataError, GetDataSuccess } from "./message.actions";

@Injectable({
    providedIn: 'root'
})
export class MessageEffects {
    constructor( 
        private actions$: Actions,
        private messageService: MessagingService,
    ){ 
 
    }

    getData$ = createEffect(():any => {
        return this.actions$.pipe(
            ofType(GetData),
            switchMap(() => this.messageService.getData().pipe(
                map((response: number[])=>{
                    return GetDataSuccess({response})
                }),
                catchError((error)=>of(GetDataError({error})))
            ))
        );
    })

}