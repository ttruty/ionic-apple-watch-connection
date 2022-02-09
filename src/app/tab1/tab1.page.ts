/* eslint-disable no-underscore-dangle */
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import * as WC from 'AppleWatchConnectivity/www/watchconnectivity'
import { from, Observable, of, Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit, OnDestroy{

  watchConnected: boolean;
  dataString: string;
  count: number;

  constructor(private ngZone: NgZone) {}


  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.count = 0;
    this.connectWatch();
    this.dataString = 'no new data';
  }

  async connectWatch() {
    if (Capacitor.getPlatform() === 'ios') {
      try {
        WC.init(
          () => {
            console.log('WATCH - Init success!');
            this.watchConnected = true;

              setTimeout(() => {
                // wait 2 seconds for watch to be initialized before connecting message receiver
                WC.messageReceiver((message) => {
                  console.log(
                    'WATCH - Message received: ' + JSON.stringify(message)
                  );
                  const obj = JSON.parse(JSON.stringify(message));
                  this.ngZone.run(() => { // run inside Angular's zone, allows DOM manipulations async
                    this.dataString = obj.message;
                  });
                }),
                  () => {
                    console.log('WATCH - Error receiving message callback');
                  };
              }, 2000);
          },
          () => {
            //error
            console.log('WATCH - Init failed!');
          }
        );
      } catch (e) {
        console.log('WATCH - ERROR', e);
      }
    }
  }


  onSendData() {
    this.count += 1;
    if (!this.watchConnected){
      this.connectWatch();
    }
    WC.sendMessage(
      ['message', `${this.count} message from phone`],
      () => {
        console.log('WATCH - Success callback');
      },
      () => {
        console.log('WATCH - Error callback');
      }
    );
  }
}
