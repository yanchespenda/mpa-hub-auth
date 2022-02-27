import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseErrorQueryParam } from 'src/app/shared/types';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {

  title!: string;
  desc!: string;

  constructor(
    private activatedRoute: ActivatedRoute,
  ) {
    this.initQueryParam();
  }

  initQueryParam(): void {
    const queryParamInit: BaseErrorQueryParam = this.activatedRoute.snapshot.queryParams as BaseErrorQueryParam;

    if (queryParamInit.title) {
      this.title = queryParamInit.title;
    } else {
      this.title = 'Something went wrong';
    }

    if (queryParamInit.desc) {
      this.desc = queryParamInit.desc;
    } else {
      this.desc = 'We&apos;re sorry. We have a problem while showing page, try again leter.';
    }
  }

  ngOnInit(): void {
  }

}
