import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {

  profileForm: any = FormGroup;
  profileImagePath: any = "";

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: [{ value: null, disabled: true }],
      lastName: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      phoneNumberPrefix: [{ value: null, disabled: true }],
      phone: [{ value: null, disabled: true }],
      address: [{ value: null, disabled: true }],
      state: [{ value: null, disabled: true }],
      lga: [{ value: null, disabled: true }],
      currentCompany: [{ value: null, disabled: true }],
      currEmploymentType: [{ value: null, disabled: true }],
      currPosition: [{ value: null, disabled: true }],
      lastCompany: [{ value: null, disabled: true }],
      lastEmploymentType: [{ value: null, disabled: true }],
      lastPosition: [{ value: null, disabled: true }],
      dateOfBirth: [{ value: null, disabled: true }],
      gender: [{ value: null, disabled: true }]
    })
  }

  onDownloadCsv() {
    console.log("Download CSV file")
  }

}
