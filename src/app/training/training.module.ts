import {NgModule} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";

import { NewTrainingComponent} from "./new-training/new-training.component";
import { PastTrainingsComponent } from "./past-trainings/past-trainings.component";
import { StopTrainingComponent } from "./current-training/stop-training.component";
import { MaterialModule } from "../../../../fitness-tracker/src/app/material.module";
import { SharedModule } from "../shared/shared.module";
import { TrainingRoutingModule } from "./training-routing.module";
import { TrainingComponent } from "../../../../fitness-tracker/src/app/training/training.component";
import { CurrentTrainingComponent } from "../../../../fitness-tracker/src/app/training/current-training/current-training.component";
import { AngularFirestoreModule } from "@angular/fire/firestore";


@NgModule({
    declarations: [
        TrainingComponent,
        CurrentTrainingComponent,
        NewTrainingComponent,
        PastTrainingsComponent,
        StopTrainingComponent
    ],
    imports: [
        SharedModule,
        AngularFirestoreModule,
        TrainingRoutingModule
    ],
    entryComponents: [
        StopTrainingComponent
    ]
})
export class TrainingModule {}