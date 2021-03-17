import { Component, OnInit } from '@angular/core';
import {Router, RouterEvent} from '@angular/router';

// 전역변수, 전역메소드 쓸거임
import {Global, MODE} from '../../globals/global';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  pages = [
    {
      title: 'Home',
      url: '/menu/home',
      icon: 'home'
    },
    {
      title: 'And/Or Project',
      url: '/menu/and-or',
      icon: 'card'
    },
    {
      title: 'Block Project',
      url: '/menu/block',
      icon: 'cube'
    },
    {
      title: 'Jumper Project',
      url: '/menu/jumper',
      icon: 'redo'
    },
    {
      title: 'Interrupt Project',
      url: '/menu/interrupt',
      icon: 'switch'
    }
  ];

  selectedPath = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      this.selectedPath = event.url;
    });
  }

  ngOnInit() {
  }

  checkMode() {
    return Global.nowMode;
  }

}
