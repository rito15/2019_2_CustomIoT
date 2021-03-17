import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BlockPage } from './block.page';
import {DragDropModule} from '@angular/cdk/drag-drop';

const routes: Routes = [
  {
    path: '',
    component: BlockPage
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
  declarations: [BlockPage]
})
export class BlockPageModule {}
