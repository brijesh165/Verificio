import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { NzUploadChangeParam, NzUploadFile, NzUploadXHRArgs } from 'ng-zorro-antd/upload';

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
  ]
  changePasswordForm: any = FormGroup;
  profileForm: any = FormGroup;
  uploadFileName: any = '';

  constructor(private fb: FormBuilder, private authService: AuthService) { }

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currPassword: [null, [Validators.required]],
      newPassword: [null, [Validators.required]],
      reNewPassword: [null, [Validators.required]]
    })

    this.profileForm = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      address: [null, [Validators.required]],
      state: [null, [Validators.required]],
      stateOfOrigin: [null, [Validators.required]],
      lga: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.required]],
      gender: [null, [Validators.required]]
    })
  }

  onSwitchClick(index: any): void {
    this.notificationList[index].status = !this.notificationList[index].status
  }

  submitForm(): void {
    console.log("Form Submitted");
    const params = {
      "password": this.changePasswordForm.newPassword,
      "current_password": this.changePasswordForm.currPassword
    }

    this.authService.changePassword(params)
      .subscribe((response: any) => {
        console.log("Response: ", response);
      })
  }

  handleUpload = (item: any): any => {
    const formData = new FormData();
    formData.append(item.name, item.file as any, this.uploadFileName);
    this.authService.uploadProfilePicture(formData)
      .subscribe((res: any) => {
        console.log("Response: ", res);
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
  }
}
