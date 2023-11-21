import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  constructor(private http:HttpClient) { }


  // url:string="https://backend.crocainz.live/api/"
  private apiUrl = 'https://www.universal-tutorial.com/api/getaccesstoken'; 
  private token = 'DOdrhtfoqS798-H0LZQX2zm6kG40xJFud5VuBsncgb08STjKi0b9Z5UTl6p6vNa0MCE'; 
  private userEmail = 'arturo3694587210@gmail.com'
  private countries = 'https://www.universal-tutorial.com/api/countries/'
  private states = 'https://www.universal-tutorial.com/api/states/'
  private cities = 'https://www.universal-tutorial.com/api/cities/'

  addSale(data:any){
    return this.http.post(environment.url+'sales',data)
  }


  validateCheck(data:any){
    return this.http.post(environment.url+'checkout',data)
  }

  second(data:any){
    return this.http.post(environment.url+'checkout/confirm',data)
  }


  getLocation(){
       const headers = new HttpHeaders({
         'Accept': 'application/json',
         'api-token': this.token,
         'user-email': this.userEmail,
       });
       return this.http.get(this.apiUrl, { headers })
     }
         // This api will help us to get the countries
         getCountry(mainToken:any){
       const headers = new HttpHeaders({
         "Authorization": "Bearer " + mainToken,
         "Accept": "application/json"
       });
           return this.http.get(this.countries, { headers })
       
     }
             getStates(mainToken:any, countrie:any){
       const headers = new HttpHeaders({
         "Authorization": "Bearer " + mainToken,
         "Accept": "application/json"
       });
           const url = `${this.states}${countrie}`;
           return this.http.get(url , { headers })
     }
         getCities(mainToken:any, state:any){
       const headers = new HttpHeaders({
         "Authorization": "Bearer " + mainToken,
         "Accept": "application/json"
       });
           const url = `${this.cities}${state}`;
           return this.http.get(url , { headers })
         }



}
