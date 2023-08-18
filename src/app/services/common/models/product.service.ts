import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/app/contracts/create_product';
import { List_Product } from 'src/app/contracts/list_product';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product_Image } from 'src/app/contracts/list_product_image';

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
  
  async list(page:number = 0, size: number = 5, successCallBack?:() => void, errorCallBack?: (errorMessage: string) => void): Promise<{totalProductCount: number; products: List_Product[]}> {
    
    const promiseData: Promise<{totalProductCount: number; products: List_Product[]}> = this.httpClientService.get<{totalProductCount: number; products: List_Product[]}>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack()).catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message));

    return await promiseData;
    
  } 

  async delete(id:string){
    const deleteObservable : Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    },id);

    await firstValueFrom(deleteObservable);
  }

  async readImages(id: string, successCallBack?: () => void): Promise<List_Product_Image[]>{
    const getObservable: Observable<List_Product_Image[]> = this.httpClientService.get<List_Product_Image[]>({
      controller: "products",
      action: "getproductimages"
    }, id);

    const productImages: List_Product_Image[] = await firstValueFrom(getObservable);
    successCallBack();
    return productImages;
  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void): Promise<void>{
    const deleteObservable: Observable<any> = this.httpClientService.delete<any>({
      controller: "products",
      action: "deleteproductimage",
      queryString: `imageId=${imageId}`
    }, id);

    await firstValueFrom(deleteObservable);
    successCallBack();
  }

  async changeShowcaseImage(imageId: string, productId: string, successCallBack?: () => void): Promise<void>{
    const changeShowcaseImageObservable: Observable<any> = this.httpClientService.get({
      controller: "products",
      action: "ChangeShowcaseImage",
      queryString: `imageId=${imageId}&productId=${productId}`
    });

    await firstValueFrom(changeShowcaseImageObservable);
    successCallBack();
  }

  async updateStockWithQrCode(productId: string, stock: number, successCallBack?: () => void){
    const observable: Observable<any> = this.httpClientService.put({
      controller: "products",
      action: "qrcode"
    },{
      productId, stock
    });
    
    await firstValueFrom(observable);
    successCallBack();
    }
  }
