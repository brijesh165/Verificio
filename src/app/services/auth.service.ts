import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  baseUrl: string = `${environment.apiUrl}/`;
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

  me() {
    return this.http.get(this.baseUrl + "auth/me");
  }

  forgetPassword(params: any) {
    return this.http.post(this.baseUrl + "auth/password/reset", params);
  }

  passwordVerifyOtp(params: any) {
    return this.http.post(this.baseUrl + "auth/password/reset/verify", params);
  }

  resetPassword(params: any) {
    return this.http.post(this.baseUrl + "auth/password/reset/update", params);
  }

  changePassword(params: any) {
    return this.http.post(this.baseUrl + "user/change-password", params);
  }

  uploadProfilePicture(params: any) {
    let headers: any = new HttpHeaders();
    headers = headers.append("Content-Type", "multipart/form-data");

    return this.http.post(this.baseUrl + "user/profile/picture", params, headers);
  }

  getAllNotifications(params: any) {
    return this.http.get(this.baseUrl + "notification/list");
  }
}
