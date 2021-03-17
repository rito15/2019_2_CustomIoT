import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {MdPageModule} from './pp/pop/md/md.module';
import {ThPageModule} from './pp/pop/th/th.module';
import {SetIpPageModule} from './pp/set-ip/set-ip.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// added
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,
  MdPageModule, ThPageModule, SetIpPageModule,
  BrowserAnimationsModule,
  HttpClientModule],  // added
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
