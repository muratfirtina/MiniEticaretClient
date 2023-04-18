import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/app/contracts/create_product';
import { List_Product } from 'src/app/contracts/list_product';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClientService: HttpClientService) { }

  create(product: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
    }, product)
      .subscribe({
        next: result => {
          successCallBack?.();
        },
        error: errorResponse => {
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
        },
        complete: () => {}
      });
  }
  
  async list(page:number = 0, size: number = 5, successCallBack?:() => void, errorCallBack?: (errorMessage: string) => void): Promise<{totalCount: number; products: List_Product[]}> {
    
    const promiseData: Promise<{totalCount: number; products: List_Product[]}> = this.httpClientService.get<{totalCount: number; products: List_Product[]}>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    return await promiseData;
    
  } 
}
