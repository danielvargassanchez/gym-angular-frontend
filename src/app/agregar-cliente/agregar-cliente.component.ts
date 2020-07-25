import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireStorage, AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { MensajesService } from '../services/mensajes.service';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.scss']
})
export class AgregarClienteComponent implements OnInit {

  form: FormGroup;
  porcentajeSubida: number = 0;
  imgUrl: string = "";
  imagenSubida: boolean = false;
  editable: boolean = false;
  id:string="";
  constructor(private fbForm: FormBuilder, private storage: AngularFireStorage,
    private db: AngularFirestore, private ruta: ActivatedRoute,
    private msg:MensajesService) {

  }

  ngOnInit(): void {


    this.form = this.fbForm.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', Validators.compose([Validators.required, Validators.email])],
      cedula: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', Validators.required],
      imgUrl: ['', Validators.required]
    })
    this.id = this.ruta.snapshot.params.clienteID;

    if (this.id != undefined) {
      this.editable=true;
      this.db.doc<any>(`clientes/${this.id}`).valueChanges().subscribe((cliente) => {
        console.log(cliente);
        this.form.setValue({
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          correo: cliente.correo,
          cedula: cliente.cedula,
          fechaNacimiento: new Date(cliente.fechaNacimiento.seconds * 1000).toISOString().substring(0, 10),
          telefono: cliente.telefono,
          imgUrl: ''
        })

        this.imgUrl = cliente.imgUrl;
      })
    }




  }

  agregar() {
    this.form.value.imgUrl = this.imgUrl;
    this.form.value.fechaNacimiento = new Date(this.form.value.fechaNacimiento);
    this.db.collection('clientes').add(this.form.value).then((termino) => {
      this.msg.mensajeOk("Agregado","Se agregó correctamente");
    });
  }

  subirImagen(event) {
    if (event.target.files.length > 0) {
      this.imagenSubida = false;
      let nombre = new Date().getTime().toString();
      let file = event.target.files[0];
      let extension = file.name.toString().substring(file.name.toString().lastIndexOf("."))

      let ruta = `clientes/${nombre}${extension}`;
      const referencia = this.storage.ref(ruta);
      const tarea = referencia.put(file);
      tarea.then((objeto) => {
        referencia.getDownloadURL().subscribe((url) => {
          this.imgUrl = url;
        })
      })

      tarea.percentageChanges().subscribe((porcentaje) => {
        this.porcentajeSubida = parseInt(porcentaje.toString());
        if (this.porcentajeSubida == 100) {
          this.imagenSubida = true;
        }
      })
    }
  }


  editar() {
    this.form.value.imgUrl=this.imgUrl;
    this.form.value.fechaNacimiento= new Date(this.form.value.fechaNacimiento);
    this.form.value

    this.db.doc(`clientes/${this.id}`).update(this.form.value).then(()=>{
      this.msg.mensajeOk("Editado","Se editó correctamente");
    }).catch(()=>{
      this.msg.mensajeError("Error","Error al actualizar el dato");
    })
  }

}
