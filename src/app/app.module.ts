import { LayoutModule } from '@angular/cdk/layout';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MessageEffects } from 'src/app/state/message.effects';
import { messageReducer } from 'src/app/state/message.reducer';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialDashComponent } from './components/dashboard/material-dash/material-dash.component';
import { HomeComponent } from './components/home/home.component';
import { LandingComponent } from './components/landing/landing/landing.component';
import { MessagesComponent, NewMessageDialog } from './components/messages/messages/messages.component';
import { MaterialNavComponent } from './components/navigation/material-nav/material-nav.component';
import { ProfileComponent } from './components/profile/profile/profile.component';
import { NavigationComponent } from './components/shared/navigation/navigation.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavigationComponent,
    MaterialNavComponent,
    MaterialDashComponent,
    ProfileComponent,
    LandingComponent,
    MessagesComponent,
    NewMessageDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserAnimationsModule,
    StoreModule.forRoot({message: messageReducer}),
    EffectsModule.forRoot([MessageEffects]),
    StoreDevtoolsModule.instrument({
      name: 'john message app',
      maxAge: 25,
    }),
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
