import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { HomeComponent } from './ui/components/home/home.component';
import { authGuard } from './guards/common/auth-guard';

const routes: Routes = [
  {
    path: "admin", component:LayoutComponent, children:[
      { path: "", component: DashboardComponent , canActivate: [authGuard]},
      { path: "customers", loadChildren :()=> import("./admin/components/customers/customers.module").then(m=>m.CustomersModule), canActivate: [authGuard]},
      { path: "products", loadChildren :()=> import("./admin/components/products/products.module").then(m=>m.ProductsModule), canActivate: [authGuard]},
      { path: "orders", loadChildren :()=> import("./admin/components/orders/orders.module").then(m=>m.OrdersModule), canActivate: [authGuard]},
      { path: "authorize-menu", loadChildren :()=> import("./admin/components/authorize-menu/authorize-menu.module").then(m=>m.AuthorizeMenuModule), canActivate: [authGuard]},
    ], canActivate: [authGuard]
  },
  {path: "", component:HomeComponent},
  {path: "cart", loadChildren :()=> import("./ui/components/cart/cart.module").then(m=>m.CartModule)},
  {path: "register", loadChildren :()=> import("./ui/components/register/register.module").then(m=>m.RegisterModule)},
  {path: "products", loadChildren :()=> import("./ui/components/products/products.module").then(m=>m.ProductsModule)},
  {path: "products/:pageNo", loadChildren :()=> import("./ui/components/products/products.module").then(m=>m.ProductsModule)},
  {path: "login", loadChildren :()=> import("./ui/components/login/login.module").then(m=>m.LoginModule)},
  {path: "password-reset", loadChildren :()=> import("./ui/components/password-reset/password-reset.module").then(m=>m.PasswordResetModule)},
  {path: "password-update/:userId/:resetToken", loadChildren :()=> import("./ui/components/password-update/password-update.module").then(m=>m.PasswordUpdateModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 