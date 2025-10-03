import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../../core/services/login-service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  constructor(private _loginService:LoginService,private _router:Router) {}
  public loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      this._loginService.userLogin(this.loginForm.value).subscribe((data:any)=>{
        sessionStorage.setItem('token',data.accessToken),
        this._router.navigate(['dashboard'])
      },(err)=>{
        console.log(err)
        alert(err.message)})
      this.loginForm.reset();
     
    } else {
      console.log('Form Invalid');
      this.loginForm.markAllAsTouched();
    }
  }
  get f() {
    return this.loginForm.controls;
  }
}
