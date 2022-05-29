import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: any = FormGroup;
  passwordVisible: any = false;
  paramsFromParent: any;
  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService, private notification: NzNotificationService,
    private messageService: NzMessageService) {
    const routeParams: any = this.router.getCurrentNavigation();
    this.paramsFromParent = routeParams.extras.state;
  }

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      password: [null, [Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
      confirmPassword: [null, [Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
    })
  }

  submitForm() {
    console.log("Params: ", this.paramsFromParent)
    if (this.resetPasswordForm.value.password === this.resetPasswordForm.value.confirmPassword) {
      this.authService.resetPassword({
        "otpId": this.paramsFromParent.opt_id,
        "otp": this.paramsFromParent.otp,
        "password": this.resetPasswordForm.value.password
      })
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.notification.create('success', "Password reset successfully", '');
            this.router.navigate(["auth"]);
          } else if (res.status === "error") {
            this.messageService.error(res.message);
          }
        })
    } else {
      this.messageService.error("Password does not match. Please try again.");
    }

  }
}
