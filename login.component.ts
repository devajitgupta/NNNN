
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Login } from '../login';
import { ServicesService } from '../services.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  datasaved = false;
  message!: string;
  status!:string;

  constructor(private formbuilder: FormBuilder, private api: ServicesService) { }

  ngOnInit(): void {
    this.setFormState();
  }
  setFormState(): void {
    this.loginForm = this.formbuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit() {
    
    let userinfo = this.loginForm.value;
    this.userLogin(userinfo);
    this.loginForm.reset();
  }
  userLogin(logininfo:Login) {
    this.api.userlogin(logininfo).subscribe(
      (resResult) =&gt; {
       let resp=JSON.stringify(resResult);
       console.log(resp);
        this.datasaved = true;
        this.message = resResult['msg'];
        this.status = resResult['status'];
        if(resResult['status']=='success'){
        localStorage.setItem('Loginuser',resp)
        }else{
          localStorage.removeItem('Loginuser');
        }
       this.loginForm.reset();
      }
    )
  }

}
