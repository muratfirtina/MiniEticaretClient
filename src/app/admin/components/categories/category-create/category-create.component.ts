import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Category } from 'src/app/contracts/category/create_category';
import { List_Category } from 'src/app/contracts/category/list_category';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { CategoryService } from 'src/app/services/common/models/category.service';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.scss']
})
export class CategoryCreateComponent extends BaseComponent implements OnInit{
  
  constructor(spinner:NgxSpinnerService, private categoryService:CategoryService, private alertify:AlertifyService) {
    super(spinner);
  }
  ngOnInit(): void {
    this.loadCategories();
  }

  @Output() createdCategory : EventEmitter<Create_Category>= new EventEmitter();

  parentCategoryControl = new FormControl();
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

  onParentCategoryInput(inputValue: string) {
    this.filteredCategories = this.categories.filter(category => 
      category.name.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 5);
  }

  create(name: HTMLInputElement, description: HTMLInputElement, parentCategoryName: HTMLInputElement){
    this.showSpinner(SpinnerType.BallSpinClockwise);
    const create_category : Create_Category = new Create_Category();
    create_category.name = name.value;
    create_category.description = description.value;
    create_category.parentCategoryName = parentCategoryName.value;

    this.categoryService.createCategory(create_category, () => {
      this.hideSpinner(SpinnerType.BallSpinClockwise);
      this.alertify.message( create_category.name + " Başarıyla oluşturuldu.", {
        dismissOthers: true,
        messageType: MessageType.Success,
        position: Position.TopRight

      });

      this.createdCategory.emit(create_category);

    }, errorMessage => {
      this.alertify.message("Category oluşturulamadı", {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
        });
    });
  }
}