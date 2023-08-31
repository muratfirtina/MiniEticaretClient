import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { AlertifyService } from 'src/app/services/admin/alertify.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';
import { CategoryListComponent } from './category-list/category-list.component';
import { Create_Category } from 'src/app/contracts/category/create_category';
declare var $: any;

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent extends BaseComponent implements OnInit {

  constructor(private alertify: AlertifyService, spinner: NgxSpinnerService, private httpClientService: HttpClientService) { 
    super(spinner); }

  ngOnInit() {

  }

  @ViewChild(CategoryListComponent)listComponents: CategoryListComponent;

  createdCategory(createdCategory: Create_Category){
    this.listComponents.getCategories();

  }

}


