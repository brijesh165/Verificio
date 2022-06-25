import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Reports } from 'src/app/models/admin/Reports';
import { AdminService } from 'src/app/services/admin.service';
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
  isEdit: any = false;
  isEditId: any = "";

  newCategoryForm: any = FormGroup;

  constructor(private fb: FormBuilder, private adminService: AdminService,
    private modalService: NzModalService) { }

  ngOnInit(): void {

    this.newCategoryForm = this.fb.group({
      name: [null, [Validators.required]],
      name_Bulk: this.fb.array([])
    })

    this.getAllReports();
  }

  getAllReports() {
    this.adminService.getAllReportType()
      .subscribe((res: any) => {
        this.tableData = res.data.map((item: any) => Reports.fromMap(item));
        this.allReportCategoryTable = res.data.map((item: any) => Reports.fromMap(item));
      })
  }

  onCreateNew() {
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
    const params = {
      name: this.newCategoryForm.value.name
    }

    if (this.isEdit) {
      const params = {
        "reportId": this.isEditId,
        "name": this.newCategoryForm.value.name
      };

      this.adminService.updateReportType(params)
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzFooter: null,
              nzComponentParams: {
                modelType: "success",
                modelTitle: "Changes has been saved",
                modelSubTitle: ""
              }
            });

            this.isEdit = false;
            this.isEditId = "";
            this.isVisible = false;
            this.getAllReports();
          }
        })
    } else {
      this.adminService.createReportType(params)
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzFooter: null,
              nzComponentParams: {
                modelType: "success",
                modelTitle: "Category has been created",
                modelSubTitle: ""
              }
            });

            this.isVisible = false;
            this.getAllReports();
          }
        })
    }

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

  onBulkAction(status: any, id: any, name: any) {
    if (status === "edit") {
      this.newCategoryForm.patchValue({
        name: name
      })
      this.isEditId = id;
      this.isEdit = true;
      this.isVisible = true;
    } else if (status === "active") {
      this.adminService.activateReportType({
        "reportIds": [id]
      })
        .subscribe((res: any) => {
          if (res.status === "success") {
            this.modalService.create<ModelsComponent>({
              nzTitle: '',
              nzContent: ModelsComponent,
              nzWidth: 444,
              nzFooter: null,
              nzComponentParams: {
                modelType: "success",
                modelTitle: res.message,
                modelSubTitle: ""
              }
            });

            this.getAllReports();
          }
        })
    } else if (status === "deactivate") {
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
          this.adminService.deleteReportType({
            "reportIds": [id]
          })
            .subscribe((res: any) => {
              if (res.status === "success") {
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

                this.getAllReports();
              }
            })
        }
      })
    }
  }
}
