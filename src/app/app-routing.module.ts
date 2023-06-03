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
    ], canActivate: [authGuard]
  },
  {path: "", component:HomeComponent},
  {path: "cart", loadChildren :()=> import("./ui/components/cart/cart.module").then(m=>m.CartModule)},
  {path: "basket", loadChildren :()=> import("./ui/components/baskets/baskets.module").then(m=>m.BasketsModule)},
  {path: "register", loadChildren :()=> import("./ui/components/register/register.module").then(m=>m.RegisterModule)},
  {path: "products", loadChildren :()=> import("./ui/components/products/products.module").then(m=>m.ProductsModule)},
  {path: "products/:pageNo", loadChildren :()=> import("./ui/components/products/products.module").then(m=>m.ProductsModule)},
  {path: "login", loadChildren :()=> import("./ui/components/login/login.module").then(m=>m.LoginModule)},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 