import { Component, Inject, OnInit } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'src/app/services/common/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QrCodeService } from 'src/app/services/common/qr-code.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SpinnerType } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/list_product';

@Component({
  selector: 'app-qrcode-dialog',
  templateUrl: './qrcode-dialog.component.html',
  styleUrls: ['./qrcode-dialog.component.scss']
})
export class QrcodeDialogComponent extends BaseDialog<QrcodeDialogComponent> implements OnInit {

  constructor(
    private alertifyService: AlertifyService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private qrcodeService: QrCodeService,
    private domSanitizer: DomSanitizer,
    dialogRef: MatDialogRef<QrcodeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
    ) {
    super(dialogRef);
   }
   qrCodeSafeurl: SafeUrl;
  async ngOnInit() {
    this.spinner.show(SpinnerType.BallSpinClockwise);
    const qrCodeBlob: Blob = await this.qrcodeService.generateQrCode(this.data)
      const url:string = URL.createObjectURL(qrCodeBlob);
      this.qrCodeSafeurl = this.domSanitizer.bypassSecurityTrustUrl(url);
      /* const link = document.createElement('a');
      link.href = url;
      link.download = `${this.data}.png`;
      link.click(); */
      this.spinner.hide(SpinnerType.BallSpinClockwise);
    
  }
 

}
