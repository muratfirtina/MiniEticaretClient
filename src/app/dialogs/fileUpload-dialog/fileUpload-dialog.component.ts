import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-fileUpload-dialog',
  templateUrl: './fileUpload-dialog.component.html',
  styleUrls: ['./fileUpload-dialog.component.css']
})
export class FileUploadDialogComponent extends BaseDialog<FileUploadDialogComponent> {

  constructor(
    dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileUploadDialogState,
    ) {
    super(dialogRef);
  
   }

}
export enum FileUploadDialogState {
  Yes,
  No
}
