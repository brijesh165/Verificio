import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {

  reportForm: any = FormGroup;
  reportTypeList: any = [];
  userList: any = [];
  showPreview: any = false;
  constructor(private fb: FormBuilder, private dataService: DataService) { }

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      // email: [null, [Validators.required, Validators.email]],
      staff: [null, [Validators.required]],
      category: [null, [Validators.required]],
      reportMsg: [null]
    });

    this.getEmployeeList();
    this.getReportTypeList();
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
        const list = res.data.map((item: any) => { return { "label": item.name, "value": item._id } });
        this.reportTypeList = list;
      })
  }

  onReportSubmit() {
    this.showPreview = true;
  }

  onPreviewReportBack() {
    this.showPreview = false;
  }

  onPreviewReportSubmit() {
    const params = {
      userId: this.reportForm.value.staff,
      description: this.reportForm.value.reportMsg,
      reportTypeId: this.reportForm.value.category,
    }

    this.dataService.createReport(params)
      .subscribe((res: any) => {
        console.log("Response: ", res);
      })
  }

}
