import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Category } from 'src/app/contracts/category/list_category';
import { DeleteDialogComponent, DeleteDialogState } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { CategoryService } from 'src/app/services/common/models/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent extends BaseComponent implements OnInit{

  displayedColumns: string[] = [ 'select','name','createdDate', 'updatedDate','edit' ,'delete'];
  dataSource:MatTableDataSource<List_Category> = null;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private categoryService: CategoryService,
     private alertifyService: AlertifyService,
     private dialogService: DialogService,
     spinner: NgxSpinnerService) {
    super(spinner);
  }

  selectedCategories: List_Category[] = []
  
  async getCategories() {

    this.showSpinner(SpinnerType.BallSpinClockwise);
  
    const pageIndex = this.paginator ? this.paginator.pageIndex : 0;
    const pageSize = this.paginator ? this.paginator.pageSize : 5;
  
    const allCategories: {totalCategoryCount: number; categories: List_Category[]} = await this.categoryService.getAllCategories(pageIndex, pageSize, 
      () => this.hideSpinner(SpinnerType.BallSpinClockwise), 
      errorMessage => this.alertifyService.message(errorMessage, {
        dismissOthers: true,
        messageType: MessageType.Error,
        position: Position.TopRight
    }));
  
    this.dataSource = new MatTableDataSource<List_Category>(allCategories.categories);
    this.paginator.length = allCategories.totalCategoryCount;
  
    if (allCategories.categories.length === 0 && pageIndex > 0) {
      this.paginator.pageIndex = pageIndex - 1;
      await this.getCategories();
    }

  }
  

  selectCategory(product: List_Category) {
    const index = this.selectedCategories.findIndex(r => r.id === product.id);
    if (index !== -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(product);
    }
  }

  selectAllCategories() {
    if (this.selectedCategories.length === this.dataSource.data.length) {
      this.selectedCategories = [];
    } else {
      this.selectedCategories = [...this.dataSource.data];
    }
  }

  async deleteSelectedCategories() {
    if (this.selectedCategories.length === 0) {
      return;
    }
    
    const dialogRef = this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteDialogState.Yes,
      afterClosed: async (result: DeleteDialogState) => {
        if (result === DeleteDialogState.Yes) {
          this.showSpinner(SpinnerType.BallSpinClockwise);
          try {
            for (const category of this.selectedCategories) {
              await this.categoryService.deleteCategory(category.id)
            }
  
            this.alertifyService.message('Selected category deleted', {
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            });
  
            this.selectedCategories = [];
            await this.getCategories();
          } catch (error) {
            this.alertifyService.message('An unexpected error occurred while deleting category', {
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
    await this.getCategories();
  }

  async ngOnInit(){
    await this.getCategories();
  }

}
