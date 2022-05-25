import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  userInitials: any = "";
  constructor(private router: Router) { }

  ngOnInit(): void {
    let userInfo = JSON.parse(localStorage.getItem("user") || '{}');
    this.userInitials = userInfo.firstName.charAt(0).toUpperCase() + "" + userInfo.lastName.charAt(0).toUpperCase();
    console.log("Initial: ", this.userInitials)
  }

  onlogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigateByUrl('/auth');
  }
}
