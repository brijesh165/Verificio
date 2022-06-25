import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Subscription } from 'src/app/models/admin/Subscriptions';
import { AdminService } from 'src/app/services/admin.service';
import { ModelsComponent } from '../models/models.component';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  tableData: any = [];
  allSubscriptionPlansTable: any = [];
  searchTetx: any = "";
  isLoading: any = false;

  constructor(private adminService: AdminService, private modalService: NzModalService,
    private router: Router) { }

  ngOnInit(): void {

    this.getSubscriptionPlanList();
  }

  getSubscriptionPlanList() {
    this.adminService.getSubscribtionPlans()
      .subscribe((res: any) => {
        this.tableData = res.data.planList.map((item: any) => Subscription.fromMap(item));
        this.allSubscriptionPlansTable = res.data.planList.map((item: any) => Subscription.fromMap(item));
        this.isLoading = false;
      })

  }

  onCreateNew() {
    this.router.navigate(["admin/subscriptions/add"], { state: { isEdit: false } })
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

    this.allSubscriptionPlansTable = targetValue.filter(function (item: any) {
      return item
    }).map((item: any) => Subscription.fromMap(item));
  }

  onBulkAction(status: any, id: any): void {
    if (status === "edit") {
      this.router.navigate(["admin/subscriptions/add"], { state: { id: id, isEdit: true } })
    } else if (status === "deactivate") {
      const drawerRef = this.modalService.create<ModelsComponent>({
        nzTitle: '',
        nzContent: ModelsComponent,
        nzWidth: 444,
        nzFooter: null,
        nzComponentParams: {
          modelType: "deactivate",
          modelTitle: "Are you sure you want to delete this?",
          modelSubTitle: "You are about to take a serious action. Be careful before you delete this subscription plan."
        }
      });

      drawerRef.afterClose.subscribe((data: any) => {
        if (data === true) {
          this.adminService.deleteSubscriptionPlan(id)
            .subscribe((res: any) => {
              if (res.status === "success") {
                this.modalService.create<ModelsComponent>({
                  nzTitle: '',
                  nzContent: ModelsComponent,
                  nzWidth: 444,
                  nzFooter: null,
                  nzComponentParams: {
                    modelType: "success",
                    modelTitle: "Plan has been deleted",
                    modelSubTitle: ""
                  }
                });
              }
            })

          this.getSubscriptionPlanList();
        }
      })
    }
  }
}
