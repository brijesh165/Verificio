import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { CountryService } from 'src/app/services/country.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  profileForm: any = FormGroup;
  profileImagePath: any = "";
  paramsFromParent: any = "";
  companyList: any = [];
  countryList: any[] = [];

  constructor(private fb: FormBuilder, private router: Router,
    private countryService: CountryService,
    private dataService: DataService) {
    const routeParams: any = this.router.getCurrentNavigation();
    this.paramsFromParent = routeParams.extras.state;
  }

  ngOnInit(): void {
    this.countryList = this.countryService.getCountryList();
    this.profileForm = this.fb.group({
      firstName: [{ value: null, disabled: true }],
      lastName: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      phoneNumberPrefix: [{ value: null, disabled: true }],
      phone: [{ value: null, disabled: true }],
      address: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      stateOfOrigin: [{ value: null, disabled: true }],
      lga: [{ value: null, disabled: true }],
      dateOfBirth: [{ value: null, disabled: true }],
      gender: [{ value: null, disabled: true }]
    })

    this.getProfileDetails();
  }

  getProfileDetails() {
    console.log("Route Params: ", this.paramsFromParent.userId);
    this.dataService.searchDetails({ id: this.paramsFromParent.userId })
      .subscribe((res: any) => {
        if (res.status == "success") {
          console.log("Response: ", res.data);

          this.profileForm.patchValue({
            firstName: res.data.firstName,
            lastName: res.data.lastName,
            email: res.data.email,
            phoneNumberPrefix: res.data.countryCode,
            phone: res.data.phoneNo,
            address: res.data.addressList.address,
            state: res.data.addressList.state,
            stateOfOrigin: res.data.addressList.stateOfOrigin,
            lga: res.data.addressList.lga,
            dateOfBirth: res.data.dob && moment(res.data.dob).format("dd-MMM-yyyy"),
            gender: res.data.gender,
          })

          this.profileImagePath = res.data.profilePicture && `${environment.apiUrl}/${res.data.profilePicture}`;
          this.companyList = res.data.userList;
        }
      })
  }

  // onDownloadCsv() {
  //   console.log("Download CSV file")
  // }

}
