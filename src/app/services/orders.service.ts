import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { loadStripe } from '@stripe/stripe-js';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(private http: HttpClient) { }

  stripePromise = loadStripe(environment.stripe_pk);

  getOrderDetail(id: any): Observable<any> {
    return this.http.get(environment.url + "/sales" + id);
  }

  async createPaymentIntent(amount: any) {
    const stripe = await this.stripePromise;
    // Realiza una solicitud a tu servidor para crear un PaymentIntent en Stripe
    const response = await fetch('URL_DE_TU_API_PARA_CREAR_PAYMENT_INTENT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amount }),
    });

    // Procesa la respuesta de la API de Stripe
    const data = await response.json();

    if (data.error) {
      throw new Error(data.error);
    }

    return data.paymentIntent;
  }



}




