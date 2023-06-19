import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartComponent } from './cart.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    CartComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path: "", component:CartComponent}
    ]),
    ReactiveFormsModule
  ],
  exports: [
    CartComponent
  ]
})
export class CartModule { }
