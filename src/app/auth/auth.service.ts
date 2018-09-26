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

import { Subject } from "rxjs/Subject";
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";
import { MatSnackBar } from '@angular/material';

import { User } from './user.model';
import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from '../shared/ui.service';


@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router,
        private afAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private snackbar: MatSnackBar,
        private uiService: UIService
    ) {}

    initAuthListener() {
        this.afAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.trainingService.cancelSubscriptions();
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.isAuthenticated = false;
            }
        });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth
            .createUserWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.snackbar.open(error.message, null, {
                    duration: 3000
                });
            });
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.afAuth.auth
            .signInWithEmailAndPassword(authData.email, authData.password)
            .then(result => {
                this.uiService.loadingStateChanged.next(false);
            })
            .catch(error => {
                this.uiService.loadingStateChanged.next(false);
                this.snackbar.open(error.message, null, {
                    duration: 3000
                });
            });
    }

    logout() {
        this.afAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}