import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes,RouterModule } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ShoppingCarComponent } from './shopping-car/shopping-car.component';
import { IndexComponent } from './index/index.component';



const ROUTES:Routes = [
  {path: '', component:  IndexComponent },
  {path: 'productos', component: ProductsComponent},
  {path: 'carrito', component: ShoppingCarComponent}
]



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES)
  ],
  exports: [RouterModule]
})



export class AppRoutingModule { }
