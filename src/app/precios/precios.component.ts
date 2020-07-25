import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { MensajesService } from '../services/mensajes.service';
import { Precio } from '../models/precio';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html',
  styleUrls: ['./precios.component.scss']
})
export class PreciosComponent implements OnInit {

  form: FormGroup;
  precios: Array<Precio> = new Array<Precio>();
  esEditar: boolean = false;
  idEditar: string = "";

  constructor(private fbForm: FormBuilder, private db: AngularFirestore,
    private msg: MensajesService) {
  }

  ngOnInit(): void {
    this.form = this.fbForm.group({
      nombre: ['', Validators.required],
      costo: ['', Validators.required],
      duracion: ['', Validators.required],
      tipoDuracion: ['', Validators.required]
    })

    this.mostrarPrecios();
  }

  agregar() {
    this.db.collection<Precio>('precios').add(this.form.value).then(() => {
      this.msg.mensajeOk("Agregado", "Agregado correctamente");
      this.form.reset()
    }).catch(() => {
      this.msg.mensajeError("Error", "Ocurrió un error");
    })
    this.mostrarPrecios();
  }

  mostrarPrecios() {
    this.precios.length=0;
    this.db.collection('precios').get().subscribe((precios) => {
      precios.docs.forEach((dato) => {
        let precio = dato.data() as Precio;
        precio.id = dato.id;
        precio.ref = dato.ref;

        this.precios.push(precio);
      })
    })
  }

  editar() {
    this.db.doc('precios/' + this.idEditar).update(this.form.value).then(() => {
      this.msg.mensajeOk("Editado", "Mensaje editado correctamente")
      this.form.reset;
      this.esEditar = false;
      this.idEditar = "";
      this.mostrarPrecios();
    }).catch(() => {
      this.msg.mensajeError("Error", "Ocurrió un error al editar");
    })
  }


  editarPrecio(precio: Precio) {
    this.esEditar = true;
    this.idEditar = precio.id;
    this.form.setValue({
      nombre: precio.nombre,
      costo: precio.costo,
      duracion: precio.duracion,
      tipoDuracion: precio.tipoDuracion
    })
  }
}
