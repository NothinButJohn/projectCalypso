import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { asyncScheduler, forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetaThought, Thought } from '../store/models/meta-thoughts.model';
import { Profile } from '../store/models/profile.model';
import { currentUserUIDSelector } from '../store/selectors/auth.selectors';
import { FireAuthService } from './fire-auth.service';
import * as firebase from 'firebase'
import { FileInput } from 'ngx-material-file-input';

@Injectable({
  providedIn: 'root'
})
export class MetaThoughtService {
  // currentUserUID$: Observable<string>
  constructor(private afs: AngularFirestore, private store: Store) {
    // this.currentUserUID$ = store.select(currentUserUIDSelector)
  }

  getAllMetaThoughtsByCurrentUser(uid: string): Observable<unknown>{
    console.log('service::getAllThoughtsByCurrentUser(), querying with uid: ', uid)
    return this.afs.collection(`users/${uid}/meta-thoughts`).get().pipe(
      map((qs) => {
        console.log('service::getAllThoughtsByCurrentUser(), querySnapshot', qs)
        let formatedMetaThoughts = [];
        let allThoughtDocs = qs.docs

        let tempThought = {
          createdAt: null,
          authorProfile: '',
          creator: '',
          privacy: '',
          text: '',
          media: '',
          link: '',
        }
        let authorProfiles = []
        
        allThoughtDocs.forEach((queryDocumentSnapshot: QueryDocumentSnapshot<unknown>) => {
          tempThought = {
            createdAt: queryDocumentSnapshot.get('createdAt'),
            authorProfile: queryDocumentSnapshot.get('authorRef').path,
            creator: queryDocumentSnapshot.get('creator'),
            privacy: queryDocumentSnapshot.get('privacy'),
            text: queryDocumentSnapshot.get('text'),
            media: queryDocumentSnapshot.get('media'),
            link: queryDocumentSnapshot.get('link'),
          }
          formatedMetaThoughts = [...formatedMetaThoughts, tempThought]
        })
        console.log('service::getAllThoughtsByCurrentUser()', formatedMetaThoughts)
        return formatedMetaThoughts;
      })
    )
  }

  loadAuthorProfiles(formatedMetaThoughts:Thought<MetaThought>[]) {
    let formatedMetaThoughtsWithProfileReplaced = []
    formatedMetaThoughtsWithProfileReplaced = [...formatedMetaThoughts] // initialize to original thought list

    let observable = forkJoin(
      formatedMetaThoughtsWithProfileReplaced.map((thought) => {
        this.afs.doc(thought.authorProfile).get()
        
        // .pipe(
        //   map((ref) => 
        //   {
        //     let profileRef = ref.data();
        //     let formattedThought = {
        //         createdAt:thought.createdAt,
        //         creator:thought.creator,
        //         privacy:thought.privacy,
        //         text:thought.text,
        //         authorProfile: profileRef,
        //         link:thought.link,
        //         media:thought.media,
        //     }
        //     thought = formattedThought;
        //   })
        // )
      })
    ).pipe(map(ele=> {console.log('wtf', ele)}))
    return observable

  }
  //_____version as promises, doesnt work________
  // loadAuthorProfiles(formatedMetaThoughts:Thought<MetaThought>[]) {
  //   let formatedMetaThoughtsWithProfileReplaced = []
  //   formatedMetaThoughtsWithProfileReplaced = [...formatedMetaThoughts] // initialize to original thought list
  //   let promises = [];

  //   for(let i=0; i<formatedMetaThoughts.length; i++){
  //     let element = formatedMetaThoughts[i];
  //     let promise = this.afs.doc(element.authorProfile).get().toPromise().then(
  //       (ref) => 
  //       {
  //         let profileRef = ref.data();
  //         let formattedThought = {
  //             createdAt:formatedMetaThoughts[i].createdAt,
  //             creator:formatedMetaThoughts[i].creator,
  //             privacy:formatedMetaThoughts[i].privacy,
  //             text:formatedMetaThoughts[i].text,
  //             authorProfile: profileRef,
  //             link:formatedMetaThoughts[i].link,
  //             media:formatedMetaThoughts[i].media,
  //         }
  //           formatedMetaThoughtsWithProfileReplaced.splice(i, 1, formattedThought); // remove and replace thought with updated authorProfile field
  //           console.log('Replaced index: ', i, 'with ', formattedThought, 'current list: ', formatedMetaThoughtsWithProfileReplaced); 
            
  //       }).catch((error) =>{
  //         console.log('[meta-thought.service]::laodAuthorProfiles() - There was an error retrieving the authorProfile. Error: ', error)
  //       })
  //       promises.push(promise)
  //     }

  //     return Promise.all(promises).then(() => {
  //       return formatedMetaThoughtsWithProfileReplaced
  //     })
  // }

  async uploadMedia(fileInput: FileInput, uid: string){
    // let uploadPromise = new Promise((resolve, reject)=> {
      let fbStorage = firebase.default.storage().ref();
      let mediaDownloadURLs = []
      let uploadCount = 0;
      for(const file of fileInput.files){
        let mediaName = Date.now().toString();
  
        await fbStorage.child(`${uid}/media/${mediaName}`).put(file).then(snapshot => {
          //nothing more to do currently...//
          console.log('uploadMedia(), upload complete, snapshot reference: ',snapshot.ref)
          fbStorage.child(`${uid}/media/${mediaName}`).getDownloadURL().then(url => {
            mediaDownloadURLs.push(url)
            uploadCount++;
          })
        })
      }
      console.log('uploadMedia()::mediaDownloadURLs: ', mediaDownloadURLs)
    
    return mediaDownloadURLs
  }

  createNewThought(thought: Thought<MetaThought>, uid: string, username: string) {
    console.log('[meta-thought service]::createNewThought() args: ',thought, uid, username);

    // Prepare Data Object to send to firestore
    let currentUserProfileDocRef = this.afs.doc(`users/${uid}`).ref;
    let newThought = {
      createdAt: thought.createdAt,
      creator: thought.creator,
      privacy: thought.privacy,
      text: thought.text,
      authorRef: currentUserProfileDocRef,
      link:thought.link,
      media:thought.media,
    }
    // Write the thought to firestore; returns the documentRef or false
    return this.afs.collection(`users/${uid}/meta-thoughts`).add(newThought).then(
      (val) =>{return val}, 
      (reason) => {
        console.log('Failed to create a new thought, reason: ',reason);
        return false;
    })
  }
}
