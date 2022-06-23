import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Reports } from 'src/app/models/admin/Reports';
import { ModelsComponent } from '../models/models.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  allReportCategoryTable: any = [];
  tableData: any = [];
  searchText: any = "";
  isVisible: any = false;

  newCategoryForm: any = FormGroup;

  constructor(private fb: FormBuilder, private modalService: NzModalService) { }

  ngOnInit(): void {

    this.newCategoryForm = this.fb.group({
      name: [null, [Validators.required]],
      name_Bulk: this.fb.array([])
    })
  }

  onCreateNew() {
    console.log("Create New");
    this.isVisible = true;
  }

  handleCancel() {
    this.isVisible = false;
  }

  get categoryBulk() {
    return this.newCategoryForm.get("name_Bulk") as FormArray;
  }

  onAddNew() {
    this.categoryBulk.push(this.fb.group({ name: [null, [Validators.required]] }))
  }

  onDeleteRow(index: any) {
    this.categoryBulk.removeAt(index);
  }

  handleSaveCategory() {
    console.log("Save Category");
  }

  onSearch(searchTxt: any): void {
    const targetValue: any[] = [];
    this.tableData.forEach((value: any) => {
      let keys = Object.keys(value);
      for (let i = 0; i < keys.length; i++) {
        if (value[keys[i]] && value[keys[i]].toString().toLocaleLowerCase().includes(searchTxt)) {
          targetValue.push(value);
          break;
        }
      }
    });

    this.allReportCategoryTable = targetValue.filter(function (item: any) {
      return item
    }).map((item: any) => Reports.fromMap(item));
  }

  onBulkAction(status: any, id: any) {
    console.log("Status: ", status);
    if (status === "deactivate") {
      const drawerRef = this.modalService.create<ModelsComponent>({
        nzTitle: '',
        nzContent: ModelsComponent,
        nzWidth: 444,
        nzFooter: null,
        nzComponentParams: {
          modelType: "deactivate",
          modelTitle: "Are you sure you want delete?",
          modelSubTitle: "You are about to take a serious action. Be careful before you delete this category."
        }
      });

      drawerRef.afterClose.subscribe((data: any) => {
        if (data === true) {
          this.modalService.create<ModelsComponent>({
            nzTitle: '',
            nzContent: ModelsComponent,
            nzWidth: 444,
            nzFooter: null,
            nzComponentParams: {
              modelType: "success",
              modelTitle: "Category has been deleted ",
              modelSubTitle: ""
            }
          });
        }
      })
    }
  }
}
