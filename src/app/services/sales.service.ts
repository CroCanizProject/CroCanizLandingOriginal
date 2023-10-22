import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http:HttpClient) { }


  url:string="https://backend.crocainz.live/api/"


  addSale(data:any){
    return this.http.post(this.url+"sales",data)
  }



}
