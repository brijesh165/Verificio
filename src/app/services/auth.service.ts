import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseUrl: string = 'http://54.157.195.180/';
  // baseUrl: string = 'http://192.168.75.137:3000';

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
  });

  register(params: any) {
    return this.http.post(this.baseUrl + "auth/company/register", params)
  }

  verifyOtp(params: any) {
    return this.http.post(this.baseUrl + "auth/otp/verify", params);
  }

  login(params: any) {
    return this.http.post(this.baseUrl + "auth/login", params);
  }

  changePassword(params: any) {
    return this.http.post(this.baseUrl + "user/change-password", params);
  }

  uploadProfilePicture(params: any) {
    let headers: any = new HttpHeaders();
    headers = headers.append("Content-Type", "multipart/form-data");

    return this.http.post(this.baseUrl + "user/profile/picture", params, headers);
  }
}
