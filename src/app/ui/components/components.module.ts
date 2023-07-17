import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { BasketsModule } from './baskets/baskets.module';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { CartModule } from './cart/cart.module';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { PasswordUpdateComponent } from './password-update/password-update.component';
import { PasswordResetModule } from './password-reset/password-reset.module';
import { PasswordUpdateModule } from './password-update/password-update.module';



@NgModule({
  declarations: [
  
  ],
  imports: [
    CommonModule,
    ProductsModule,
    BasketsModule,
    HomeModule,
    CartModule,
    PasswordResetModule,
    PasswordUpdateModule,
    
    //RegisterModule,
    //LoginModule
  ],
  exports: [
    CartModule
  ]
})
export class ComponentsModule { }
