import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { PaystackOptions } from 'angular4-paystack';
import { environment } from 'src/environments/environment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { User } from 'src/app/models/User';


@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  subscriptionList: any = [];
  currency: any = "";
  isVisible: any = false;
  isNotificationVisible: any = false;
  modaltitle: any = "";
  selectedPlanAmount: any = "";
  paymentMethodId: any = "";
  paymentMethodUrl: any = "";
  authenticatedUser: User;
  subscriptionExpiryDate: any = "";
  expiredSubscriptionId: any = "";


  options: PaystackOptions = {
    amount: 0,
    email: 'user@mail.com',
    ref: `${Math.ceil(Math.random() * 10e10)}`
  }

  constructor(private dataService: DataService, private notification: NzNotificationService) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'))

    this.dataService.getCompanyById(this.authenticatedUser.companyId)
      .subscribe((res: any) => {
        console.log("Company Details: ", res);
        if (res.data) {
          this.isNotificationVisible = res.data.subscriptionExpiry && true;
          this.subscriptionExpiryDate = res.data?.subscriptionExpiry;
          this.expiredSubscriptionId = res.data?.subscriptionPlanId;
        }
      })

    this.getSubscriptionPlan();
  }

  getSubscriptionPlan() {
    this.subscriptionList = [];
    this.dataService.getSubscriptionPlan()
      .subscribe((res: any) => {
        let planList = res.data.planList;
        this.paymentMethodId = res.data.paymentGatewayList[0]._id;
        this.paymentMethodUrl = `${environment.apiUrl}/${res.data.paymentGatewayList[0].logo}`;
        this.currency = res.data.paymentGatewayList[0].currency;

        for (let i = 0; i <= planList.length - 1; i++) {
          this.subscriptionList.push({
            plan_id: planList[i]._id,
            title: planList[i].name,
            subTitle: planList[i].subtitle,
            currency: this.currency,
            price: planList[i].prices[this.currency],
            unit: planList[i].durationUnit,
            benefits: planList[i].benefits,
            isCurrent: planList[i].isCurrent
          })
        }
      })
  }

  onProceed() {
    this.onUpgrade(this.expiredSubscriptionId);
  }

  onClose() {
    this.isNotificationVisible = false;
  }

  onUpgrade(id: any): void {
    let userInfo = JSON.parse(localStorage.getItem("user") || '{}');
    const selectedPlan = this.subscriptionList.filter((item: any) => item.plan_id === id);

    this.dataService.createSubscribe({
      subscriptionPlanId: id,
      paymentMethodId: this.paymentMethodId
    })
      .subscribe((res: any) => {
        this.isVisible = true;
        this.modaltitle = `Upgrading to ${selectedPlan[0].title} Plan`;
        this.selectedPlanAmount = selectedPlan[0].price;
        this.options.amount = res.data.transaction.amount * 100;
        this.options.email = userInfo.email;
        this.options.ref = res.data.transaction._id
      })
  }

  paymentInit() {
    console.log("Payment Init");
  }

  paymentCancel() {
    console.log("Payment Cancel");
    this.dataService.validateSubsctiption({
      "transactionId": this.options.ref
    })
      .subscribe((res: any) => {
        if (res.status === "error") {
          this.isVisible = false;
          this.notification.create(
            "error",
            res.data,
            ''
          );
        }
      })
  }

  handleCancel() {
    this.isVisible = false;
  }

  paymentDone(event: any) {
    console.log("Payment Done: ", event);
    this.dataService.validateSubsctiption({
      "transactionId": event.reference
    })
      .subscribe((res: any) => {
        if (res.status === "success") {
          this.isVisible = false;
          this.notification.create(
            "success",
            res.data,
            ''
          );
          this.ngOnInit();
        } else if (res.status === "error") {
          this.isVisible = false;
          this.notification.create(
            "error",
            res.data,
            ''
          );
        }
      })
  }
}
