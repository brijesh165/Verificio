import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { User } from 'src/app/models/User';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-create-report',
  templateUrl: './create-report.component.html',
  styleUrls: ['./create-report.component.scss']
})
export class CreateReportComponent implements OnInit {

  reportForm: any = FormGroup;
  reportTypeList: any = [];
  userList: any = [];
  showPreview: any = false;
  otherCategory: any = false;
  authenticatedUser: User;
  company: any;

  previewData: any = {};

  constructor(private fb: FormBuilder, private dataService: DataService,
    private message: NzMessageService, private router: Router) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'))
    this.reportForm = this.fb.group({
      staff: [null, [Validators.required]],
      category: [null, [Validators.required]],
      other: [null],
      reportMsg: [null, [Validators.required]]
    });

    this.getEmployeeList();
    this.getReportTypeList();

    this.dataService.getCompanyById(this.authenticatedUser.companyId).subscribe((data: any) => {
      this.company = data.data;
    });

  }

  getEmployeeList() {
    this.dataService.listEmployee()
      .subscribe((res: any) => {
        const list = res.data.map((item: any) => { return { "label": `${item.firstName} ${item.lastName}`, "value": item._id } });
        this.userList = list;
      })
  }

  getReportTypeList() {
    this.dataService.reportTypeList()
      .subscribe((res: any) => {
        const list = res.data.map((item: any) => { return { "label": item.name, "value": item.name } });
        list.push({ "label": "others", "value": "others" });
        this.reportTypeList = list;
      })
  }

  onReportCategory(event: any) {
    console.log("Report: ", event);
    if (event === "others") {
      this.otherCategory = true;
      this.reportForm.controls['other'].setValidators([Validators.required]);
    } else {
      this.otherCategory = false;
      this.reportForm.controls['other'].clearValidators();
    }
  }

  onReportSubmit() {
    this.previewData.companyName = this.company.name;
    // this.previewData.reportCategory = this.reportTypeList.find((item: any) => { return item.value == this.reportForm.value.category }).label;
    this.previewData.reportCategory = this.reportForm.value.category === "others" ? this.reportForm.value.other : this.reportForm.value.category;
    this.previewData.reportedUser = this.userList.find((item: any) => { return item.value == this.reportForm.value.staff }).label;
    this.previewData.message = this.reportForm.value.reportMsg;
    this.showPreview = true;
  }

  onPreviewReportBack() {
    this.showPreview = false;
  }

  onPreviewReportSubmit() {
    const params = {
      userId: this.reportForm.value.staff,
      description: this.reportForm.value.reportMsg,
      category: this.reportForm.value.category === "others" ? this.reportForm.value.other : this.reportForm.value.category,
    }

    // console.log("Params: ", params);
    this.dataService.createReport(params)
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.message.create('success', res.message);
          this.otherCategory = false;
          this.router.navigateByUrl('/app/reports');
        } else if (res.status === "error") {
          this.message.create('error', res.message);
        }
      })
  }
}
