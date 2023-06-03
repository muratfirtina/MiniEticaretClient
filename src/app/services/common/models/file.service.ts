import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Product } from 'src/app/contracts/create_product';
import { List_Product } from 'src/app/contracts/list_product';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Product_Image } from 'src/app/contracts/list_product_image';
import { BaseUrl } from 'src/app/contracts/base_url';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  constructor(private httpClientService: HttpClientService) { }

  async getBaseStorageUrl(): Promise<BaseUrl>{
    const getObservable: Observable<BaseUrl> = this.httpClientService.get<BaseUrl>({
        controller: "files",
        action: "GetBaseStorageUrl"
    });
    return await firstValueFrom(getObservable);
  }
}