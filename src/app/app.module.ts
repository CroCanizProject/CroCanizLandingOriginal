import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ProductsComponent } from './products/products.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ShoppingCarComponent } from './shopping-car/shopping-car.component';
import { IndexComponent } from './index/index.component';
import { HeaderMainComponent } from './header-main/header-main.component';
import { FooterMainComponent } from './footer-main/footer-main.component';
import { GeneralContentComponent } from './general-content/general-content.component';


@NgModule({
  declarations: [
    AppComponent,
    ProductsComponent,
    ShoppingCarComponent,
    IndexComponent,
    HeaderMainComponent,
    FooterMainComponent,
    GeneralContentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
