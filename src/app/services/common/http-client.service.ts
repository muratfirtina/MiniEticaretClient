import { Inject, Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'

})
export class HttpClientService {

  constructor(private httpClient:HttpClient, @Inject("baseUrl") private baseUrl: string) {}

  get<T>(){
    let url = this.baseUrl + "/Products";

  }

  post(){

  }

  put(){

  }
  delete(){

  }

}
