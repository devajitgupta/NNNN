import { Component } from '@angular/core';
import { ServicesService } from './services.service';
import { Router } from '@angular/router';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms'
import { User } from './user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private apiServices:ServicesService,
    private fb:FormBuilder
    ,
    private router:Router){}
  title = 'app';

  regForm!: FormGroup;
  User: User[] = [];
  res:any;
  isEditMode=false;
  
  ngOnInit(): void {
    this.mainForm();
      this.getUser();
      this.setForm();
  }
  setValue(){
    
  }

  mainForm() {
    this.regForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]

    })
  }
  onSubmit(userId:any){
    if(this.isEditMode){
      console.log(userId)
      
      this.apiServices.updateUser(userId,this.regForm.value).subscribe((res)=>{
        this.setValue();
      })

      
    }else{
      console.log("1st")
      
      this.apiServices.addUser(this.regForm.value).subscribe(
        () => {
          this.regForm.reset();
          this.getUser();
  
  
        }
      )

    }

  }

  onSsubmit() {

    console.log("submit formdata" + this.regForm)
    this.apiServices.addUser(this.regForm.value).subscribe(
      () => {
        this.regForm.reset();
        this.getUser();


      }
    )
  }
  onEdit(userId:User){
    this.apiServices.selectedUser=userId;
    this.isEditMode=true;
    this.regForm.setValue({
      name:userId.name,
      email:userId.email,
      password:userId.password
    })


    console.log(userId)

  }

  // -- reset form
  setForm() {
    this.apiServices.selectedUser = {
      id: "",
      name: "",
      email: "",
      password: ""
    }
  }

  // -- get single data of user
  getSingleUser(id:string){
    this.apiServices.getUser(id).subscribe(data=>{
      this.res=data;
    })

  }

  //-- get all data 
  getUser() {
    this.apiServices.getUsers()
      .subscribe(data => {
        this.User = data;
        console.log(this.User)
      })
  }


  //------ delete user
  onDelete(id: string, i: any) {
    if (window.confirm('do you want to delete data')) {
      console.log("deleted data " + id);
      this.apiServices.deleteUser(id).subscribe(data => {
        this.User.splice(i, 1);
      });
    }







    //--- on edit 

  }
}
