import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { AlertifyService } from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-baskets',
  templateUrl: './baskets.component.html',
  styleUrls: ['./baskets.component.scss']
})
export class BasketsComponent extends BaseComponent implements OnInit{
  
  constructor(
    private alertify: AlertifyService, spinner: NgxSpinnerService) {
    super(spinner);
  }

  ngOnInit() {
    this.showSpinner(SpinnerType.BallSpinClockwise);
  }
}
