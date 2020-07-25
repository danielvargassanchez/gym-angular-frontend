  import { Component } from '@angular/core';
  import { AngularFireAuth } from '@angular/fire/auth';
  import { auth, User } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'MasterGym';
  usuario:User;
  cargando:boolean=true;

  constructor(public auth: AngularFireAuth){
    this.cargando=false;
    this.auth.user.subscribe((user)=>{
      this.usuario=user;
  })
  }

  login() {
    this.auth.signInWithEmailAndPassword("daniel@hotmail.com","28022014");
  }

}
