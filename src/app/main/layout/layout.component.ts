import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  userInitials: any = "";
  authenticatedUser: User;
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.authenticatedUser = User.fromMap(JSON.parse(localStorage.getItem("user") || '{}'));
    this.userInitials = this.authenticatedUser.firstName.charAt(0).toUpperCase() + "" + this.authenticatedUser.lastName.charAt(0).toUpperCase();
    console.log("Initial: ", this.userInitials)
  }

  onlogout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigateByUrl('/auth');
  }
}
