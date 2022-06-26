import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { AuthService } from 'src/app/services/auth.service';
import { CountryService } from 'src/app/services/country.service';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';
import { AdminService } from 'src/app/services/admin.service';

import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  changePasswordForm: any = FormGroup;
  profileForm: any = FormGroup;
  termOfUseForm: any = FormGroup;

  passwordVisible = false;
  isEdit: any = true;

  profileImagePath: any = "";
  uploadFileName: any = '';

  countryList: any[] = [];
  notificationList: any = [
    { item: "Admins Roles settings", status: false },
    { item: "Allow subscribers to downgrade plans", status: false },
    { item: "Allow company owners to resset password", status: false },
    { item: "Allow standard subscribe access custom survey", status: false },
    { item: "Allow standard subscribers to suggest category", status: false },
    { item: "Allow Standard subscriber connect HR softwares", status: false },
    { item: "Allow only premium subscribers recieve whatsapp notification", status: false },
    { item: "Send mails to newly added users by admins or super admins ", status: false },
    { item: "Allow all Subscribers approve profile update", status: false },
    { item: "Activate custom survey form", status: false }
  ];

  public Editor = ClassicEditorBuild;
  config = {
    placeholder: 'Write your terms and condition',
    toolbar: {
      shouldNotGroupWhenFull: true
    },
    image: {
      toolbar: [
        'imageStyle:alignLeft', 'imageStyle:alignCenter', 'imageStyle:alignRight',
        '|',
        'imageStyle:full',
        'imageStyle:side',
        '|',
        'imageTextAlternative'
      ],
      styles: [
        'full',
        'side',
        'alignLeft', 'alignCenter', 'alignRight'
      ],
      resizeOptions: [
        {
          name: 'imageResize:original',
          label: 'Original',
          value: null
        },
        {
          name: 'imageResize:50',
          label: '50%',
          value: '50'
        },
        {
          name: 'imageResize:75',
          label: '75%',
          value: '75'
        }
      ],
    }
  }

  constructor(private fb: FormBuilder, private authService: AuthService,
    private countryService: CountryService, private dataService: DataService,
    private adminService: AdminService,
    private message: NzMessageService) { }

  ngOnInit(): void {
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
    });

    this.termOfUseForm = this.fb.group({
      editorContent: [null, [Validators.required]]
    })


    this.getEmployeeDetails();
    this.getTermsOfUse();
  }

  getEmployeeDetails() {
    this.authService.me()
      .subscribe((res: any) => {
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

        this.profileImagePath = res.data.profilePicture && `${environment.apiUrl}/${res.data.profilePicture}`
      })
  }

  getTermsOfUse() {
    this.adminService.getTerms()
      .subscribe((res: any) => {
        console.log("Response: ", res);

        this.termOfUseForm.patchValue({
          editorContent: res.data.content
        })
      })
  }

  onSwitchClick(id: any) {
    console.log("Switch Id: ", id);
  }

  // Profile form
  beforeUpload = (file: NzUploadFile): any => {
    this.uploadFileName = file.name;
    return true;
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

  submitProfileForm(): void {
    const params = {
      "firstName": this.profileForm.value.firstName,
      "lastName": this.profileForm.value.lastName,
      "dob": moment(this.profileForm.value.dateOfBirth).toISOString(),
      "address": {
        "address": this.profileForm.value.address,
        "state": this.profileForm.value.state,
        "country": this.profileForm.value.country,
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
          this.handlePersonalEdit();
          this.getEmployeeDetails();
        } else if (res.status === "error") {
          this.message.create('error', res.message);
        }
      })
  }

  handlePersonalEdit(): void {
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      this.profileForm.controls['firstName'].enable();
      this.profileForm.controls['lastName'].enable();
      this.profileForm.controls['email'].enable();
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
      this.profileForm.controls['email'].disable();
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
  // Password Form
  submitForm() {
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

  handleTermOfUse() {
    console.log("Terms: ", this.termOfUseForm.value.editorContent)
    const params = {
      "content": this.termOfUseForm.value.editorContent
    }
    this.adminService.updateTerms(params)
      .subscribe((res: any) => {
        console.log("Update Terms res: ", res);

        if (res.status === "success") {
          this.message.create('success', res.message);

          this.getTermsOfUse();
        }
      })
  }
}
