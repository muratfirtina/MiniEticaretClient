import { Component, Input, OnInit } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { HttpClientService } from '../http-client.service';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';

@Component({
  selector: 'app-fileUpload',
  templateUrl: './fileUpload.component.html',
  styleUrls: ['./fileUpload.component.css']
})
export class FileUploadComponent {

  constructor(
    private httpClientService:HttpClientService,
    private alertifyService: AlertifyService,
    private customToastrService: CustomToastrService
    ) {}

  public files: NgxFileDropEntry[];
  
  @Input() options: Partial<FileUploadOptions>

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file: File) => {
        fileData.append(_file.name, _file, file.relativePath);
      });
    }
    this.httpClientService.post({

      controller: this.options.controller,
      action: this.options.action,
      queryString: this.options.queryString,
      headers: new HttpHeaders({"responseType": "blob"})
      
    }, fileData).subscribe( data => {

      const message :string = "File uploaded successfully"

        if(this.options.isAdminPage){
          this.alertifyService.message(message,{
            dismissOthers: true,
            messageType: MessageType.Success,
            position: Position.TopRight
          })
          
        } else{
          this.customToastrService.message(message, "Success" ,{
            toasterMessageType: ToastrMessageType.Success,
            position:ToastrPosition.TopRight
          })
          
        }
    }, (error: HttpErrorResponse) => {

      const message :string = "File upload failed"

      if(this.options.isAdminPage){
          this.alertifyService.message(message,{
            dismissOthers: true,
            messageType: MessageType.Error,
            position: Position.TopRight
          })
          
        } else{

          this.customToastrService.message(message, "Failed" ,{
            toasterMessageType: ToastrMessageType.Error,
            position:ToastrPosition.TopRight
          })
          
        }
    });
    
  }
}
export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  acceptedFileTypes?: string;
  isAdminPage?: boolean = false;

}
