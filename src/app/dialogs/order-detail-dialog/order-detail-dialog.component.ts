import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderService } from 'src/app/services/common/models/order.service';
import { SingleOrder } from 'src/app/contracts/order/single_order';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'src/app/services/common/dialog.service';
import { CompleteOrderDialogComponent, CompleteOrderDialogState } from '../complete-order-dialog/complete-order-dialog.component';
import { SpinnerType } from 'src/app/base/base.component';
import { OrderItemRemoveDialogComponent, OrderItemRemoveDialogState } from '../order-item-remove-dialog/order-item-remove-dialog.component';
import { List_Cart_Item } from 'src/app/contracts/cart/list_cart_item';
import { ActivatedRoute, Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-order-detail-dialog',
  templateUrl: './order-detail-dialog.component.html',
  styleUrls: ['./order-detail-dialog.component.scss']
})
export class OrderDetailDialogComponent extends BaseDialog<OrderDetailDialogComponent> implements OnInit {

  constructor(
    private alertifyService: AlertifyService,
    private orderService: OrderService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private router:Router,
    private activatedRoute: ActivatedRoute,
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string
    ) {
    super(dialogRef);
   }

  singleOrder: SingleOrder;
  
  displayedColumns: string[] = ['name', 'price', 'totalPrice', 'quantity','delete'];
  dataSource = [];
  clickedRows = new Set<any>();
  totalPrice: number;

  async ngOnInit(): Promise<void> {
    this.getSingleOrder();
  }

  async getSingleOrder(){
    this.singleOrder = await this.orderService.getOrderById(this.data as string)
    this.dataSource = this.singleOrder.cartItems;
    this.totalPrice = this.singleOrder.cartItems.map((cartItem, index) => cartItem.price * cartItem.quantity).reduce((price, current) => price + current);
    this.spinner.hide(SpinnerType.BallSpinClockwise);
    
  }


  completeOrder(){
    this.dialogService.openDialog({
      componentType: CompleteOrderDialogComponent,
      data: CompleteOrderDialogState.Yes,
      afterClosed: async () => {
      this.spinner.show(SpinnerType.BallSpinClockwise);
      await this.orderService.completeOrder( this.data as string);
      this.spinner.hide(SpinnerType.BallSpinClockwise);
      this.alertifyService.message('Sipariş başarıyla tamamlanmıştır.', {
        messageType: MessageType.Success,
        position: Position.TopRight
      });
      }
          
    })
  }

  
  async handleOrderItemDelete(cartItemId: string) {
    const remainingOrderItems = this.dataSource.filter(item => item.id !== cartItemId);
  
    if (remainingOrderItems.length === 0) {
      // Tüm order itemler silinmişse, sayfayı yeniden yükle
      this.refreshPage();
    } else {
      // Diğer durumda sadece bu öğeyi çıkarın ve referansları güncelleyin
      this.dataSource = [...remainingOrderItems];
    }
  }
  
  refreshPage() {
    window.location.reload();
  }
}
export enum OrderDetailDialogState {
  Close,
  OrderComplete
}
