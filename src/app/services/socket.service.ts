import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor(private socket: Socket) {}

  getClientMessage(): Observable<string> {
    return this.socket.fromEvent('message');
  }
  
  getMotionDetectionAlert(): Observable<string> {
    return this.socket.fromEvent('onMotionCapture');
  }

  getHeatIndicationAlert(): Observable<string> {
    return this.socket.fromEvent('onHeatIndication');
  }

  getDoorOperationAlert(): Observable<string> {
    return this.socket.fromEvent('onOpenCloseDoor');
  }
}