import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AndOrPage } from './and-or.page';
import {DragDropModule} from '@angular/cdk/drag-drop';

const routes: Routes = [
  {
    path: '',
    component: AndOrPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        DragDropModule
    ],
  declarations: [AndOrPage]
})
export class AndOrPageModule {}
