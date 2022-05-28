import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: any = FormGroup;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService, private notification: NzNotificationService) { }

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
    const params = {
      "userName": this.loginForm.value.userName,
      "password": this.loginForm.value.password
    }

    this.authService.login(params)
      .subscribe((response: any) => {
        if (response.status === "success") {
          localStorage.setItem('token', response.data.token.toString());
          localStorage.setItem('user', JSON.stringify(response.data.user));
          this.notification.create('success', response.message, '');
          this.router.navigateByUrl('/app/dashboard');
        } else if (response.status === "error") {
          this.notification.create('error', response.message, '');
        }
      })
  }

  onSignUp(): void {
    this.router.navigateByUrl('/auth/registration');
  }
}
