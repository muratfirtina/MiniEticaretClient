import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FileUploadDialogComponent } from './fileUpload-dialog/fileUpload-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProductImageDialogComponent } from './product-image-dialog/product-image-dialog.component';
import { FileUploadModule } from '../services/common/fileUpload/fileUpload.module';
import {MatCardModule} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { CartItemRemoveDialogComponent } from './cart-item-remove-dialog/cart-item-remove-dialog.component';
import { ShoppingCompleteDialogComponent } from './shopping-complete-dialog/shopping-complete-dialog.component';



@NgModule({
  declarations: [
    DeleteDialogComponent,
    ProductImageDialogComponent,
    CartItemRemoveDialogComponent,
    ShoppingCompleteDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    FileUploadModule,
    FormsModule
  ]
})
export class DialogModule { }
