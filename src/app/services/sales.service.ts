import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http:HttpClient) { }


  // url:string="https://backend.crocainz.live/api/"


  addSale(data:any){
    return this.http.post(environment.url+'sales',data)
  }


  validateCheck(data:any){
    return this.http.post(environment.url+'checkout',data)
  }

  second(data:any){
    return this.http.post(environment.url+'checkout/confirm',data)
  }



}
