import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OauthService } from 'src/app/shared/services/oauth.service';
import { BaseQueryParam } from 'src/app/shared/types';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.initQueryParam();
  }

  paramBuilder(queryParamInit: BaseQueryParam, param: string): string | undefined {
    if (param === 'token')
      if (queryParamInit.token)
        return queryParamInit.token;
      
    if (param === 'request')
      if (queryParamInit.request)
        return queryParamInit.request;

    return undefined;
  }

  paramActionBuilder(queryParamInit: BaseQueryParam): string | undefined {
    if (queryParamInit.action)
      return ["reset-password", "email-verification"].indexOf(queryParamInit.action) > -1 ? queryParamInit.action : undefined;
    return undefined;
  }

  actionBuilder(queryParamInit: BaseQueryParam): string | undefined {
    if (queryParamInit.action)
      return ["reset-password", "email-verification"].indexOf(queryParamInit.action) > -1 ? "request" : queryParamInit.action;
    return "error";
  }

  initQueryParam(): void {
    const queryParamInit: BaseQueryParam = this.activatedRoute.snapshot.queryParams as BaseQueryParam;

    if (queryParamInit.action) {

      if (["signin", "signup", "reset-password", "email-verification"].indexOf(queryParamInit.action) === -1) {
        this.router.navigate([`/error`], {
          queryParams: {
            title: 'Bad Request',
            desc: 'The request action not valid',
          },
        });
        return;
      }

      const actionBuilder = this.actionBuilder(queryParamInit);
      if ((queryParamInit.redirect || ["reset-password", "email-verification"].indexOf(queryParamInit.action) > -1) && actionBuilder !== "error") {
        this.router.navigate([`/${actionBuilder}`], {
          queryParams: {
            redirect: queryParamInit.redirect,
            ref: queryParamInit.ref,
            token: this.paramBuilder(queryParamInit, "token"),
            request: this.paramBuilder(queryParamInit, "request"),
            action: this.paramActionBuilder(queryParamInit),
          },
        });
      } else {
        this.router.navigate([`/error`], {
          queryParams: {
            title: 'Bad Request',
            desc: 'Some requests are missing'
          },
        });
      }
    } else {
      this.router.navigate([`/error`], {
        queryParams: {
          title: 'Bad Request',
          desc: 'The request action not found'
        },
      });
    }
  }

  ngOnInit(): void {
  }

}
