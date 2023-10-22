import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ProductInfo, Products } from '../interfaces/Products';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private http:HttpClient) { }
  carrito: any[] = [];

  // url:string="https://backend.crocainz.live/api/products?limit=2"
  url:string="https://backend.crocainz.live/api/products"


  getProductos(): Observable<any> {
    return this.http.get(this.url);
  }

  // getProductos():Observable<ProductInfo[]>{
  //   let direccion = this.url + "/products";
  //   return this.http.get<ProductInfo[]>(direccion);
  // }

}
