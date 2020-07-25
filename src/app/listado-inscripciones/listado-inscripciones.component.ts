import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Inscripcion } from '../models/inscripcion';

@Component({
  selector: 'app-listado-inscripciones',
  templateUrl: './listado-inscripciones.component.html',
  styleUrls: ['./listado-inscripciones.component.scss']
})
export class ListadoInscripcionesComponent implements OnInit {

  inscripciones: any[] = [];
  constructor(private db: AngularFirestore) { }

  ngOnInit(): void {
    this.inscripciones.length = 0;
    this.db.collection('inscripciones').get().subscribe((result) => {
      result.forEach((item) => {
        let inscripcionObtenida = item.data();
        inscripcionObtenida.fecha= new Date(inscripcionObtenida.fecha.seconds * 1000);
        inscripcionObtenida.fechaFinal= new Date(inscripcionObtenida.fechaFinal.seconds * 1000);
        inscripcionObtenida.id = item.id;
        this.db.doc(item.data().cliente.path).get().subscribe((cliente) => {
          inscripcionObtenida.clienteObtenido = cliente.data();
          this.inscripciones.push(inscripcionObtenida);
        })
      })
    })
  }

}
