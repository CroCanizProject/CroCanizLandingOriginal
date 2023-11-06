import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompanyInformationService {

  constructor(private http:HttpClient) { }


  // url:string="https://backend.crocainz.live/api/companyinformation"


  getGeneralInformation(): Observable<any> {
    return this.http.get(environment.url  + "companyinformation");
  }


  sendContact(data:any): Observable<any> {
    return this.http.post(environment.url  + "contact", data);
  }
  
}
