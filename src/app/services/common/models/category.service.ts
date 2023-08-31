import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Create_Category } from 'src/app/contracts/category/create_category';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Category } from 'src/app/contracts/category/list_category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private httpClientService: HttpClientService) { }

  async createCategory(category: Create_Category, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void){
    const observable: Observable<Create_Category> = this.httpClientService.post({
      controller: "categories"
    }, category);
    
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
      .catch(errorCallBack);
    return await promiseData;

  }

  async getAllCategories(page:number = 0, size: number = 5, successCallBack?:() => void, errorCallBack?: (errorMessage: string) => void): Promise<{totalCategoryCount: number; categories: List_Category[]}> {
    
    const observable: Observable<{totalCategoryCount: number; categories: List_Category[]}> = this.httpClientService.get<{totalCategoryCount: number; categories: List_Category[]}>({
      controller: "categories",
      queryString: `page=${page}&size=${size}`
    })
    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
      .catch(errorCallBack);
    return await promiseData;
  }

  async deleteCategory(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void){
    const observable: Observable<void> = this.httpClientService.delete({
      controller: "categories"
    },id);

    const promiseData = firstValueFrom(observable);
    promiseData.then(successCallBack)
      .catch(errorCallBack);
    return await promiseData;
  }
}
