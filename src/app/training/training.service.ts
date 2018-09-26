// import { Injectable } from "@angular/core";
// import { AngularFirestore } from "@angular/fire/firestore";
// import { Subject } from "rxjs/Subject";
// import { Exercise } from "./exercise.model";
// import { Subscription } from "rxjs/Subscription";
//
// @Injectable()
// export class TrainingService {
//     exerciseChanged = new Subject<Exercise>();
//     exercisesChanged = new Subject<Exercise[]>();
//     finishedExerciseChanged = new Subject<Exercise>();
//     private fbSubs: Subscription[];
//     // private availableExercises: Exercise[] = [
//     //     { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
//     //     { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
//     //     { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
//     //     { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
//     // ];
//     // private availableExercises: Exercise[] = [
//     //     { id: 'crunches', name: 'Crunches', duration: 30, calories: 8 },
//     //     { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
//     //     { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
//     //     { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 }
//     // ];
//     private availableExercises:  Exercise[] = [];
//     private runningExercise: Exercise;
//
//     constructor( private db: AngularFirestore ){}
//
//     fetchAvailableExercises() {
//         // return this.availableExercises.slice();
//         this.fbSubs.push.this(db
//             .collection('availableExercises')
//             .snapshotChanges()
//             .map(docArray => {
//                 return docArray.map(doc => {
//                     console.log(doc);
//                     return {
//                         id: doc.payload.doc.id,
//                         name: doc.payload.doc.data().name,
//                         duration: doc.payload.doc.data().duration,
//                         calories: doc.payload.doc.data().calories
//                     };
//                 });
//             })
//             .subscribe((exercises: Exercise[]) => {
//                 this.availableExercises = exercises;
//                 this.exercisesChanged.next([...this.availableExercises]);
//             }, error => {
//                 console.log(error);
//             }));
//     }
//
//     startExercise(selectedId: string) {
//         // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
//         this.runningExercise = this.availableExercises.find( ex => ex.id === selectedId );
//         this.exerciseChanged.next({ ...this.runningExercise });
//     }
//
//     completeExercise() {
//         this.exercises.push({...this.runningExercise, date: new Date(), state: 'completed' });
//         this.runningExercise = null;
//         this.exerciseChanged.next(null);
//     }
//
//     cancelExercise(progress: number) {
//         this.exercises.push({...this.runningExercise,
//                              duration: this.runningExercise.duration * (progress / 100),
//                              calories: this.runningExercise.calories * (progress / 100),
//                              date: new Date(),
//                              state: 'cancelled' });
//         this.runningExercise = null;
//         this.exerciseChanged.next(null);
//     }
//     getRunningExercise() {
//         return { ...this.runningExercise };
//     }
//
//     private addDataToDatabase(exercise: Exercise) {
//         this.db.collection('finishedExercises').add(exercise);
//     }
//
//     fetchCompletedOrCancelledExercises() {
//         // return this.exercises.slice();
//         this.finishedExerciseChanged.push(this.db.collection('finishedExercises').valueChanges().subscribe((exercises: Exercise[]) => {
//             this.finishedExerciseChanged.next(exercises);
//         }, error => {
//             console.log(error);
//         }));
//     }
//
//     cancelSubscriptions () {
//         this.fbSubs.forEach( sub => sub.unsubscribe() );
//     }
// }

import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';

import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(private db: AngularFirestore) {}

    fetchAvailableExercises() {
        this.fbSubs.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    return {
                        id: doc.payload.doc.id,
                        name: doc.payload.doc.data().name,
                        duration: doc.payload.doc.data().duration,
                        calories: doc.payload.doc.data().calories
                    };
                });
            })
            .subscribe((exercises: Exercise[]) => {
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises]);
            }));
    }

    startExercise(selectedId: string) {
        // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
        this.runningExercise = this.availableExercises.find(
            ex => ex.id === selectedId
        );
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.finishedExercisesChanged.next(exercises);
            }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}