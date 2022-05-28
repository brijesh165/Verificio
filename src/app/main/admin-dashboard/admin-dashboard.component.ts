import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  authenticatedUser: User;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'))
  }

  onAddNew(): void {
    this.router.navigateByUrl('/app/create-report');
  }
}
