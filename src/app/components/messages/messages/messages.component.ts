import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentSnapshot, QueryDocumentSnapshot} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { delay, filter, map, startWith, take, tap, timestamp } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { MessagingService } from 'src/app/services/messaging.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Store } from '@ngrx/store';
import { GetData, SetSelectedConversationId } from 'src/app/state/message.actions';
import { GetLoadingState, GetSelectedConversationId } from 'src/app/state/message.selectors';
export interface Message{
  sender: string;
  createdAt;
  text: string;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];

  chatroomList$: Observable<any>;/// = new Observable();

  chatroomSubject: Subject<any> = new Subject<any>();

  filteredUsernames$: Observable<any>;
  newChatMembers$: Observable<string[]>;

  @ViewChild('userInput') userInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  chatForm = new FormGroup({
    text: new FormControl('', Validators.required)
  })
  searchForm = new FormGroup({
    searchUsers: new FormControl('')
  
  })

  public conversationId$: Observable<string>;
  public showSpinner: boolean = false;

  constructor(
    private msg: MessagingService,
    private fa: FireAuthService,
    public dialog: MatDialog,
    public store: Store,
   ) {}

  setSelectedId() {
    this.store.dispatch(GetData());
    this.showSpinner = true;
    this.store.select(GetLoadingState).pipe(
      delay(1000),
      filter((loadingState) => loadingState === 1),
      take(1),
      tap(() => this.showSpinner = false)
    ).subscribe();
  }


  ngOnInit(): void {
    this.conversationId$ = this.store.select(GetSelectedConversationId).pipe(
      tap((id)=>{
        console.log('id',id)
      })
    )

    this.chatroomSubject.subscribe({
      next: (value) => this.chatroomList$ = value
    })
    this.msg.queryAllUsernames().subscribe();

    this.filteredUsernames$ = this.searchForm.get('searchUsers')
      .valueChanges.pipe(
      startWith(null),
      map((username: string | null) => username ? 
        this.msg.filterAllUsernames(username) : 
        this.msg.getAllUsernames().slice() 
      )
    )
    this.newChatMembers$ = this.msg.getNewChatroomMembers()
  }

  ngOnDestroy(){
    this.chatroomSubject.unsubscribe()
  }

  openDialog() {
    let dialogRef = this.dialog.open(NewMessageDialog);
    
    dialogRef.afterClosed().subscribe(result => {

    })
  }

  add(event: MatChipInputEvent) {
    let input = event.input;
    let value = event.value;
    if ((value || '').trim()) {
      this.msg.addNewChatMember(value.trim())
    }
    if(input) {
      input.value = null;
    }
  }

  remove(user: string) {
    this.msg.removeNewChatMember(user)
  }

  selected(event: MatAutocompleteSelectedEvent) {
    this.msg.addNewChatMember(event.option.viewValue)
    this.userInput.nativeElement.value = '';
    this.searchForm.get('searchUsers').setValue('');
  }

  createChatroom(){

  }

}

@Component({
  selector: 'new-message-dialog-content',
  templateUrl: 'newchat-dialog.html'
})
export class NewMessageDialog extends MessagesComponent{}
