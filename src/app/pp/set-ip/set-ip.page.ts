import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {Global} from '../../globals/global';

@Component({
  selector: 'app-set-ip',
  templateUrl: './set-ip.page.html',
  styleUrls: ['./set-ip.page.scss'],
})
export class SetIpPage implements OnInit {

  passedId = null;
  targetUrl = '';

  constructor(private navParams: NavParams, private popoverController: PopoverController) { }

  ngOnInit() {
    this.passedId = this.navParams.get('custom_id');
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  setGlobalIP(ev) {
    if (ev.target.value.toString().length < 3) {
      Global.targetUrl = this.targetUrl = 'https://my-json-server.typicode.com/lacolico/NyangMusic/';
    } else {
      Global.targetUrl = this.targetUrl = 'http://' + ev.target.value.toString() + '/';
    }
  }

  saveToGlobalIP() {
    Global.targetUrl = this.targetUrl;
    alert('IP : ' + Global.targetUrl);
    this.popoverController.dismiss();
  }

}
