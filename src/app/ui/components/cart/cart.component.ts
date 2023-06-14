import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/base_url';
import { List_Cart_Item } from 'src/app/contracts/cart/list_cart_item';
import { Update_Cart_Item } from 'src/app/contracts/cart/update_cart_item';
import { List_Product_Image } from 'src/app/contracts/list_product_image';
import { CartService } from 'src/app/services/common/models/cart.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent extends BaseComponent implements OnInit{

  constructor(
    spinner: NgxSpinnerService,
    private cartService:CartService,private productService:ProductService,private fileService:FileService) {
    super(spinner);
  }

  cartItems: List_Cart_Item[];

  async ngOnInit(): Promise<void>{
    this.showSpinner(SpinnerType.BallSpinClockwise);
    this.cartItems = await this.cartService.get();
    this.hideSpinner(SpinnerType.BallSpinClockwise);
    
  }
  async changeQuantity(object: any) {
    this.showSpinner(SpinnerType.BallSpinClockwise);
    const cartItemId: string = object.target.attributes["id"].value;
    const quantity: number = object.target.value;
    const cartItem: Update_Cart_Item = new Update_Cart_Item();
    cartItem.cartItemId = cartItemId;
    cartItem.quantity = quantity;
    await this.cartService.updateQuantity(cartItem);
    this.hideSpinner(SpinnerType.BallSpinClockwise);
  }
  async removeCartItem(cartItemId: string) {
    this.showSpinner(SpinnerType.BallSpinClockwise);
    await this.cartService.remove(cartItemId);
    $("." + cartItemId).fadeOut(200, ()=> this.hideSpinner(SpinnerType.BallSpinClockwise));
    this.cartItems = await this.cartService.get();
    
  }
}
