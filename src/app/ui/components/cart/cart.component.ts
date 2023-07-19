import {
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { BaseUrl } from 'src/app/contracts/base_url';
import { IsChecked_Cart_Item } from 'src/app/contracts/cart/isChecked_cart_item';
import { List_Cart_Item } from 'src/app/contracts/cart/list_cart_item';
import { Update_Cart_Item } from 'src/app/contracts/cart/update_cart_item';
import { Create_Order } from 'src/app/contracts/order/create_order';
import {
  CartItemRemoveDialogComponent,
  CartItemRemoveDialogState,
} from 'src/app/dialogs/cart-item-remove-dialog/cart-item-remove-dialog.component';
import {
  ShoppingCompleteDialogComponent,
  ShoppingCompleteDialogState,
} from 'src/app/dialogs/shopping-complete-dialog/shopping-complete-dialog.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { CartService } from 'src/app/services/common/models/cart.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { OrderService } from 'src/app/services/common/models/order.service';
import {
  CustomToastrService,
  ToastrMessageType,
  ToastrPosition,
} from 'src/app/services/ui/custom-toastr.service';

declare var $: any;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent extends BaseComponent implements OnInit {
  constructor(
    spinner: NgxSpinnerService,
    private cartService: CartService,
    private fileService: FileService,
    private orderService: OrderService,
    private toastrService: CustomToastrService,
    private router: Router,
    private dialogService: DialogService
  ) {
    super(spinner);
  }

  totalItemCount: number;
  totalSelectedCartPrice: number;
  baseUrl: BaseUrl;
  cartItems: List_Cart_Item[];
  isCartPriceModalActive = false;
  selectedItemCount: number = 0;
  cartIsEmptyMessage: string;

  async ngOnInit(): Promise<void> {
    this.showSpinner(SpinnerType.BallSpinClockwise);
    this.baseUrl = await this.fileService.getBaseStorageUrl();
    await this.getCartItems();
    this.updateSelectedItemCount();
    this.hideSpinner(SpinnerType.BallSpinClockwise);
  }

  async getCartItems(): Promise<void> {
    this.cartItems = await this.cartService.get();
    this.totalItemCount = this.cartItems.length;

    this.cartItems.forEach((cartItem) => {
      cartItem.quantityPrice = cartItem.unitPrice * cartItem.quantity;
    });

    this.totalSelectedCartPrice = this.cartItems
      .filter((cartItem) => cartItem.isChecked)
      .reduce((sum, cartItem) => sum + cartItem.quantityPrice, 0);
  }

  toggleItemChecked(event: any, cartItem: List_Cart_Item) {
    cartItem.isChecked = event.target.checked;
    this.updateTotalCartPrice();
    this.updateSelectedItemCount();

    const isCheckedCartItem: IsChecked_Cart_Item = new IsChecked_Cart_Item();
    isCheckedCartItem.cartItemId = cartItem.cartItemId;
    isCheckedCartItem.isChecked = cartItem.isChecked;
    this.cartService.updateCartItem(isCheckedCartItem);
  }

  async changeQuantity(change: number, cartItem: List_Cart_Item) {
    this.showSpinner(SpinnerType.BallSpinClockwise);
    const quantity: number = cartItem.quantity + change;

    if (quantity >= 1) {
      const updateCartItem: Update_Cart_Item = new Update_Cart_Item();
      updateCartItem.cartItemId = cartItem.cartItemId;
      updateCartItem.quantity = quantity;

      await this.cartService.updateQuantity(updateCartItem);
      cartItem.quantityPrice = cartItem.unitPrice * quantity;
      cartItem.quantity = quantity; // Güncellenen quantity değerini ata
    }

    this.updateTotalCartPrice();
    this.hideSpinner(SpinnerType.BallSpinClockwise);
  }

  async removeCartItem(cartItemId: string) {
    
    this.dialogService.openDialog({
      componentType: CartItemRemoveDialogComponent,
      data: CartItemRemoveDialogState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallSpinClockwise);

        try {
          await this.cartService.remove(cartItemId);
          this.cartItems = this.cartItems.filter(
            (item) => item.cartItemId !== cartItemId
          );
          this.updateSelectedItemCount();
          this.updateTotalCartPrice();
          this.totalItemCount = this.cartItems.length;
        } catch (error) {
          console.log('Error occurred while removing cart item:', error);
        } finally {
          this.hideSpinner(SpinnerType.BallSpinClockwise);
        }
        
      },
    });
  }

  updateTotalCartPrice() {
    this.totalSelectedCartPrice = this.cartItems
      .filter((cartItem) => cartItem.isChecked)
      .reduce((sum, cartItem) => sum + cartItem.quantityPrice, 0);
  }

  updateSelectedItemCount() {
    this.selectedItemCount = this.cartItems.filter(
      (cartItem) => cartItem.isChecked
    ).length;

    if (this.selectedItemCount === 0) {
      const cartIsEmpty = this.cartItems.length === 0;
      this.cartIsEmptyMessage = cartIsEmpty
        ? 'Sepetiniz boş'
        : 'Seçili ürün bulunmamaktadır.';
    }
  }

  async shoppingCompleting() {
    if (this.selectedItemCount === 0) {
      this.toastrService.message(
        'Lütfen sepetinizden en az bir ürün seçiniz.',
        'Sepetinizde seçili ürün bulunmamaktadır.',
        {
          toastrMessageType: ToastrMessageType.Warning,
          position: ToastrPosition.TopRight,
        }
      );
      $('#cartModal').modal('show');
      return;
    }
    this.dialogService.openDialog({
      componentType: ShoppingCompleteDialogComponent,
      data: ShoppingCompleteDialogState.Yes,
      afterClosed: async () => {
        this.showSpinner(SpinnerType.BallSpinClockwise);
        const order: Create_Order = new Create_Order();
        order.address = 'Altıntepe Mahallesi, 34760 Maltepe/İstanbul, Türkiye';
        order.description = 'Acil teslim edilmesi gereken sipariş';
        await this.orderService.create(order);
        this.hideSpinner(SpinnerType.BallSpinClockwise);
        this.toastrService.message(
          'Siparişiniz başarıyla oluşturuldu.',
          'Siparişiniz alındı',
          {
            toastrMessageType: ToastrMessageType.Info,
            position: ToastrPosition.TopRight,
          }
        );
        $('#cartModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
        this.router.navigate(['/']).then(() => {
          window.location.reload();
        });
      },
    });
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const modal = document.getElementById('cartPriceModal');
    const windowHeight = window.innerHeight;
    const modalHeight = modal.offsetHeight;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;

    if (scrollTop + windowHeight - event.clientY > modalHeight) {
      this.isCartPriceModalActive = true;
    } else {
      this.isCartPriceModalActive = false;
    }
  }
}
