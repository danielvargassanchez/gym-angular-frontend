import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form:FormGroup;
  correcto:boolean=true;
  textoError:string="";
  constructor(private fbForm:FormBuilder, private auth:AngularFireAuth,
    private spinner: NgxSpinnerService) { 

  }

  ngOnInit(): void {
    this.form=this.fbForm.group({
      password:['',Validators.required],
      email:['',Validators.compose(
        [Validators.required,Validators.email]
      )]
    });
  }

  ingresar(){
    if(this.form.valid){
      this.spinner.show();
      this.correcto=true;
    this.auth.signInWithEmailAndPassword(this.form.value.email, this.form.value.password)
    .then((usuario)=>{
      console.log(usuario);
      this.spinner.hide();
    }).catch((error)=>{
      this.correcto=false;
      this.textoError=error.message;
      this.spinner.hide();
    });
    }else{
      this.correcto=false;
      this.textoError="Ingrese todos los datos"
    }
  }


}
