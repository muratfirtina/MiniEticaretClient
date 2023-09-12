import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var $: any;

@Component({
  selector: 'app-order-item-remove-dialog',
  templateUrl: './order-item-remove-dialog.component.html',
  styleUrls: ['./order-item-remove-dialog.component.scss']
})
export class OrderItemRemoveDialogComponent extends BaseDialog<OrderItemRemoveDialogComponent> implements OnDestroy {

  constructor(
    dialogRef: MatDialogRef<OrderItemRemoveDialogComponent>,
    @Inject (MAT_DIALOG_DATA) public data: OrderItemRemoveDialogState) {
    super(dialogRef);
  }
  ngOnDestroy(): void {
    $('#orderDetailModal').modal('show');
  }

}
export enum OrderItemRemoveDialogState {
  Yes,
  No
}
