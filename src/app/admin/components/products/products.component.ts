import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Product } from 'src/app/contracts/product';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {
  constructor(
    private alertify: AlertifyService, spinner: NgxSpinnerService, private httpClientService: HttpClientService) {
    super(spinner);
  }

  ngOnInit() {
    this.showSpinner(SpinnerType.BallSpinClockwise);
    this.httpClientService.get<Product[]>({
      controller: "products",
    }).subscribe(data => console.log(data));

    /* this.httpClientService.post({
      controller: "products",
    
    },{
      name:"mavi Kalem",
      stock: 100,
      price: 15

    }).subscribe(); */

    /* this.httpClientService.put({
      controller: "products",
    }, {
      id: "f4773172-16fd-4215-89bd-790d29a7d04b",
      name: "Renkli Kalem",
      stock: 90,
      price: 12
      }).subscribe();
    } */

    /* this.httpClientService.delete({
      controller: "products",
    },"6c1f25ba-0684-4d89-a967-1d31adf3e7de").subscribe(); */
     
    
  } 
  
} 