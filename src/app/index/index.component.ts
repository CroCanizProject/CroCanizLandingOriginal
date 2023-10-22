import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CompanyInformationService } from '../services/company-information.service';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {
  
  constructor(private fb:FormBuilder, private generalI:CompanyInformationService){}

  data: any;

  ngOnInit() {
    this.generalI.getGeneralInformation().subscribe((response)=>{
      this.data = response.data
    });
  
  }




}
