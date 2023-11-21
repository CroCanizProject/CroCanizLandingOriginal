import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products.service';
import { Shopping } from '../interfaces/Shoppoing';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent {

  constructor(private router: Router, private producto: ProductsService) { }

  product: any;
  carrito: any[] = [];
  cargando: boolean = true;

  ngOnInit():void {
  


    this.producto.getProductos().subscribe((response) => {
      this.product = response.data;
      this.cargando = false;
      // console.log(this.product = response.data);
    },
    (error)=>{
      console.log(error)
      this.cargando
    });
    const shoppingStorage = localStorage.getItem("carrito");
  if (shoppingStorage) {
    this.carrito = JSON.parse(shoppingStorage);
  }
  }


  addShoppingCar(item: any) {
    const index = this.carrito.findIndex((cartItem) => cartItem.item.id === item.id);
  
    if (index === -1) {
      this.carrito.push({ item, cantidad: 1 });
    } else {
      this.carrito[index].cantidad++;
    }
  
    // Actualizar el carrito en el almacenamiento local.
    localStorage.setItem("carrito", JSON.stringify(this.carrito));

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto añadido a tu carrito",
      showConfirmButton: false,
      timer: 1500
    });


  }
  

 
 






}
