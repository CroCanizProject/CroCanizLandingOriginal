import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyInformationService {

  constructor(private http:HttpClient) { }


  url:string="https://backend.crocainz.live/api/companyinformation"


  getGeneralInformation(): Observable<any> {
    return this.http.get(this.url);
  }
  
}
