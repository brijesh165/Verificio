import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { DataService } from 'src/app/services/data.service';
import * as moment from 'moment';

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

  changePasswordForm: any = FormGroup;
  profileImagePath: any = "";
  profileForm: any = FormGroup;
  uploadFileName: any = '';
  isEdit: any = true;
  passwordVisible = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private dataService: DataService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]],
      reNewPassword: [null, [Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)[A-Za-z\\d!$%@#£€*?&]{8,}$')]]
    })

    this.profileForm = this.fb.group({
      firstName: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      lastName: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      email: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      phoneNumberPrefix: ['+91', [Validators.required]],
      phone: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      address: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      state: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      stateOfOrigin: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      lga: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      dateOfBirth: [{ value: null, disabled: this.isEdit }, [Validators.required]],
      gender: [{ value: null, disabled: this.isEdit }, [Validators.required]]
    })

    this.getEmployeeDetails();
  }

  getEmployeeDetails() {
    let userInfo = JSON.parse(localStorage.getItem("user") || '{}');
    this.dataService.getEmployeeDetailsById(userInfo._id)
      .subscribe((res: any) => {
        console.log("Employee Details: ", res.data);
        this.profileForm.patchValue({
          firstName: res.data.firstName,
          lastName: res.data.lastName,
          email: res.data.email,
          phoneNumberPrefix: res.data.countryCode,
          phone: res.data.phoneNo,
          address: res.data.address.address,
          state: res.data.address.state,
          stateOfOrigin: res.data.address.stateOfOrigin,
          lga: res.data.address.lga,
          dateOfBirth: res.data.dob ? moment(res.data.dob).format("DD/MM/yyyy") : "",
          gender: res.data.gender
        })

        this.profileImagePath = res.data.profilePicture && `http://54.157.195.180/${res.data.profilePicture}`
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
          console.log("Response: ", res);
          if (res.status === "success") {
            alert("Password change successfulluy");
          }
        })
    }
  }

  handleUpload = (item: any): any => {
    console.log("Item: ", item);
    const formData = new FormData();
    formData.append("image", item.file);
    this.authService.uploadProfilePicture(formData)
      .subscribe((res: any) => {
        // console.log("Response: ", res);
        if (res.status === "success") {
          this.getEmployeeDetails();
        }
      })
    // this.http.post('https://jsonplaceholder.typicode.com/posts/', formData).subscribe(
    //   res => {
    //     console.log("success", res.id);
    //     item.onSuccess(item.file);
    //   },
    //   (err) => {
    //     item.onError(err, item.file);
    //   }
    // );
  }

  beforeUpload = (file: NzUploadFile): any => {
    this.uploadFileName = file.name;
    return true;
  }

  submitProfileForm(): void {
    console.log("Profile Form Submitted");
    const params = {
      "firstName": this.profileForm.value.firstName,
      "lastName": this.profileForm.value.lastName,
      "dob": moment(this.profileForm.value.dateOfBirth).format("DD/MM/yyyy"),
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
          this.getEmployeeDetails();
          this.isEdit = true;
        }
      })
  }

  handleEdit(): void {
    console.log("Edit Profile");
    this.isEdit = !this.isEdit;
    if (!this.isEdit) {
      this.profileForm.controls['firstName'].enable();
      this.profileForm.controls['lastName'].enable();
      this.profileForm.controls['email'].enable();
      this.profileForm.controls['phone'].enable();
      this.profileForm.controls['address'].enable();
      this.profileForm.controls['state'].enable();
      this.profileForm.controls['stateOfOrigin'].enable();
      this.profileForm.controls['lga'].enable();
      this.profileForm.controls['dateOfBirth'].enable();
      this.profileForm.controls['gender'].enable();
    } else {
      this.profileForm.controls['firstName'].disable();
      this.profileForm.controls['lastName'].disable();
      this.profileForm.controls['email'].disable();
      this.profileForm.controls['phone'].disable();
      this.profileForm.controls['address'].disable();
      this.profileForm.controls['state'].disable();
      this.profileForm.controls['stateOfOrigin'].disable();
      this.profileForm.controls['lga'].disable();
      this.profileForm.controls['dateOfBirth'].disable();
      this.profileForm.controls['gender'].disable();
    }

  }
}
