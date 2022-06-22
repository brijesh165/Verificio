import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  baseUrl: string = `${environment.apiUrl}/`;

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  });

  getCompanyList() {
    return this.http.get(this.baseUrl + 'company/list')
  }

  getCompanyById(id: any) {
    return this.http.get(this.baseUrl + `company/${id}`)
  }

  getSubscribtionPlans() {
    return this.http.get(this.baseUrl + 'subscription/plan/list/active');
  }

  createSubscriptionPlan(params: any) {
    return this.http.post(this.baseUrl + 'subscription/plan/create', params);
  }

}
