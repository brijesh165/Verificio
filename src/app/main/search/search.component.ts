import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchForm: any = FormGroup;
  profileForm: any = FormGroup;
  profileImagePath: any = "";
  title: any = "Search User";
  isSearch: any = false;

  constructor(private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchWithEmail: [null, [Validators.email]],
      searchWithName: [null, []],
      searchWithDob: [null, []],
      searchWithFacebook: [null, []],
      searchWithInstagram: [null, []],
      searchWithTwitter: [null, []],
      searchWithLinkedIn: [null, []],
      searchWithPhone: [null, []]
    })

    this.profileForm = this.fb.group({
      firstName: [{ value: null, disabled: true }],
      lastName: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      status: [{ value: null, disabled: true }]
    })
  }

  onSearchNow() {
    this.title = "Search Result";
    this.isSearch = true;
  }

  onUserInfo() {
    this.router.navigate(['app/user-profile'])
  }

}
