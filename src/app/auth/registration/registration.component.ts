import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ModelsComponent } from 'src/app/main/models/models.component';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CountryService } from 'src/app/services/country.service';


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
  countryList: any[] = [];

  isModalVisible: any = false;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private router: Router,
    private messageService: NzMessageService,
    private authService: AuthService, private notification: NzNotificationService,
    private countryService: CountryService,
    private modalService: NzModalService) { }

  ngOnInit(): void {
    this.countryList = this.countryService.getCountryList();

    this.authService.getUserCurrentCountry()
      .subscribe((res: any) => {
        let country = this.countryList.find(function (item) {
          return item.code == res.data;
        })

        if (country) {
          this.registrationForm.patchValue({
            phoneNumberPrefix: country.dial_code
          });
        }
      })


    this.registrationForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required, Validators.minLength(6)]],
      phoneNumberPrefix: [null, [Validators.required]],
      phone: [null, [Validators.required]],
    });

    this.organizationForm = this.fb.group({
      companyName: [null, [Validators.required]],
      jobRole: [null, [Validators.required]],
      companySize: [null, [Validators.required]],
      industry: [null, [Validators.required]],
      orgAck: [null, [Validators.required]]
    });

    // let locale: String = Intl.DateTimeFormat().resolvedOptions().locale;
    // if (locale) {
    //   let countryCode = locale.split("-")[1];
    //   let country = this.countryList.find(function (item) {
    //     return item.code == countryCode;
    //   })

    //   if (country) {
    //     this.registrationForm.patchValue({
    //       phoneNumberPrefix: country.dial_code
    //     });
    //   }

    // }

  }

  pre(): void {
    this.activedStep -= 1;
  }

  next(): void {
    this.activedStep += 1;
  }

  done(): void {
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
        "email": this.registrationForm.value.email
      }

      this.authService.register(params)
        .subscribe((response: any) => {
          if (response.status === "success") {
            this.notification.create(
              'success',
              response.message,
              ''
            );
            this.otp_id = response.data;
            this.isModalVisible = true;
          } else {
            this.messageService.error(response.message);
          }
        })
    }
  }

  planChange(value: string): void {
    // console.log("Value: ", value);
  }

  onOtpChange(event: any): void {
    this.otp = event;
  }

  closeOTPModal(): void {
    this.isModalVisible = false;
  }

  onLogin(): void {
    this.router.navigateByUrl("/auth")
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  onOtpDone(): void {
    const params = {
      "otp_id": this.otp_id,
      "otp": this.otp
    }
    this.authService.verifyOtp(params)
      .subscribe((response: any) => {
        if (response.status === "success") {
          // this.notification.create('success', response.message, '');
          const drawerRef = this.modalService.create<ModelsComponent>({
            nzTitle: '',
            nzContent: ModelsComponent,
            nzWidth: 444,
            nzFooter: null,
            nzComponentParams: {
              modelType: "registration",
              modelTitle: "Thank you for your registration",
              modelSubTitle: "you can now login to proceed"
            }
          });

          drawerRef.afterClose.subscribe((data: any) => {
            if (data === true) {
              this.isModalVisible = false;
              this.router.navigateByUrl("/auth");
            }
          })
        } else if (response.status === "error") {
          this.notification.create('error', response.message, '');
        }
      })
  }
}
