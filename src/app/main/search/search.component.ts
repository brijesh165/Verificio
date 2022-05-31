import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data.service';
import { environment } from 'src/environments/environment';

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
  environment = environment;

  searchResult: any = [];

  constructor(private router: Router, private fb: FormBuilder,
    private dataService: DataService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      searchWithEmail: [null, [Validators.email]],
      searchWithName: [null, []],
      searchWithDob: [null, []],
      searchWithPhone: [null, []],
    })

    this.profileForm = this.fb.group({
      firstName: [{ value: null, disabled: true }],
      lastName: [{ value: null, disabled: true }],
      email: [{ value: null, disabled: true }],
      status: [{ value: null, disabled: true }]
    })
  }

  onSearchNow() {
    this.dataService.search({
      "name": this.searchForm.value.searchWithName,
      "dob": this.searchForm.value.searchWithDob && moment(this.searchForm.value.searchWithDob).format("DD-MM-yyyy"),
      "phoneNo": this.searchForm.value.searchWithPhone,
      "email": this.searchForm.value.searchWithEmail
    })
      .subscribe((res: any) => {
        if (res.status === "success") {
          console.log("Search Response: ", res.data);
          this.title = "Search Result";
          this.isSearch = true;

          this.searchResult = res.data;
        }
      })

  }

  onUserInfo(userId: any) {
    this.router.navigate(["app/user-profile"], { state: { userId: userId } });
  }

}
