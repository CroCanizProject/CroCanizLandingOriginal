import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SalesService } from '../services/sales.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { OrdersService } from '../services/orders.service';
import Stripe from 'stripe';


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
export class ShoppingCarComponent {

  constructor(private order: OrdersService, private fb: FormBuilder, private router: Router, private sale: SalesService) {

    this.salesForm = this.fb.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      colony: ['', Validators.required],
      zip_code: ['', Validators.required],
      municipality: ['', Validators.required],
      state: ['', Validators.required],
      paymentIntent: ['', Validators.required],
      items: [],
      // totalCantidadProductos: 0, 
      // totalAPagar: 0,

    });



  }

  makePayment(amount:any){
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key:
      'pk_test_51KdHpCLv3DAilF3a717lsqDl8jHrEuT5qataPcumOy9vhbfCn42b5Pdt1BO50GyOnDoqN9gGJ8UPYroPSg8hUuE600ED56fcdO',
      locale:'auto',
      token:function(stripeToken:any){
        console.log(stripeToken.card);
        alert('Stripe token generated! ');
      },
    });
    paymentHandler.open({
      name: 'Cro Caniz',
      description: 'Productos a pagar ',
      amount:amount*100,
    });
  }



  invokeStripe(){
    if(!window.document.getElementById('stripe-script')){
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      window.document.body.appendChild(script);
    }
  }



 

  listShoppingCar: any[] = [];
  carrito: any[] = [];
  salesForm!: FormGroup;


  ngOnInit(): void {
    let carStorage = localStorage.getItem("carrito") as string;
    let carrito = JSON.parse(carStorage);
    this.listShoppingCar = carrito
    this.invokeStripe();
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




  generateSale() {
    const items = this.listShoppingCar.map(item => {
      return {
        id: item.item.id,
        cantidad: item.cantidad
      };
    });

    const totalCantidadProductos = this.getTotalCantidadProductos();
    const totalAPagar = this.getTotalSubtotales();

    this.salesForm.patchValue({
      items: items,
      totalCantidadProductos: totalCantidadProductos,
      totalAPagar: totalAPagar
    });

    const direccion = {

      street: this.salesForm.get('street')?.value,
      number: this.salesForm.get('number')?.value,
      colony: this.salesForm.get('colony')?.value,
      zip_code: this.salesForm.get('zip_code')?.value,
      municipality: this.salesForm.get('municipality')?.value,
      state: this.salesForm.get('state')?.value,
    };


    if (this.salesForm.valid) {
      this.sale.addSale(this.salesForm.value).subscribe({
        next: (res => {
          console.log("DONE!")
        }),
        error: (err) => {
          alert(err.error.message)
          console.log("ERROR")
        }
      })
    }
    else {
      this.validateAll(this.salesForm);
      console.log("Error de formulario");
    }

    console.log('Datos del carrito:', this.salesForm.value);
    // console.log('Datos de dirección:', direccion);
  }

  subtotal(first: any, second: any) {
    var sub = first * second;
    return sub;
  }


  emptyShoppingCar() {
    localStorage.clear();
    this.listShoppingCar = [];

  }


}
