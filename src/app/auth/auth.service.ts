// import { Subject } from "rxjs/Subject";
// import { Injectable } from "@angular/core";
// import { Router } from '@angular/router';
// import { AngularFireAuth } from "@angular/fire/auth";
//
// import { User } from './user.model';
// import { AuthData } from "./auth-data.model";
// import { TrainingService } from "../training/training.service";
//
// @Injectable()
// export class AuthService {
//     public authChange = new Subject<boolean>();
//     // private user: User;
//     private isAuthenticated = false;
//
//     constructor(
//         private router: Router,
//         private afAuth: AngularFireAuth,
//         private trainingService: TrainingService
//     ) {}
//
//     initAuthListener () {
//         this.afAuth.authState.subscribe(user => {
//             if( user ) {
//                 this.isAuthenticated = true;
//                 this.authChange.next(true);
//                 this.router.navigate(['/training']);
//             } else {
//                 this.trainingService.cancelSubscription();
//                 this.authChange.next(false);
//                 this.router.navigate(['/login']);
//                 this.isAuthenticated = false;
//             }
//         })
//     }
//
//
//     registerUser(authData: AuthData) {
//         this.afAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
//                         .then(result => {
//                             console.log(result);
//                             this.authSuccessfully();
//                         })
//                         .catch(error => {
//                            console.log(error);
//                         });
//     }
//
//     login(authData: AuthData) {
//         // this.user = {
//         //     email: authData.email,
//         //     userId: Math.round(Math.random() * 10000).toString()
//         // };
//         this.afAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
//                         .then(result => {
//                             console.log(result);
//                             this.authSuccessfully();
//                         })
//                         .catch(error => {
//                             console.log(error);
//                         });
//     }
//     //
//     // getUser() {
//     //     return { ...this.user };
//     // }
//
//
//     logout() {
//         this.afAuth.auth.signOut();
//     }
//
//     isAuth() {
//         // return this.user !== null;
//         return this.isAuthenticated;
//     }
//
// }

// import { Injectable } from '@angular/core';
// import { Router } from '@angular/router';
// import { Subject } from 'rxjs/Subject';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { MatSnackBar } from '@angular/material';
//
// import { User } from './user.model';
// import { AuthData } from './auth-data.model';
// import { TrainingService } from '../training/training.service';
// import { UIService } from '../shared/ui.service';

import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from '../shared/ui.service';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';


@Injectable()
export class AuthService {

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService,
        private store: Store<fromRoot.State>
    ) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.store.dispatch(new Auth.SET_AUTHENTICATED());
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.store.dispatch(new Auth.SET_UNAUTHENTICATED());
                this.router.navigate(['/login']);
            }
        });
    }

    registerUser(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        // this.store.dispatch({type: 'START_LOADING'});
        this.store.dispatch(new UI.START_LOADING());
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                // this.store.dispatch({ type: 'STOP_LOADING'});
                this.store.dispatch(new UI.STOP_LOADING());
                this.uiService.showSnackBar(error.message, null, { duration: 3000 });
            });
    }

    login(authData: AuthData) {
        // this.uiService.loadingStateChanged.next(true);
        // this.store.dispatch({type: 'START_LOADING'});
        this.store.dispatch(new UI.START_LOADING());
        this.afAuth.auth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                // this.uiService.loadingStateChanged.next(false);
                // this.store.dispatch({type: 'STOP_LOADING'});
                this.store.dispatch(new UI.STOP_LOADING());
                this.uiService.showSnackBar(error.message, null, { duration: 3000 });
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

}