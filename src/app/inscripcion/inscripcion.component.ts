import { Component, OnInit } from '@angular/core';
import { Inscripcion } from '../models/inscripcion';
import { Cliente } from '../models/cliente';
import { AngularFirestore } from '@angular/fire/firestore';
import { Precio } from '../models/precio';
import Swal from 'sweetalert2';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-inscripcion',
  templateUrl: './inscripcion.component.html',
  styleUrls: ['./inscripcion.component.scss']
})
export class InscripcionComponent implements OnInit {

  inscripcion: Inscripcion = new Inscripcion();
  clienteSeleccionado: Cliente = new Cliente();
  precios: Precio[] = new Array<Precio>();
  precioSeleccionado: Precio = new Precio();
  idPrecio:string="null";

  constructor(private db: AngularFirestore, private msg:MensajesService) { }

  ngOnInit(): void {
    this.db.collection('precios').get().subscribe((result) => {
      result.docs.forEach((item) => {
        let precio = item.data() as Precio;
        precio.id = item.id;
        precio.ref = item.ref;

        this.precios.push(precio)
      })
    })
  }

  asignarCliente(cliente: Cliente) {
    this.inscripcion.cliente = cliente.ref;
    this.clienteSeleccionado = cliente;
  }

  eliminarCliente() {
    this.clienteSeleccionado = new Cliente();
    this.inscripcion.cliente = undefined;
  }

  guardar() {
    if(this.inscripcion.validar().esValido){
      let inscripcionesAdd={
        fecha: this.inscripcion.fecha,
        fechaFinal:this.inscripcion.fechaFinal,
        cliente:this.inscripcion.cliente,
        precios:this.inscripcion.precios,
        subTotal:this.inscripcion.subTotal,
        isv:this.inscripcion.isv,
        total:this.inscripcion.total
      }

      this.db.collection('inscripciones').add(inscripcionesAdd).then((result)=>{
        this.inscripcion=new Inscripcion();
        this.clienteSeleccionado= new Cliente();
        this.precioSeleccionado= new Precio();
        this.idPrecio="null"

        this.msg.mensajeOk("Guardado","Se guardo correctamente")
      })
    }else{
      this.msg.mensajeAdvertencia("Error",this.inscripcion.validar().mensaje)
    }
  }

  seleccionarPrecio(id: string) {
    if (id != "null") {
      this.precioSeleccionado = this.precios.find(x => x.id == id)
      this.inscripcion.precios = this.precioSeleccionado.ref;
      this.inscripcion.fecha = new Date();


      this.inscripcion.subTotal = this.precioSeleccionado.costo;
      this.inscripcion.isv = this.inscripcion.subTotal * 0.16;
      this.inscripcion.total = this.inscripcion.subTotal + this.inscripcion.isv;


      if (this.precioSeleccionado.tipoDuracion == 1) {
        //fecha final= precioSeleccionado.duracion * 1;
        let dias: number = this.precioSeleccionado.duracion;
        let fechaFinal = new Date(this.inscripcion.fecha.getFullYear(),
          this.inscripcion.fecha.getMonth(), this.inscripcion.fecha.getDay() - 2 + dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 2) {
        //fecha final= precioSeleccionado.duracion * 7;
        let dias: number = this.precioSeleccionado.duracion * 7;
        let fechaFinal = new Date(
          this.inscripcion.fecha.getFullYear(),
          this.inscripcion.fecha.getMonth(),
          this.inscripcion.fecha.getDay() - 2 + dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 3) {
        //fecha final= precioSeleccionado.duracion * 15;
        let dias: number = this.precioSeleccionado.duracion * 15;

        let fechaFinal = new Date(
          this.inscripcion.fecha.getFullYear(),
          this.inscripcion.fecha.getMonth(),
          this.inscripcion.fecha.getDay() - 2 + dias);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 4) {
        //fecha final= precioSeleccionado.duracion * un mes;
        let meses = this.precioSeleccionado.duracion;
        let fechaFinal = new Date(
          this.inscripcion.fecha.getFullYear(),
          this.inscripcion.fecha.getMonth() + meses,
          this.inscripcion.fecha.getDay() - 2);
        this.inscripcion.fechaFinal = fechaFinal;
      }
      if (this.precioSeleccionado.tipoDuracion == 5) {
        //fecha final= precioSeleccionado.duracion * año;
        let anios = this.precioSeleccionado.duracion;
        let fechaFinal = new Date(
          this.inscripcion.fecha.getFullYear() + anios,
          this.inscripcion.fecha.getMonth(),
          this.inscripcion.fecha.getDay() - 2);
        this.inscripcion.fechaFinal = fechaFinal;
      }
    }else{
      this.precioSeleccionado= new Precio();
      this.inscripcion.fechaFinal= null;
      this.inscripcion.precios=null;
      this.inscripcion.subTotal=0;
      this.inscripcion.isv=0;
      this.inscripcion.total=0;
    }
  }


}
