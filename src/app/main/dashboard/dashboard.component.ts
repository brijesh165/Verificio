import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke
} from "ng-apexcharts";

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

  constructor(private dataService: DataService) {
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

  adminCount: number = 0;
  employeeCount: number = 0;
  reportCount: number = 0;

  ngOnInit(): void {
    this.dataService.getDashboardData().subscribe((response: any) => {
      if (response.status == 'success') {
        this.adminCount = response.data.adminCount;
        this.employeeCount = response.data.employeeCount;
        this.reportCount = response.data.reportCount;
      }
    })

    this.dataService.reportData()
      .subscribe((res: any) => {
        console.log("Graph Response: ", res);
        const xAxis = res.data.map((item: any) => item.month);
        const xAxisData = res.data.map((item: any) => item.count);

        // console.log("X Axis: ", xAxis, xAxisData);
        this.chartOptions.xaxis.categories = xAxis;
        this.chartOptions.series = [
          {
            name: "Report",
            data: xAxisData
          }];
        this.loaded = true;
      })
  }

}
