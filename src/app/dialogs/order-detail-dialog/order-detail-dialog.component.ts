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
    dialogRef: MatDialogRef<OrderDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDetailDialogState | string
    ) {
    super(dialogRef);
   }

  singleOrder: SingleOrder;

  displayedColumns: string[] = ['name', 'price', 'totalPrice', 'quantity',];
  dataSource = [];
  clickedRows = new Set<any>();
  totalPrice: number;

  async ngOnInit(): Promise<void> {
   this.singleOrder = await this.orderService.getOrderById(this.data as string, ()=>this.spinner.hide ,errorMessage => {
    this.alertifyService.message(errorMessage, {
      dismissOthers: true,
      messageType: MessageType.Error,
      position: Position.TopRight
    })});

   this.dataSource = this.singleOrder.cartItems;
   this.totalPrice = this.singleOrder.cartItems.map((cartIrems,index) => cartIrems.price * cartIrems.quantity).reduce((a,b) => a + b);
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
}
export enum OrderDetailDialogState {
  Close,
  OrderComplete
}
