import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './user';
@Injectable({
  providedIn: 'root'
})
export class ServicesService {
  selectedUser!:User;

  delete_url='http://localhost:3000';
  url='http://localhost:3000/user';
  urlupdate='http://localhost:3000';
  allUsersUrl='http://localhost:3000/users';
 
  singleDataUrl='http://localhost:3000';
  private httpOptions={
		headers:new HttpHeaders()
		.set("content-Type", "application/json")
  };


  constructor( private http:HttpClient) { }

  getUsers(): Observable<User[]>{
  	return this.http.get<User[]>(this.allUsersUrl);
  }
  getUser(id:string){
    console.log("get user data")
  	return this.http.get<User>(`${this.singleDataUrl}/${id}`);
  }

  


  addUser(user: any){
  	return this.http.post<any>
  	(this.url,user,this.httpOptions);
  }
  updateUser(user: any,id: String) {
  return this.http.put<any>(
  	`${this.urlupdate}/${id}`,
  	user,
  	this.httpOptions
  	);
}
deleteUser(id:string):Observable<any>{
  return this.http.delete(`${this.delete_url}/${id}`,this.httpOptions);
}




}
