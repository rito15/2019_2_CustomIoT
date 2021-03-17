import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-and-or',
    templateUrl: './and-or.page.html',
    styleUrls: ['./and-or.page.scss'],
})
export class AndOrPage implements OnInit {

    listLogic = [
        {
            type: 'AND',
            conds: []
        },
        {
            type: 'OR',
            conds: []
        }];
    listCustom = [];
    listTrash = [];

    listSensor = [
        {
            name: 'MotionDetector'
        },
        {
            name: 'TempHumi'
        }
    ];

    constructor() {}

    drop(event: CdkDragDrop<any>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
            if (event.previousIndex === 0) {
                this.createNew('A');
            } else {
                this.createNew('O');
            }
        }
    }

    dropDead(event: CdkDragDrop<string[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
            this.listTrash.pop();
        }
    }

    add(item) {
        console.log(item);
        item.conds.push({});
    }

    createNew(logic) {
        if (logic === 'A') {
            this.listLogic.unshift({type: 'AND', conds: []});
        } else {
            this.listLogic.push({type: 'OR', conds: []});
        }
    }

    addSen(ev, item) {
        const idx = this.listSensor.findIndex(x => x.name === ev.target.value);
        if (idx !== -1) {
            item.name = this.listSensor[idx].name;
            item.range = [null, null];
        }
        console.log('Sensor added');
    }

    setRange(ev, item, i) {
        item.range[i] = ev.target.value;
        console.log(item);
    }

    ngOnInit() {
    }
}
