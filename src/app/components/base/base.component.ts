import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  initQueryParam(): void {
    const queryParamInit: BaseQueryParam = this.activatedRoute.snapshot.queryParams as BaseQueryParam;

    if (queryParamInit.action) {

      if (["signin", "signup"].indexOf(queryParamInit.action) === -1) {
        this.router.navigate([`/error`], {
          queryParams: {
            title: 'Bad Request',
            desc: 'The request action not valid'
          },
        });
        return;
      } 

      if (queryParamInit.redirect) {
        this.router.navigate([`/${queryParamInit.action}`], {
          queryParams: {
            redirect: queryParamInit.redirect,
            ref: queryParamInit.ref
          },
        });
      } else {
        this.router.navigate([`/error`], {
          queryParams: {
            title: 'Bad Request',
            desc: 'The request redirect not found'
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
