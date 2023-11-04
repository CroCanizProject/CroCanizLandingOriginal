import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../services/sales.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { OrdersService } from '../services/orders.service';
import Stripe from 'stripe';
import { HttpClient } from '@angular/common/http';
// import { StripeElement } from '@stripe/stripe-js/types/stripe-js/elements-group';
// import { StripeService, Elements, Element as StripeElement, ElementsOptions } from 'ngx-stripe';


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
export class ShoppingCarComponent implements OnInit{
  private stripe!: Stripe;
  private items: { id: number; cantidad: number }[] = []; // Agrega los productos aquí
  listShoppingCar: any[] = [];
  carrito: any[] = [];
  salesForm!: FormGroup;





  

  constructor(private order: OrdersService, private fb: FormBuilder, private router: Router, private sale: SalesService,
    private http: HttpClient
    ) {
  }





confirmarPago(clientSecret: string) {
  this.http.post<any>('https://backend.crocainz.live/api/checkout', { client_secret: clientSecret })
    .subscribe(
      (data) => {
        console.log('Respuesta del servidor:', data);
        // Aquí puedes actualizar la interfaz de usuario según la respuesta del servidor
      },
      (error) => {
        console.error('Error al confirmar el pago:', error);
        // Maneja el error en caso de problemas con la confirmación del pago
      }
    );
}



  makePayment(amount: any) {
    const items = this.listShoppingCar.map(item => {
      return {
        id: item.item.id,
        cantidad: item.cantidad
      };
    });

    const requestData = {
      items: items,
    };

    const stripe = require('stripe')('pk_test_51KdHpCLv3DAilF3a717lsqDl8jHrEuT5qataPcumOy9vhbfCn42b5Pdt1BO50GyOnDoqN9gGJ8UPYroPSg8hUuE600ED56fcdO');
  
    
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key:
        'pk_test_51KdHpCLv3DAilF3a717lsqDl8jHrEuT5qataPcumOy9vhbfCn42b5Pdt1BO50GyOnDoqN9gGJ8UPYroPSg8hUuE600ED56fcdO',
        
      locale: 'auto',
      token: (stripeToken: any) => {
        
        
        const saleData = {
          street: 'Miguel Hidalgo',
          number: '520',
          colony: 'San Miguel',
          zip_code: '72138',
          municipality: 'San Mateo Atenco',
          state: 'México',
          items: items,
          paymentIntent: stripeToken.id,
          
        };

        const clientSecret = stripeToken.client_secret;

        this.confirmarPago(clientSecret);


        

        // this.sale.validateCheck(requestData).subscribe({
        //   next: (res) => {
        //     console.log("Venta completada:", res);
        //     // Realiza acciones adicionales, como redirigir al usuario a una página de confirmación
        //   },
        //   error: (err) => {
        //     alert("Error al procesar la venta: " + err.error.message);
        //     console.error("Error:", err);
        //     // Maneja errores y notifica al usuario si la venta falló
        //   },
        // });
      },
    });
    paymentHandler.open({
      mode: 'payment',
      name: 'Cro Caniz',
      description: 'Productos a pagar ',
      amount: amount * 100,
      
    });
  }



  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(script);
    }
  }







  ngOnInit(): void {
    this.invokeStripe();
    this.loadShoppingCart();
  }

  loadShoppingCart() {
    const carStorage = localStorage.getItem("carrito");
    if (carStorage) {
      this.listShoppingCar = JSON.parse(carStorage);
    }
  }



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

  calculateSubtotal(cartItem: any): number {
    return cartItem.cantidad * cartItem.item.price;
  }

  getTotalSubtotales(): number {
    return this.listShoppingCar.reduce((total, cartItem) => total + this.calculateSubtotal(cartItem), 0);
  }



  // Sales Module


  private validateAll(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control?.markAsDirty({ onlySelf: true })
      } else if (control instanceof FormGroup) {
        this.validateAll(control)
      }
    })
  }




  // generateSale() {
  //   const items = this.listShoppingCar.map(item => {
  //     return {
  //       id: item.item.id,
  //       cantidad: item.cantidad
  //     };
  //   });

  //   const totalCantidadProductos = this.getTotalCantidadProductos();
  //   const totalAPagar = this.getTotalSubtotales();

  //   this.salesForm.patchValue({
  //     items: items,
  //     totalCantidadProductos: totalCantidadProductos,
  //     totalAPagar: totalAPagar
  //   });

  //   const direccion = {

  //     street: this.salesForm.get('street')?.value,
  //     number: this.salesForm.get('number')?.value,
  //     colony: this.salesForm.get('colony')?.value,
  //     zip_code: this.salesForm.get('zip_code')?.value,
  //     municipality: this.salesForm.get('municipality')?.value,
  //     state: this.salesForm.get('state')?.value,
  //   };


  //   if (this.salesForm.valid) {
  //     this.sale.addSale(this.salesForm.value).subscribe({
  //       next: (res => {
  //         console.log("DONE!")
  //       }),
  //       error: (err) => {
  //         alert(err.error.message)
  //         console.log("ERROR")
  //       }
  //     })
  //   }
  //   else {
  //     this.validateAll(this.salesForm);
  //     console.log("Error de formulario");
  //   }

  //   console.log('Datos del carrito:', this.salesForm.value);
  //   // console.log('Datos de dirección:', direccion);
  // }

  subtotal(first: any, second: any) {
    var sub = first * second;
    return sub;
  }


  emptyShoppingCar() {
    localStorage.clear();
    this.listShoppingCar = [];

  }


}