import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private _connection: HubConnection;

  constructor() { }

  get connection(): HubConnection {
    return this._connection;
  }

  start(hubUrl: string) {
    const builder: HubConnectionBuilder = new HubConnectionBuilder();
    this._connection = builder.withUrl(hubUrl).withAutomaticReconnect().build();

    this._connection.start()
      .then(() => console.log('Connection started'))
      .catch(err => setTimeout(() => this.start(hubUrl), 2000));

    this._connection.onreconnected(connectionId => console.log('Reconnected with ' + connectionId));
    this._connection.onreconnecting(error => console.log('Reconnecting' + error));
    this._connection.onclose(error => console.log('Connection closed' + error));
  }

  invoke(procedureName: string, message: any, successCallback?: (value) => void, errorCallback?: (error) => void) {
    this.connection.invoke(procedureName, message)
      .then(successCallback)
      .catch(errorCallback);
  }

  on(procedureName: string, callBack: (...message: any) => void) {
    this.connection.on(procedureName, callBack);
  }
}
