import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../services/sales.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import Stripe from 'stripe';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { catchError, concatMap, of, switchMap } from 'rxjs';



declare global {
  interface Window {
    example: any; 
  }
}

@Component({
  selector: 'app-shopping-car',
  templateUrl: './shopping-car.component.html',
  styleUrls: ['./shopping-car.component.css']
})


export class ShoppingCarComponent implements AfterViewInit {

  @ViewChild('cardInfo') cardInfo: ElementRef;
  cardError: String;
  card: any;


  // carrito de compras
  private items: { id: number; cantidad: number }[] = [];
  listShoppingCar: any[] = [];
  carrito: any[] = [];
  

  constructor(private ngZone: NgZone, private sales: SalesService) {

  }

  ngAfterViewInit(): void {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.onChange.bind(this));

  }



  onChange({ error }) {
    if (error) {
      this.ngZone.run(() => this.cardError = error.message);
    }
    else {
      this.ngZone.run(() => this.cardError = null);
    }
  }

  confirmarCompra() {
    Swal.fire({
      title: "¿Estás seguro de continuar con la compra?",
      text: "Se harán cargos a la tarjeta ingresada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, deseo continuar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const items = this.listShoppingCar.map(items => {
          return {
            id: items.item.id,
            cantidad: items.cantidad
          };
        });
  
        const requestData = {
          items: items
        };
  
        const { token, error } = await stripe.createToken(this.card);
  
        interface ApiResponse {
          client_secret: any;
          total: number;
        }
  
        if (token) {
          this.sales.validateCheck(requestData).subscribe({
            next: (res: any) => {
              const startPosition = 0;
              const endPosition = 26;
  
              if (startPosition >= 0 && endPosition >= startPosition && endPosition < res.client_secret.length) {
                const truncatedClientSecret = res.client_secret.substring(startPosition, endPosition + 1);
                console.log("client_secret truncado:", truncatedClientSecret);
  
                const complete = {
                  paymentIntent: truncatedClientSecret.toString(),
                  return_url: "https://web.whatsapp.com/",
                  payment_method: "pm_card_visa"
                };
  
                console.log(complete);
  
                this.callValidateCheckTwo(complete);
  
                Swal.fire({
                  title: "¡Gracias por tu compra!",
                  width: 450,
                  padding: "3em",
                  color: "#716add",
                  background: "#fff url(/assets/img/fondoPerros.png)",
                  backdrop: `
                    rgba(0,0,123,0.4)
                    url("/assets/img/perritoCarro.gif")
                    left top
                    no-repeat
                  `
                });

                this.emptyShoppingCar()


              } else {
                console.log("Las posiciones especificadas no son válidas.");
              }
            }
          });
        } else {
          this.ngZone.run(() => this.cardError = error.message);
        }
      }
    });
  }

  onClick() {
  this.confirmarCompra();
}
  
emptyShoppingCar() {
  localStorage.clear();
  this.listShoppingCar = [];

}

  
  callValidateCheckTwo(data) {
    this.sales.second(data).subscribe({
      next: (res) => {
        console.log("DONE!!!!!", res);
      },
      error: (error) => {
        console.log("Error en validateCheckTwo:", error);
        // Aquí puedes agregar código adicional para registrar el error o manejarlo de otra manera.
      }
    });
  }
  


  ngOnInit(): void {
    this.loadShoppingCart();
  }

  loadShoppingCart() {
    const carStorage = localStorage.getItem("carrito");
    if (carStorage) {
      this.listShoppingCar = JSON.parse(carStorage);
    }
  }


  removeProduct(index: any) {
    if (index >= 0 && index < this.listShoppingCar.length) {
      this.listShoppingCar.splice(index, 1);
      localStorage.setItem("carrito", JSON.stringify(this.listShoppingCar));
    }
  }


  // Shopping Car


  getTotalPorProducto(item: any) {
    const cartItem = this.carrito.find((cartItem) => cartItem.item.id === item.id);

    return cartItem ? cartItem.cantidad : 0;
  }

  getTotal(subtotales: any) {
    let total = 0;
    for (let i = 0; i < subtotales.length; i++) {
      total += subtotales[i];
    }
    return total;
  }

  getTotalCantidadProductos(): number {
    return this.listShoppingCar.reduce((total, cartItem) => total + cartItem.cantidad, 0);
  }



  // -************************ Subtotales

  calculateSubtotal(cartItem: any): number {
    return cartItem.cantidad * cartItem.item.price;
  }

  getTotalSubtotales(): number {
    return this.listShoppingCar.reduce((total, cartItem) => total + this.calculateSubtotal(cartItem), 0);
  }




}