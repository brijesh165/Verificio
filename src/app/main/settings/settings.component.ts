import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { environment } from 'src/environments/environment';
import { CountryService } from 'src/app/services/country.service';
import { User } from 'src/app/models/User';

import { NzIconService } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  notificationList: any = [
    {
      item: "Allow anonymous rate",
      status: false
    },
    {
      item: "Allow admin to create survey",
      status: false
    },
    {
      item: "Allow admin to delete user",
      status: false
    },
    {
      item: "Allow admin to pay for subscription ",
      status: false
    },
    {
      item: "Manage Employee Notifications",
      status: false
    },
    {
      item: "Allow head admin create report",
      status: false
    }
  ];

  authenticatedUser: User;
  changePasswordForm: any = FormGroup;
  profileForm: any = FormGroup;
  businessInfoForm: any = FormGroup;
  socialMedialForm: any = FormGroup;
  profileImagePath: any = "";
  uploadFileName: any = '';

  isEdit: any = true;
  isBusinessEdit: any = true;
  isSocialEdit: any = true;

  passwordVisible = false;
  isChangesPending = false;
  countryList: any[] = [];

  constructor(private fb: FormBuilder, private authService: AuthService,
    private countryService: CountryService,
    private dataService: DataService, private message: NzMessageService,
    private iconService: NzIconService) {
    this.iconService.fetchFromIconfont({
      scriptUrl: 'https://at.alicdn.com/t/font_8d5l8fzk5b87iudi.js'
    });
  }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'))

    this.countryList = this.countryService.getCountryList();

    this.changePasswordForm = this.fb.group({
      currPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
      reNewPassword: [null, [Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]]
    })

    this.profileForm = this.fb.group({
      firstName: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      lastName: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      email: [{ value: null, disabled: true }, [Validators.required]],
      phoneNumberPrefix: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      phone: [{ value: null, disabled: this.isEdit }, [Validators.required, Validators.maxLength(10)]],
      address: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      state: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      country: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      stateOfOrigin: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      lga: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      dateOfBirth: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      gender: [{ value: null, disabled: this.isEdit }, [Validators.required]]
    })

    this.businessInfoForm = this.fb.group({
      name: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      regNo: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      compEmail: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      businessPhoneNumberPrefix: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      phone: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required, Validators.maxLength(10)]],
      address: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      state: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      country: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      stateOfOrigin: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      lga: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      industry: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
      numberOfStaff: [{ value: null, disabled: this.isBusinessEdit }, [Validators.required]],
    })

    this.socialMedialForm = this.fb.group({
      linkedIn: [{ value: null, disabled: this.isSocialEdit }, [Validators.pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)]],
      youtube: [{ value: null, disabled: this.isSocialEdit }, [Validators.pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)]],
      instagram: [{ value: null, disabled: this.isSocialEdit }, [Validators.pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)]],
      facebook: [{ value: null, disabled: this.isSocialEdit }, [Validators.pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)]],
      twitter: [{ value: null, disabled: this.isSocialEdit }, [Validators.pattern(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)]],
      // pinterest: [{ value: null, disabled: this.isSocialEdit }]
    })

    this.getEmployeeDetails();
    this.getBusinessInfo();
  }

  getEmployeeDetails() {
    let userInfo = JSON.parse(localStorage.getItem("user") || '{}');
    this.authService.me()
      .subscribe((res: any) => {
        // console.log("Response: ", res);
        if (res.data.changedData != null) {
          this.isChangesPending = true;
        }
        res.data = { ...res.data, ...res.data.changedData };

        this.profileForm.patchValue({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phoneNumberPrefix: res.data.countryCode,
          phone: res.data.phoneNo,
          address: res.data.address?.address,
          state: res.data.address?.state,
          country: res.data.address?.country,
          stateOfOrigin: res.data.address?.stateOfOrigin,
          lga: res.data.address?.lga,
          dateOfBirth: res.data.dob ? moment(res.data.dob).toDate() : null,
          gender: res.data.gender
        })

        this.socialMedialForm.patchValue({
          linkedIn: res.data?.socials?.linkedin,
          youtube: res.data?.socials?.youtube,
          instagram: res.data?.socials?.instagram,
          facebook: res.data?.socials?.facebook,
          twitter: res.data?.socials?.twitter,
        })

        this.profileImagePath = res.data.profilePicture && `${environment.apiUrl}/${res.data.profilePicture}`
      })
  }

  getBusinessInfo() {
    this.dataService.getCompanyById(this.authenticatedUser.companyId)
      .subscribe((res: any) => {
        this.businessInfoForm.patchValue({
          name: res.data?.name,
          regNo: res.data?.registrationNo,
          compEmail: res.data?.email,
          businessPhoneNumberPrefix: res.data?.countryCode,
          phone: res.data?.phoneNo,
          address: res.data.address?.address,
          state: res.data.address?.state,
          country: res.data.address?.country,
          stateOfOrigin: res.data.address?.stateOfOrigin,
          lga: res.data.address?.lga,
          industry: res.data?.industry,
          numberOfStaff: res.data?.employees
        })
      })
  }

  onSwitchClick(index: any): void {
    this.notificationList[index].status = !this.notificationList[index].status
  }

  submitForm(): void {
    if (this.changePasswordForm.value.newPassword === this.changePasswordForm.value.reNewPassword) {
      const params = {
        "password": this.changePasswordForm.value.newPassword,
        "current_password": this.changePasswordForm.value.currPassword
      }

      this.authService.changePassword(params)
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.message.create('success', res.message);
          } else if (res.status === "error") {
            this.message.create('error', res.message);
          }
        })
    }
  }

  handleUpload = (item: any): any => {
    const formData = new FormData();
    formData.append("image", item.file);
    this.authService.uploadProfilePicture(formData)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.message.create('success', res.message);
          this.getEmployeeDetails();
        } else if (res.status === "error") {
          this.message.create('error', res.message);
        }
      })
  }

  handleBusinessUpload = (item: any): any => {
    const formData = new FormData();
    formData.append("proof", item.file);
    this.dataService.uploadCompanyProof({ id: this.authenticatedUser.companyId, formData: formData })
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.message.create('success', res.message);
          this.getEmployeeDetails();
        } else if (res.status === "error") {
          this.message.create('error', res.message);
        }
      })
  }

  beforeUpload = (file: NzUploadFile): any => {
    this.uploadFileName = file.name;
    return true;
  }

  submitProfileForm(): void {
    const params = {
      "firstName": this.profileForm.value.firstName,
      "lastName": this.profileForm.value.lastName,
      "dob": moment(this.profileForm.value.dateOfBirth).toISOString(),
      "address": {
        "address": this.profileForm.value.address,
        "state": this.profileForm.value.state,
        "stateOfOrigin": this.profileForm.value.stateOfOrigin,
        "lga": this.profileForm.value.lga
      },
      "phoneNo": this.profileForm.value.phone,
      "countryCode": this.profileForm.value.phoneNumberPrefix,
      "gender": this.profileForm.value.gender
    };
    this.dataService.updateProfile(params)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.message.create('success', res.message);
          this.handleEdit();
          this.getEmployeeDetails();
        } else if (res.status === "error") {
          this.message.create('error', res.message);
        }
      })
  }

  submitBusinessForm(): void {
    const params = {
      companyId: this.authenticatedUser.companyId,
      name: this.businessInfoForm.value.name,
      registrationNo: this.businessInfoForm.value.regNo,
      email: this.businessInfoForm.value.compEmail,
      countryCode: this.businessInfoForm.value.businessPhoneNumberPrefix,
      phoneNo: this.businessInfoForm.value.phone,
      address: {
        address: this.businessInfoForm.value.address,
        state: this.businessInfoForm.value.state,
        stateOfOrigin: this.businessInfoForm.value.stateOfOrigin,
        lga: this.businessInfoForm.value.lga,
      },
      industry: this.businessInfoForm.value.industry,
      employees: this.businessInfoForm.value.numberOfStaff
    };
    this.dataService.updateBusinessProfile(params)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.message.create('success', res.message);
          this.handleBusinessEdit();
          this.getBusinessInfo();
        } else if (res.status === "error") {
          this.message.create('error', res.message);
        }
      })
  }

  submitSocialForm(): void {
    const params = {
      socials: {
        "linkedin": this.socialMedialForm.value.linkedIn,
        "youtube": this.socialMedialForm.value.youtube,
        "instagram": this.socialMedialForm.value.instagram,
        "facebook": this.socialMedialForm.value.facebook,
        "twitter": this.socialMedialForm.value.twitter,
        "pinterest": this.socialMedialForm.value.pinterest
      }
    };

    this.dataService.updateProfile(params)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.message.create('success', res.message);
          this.handleSocialEdit();
          this.getEmployeeDetails();
        } else if (res.status === "error") {
          this.message.create('error', res.message);
        }
      })
  }

  handleEdit(): void {
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      this.profileForm.controls['firstName'].enable();
      this.profileForm.controls['lastName'].enable();
      this.profileForm.controls['phoneNumberPrefix'].enable();
      this.profileForm.controls['phone'].enable();
      this.profileForm.controls['address'].enable();
      this.profileForm.controls['state'].enable();
      this.profileForm.controls['country'].enable();
      this.profileForm.controls['stateOfOrigin'].enable();
      this.profileForm.controls['lga'].enable();
      this.profileForm.controls['dateOfBirth'].enable();
      this.profileForm.controls['gender'].enable();
    } else {
      this.profileForm.controls['firstName'].disable();
      this.profileForm.controls['lastName'].disable();
      this.profileForm.controls['phoneNumberPrefix'].disable();
      this.profileForm.controls['phone'].disable();
      this.profileForm.controls['address'].disable();
      this.profileForm.controls['state'].disable();
      this.profileForm.controls['country'].disable();
      this.profileForm.controls['stateOfOrigin'].disable();
      this.profileForm.controls['lga'].disable();
      this.profileForm.controls['dateOfBirth'].disable();
      this.profileForm.controls['gender'].disable();
    }
  }

  handleBusinessEdit(): void {
    this.isBusinessEdit = !this.isBusinessEdit;

    if (!this.isBusinessEdit) {
      this.businessInfoForm.controls['name'].enable();
      this.businessInfoForm.controls['regNo'].enable();
      this.businessInfoForm.controls['compEmail'].enable();
      this.businessInfoForm.controls['businessPhoneNumberPrefix'].enable();
      this.businessInfoForm.controls['phone'].enable();
      this.businessInfoForm.controls['address'].enable();
      this.businessInfoForm.controls['state'].enable();
      this.businessInfoForm.controls['country'].enable();
      this.businessInfoForm.controls['stateOfOrigin'].enable();
      this.businessInfoForm.controls['lga'].enable();
      this.businessInfoForm.controls['industry'].enable();
      this.businessInfoForm.controls['numberOfStaff'].enable();
    } else {
      this.businessInfoForm.controls['name'].disable();
      this.businessInfoForm.controls['regNo'].disable();
      this.businessInfoForm.controls['compEmail'].disable();
      this.businessInfoForm.controls['businessPhoneNumberPrefix'].disable();
      this.businessInfoForm.controls['phone'].disable();
      this.businessInfoForm.controls['address'].disable();
      this.businessInfoForm.controls['state'].disable();
      this.businessInfoForm.controls['country'].disable();
      this.businessInfoForm.controls['stateOfOrigin'].disable();
      this.businessInfoForm.controls['lga'].disable();
      this.businessInfoForm.controls['industry'].disable();
      this.businessInfoForm.controls['numberOfStaff'].disable();
    }
  }

  handleSocialEdit(): void {
    this.isSocialEdit = !this.isSocialEdit;
    if (!this.isSocialEdit) {
      this.socialMedialForm.controls['linkedIn'].enable();
      this.socialMedialForm.controls['youtube'].enable();
      this.socialMedialForm.controls['instagram'].enable();
      this.socialMedialForm.controls['facebook'].enable();
      this.socialMedialForm.controls['twitter'].enable();
      // this.socialMedialForm.controls['pinterest'].enable();
    } else {
      this.socialMedialForm.controls['linkedIn'].disable();
      this.socialMedialForm.controls['youtube'].disable();
      this.socialMedialForm.controls['instagram'].disable();
      this.socialMedialForm.controls['facebook'].disable();
      this.socialMedialForm.controls['twitter'].disable();
      // this.socialMedialForm.controls['pinterest'].disable();
    }
  }
}
