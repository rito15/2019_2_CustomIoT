import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jumper',
  templateUrl: './jumper.page.html',
  styleUrls: ['./jumper.page.scss'],
})
export class JumperPage implements OnInit {

  constructor() { }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  ngOnInit() {
  }

}
