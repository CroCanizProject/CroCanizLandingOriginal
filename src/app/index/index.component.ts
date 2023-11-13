import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CompanyInformationService } from '../services/company-information.service';
import { ProductsService } from '../services/products.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {

  constructor(private fb: FormBuilder, private generalI: CompanyInformationService, private productos: ProductsService) { }

  data: any;
  threeProducts: any;
  contactForm!: FormGroup;

  ngOnInit() {


    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
    })

    this.generalI.getGeneralInformation().subscribe((response) => {
      this.data = response.data
    });

    this.productos.getThreeProducts().subscribe((response) => {
      this.threeProducts = response.data
    });
  }


  onCreateContact() {
    if (this.contactForm.valid) {
      Swal.fire({
        title: '¿Estas seguro de enviar los datos?',
        text: "No se podrá revertir el proceso",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Enviar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.generalI.sendContact(this.contactForm.value).subscribe({
            next: (res => {
              Swal.fire(
                '¡Comentario enviado con éxito!',
                'Muchas gracias por tus datos: ',
                'success'
              )
            }),
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Parece que hubo un error',
                footer: 'Inténtalo de nuevo'
              })
            }
          })
        }
      })
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Parece que aún no has llenado algunos campos',
      })
    }
  }

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




}
