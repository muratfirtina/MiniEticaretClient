import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FileUploadDialogComponent } from './fileUpload-dialog/fileUpload-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ProductImageDialogComponent } from './product-image-dialog/product-image-dialog.component';
import { FileUploadModule } from '../services/common/fileUpload/fileUpload.module';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    DeleteDialogComponent,
    ProductImageDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatCardModule,
    FileUploadModule
  ]
})
export class DialogModule { }
