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
export class FormData {
  selectedCountry: string;
  selectedState: string;
  selectedCity: string;
}

interface Resp {
  auth_token: any;
}
interface Countries {
  country_name: any;
  country_short_name: any;
  country_phone_code: any
}

interface States {
  state_name: any
}

interface Cities {
  city_name: any
}


@Component({
  selector: 'app-shopping-car',
  templateUrl: './shopping-car.component.html',
  styleUrls: ['./shopping-car.component.css']
})



export class ShoppingCarComponent implements AfterViewInit {
  formData: FormData = new FormData();

  @ViewChild('cardInfo') cardInfo: ElementRef;
  cardError: String;
  card: any;




  // carrito de compras
  private items: { id: number; cantidad: number }[] = [];
  listShoppingCar: any[] = [];
  carrito: any[] = [];
   //Get Location

  countriesResponse: string[] =[];
  stateResponse: string[] =[];
  citiesResponse:string[] =[];


 selectedCountry: any; 
 selectedState:any;
  selectedCity:any;
   //Variables de la venta
   street: any;
   number: any;
   colony: any;
   zip_code: any;

  mostrarFormularioDos: boolean = false;

  formularioUnoForm: FormGroup;

  

  constructor(private ngZone: NgZone, private sales: SalesService,private formBuilder: FormBuilder) {
    // this.formularioUnoForm = this.formBuilder.group({
    //   street: ['', Validators.required],
    //   number: ['', Validators.required],
    //   colony: ['', Validators.required],
    //   zip_code: ['', Validators.required],
    //   selectCountry: ['', Validators.required],
    //   selectState: ['', Validators.required],
    //   municipality: ['', Validators.required],
   
    // });
  }

  ngAfterViewInit(): void {
    this.card = elements.create('card');
    this.card.mount(this.cardInfo.nativeElement);
    this.card.addEventListener('change', this.onChange.bind(this));
    // this.getCountries();

  }

  validateNotEmpty(value: string): boolean {
    return value && value.trim() !== '';
  }

  validateSelected(value: string): boolean {
    return value && value !== 'Selecciona una opción';
  }

  // Función para validar el código postal
  validateZipCode(value: string): boolean {
    // Puedes agregar una lógica más específica si es necesario
    return /^[0-9]{5}$/.test(value);
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

                const formularioValues = {
                  street: this.street,
                  number: this.number,
                  colony: this.colony,
                  zip_code: this.zip_code,
                  // selectedCountry: this.selectedCountry,
                  state: this.selectedState,
                  municipality: this.selectedCity,
                  paymentIntent: complete.paymentIntent,
                  items: items
                };
  
                console.log(formularioValues);
  
                this.callValidateCheckTwo(complete);
                this.callFillForm(formularioValues)
  
                Swal.fire({
                  title: "¡Gracias por tu compra!",
                  width: 450,
                  padding: "3em",
                  color: "#E20D77",
                  background: "#fff url(/assets/img/fondoPerros.png)",
                  backdrop: `
                    #f2b1d1
                    url("/assets/img/finishShop.gif")
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
        // console.log("DONE!!!!!", res);
      },
      error: (error) => {
        console.log("Error en validateCheckTwo:", error);
        // Aquí puedes agregar código adicional para registrar el error o manejarlo de otra manera.
      }
    });
  }

  callFillForm(data1){
    this.sales.addSale(data1).subscribe({
      next: (res) => {
        // console.log("DONE!!!!!", res);
      },
      error: (error) => {
        console.log("Error en validateCheckTwo:", error);
        // Aquí puedes agregar código adicional para registrar el error o manejarlo de otra manera.
      }
    });
  }


  // getCountries() {
  //   this.sales.getLocation().subscribe(
  //     (response: Resp) => {
  //       this.sales.getCountry(response.auth_token).subscribe(
  //         (countries: Countries[]) => {
  //           this.countriesResponse = countries.map((country) => country.country_name);
  //         },
  //         (error) => {
  //           console.log(error);
  //         }
  //       );
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }

    onCountryChange() {
        this.sales.getLocation().subscribe(
          (response: Resp) => {
            this.sales.getStates(response.auth_token).subscribe(
              (states: States[]) => {
                this.stateResponse = states.map((state) => state.state_name);
              },
              (error) => {
                console.log(error);
              }
            );
          },
          (error) => {
            console.log(error);
          }
        );
      
    }
    
    // onStateChange() {
    //   if (this.selectedCountry && this.selectedState) {
    //     // console.log('Selected Country:', this.selectedCountry);
    //     // console.log('Selected State:', this.selectedState);
    
    //     this.sales.getLocation().subscribe(
    //       (response: Resp) => {
    //         // console.log('Response from getLocation:', response);
    
    //         this.sales.getCities(response.auth_token, this.selectedCountry).subscribe(
    //           (cities: Cities[]) => {
    //             console.log('Cities received:', cities);
    
    //             // Verifica que cities tenga datos
    //             if (cities && cities.length > 0) {
    //               // console.log('Updating cities in component:', cities);
    //               this.citiesResponse = cities.map((city) => city.city_name);
    //             } else {
    //               console.log('No cities received from the service.');
    //             }
    //           },
    //           (error) => {
    //             console.log('Error getting cities:', error);
    //           }
    //         );
    //       },
    //       (error) => {
    //         console.log('Error getting location:', error);
    //       }
    //     );
    //   } else {
    //     this.citiesResponse = [];
    //   }
    // }
  


  ngOnInit(): void {
    this.loadShoppingCart();
    this.onCountryChange();
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