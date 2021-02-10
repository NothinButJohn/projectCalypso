import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, DocumentData, DocumentReference, QueryDocumentSnapshot, QueryFn, QuerySnapshot } from '@angular/fire/firestore';
import { FireAuthService } from './fire-auth.service';

import { Message } from '../components/messages/messages/messages.component'
import { Observable, Observer, of, Subject } from 'rxjs';
import { concatAll, delay, map, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  private currAuthUser: string
  private allUsernames: string[] = [];
  private newChatroomMembers: string[] = [];
  private filteredUsernames$: Observable<string[]>;

  private messageSubject: Subject<QueryDocumentSnapshot<unknown>>;
  // private chatroomSubject: Subject<QueryDocumentSnapshot<unknown>[]>;

  private chatRooms: DocumentReference<DocumentData>[] = [];
  
  public chatroomList$: Observable<any> = of([
    {title: 'My Chat Room Title'},
    {title: 'Boat'},
    {title: 'Car'},
  ])

  constructor(
    private afs: AngularFirestore,
    private fa: FireAuthService
  ) { }

  getData(): Observable<number[]>{
    return of([
      3,5,67,8,3,34,5,34
    ])
  }



  filterAllUsernames(username: string){
    console.log('filter value: ', username, "allUsernames: ", this.allUsernames, "val")
    let filterValue = username.toLowerCase();
    return this.allUsernames.filter(un => un.toLowerCase().indexOf(filterValue) === 0)
  }

  getNewChatroomMembers(): Observable<string[]>{
    return of(this.newChatroomMembers)
  }

  getAllUsernames(){
    return this.allUsernames
  }
  addNewChatMember(user: string){
    if(!this.newChatroomMembers.includes(user)){
      this.newChatroomMembers.push(user)
    }
  }
  removeNewChatMember(user: string){
    let index = this.newChatroomMembers.indexOf(user);
    if(index >=0) {
      this.newChatroomMembers.splice(index, 1);
    }
  }


  queryAllUsernames(){
    // console.log('query all usernames', this.allUsernames)
    return this.afs.collection('users').get().pipe(
      map(qs => {
          qs.docs.forEach(qds => {
          if(!this.allUsernames.includes(qds.get('profile.username'))){
            this.allUsernames.push(qds.get('profile.username'))} 
        })
      })
    )
  }

  getChatrooms(){

  }








}
