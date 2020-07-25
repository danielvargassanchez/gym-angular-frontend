import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-listado-clientes',
  templateUrl: './listado-clientes.component.html',
  styleUrls: ['./listado-clientes.component.scss']
})
export class ListadoClientesComponent implements OnInit {

  form:FormGroup;
  Clientes:any[]= new Array<any>();
  constructor(private fbForm:FormBuilder,private db: AngularFirestore) { 
  }

  ngOnInit(): void {
    this.form=this.fbForm.group({
      buscar:["",Validators.required  ]
    })


    // this.db.collection('clientes').valueChanges().subscribe((result)=>{
    //   this.Clientes=result;
    // })

    this.Clientes.length=0;
    this.db.collection('clientes').get().subscribe((result)=>{
      console.log(result.docs);

      result.docs.forEach((item)=>{
        //la data son los atributos del objeto
        let cliente=item.data();
        //id de firebase
        cliente.id=item.id;
        //ref hace referencia al objeto para despues hacerle una relacion en otra tabla
        cliente.ref=item.ref;

        this.Clientes.push(cliente);
      })

 
    })
  }

}
