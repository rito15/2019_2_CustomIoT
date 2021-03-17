import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';
import {Global} from '../../../globals/global';

@Component({
  selector: 'app-th',
  templateUrl: './th.page.html',
  styleUrls: ['./th.page.scss'],
})
export class ThPage implements OnInit {

  minInputTem: any = 0;
  maxInputTem: any = 50;
  temInput = {
    lower: Global.tempMin,
    upper: Global.tempMax
  };
  minInputHum: any = 20;
  maxInputHum: any = 90;
  humInput = {
    lower: Global.humiMin,
    upper: Global.humiMax
  };
  temCheck: any = 'checked';
  humCheck: any = 'checked';

  setGlobalTempHumiValues() {
    Global.setTempValues(this.minInputTem, this.maxInputTem);
    Global.setHumiValues(this.minInputHum, this.maxInputHum);
  }

  constructor(private popoverController: PopoverController) {
  }

  ngOnInit() {
  }

  closePopover() {
    this.popoverController.dismiss();
  }

  setTemBadge(temInput) {
    // this.minInputTem = temInput.lower;
    // this.maxInputTem = temInput.upper;
    this.minInputTem = temInput.target.value.lower;
    this.maxInputTem = temInput.target.value.upper;

    this.setGlobalTempHumiValues();
  }

  setHumBadge(humInput) {
    // this.minInputHum = humInput.lower;
    // this.maxInputHum = humInput.upper;
    this.minInputHum = humInput.target.value.lower;
    this.maxInputHum = humInput.target.value.upper;

    this.setGlobalTempHumiValues();
  }

}
