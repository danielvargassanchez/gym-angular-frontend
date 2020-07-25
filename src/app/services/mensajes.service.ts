import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class MensajesService {

  constructor() {

  }

  mensajeError(title:string, text:string) {
    Swal.fire({
      title: title,
      text: text,
      icon: "error"
    })
  }

  mensajeOk(title:string, text:string) {
    Swal.fire({
      title: title,
      text: text,
      icon: "success"
    })
  }

  mensajeAdvertencia(title:string, text:string) {
    Swal.fire({
      title: title,
      text: text,
      icon: "warning"
    })
  }
}
