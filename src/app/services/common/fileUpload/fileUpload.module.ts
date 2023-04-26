import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './fileUpload.component';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  imports: [
    CommonModule,
    NgxFileDropModule
  ],
  declarations: [FileUploadComponent],
  exports: [FileUploadComponent]
})
export class FileUploadModule { }
