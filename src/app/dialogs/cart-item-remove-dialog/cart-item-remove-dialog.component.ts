import { Component, Inject, OnDestroy } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
declare var $: any;

@Component({
  selector: 'app-cart-item-remove-dialog',
  templateUrl: './cart-item-remove-dialog.component.html',
  styleUrls: ['./cart-item-remove-dialog.component.scss']
})
export class CartItemRemoveDialogComponent extends BaseDialog<CartItemRemoveDialogComponent> implements OnDestroy {

  constructor(
    dialogRef: MatDialogRef<CartItemRemoveDialogComponent>,
    @Inject (MAT_DIALOG_DATA) public data: CartItemRemoveDialogState) {
    super(dialogRef);
  }
  ngOnDestroy(): void {
    $('#cartModal').modal('show');
  }

}
export enum CartItemRemoveDialogState {
  Yes,
  No
}