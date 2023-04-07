import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {
  constructor(
    private alertify: AlertifyService, spinner: NgxSpinnerService) {
    super(spinner);
  }

  ngOnInit() {
    this.showSpinner(SpinnerType.BallSpinClockwise);
  }

}
