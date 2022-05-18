import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  onForgetPassword(): void {
    console.log("Forget Password");
    this.router.navigateByUrl('/auth/forget-password');
  }

  submitForm(): void {
    console.log("Submit Form", this.loginForm);
    const params = {
      "userName": this.loginForm.value.userName,
      "password": this.loginForm.value.password
    }

    this.authService.login(params)
      .subscribe((response: any) => {
        if (response.status === "success") {
          localStorage.setItem('token', response.data.token.toString());
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.router.navigateByUrl('/app/dashboard');
        }
      })
  }

  onSignUp(): void {
    console.log("Sign Up");
    this.router.navigateByUrl('/auth/registration');
  }
}
