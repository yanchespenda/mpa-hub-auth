import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OauthSignin } from '../types';

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
}
