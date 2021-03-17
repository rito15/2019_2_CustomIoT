import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Global} from '../../../globals/global';

@Component({
  selector: 'app-md',
  templateUrl: './md.page.html',
  styleUrls: ['./md.page.scss'],
})
export class MdPage implements OnInit {

  passedId = null;

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.passedId = this.navParams.get('custom_id');
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  setGlobalMotionValue(ev) {
    Global.setMotionValues(ev.target.checked ? 1 : 0);
  }

  getGlobalMotionValue() {
    return Global.motionValue === 1;
  }
}
