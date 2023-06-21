import { Injectable } from '@angular/core';
import { HttpClientService } from '../http-client.service';
import { Observable, firstValueFrom } from 'rxjs';
import { List_Cart_Item } from 'src/app/contracts/cart/list_cart_item';
import { Create_Cart_Item } from 'src/app/contracts/cart/create_cart_item';
import { Update_Cart_Item } from 'src/app/contracts/cart/update_cart_item';
import { AuthService } from '../auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Router } from '@angular/router';
import { ProductService } from './product.service';
import { IsChecked_Cart_Item } from 'src/app/contracts/cart/isChecked_cart_item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClientService: HttpClientService,
    private authService:AuthService,
    private customToastrService:CustomToastrService,
    private router:Router,
    private productService: ProductService) { }
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

  async updateCartItem(cartItem: IsChecked_Cart_Item): Promise<void> {
    const observable: Observable<any> = this.httpClientService.put({
      controller: 'carts',
      action: 'updateCartItem'
    }, cartItem);

    await firstValueFrom(observable);
  }

  /* async addImageUrlToCartItems(cartItems: List_Cart_Item[]): Promise<List_Cart_Item[]> {
    const updatedCartItems: List_Cart_Item[] = [];
    for (const cartItem of cartItems) {
      const imageUrl = await this.getImageUrlForProduct(cartItem.productId);
      cartItem.productImageUrls = imageUrl;
      updatedCartItems.push(cartItem);
    }
    return updatedCartItems;
  }

  async getImageUrlForProduct(productId: string): Promise<string> {
    const productImages = await this.productService.readImages(productId);
    if (productImages && productImages.length > 0) {
      return productImages[0].path; // İlk fotoğrafın yolunu döndürün
    }
    return '../../../../../assets/default_product.png'; // Fotoğraf yoksa boş bir değer döndürün veya varsayılan bir URL tanımlayabilirsiniz
  } */
}
