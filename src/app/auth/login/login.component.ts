import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onForgetPassword(): void {
    console.log("Forget Password");
    this.router.navigateByUrl('/auth/forget-password');
  }

  submitForm(): void {
    console.log("Submit Form");
  }

  onSignUp(): void {
    console.log("Sign Up");
    this.router.navigateByUrl('/auth/registration');
  }
}
