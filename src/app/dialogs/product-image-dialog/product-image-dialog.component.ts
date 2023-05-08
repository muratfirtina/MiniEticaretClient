import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from 'src/app/services/common/fileUpload/fileUpload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { List_Product_Image } from 'src/app/contracts/list_product_image';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { DeleteDialogComponent, DeleteDialogState } from '../delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-product-image-dialog',
  templateUrl: './product-image-dialog.component.html',
  styleUrls: ['./product-image-dialog.component.scss']
})
export class ProductImageDialogComponent extends BaseDialog<ProductImageDialogComponent> implements OnInit{

  constructor(
    dialogRef: MatDialogRef<ProductImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProductImageDialogState | string,
    private productService: ProductService,
    private spinner:NgxSpinnerService,
    private dialogService: DialogService) {
    super(dialogRef);
  }

  productImages: List_Product_Image[] = [];

  

 @Output() options: Partial<FileUploadOptions> = {
    acceptedFileTypes: ".png, .jpg, .jpeg. gif",
    action: "upload",
    controller: "products",
    explanation: "Drag and drop your images here or click here to select images",
    isAdminPage: true,
    queryString: "Id=" + this.data

  };

  async ngOnInit() {
    this.spinner.show(SpinnerType.BallSpinClockwise);
    this.productImages = await this.productService.readImages(this.data as string,() =>this.spinner.hide(SpinnerType.BallSpinClockwise));
  }

  async deleteImage(imageId: string, event: any) {

    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteDialogState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallSpinClockwise)
        await this.productService.deleteImage(this.data as string, imageId, () => {
          this.spinner.hide(SpinnerType.BallSpinClockwise)
          var card = $(event.srcElement).parent().parent()
          card.fadeOut(400);
        });
      },
    });
  }

  
}
export enum ProductImageDialogState {
  Close
}