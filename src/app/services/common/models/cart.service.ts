import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Cart_Item } from 'src/app/contracts/cart/list_cart_item';
import { Create_Cart_Item } from 'src/app/contracts/cart/create_cart_item';
import { Update_Cart_Item } from 'src/app/contracts/cart/update_cart_item';
import { AuthService } from '../auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClientService: HttpClientService,private authService:AuthService, private customToastrService:CustomToastrService,private router:Router) { }
  async get(): Promise<List_Cart_Item[]>{
    const observable:Observable<List_Cart_Item[]> = this.httpClientService.get({
      controller: 'carts',
    });

    return await firstValueFrom(observable);
  }

  async add(cartItem: Create_Cart_Item): Promise<void>{
   
    const observable: Observable<any> = this.httpClientService.post({
      controller: 'carts',

    }, cartItem);

    await firstValueFrom(observable);
  }

  async updateQuantity(cartItem:Update_Cart_Item): Promise<void>{
    const observable: Observable<any> = this.httpClientService.put({
      controller: 'carts',
    }, cartItem);

    await firstValueFrom(observable);
  } 
  
  async remove(cartItemId: string): Promise<void>{
    const observable: Observable<any> = this.httpClientService.delete({
      controller: 'carts',
    },cartItemId);

    await firstValueFrom(observable);
  }
}
