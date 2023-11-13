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
    example: any; // 👈️ turn off type checking
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
  private items: { id: number; cantidad: number }[] = []; // Agrega los productos aquí
  listShoppingCar: any[] = [];
  carrito: any[] = [];
  //

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


  
  async onClick() {
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
        next:(res:any)=>{
          const startPosition = 0;
          const endPosition = 26;

          if (startPosition >= 0 && endPosition >= startPosition && endPosition < res.client_secret.length) {
            // Corta la cadena desde la posición inicial hasta la posición final
            const truncatedClientSecret = res.client_secret.substring(startPosition, endPosition + 1);
          
            console.log("client_secret truncado:", truncatedClientSecret);

            const complete = {
              paymentIntent: (truncatedClientSecret).toString(), 
              return_url: "https://web.whatsapp.com/",
              payment_method: "pm_card_visa"
            };

            console.log(complete)

            this.callValidateCheckTwo(complete)
            // this.sales.second(complete).subscribe({
            //   next:(next=>{
            //     console.log(next)
            //   })
            // })


          } else {
            console.log("Las posiciones especificadas no son válidas.");
          }



        }
      })



  
      // this.sales.validateCheck(requestData).subscribe({
      //   next: (res: ApiResponse) => {
      //     complete.paymentIntent = res.client_secret;
  
      //     this.sales.second(complete).subscribe({
      //       next: (res: any) => {
      //         if (res.payment_intent && res.payment_intent.id) {
      //           const paymentIntentId = res.payment_intent.id;
      //           console.log("ID del payment_intent:", paymentIntentId);
      //           // Aquí puedes usar paymentIntentId como necesites
      //         } else {
      //           console.log("No se encontró el ID del payment_intent en la respuesta de validateChecktwo.");
      //         }
      //       },
      //       error: (error) => {
      //         console.log("Error en validateChecktwo:", error);
      //       }
      //     });
      //   },
      //   error: (error) => {
      //     console.log("Error en validateCheck:", error);
      //   }
      // });
    } else {
      this.ngZone.run(() => this.cardError = error.message);
    }
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
    // this.invokeStripe();
    this.loadShoppingCart();
  }

  loadShoppingCart() {
    const carStorage = localStorage.getItem("carrito");
    if (carStorage) {
      this.listShoppingCar = JSON.parse(carStorage);
    }
  }


  removeProduct(index: any) {
    // Asumiendo que `index` es la posición del producto que quieres eliminar
    if (index >= 0 && index < this.listShoppingCar.length) {
      this.listShoppingCar.splice(index, 1); // Elimina 1 elemento en la posición `index`
      localStorage.setItem("carrito", JSON.stringify(this.listShoppingCar)); // Actualiza el carrito en el almacenamiento local
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