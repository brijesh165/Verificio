import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(private dataService: DataService) { }

  adminCount:number =0;
  employeeCount:number =0;
  reportCount:number = 0;

  ngOnInit(): void {
    this.dataService.getDashboardData().subscribe((response:any)=>{
      if(response.status=='success') {
        this.adminCount = response.data.adminCount;
        this.employeeCount = response.data.employeeCount;
        this.reportCount = response.data.reportCount;
      }
    })
  }

}
