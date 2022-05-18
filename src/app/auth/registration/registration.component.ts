import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  activedStep: any = 0;
  registrationForm: any = FormGroup;
  organizationForm: any = FormGroup;
  otp_id: any = "";
  otp: any = "";

  isModalVisible: any = false;
  isSuccessModalVisible: any = false;

  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      phoneNumberPrefix: ['+91', [Validators.required]],
      phone: [null, [Validators.required]],
      // plan: [null, [Validators.required]],
      regAck: [null, [Validators.required]]
    });

    this.organizationForm = this.fb.group({
      companyName: [null, [Validators.required]],
      jobRole: [null, [Validators.required]],
      companySize: [null, [Validators.required]],
      industry: [null, [Validators.required]],
      orgAck: [null, [Validators.required]]
    })
  }

  pre(): void {
    this.activedStep -= 1;
  }

  next(): void {
    this.activedStep += 1;
  }

  done(): void {
    console.log('Registration Form: ', this.registrationForm.value);
    console.log('Organization Form: ', this.organizationForm.value);

    if (this.registrationForm.valid && this.organizationForm.valid) {
      const params = {
        "firstName": this.registrationForm.value.firstName,
        "lastName": this.registrationForm.value.lastName,
        "designation": this.organizationForm.value.jobRole,
        "phoneNo": this.registrationForm.value.phone,
        "countryCode": this.registrationForm.value.phoneNumberPrefix,
        "companyName": this.organizationForm.value.companyName,
        "employees": this.organizationForm.value.companySize,
        "industry": this.organizationForm.value.industry,
        "password": this.registrationForm.value.password,
        "userName": this.registrationForm.value.userName,
        "email": this.registrationForm.value.email
      }

      this.authService.register(params)
        .subscribe((response: any) => {
          console.log("Response: ", response);
          if (response.status === "success") {
            this.otp_id = response.data;
            this.isModalVisible = true;
          }
        })
    }
  }

  planChange(value: string): void {
    console.log("Value: ", value);
  }

  onOtpChange(event: any): void {
    console.log("Event: ", event);
    this.otp = event;
  }

  onLogin(): void {
    console.log("On Login")
    this.router.navigateByUrl("/auth")
  }

  onOtpDone(): void {
    const params = {
      "otp_id": this.otp_id,
      "otp": this.otp
    }
    this.authService.verifyOtp(params)
      .subscribe((response: any) => {
        if (response.status === "success") {
          this.isModalVisible = false;
          this.isSuccessModalVisible = true;
        }
      })
  }
}
