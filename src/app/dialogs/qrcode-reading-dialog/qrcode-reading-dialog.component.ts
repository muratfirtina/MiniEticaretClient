import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import {
  AlertifyService,
  MessageType,
  Position,
} from 'src/app/services/admin/alertify.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DialogService } from 'src/app/services/common/dialog.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QrCodeService } from 'src/app/services/common/qr-code.service';
import { NgxScannerQrcodeComponent } from 'ngx-scanner-qrcode';
import { SpinnerType } from 'src/app/base/base.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { BehaviorSubject } from 'rxjs';

declare var $: any;

@Component({
  selector: 'app-qrcode-reading-dialog',
  templateUrl: './qrcode-reading-dialog.component.html',
  styleUrls: ['./qrcode-reading-dialog.component.scss'],
})
export class QrcodeReadingDialogComponent
  extends BaseDialog<QrcodeReadingDialogComponent>
  implements OnInit, OnDestroy
{
  constructor(
    private alertifyService: AlertifyService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private qrcodeService: QrCodeService,
    private productService: ProductService,
    dialogRef: MatDialogRef<QrcodeReadingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    super(dialogRef);
  }
  private scannedQRValues: Set<string> = new Set();
  private hasProcessedQR: boolean = false;

  @ViewChild('scanner', { static: true }) scanner: NgxScannerQrcodeComponent;
  @ViewChild('txtStock', { static: true }) txtStock: ElementRef;
  @ViewChild('resultTableBody', { static: true }) resultTableBody: ElementRef;

  ngOnInit(): void {
    this.scanner.start();
  }

  ngOnDestroy(): void {
    this.scanner.stop();
  }

  onEvent(e) {
    this.spinner.show(SpinnerType.BallScaleMultiple);
    const firstResult = e[0];
    if (
      firstResult &&
      firstResult.value &&
      !this.scannedQRValues.has(firstResult.value)
    ) {
      this.scannedQRValues.add(firstResult.value);

      const decodedValue = JSON.parse(firstResult.value);
      const stockValue = (this.txtStock.nativeElement as HTMLInputElement)
        .value;
      console.log(decodedValue);

      // Tabloya eklemek için satır oluştur
      const row = document.createElement('tr');
      const fieldCell = document.createElement('td');
      const valueCell = document.createElement('td');

      // Satır içindeki hücreleri düzenle
      fieldCell.textContent = 'Name';
      valueCell.textContent = decodedValue.Name;
      row.appendChild(fieldCell);
      row.appendChild(valueCell);

      // Tabloya satırı ekle
      this.resultTableBody.nativeElement.appendChild(row);
      
      this.productService.updateStockWithQrCode(decodedValue.Id, parseInt(stockValue),()=>{
        this.alertifyService.message(
          decodedValue.Name +
            ' ürününün stok bilgisi: ' +
            stockValue +
            ' olarak güncellenmiştir',
          {
            messageType: MessageType.Success,
            position: Position.TopRight,
          }
        );
        this.spinner.hide(SpinnerType.BallScaleMultiple);
      });
    }
  }
}
