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

  constructor(private fb: FormBuilder, private router: Router,
    private dataService: DataService, private countryService: CountryService) {
    const routeParams: any = this.router.getCurrentNavigation();
    this.paramsFromParent = routeParams.extras.state;
  }

  ngOnInit(): void {
    this.countryList = this.countryService.getCountryList();

    this.companyProfileForm = this.fb.group({
      name: [{ value: null, disabled: true }, [Validators.required]],
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

    this.getEmployeeInfo(this.paramsFromParent.id);
  }

  getEmployeeInfo(id: any) {
    this.dataService.getCompanyById(id)
      .subscribe((res: any) => {
        this.companyProfileForm.patchValue({
          name: res.data?.name,
          email: res.data?.email,
          phoneNumberPrefix: res.data?.countryCode,
          phone: res.data?.phoneNo,
          plan: res.data?.plan,
          status: res.data?.status,
          registrationDate: res.data?.registrationDate,
          address: res.data.address?.address,
          state: res.data.address?.state,
          lga: res.data.address?.lga,
        })
      });

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
    this.isModalVisible = true;
  }

  handleCancel() {
    this.isModalVisible = false;
  }

  handleGeneratePassword() {
    this.disableSaveBtn = !this.disableSaveBtn;
  }

  onSavePassword() {
    console.log("Save Password");
  }
}
