import { Component, Inject, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from 'src/app/services/common/fileUpload/fileUpload.component';

@Component({
  selector: 'app-product-image-dialog',
  templateUrl: './product-image-dialog.component.html',
  styleUrls: ['./product-image-dialog.component.scss']
})
export class ProductImageDialogComponent extends BaseDialog<ProductImageDialogComponent> {

  constructor(
    dialogRef: MatDialogRef<ProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductImageDialogState,
  ) {
    super(dialogRef);
  }

 @Output() options: Partial<FileUploadOptions> = {
    acceptedFileTypes: ".png, .jpg, .jpeg. gif",
    action: "upload",
    controller: "products",
    explanation: "Drag and drop your images here or click here to select images",
    isAdminPage: true,
    queryString: "Id=" + this.data

  }
}

export enum ProductImageDialogState {
  Close
}