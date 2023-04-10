import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService{

  constructor(private httpClientServices:HttpClientService) { }

  create(product){
    return this.httpClientServices.post({
      controller:"products"
    },product);
  }
}
