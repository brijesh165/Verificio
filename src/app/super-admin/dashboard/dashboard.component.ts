import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";
import { DataService } from 'src/app/services/data.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild("chart")
  chart!: ChartComponent;
  chartOptions: any;
  loaded: Boolean = false;

  authenticatedUser: User;

  totalRevenue: any;
  totalSales: any;
  totalCompanies: any;

  constructor(private router: Router, private dataService: DataService) {
    this.chartOptions = {
      series: [
        {
          name: "Report",
          data: []
        },
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        categories: []
        // categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Nov", "Dec"]
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'))

    this.dataService.getDashboardData()
      .subscribe((response: any) => {
        if (response.status == 'success') {
          this.totalRevenue = response.data.totalRevenueNBN[0].totalRevenueNGN;
          this.totalSales = response.data.totalSales;
          this.totalCompanies = response.data.totalCompanies;
        }
      })
  }

  onAddNew(): void {
    this.router.navigateByUrl('/app/create-report');
  }
}
