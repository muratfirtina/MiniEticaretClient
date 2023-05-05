import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './fileUpload.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DialogModule } from 'src/app/dialogs/dialog.module';
import { FileUploadDialogComponent } from 'src/app/dialogs/fileUpload-dialog/fileUpload-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    NgxFileDropModule,
    MatButtonModule,
    MatDialogModule
  ],
  declarations: [
    FileUploadComponent,
    FileUploadDialogComponent
  ],
  exports: [FileUploadComponent]
})
export class FileUploadModule { }
