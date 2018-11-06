import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from "../shared/ui.service";
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';
import * as fromTraining from './traininig.reducer';

@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) {}

    fetchAvailableExercises() {
        this.fbSubs.push(this.db
            .collection('availableExercises')
            .snapshotChanges()
            .map(docArray => {
                return docArray.map(doc => {
                    // throw(new Error());
                    return {
                        id: doc.payload.doc.id,
                        name: doc.payload.doc.data().name,
                        duration: doc.payload.doc.data().duration,
                        calories: doc.payload.doc.data().calories
                    };
                });
            })
            .subscribe((exercises: Exercise[]) => {
                this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StartLoading());
                this.store.dispatch(new Training.SetAvailableTrainings(exercises));
                // this.availableExercises = exercises;
                // this.exercisesChanged.next([...this.availableExercises]);
            }, error => {
                // this.uiService.loadingStateChanged.next(false);
                this.store.dispatch(new UI.StopLoading());
                this.uiService.showSnackBar("Fetching exercises failed. Please try again later.", null, 3000);
                this.exercisesChanged.next(null);
            }));
    }

    startExercise(selectedId: string) {
        // // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
        // this.runningExercise = this.availableExercises.find(
        //     ex => ex.id === selectedId
        // );
        // this.exerciseChanged.next({ ...this.runningExercise });
        this.store.dispatch(new Training.StartTraining(selectedId));
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.store.dispatch(new Training.StopTraining());
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.store.dispatch(new Training.StopTraining());
    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                // this.finishedExercisesChanged.next(exercises);
                this.store.dispatch(new Training.SetFinishedTraining(exercises));
            }));
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}