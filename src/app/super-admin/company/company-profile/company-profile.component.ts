import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { CountryService } from 'src/app/services/country.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {

  companyProfileForm: any = FormGroup;
  generatePasswordForm: any = FormGroup;

  profileImagePath: any = "";
  uploadFileName: any = '';
  countryList: any[] = [];
  isModalVisible: any = false;

  disableSaveBtn: any = false;
  paramsFromParent: any;

  constructor(private fb: FormBuilder, private router: Router, private countryService: CountryService) {
    const routeParams: any = this.router.getCurrentNavigation();
    this.paramsFromParent = routeParams.extras.state;
  }

  ngOnInit(): void {
    this.countryList = this.countryService.getCountryList();

    this.companyProfileForm = this.fb.group({
      firstName: [{ value: null, disabled: true }, [Validators.required]],
      lastName: [{ value: null, disabled: true }, [Validators.required]],
      email: [{ value: null, disabled: true }, [Validators.required]],
      phoneNumberPrefix: [{ value: null, disabled: true }, [Validators.required]],
      phone: [{ value: null, disabled: true }, [Validators.required, Validators.maxLength(10)]],
      plan: [{ value: null, disabled: true }, [Validators.required]],
      status: [{ value: null, disabled: true }, [Validators.required]],
      staff: [{ value: null, disabled: true }, [Validators.required]],
      registrationDate: [{ value: null, disabled: true }, [Validators.required]],
      address: [{ value: null, disabled: true }, [Validators.required]],
      state: [{ value: null, disabled: true }, [Validators.required]],
      lga: [{ value: null, disabled: true }, [Validators.required]],
    })

    this.generatePasswordForm = this.fb.group({
      password: [{ value: null, disabled: true }, [Validators.required]],
      confirmPassword: [{ value: null, disabled: true }, [Validators.required]],
    });

    this.getEmployeeInfo(this.paramsFromParent);
  }

  getEmployeeInfo(id: any) {
    console.log("Empolyee Id: ", id);
  }

  beforeUpload = (file: NzUploadFile): any => {
    this.uploadFileName = file.name;
    return true;
  }

  handleUpload = (item: any): any => {
    const formData = new FormData();
    formData.append("image", item.file);
    // this.authService.uploadProfilePicture(formData)
    //   .subscribe((res: any) => {
    //     if (res.status === "success") {
    //       this.message.create('success', res.message);
    //       this.getEmployeeDetails();
    //     } else if (res.status === "error") {
    //       this.message.create('error', res.message);
    //     }
    //   })
  }

  handleResetPassword() {
    console.log("Reset Password");
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  handleGeneratePassword() {
    console.log("Generate Password");

    this.disableSaveBtn = !this.disableSaveBtn;
  }

  onSavePassword() {
    console.log("Save Password");
  }
}
