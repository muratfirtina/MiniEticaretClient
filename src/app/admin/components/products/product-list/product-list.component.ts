import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, _MatTableDataSource} from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Product } from "src/app/contracts/list_product";
import { DeleteDialogComponent, DeleteDialogState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { ProductImageDialogComponent } from 'src/app/dialogs/product-image-dialog/product-image-dialog.component';
import { QrcodeDialogComponent } from 'src/app/dialogs/qrcode-dialog/qrcode-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent extends BaseComponent implements OnInit{

  displayedColumns: string[] = [ 'select','name', 'stock', 'price', 'createdDate', 'updatedDate','photos', 'qrcode' , 'edit' ,'delete'];
  dataSource:MatTableDataSource<List_Product> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private productService: ProductService,
     private alertifyService: AlertifyService,
     private dialogService: DialogService,
     spinner: NgxSpinnerService) {
    super(spinner);
  }

  selectedProducts: List_Product[] = []
  
  async getProducts() {

    this.showSpinner(SpinnerType.BallSpinClockwise);
  
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : 5;
  
    const allProducts: {totalProductCount: number; products: List_Product[]} = await this.productService.list(pageIndex, pageSize, 
      () => this.hideSpinner(SpinnerType.BallSpinClockwise), 
      errorMessage => this.alertifyService.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
    }));
  
    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalProductCount;
  
    if (allProducts.products.length === 0 && pageIndex > 0) {
      this.paginator.pageIndex = pageIndex - 1;
      await this.getProducts();
    }

  }
  
  addProductImages(id:string){
    this.dialogService.openDialog({
      componentType: ProductImageDialogComponent,
      data: id,
      options: {
        width: '1000px'
      }
    });

  }

  selectProduct(product: List_Product) {
    const index = this.selectedProducts.findIndex(r => r.id === product.id);
    if (index !== -1) {
      this.selectedProducts.splice(index, 1);
    } else {
      this.selectedProducts.push(product);
    }
  }

  selectAllProducts() {
    if (this.selectedProducts.length === this.dataSource.data.length) {
      this.selectedProducts = [];
    } else {
      this.selectedProducts = [...this.dataSource.data];
    }
  }

  async deleteSelectedProducts() {
    if (this.selectedProducts.length === 0) {
      return;
    }
    
    const dialogRef = this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteDialogState.Yes,
      afterClosed: async (result: DeleteDialogState) => {
        if (result === DeleteDialogState.Yes) {
          this.showSpinner(SpinnerType.BallSpinClockwise);
          try {
            for (const role of this.selectedProducts) {
              await this.productService.delete(role.id);
            }
  
            this.alertifyService.message('Selected product deleted', {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            });
  
            this.selectedProducts = [];
            await this.getProducts();
          } catch (error) {
            this.alertifyService.message('An unexpected error occurred while deleting product', {
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight
            });
          }
        }
      }
    });
  
    // Burada dialog kapatılmasını bekliyoruz
    
    this.hideSpinner(SpinnerType.BallSpinClockwise);
  }
  
  async pageChanged(){
    await this.getProducts();
  }

  async ngOnInit(){
    await this.getProducts();
  }

  showQrCode(productId:string){
    this.dialogService.openDialog({
      componentType: QrcodeDialogComponent,
      data: productId,
      afterClosed:() => {},
      
    });
  }
   /* async getProducts(){

    this.showSpinner(SpinnerType.BallSpinClockwise);
    const allProducts: {totalCount: number; products: List_Product[]} = await this.productService.list(this.paginator ? this.paginator.pageIndex :0,this.paginator ? this.paginator.pageSize :5, ()=> this.hideSpinner(SpinnerType.BallSpinClockwise), errorMessage =>
      this.alertifyService.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
    }));
    
    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    
    this.paginator.length = allProducts.totalCount;  

    if (this.paginator && this.paginator.length && this.dataSource.data.length > 0) {
      this.paginator.pageIndex;
    }
  } */
  
  
}
