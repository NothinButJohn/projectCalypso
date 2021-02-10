import { AfterContentChecked, AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DocumentSnapshot, QueryDocumentSnapshot} from '@angular/fire/firestore';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog} from '@angular/material/dialog';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { map, startWith, tap, timestamp } from 'rxjs/operators';
import { FireAuthService } from 'src/app/services/fire-auth.service';
import { MessagingService } from 'src/app/services/messaging.service';
import {MatChipInputEvent} from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
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

  chatroomList$: Observable<any> = new Observable();
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

  constructor(
    private msg: MessagingService,
    private fa: FireAuthService,
    public dialog: MatDialog,
   ) 
    {

    }

  ngOnInit(): void {
    this.chatroomSubject.subscribe({
      next: (value) => this.chatroomList$ = value
    })
    this.updateChatrooms();
    this.msg.queryAllUsernames().subscribe();

    this.filteredUsernames$ = this.searchForm.get('searchUsers').valueChanges.pipe(
      startWith(null),
      map((username: string | null) => username ? this.msg.filterAllUsernames(username) : this.msg.getAllUsernames().slice() )
    )
    this.newChatMembers$ = this.msg.getNewChatroomMembers()
  }

  updateChatrooms(){
    this.chatroomSubject.next(this.msg.queryChatroomsOnce())
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
    console.log(event.option)
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
