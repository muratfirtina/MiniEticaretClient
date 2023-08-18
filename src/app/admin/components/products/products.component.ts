import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/create_product';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { ProductListComponent } from './product-list/product-list.component';
import { DialogService } from 'src/app/services/common/dialog.service';
import { QrcodeReadingDialogComponent } from 'src/app/dialogs/qrcode-reading-dialog/qrcode-reading-dialog.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {
  constructor(
    private alertify: AlertifyService, spinner: NgxSpinnerService, private httpClientService: HttpClientService ,private dialogService: DialogService) {
    super(spinner);
  }

  ngOnInit() {

  }

  @ViewChild(ProductListComponent)listComponents: ProductListComponent;

  createdProduct(createProduct: Create_Product){
    this.listComponents.getProducts();

  }

  showProductQrCodeReading(){
    this.dialogService.openDialog({
      componentType: QrcodeReadingDialogComponent,
      data: null,
      options: {
        width: '750px'},
      afterClosed: () => {
      }
    });
  }
}
