import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/create_product';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.scss']
})
export class ProductCreateComponent extends BaseComponent implements OnInit{
  
  constructor(spinner:NgxSpinnerService, private productService:ProductService, private alertify:AlertifyService) {
    super(spinner);
  }
  ngOnInit(): void {
    
  }

  create(Name: HTMLInputElement, Stock: HTMLInputElement, Price: HTMLInputElement){
    this.showSpinner(SpinnerType.BallSpinClockwise);
    const create_product : Create_Product = new Create_Product();
    create_product.name = Name.value;
    create_product.stock = parseInt(Stock.value);
    create_product.price = parseFloat(Price.value);

    this.productService.create(create_product, () => {
      this.hideSpinner(SpinnerType.BallSpinClockwise);
      this.alertify.message("Product created successfully", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight

      });

    });

  }
}
