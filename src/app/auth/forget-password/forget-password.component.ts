import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModelsComponent } from 'src/app/main/models/models.component';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  forgetPasswordForm: any = FormGroup;
  isVisible: any = false;
  otp_id: any = "";
  otp: any = "";

  constructor(public fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private messageService: NzMessageService) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: [null, [Validators.required,Validators.email]],
    });
  }

  submitForm(): void {
    this.authService.forgetPassword(this.forgetPasswordForm.value)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.otp_id = res.data;

          this.isVisible = true;
        } else if (res.status === "error") {
          this.messageService.error(res.message);
        }
      })
  }

  handleCancel() {
    this.isVisible = false;
  }

  onOtpChange(event: any) {
    this.otp = event;
  }

  onOtpDone() {
    if (this.otp) {
      this.authService.passwordVerifyOtp({ "otpId": this.otp_id, "otp": this.otp })
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.isVisible = false;
            this.router.navigate(["/auth/reset-password"], {
              state: { opt_id: this.otp_id, otp: this.otp }
            });
          } else if (res.status === "error") {
            this.messageService.error(res.message);
          }
        })
    }
  }

  onSendAgain(): void {
    this.authService.forgetPassword({ "userName": this.forgetPasswordForm.value.username })
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.otp_id = res.data;
          this.isVisible = true;
        } else if (res.status === "error") {
          this.messageService.error(res.message);
        }
      })
  }
}
