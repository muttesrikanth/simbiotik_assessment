import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
   constructor(private http:HttpClient){}

  userLogin(data:any){
    return this.http.post('https://du-test-api.simbiotiktech.in/users/login',data)
  }
}
