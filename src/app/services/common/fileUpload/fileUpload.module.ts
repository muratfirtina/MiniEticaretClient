import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './fileUpload.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { DialogModule } from 'src/app/dialogs/dialog.module';

@NgModule({
  imports: [
    CommonModule,
    NgxFileDropModule,
    DialogModule
  ],
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent]
})
export class FileUploadModule { }
