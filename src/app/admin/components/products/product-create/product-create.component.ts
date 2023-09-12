import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Category } from 'src/app/contracts/category/list_category';
import { Create_Product } from 'src/app/contracts/create_product';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/fileUpload/fileUpload.component';
import { CategoryService } from 'src/app/services/common/models/category.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent extends BaseComponent implements OnInit{
  
  constructor(spinner:NgxSpinnerService, private productService:ProductService, private alertify:AlertifyService,private categoryService:CategoryService) {
    super(spinner);
  }
  ngOnInit(): void {
    this.loadCategories();
  }

  categoryNameControl = new FormControl();
  categories: List_Category[] = [];
  filteredCategories: List_Category[] = [];

  loadCategories() {
    this.showSpinner(SpinnerType.BallSpinClockwise);
    this.categoryService.getAllCategories(0, 1000, () => {
      this.hideSpinner(SpinnerType.BallSpinClockwise);
    }, errorMessage => {
      this.alertify.message("Kategoriler yüklenemedi", {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
        });
    }).then(result => {
      this.categories = result.categories;
      this.filteredCategories = this.categories;
    });
  }

  onCategoryNameInput(inputValue: string) {
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 5);
  }

  @Output() createdProduct : EventEmitter<Create_Product>= new EventEmitter();

  @Output() fileUploadOptions: Partial<FileUploadOptions> ={
    controller: "products",
    action: "upload",
    explanation: "Selected files will be uploaded to the server",
    isAdminPage: true,
    acceptedFileTypes: ".png , .jpg, jpeg"
    
  };

  create(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement, categoryName: HTMLInputElement){
    this.showSpinner(SpinnerType.BallSpinClockwise);
    const create_product : Create_Product = new Create_Product();
    create_product.name = name.value;
    create_product.stock = parseInt(stock.value);
    create_product.price = parseFloat(price.value);
    create_product.categoryName = categoryName.value;


    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallSpinClockwise);
      this.alertify.message( create_product.name + " Başarıyla oluşturuldu.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight

      });

      this.createdProduct.emit(create_product);

    }, errorMessage => {
      this.alertify.message("Ürün oluşturulamadı", {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
        });
    });
  }
}
