import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OauthEmailVerificationParam, OauthForgotPasswordConfirmParam, OauthForgotPasswordParam, OauthRequest, OauthRequestParam, OauthSignin } from '../types';

@Injectable({
  providedIn: 'root'
})
export class OauthService {

  /**
   * Set the base url
   */
  private BASE_API_URL = environment.BASE_API_URL;

  /**
   * Set the base url for the auth service
   */
  private BASE_AUTH = this.BASE_API_URL + 'oauth/';

  constructor(
    private httpClient: HttpClient,
  ) { }

  signIn(email: string, password: string, token: string): Observable<OauthSignin> {
    const dataParams = new HttpParams()
                  .set('email', email)
                  .set('password', password)
                  .set('token', token);
    return this.httpClient.post<OauthSignin>(this.BASE_AUTH + 'signin', dataParams);
  }

  signUp(username: string, email: string, password: string, passwordConfirm: string, token: string): Observable<OauthSignin> {
    const dataParams = new HttpParams()
                  .set('username', username)
                  .set('email', email)
                  .set('password', password)
                  .set('passwordConfirm', passwordConfirm)
                  .set('token', token);
    return this.httpClient.post<OauthSignin>(this.BASE_AUTH + 'signup', dataParams);
  }

  requestVerify(param: OauthRequestParam, token: string): Observable<OauthRequest> {
    const dataParams = new HttpParams()
                  .set('action', param.action)
                  .set('requestId', param.requestId)
                  .set('tokenKey', param.tokenKey)
                  .set('token', token);
    return this.httpClient.post<OauthRequest>(this.BASE_AUTH + 'token-verify', dataParams);
  }

  requestForgotPassword(param: OauthForgotPasswordParam, token: string): Observable<OauthRequest> {
    const dataParams = new HttpParams()
                  .set('email', param.email)
                  .set('token', token);
    return this.httpClient.post<OauthRequest>(this.BASE_AUTH + 'forgot-password', dataParams);
  }

  requestForgotPasswordConfirm(param: OauthForgotPasswordConfirmParam, token: string): Observable<OauthRequest> {
    const dataParams = new HttpParams()
                  .set('requestId', param.requestId)
                  .set('password', param.password)
                  .set('passwordConfirm', param.passwordConfirm)
                  .set('tokenKey', param.tokenKey)
                  .set('token', token);
    return this.httpClient.post<OauthRequest>(this.BASE_AUTH + 'forgot-password-confirm', dataParams);
  }

  requestEmailVerification(param: OauthEmailVerificationParam, token: string): Observable<OauthRequest> {
    const dataParams = new HttpParams()
                  .set('requestId', param.requestId)
                  .set('tokenKey', param.tokenKey)
                  .set('token', token);
    return this.httpClient.post<OauthRequest>(this.BASE_AUTH + 'email-verification', dataParams);
  }
}
