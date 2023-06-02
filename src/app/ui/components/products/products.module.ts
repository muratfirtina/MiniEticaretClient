import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsComponent } from './products.component';
import { RouterModule } from '@angular/router';
import { UiProductListComponent } from './ui-product-list/ui-product-list.component';



@NgModule({
  declarations: [
    ProductsComponent,
    UiProductListComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component:ProductsComponent}
    ])
  ]
})
export class ProductsModule { }
