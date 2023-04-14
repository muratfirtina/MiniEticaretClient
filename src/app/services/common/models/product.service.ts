import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/app/contracts/create_product';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) { }

  create(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
    }, product)
      .subscribe(
        result => {
          successCallBack?.();
        },
        errorResponse => {
          let message = "";
          if (Array.isArray(errorResponse.error)) {
            errorResponse.error.forEach((v, index) => {
              v.value.forEach((_v, _index) => {
                message += `${_v}<br>`;
              });
            });
          } else if (typeof errorResponse.error === 'object' && errorResponse.error !== null) {
            Object.values(errorResponse.error).forEach((v: Array<string>) => {
              v.forEach((_v) => {
                message += `${_v}<br>`;
              });
            });
          } else if (typeof errorResponse.error === 'string') {
            message = errorResponse.error;
          } else {
            message = "An error occurred";
          }
          errorCallBack?.(message);
        }
      );
  }
  
  
}
