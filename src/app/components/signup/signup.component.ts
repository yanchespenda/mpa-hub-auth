import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription, finalize } from 'rxjs';
import { OauthService } from 'src/app/shared/services/oauth.service';
import { BaseQueryParam } from 'src/app/shared/types';
import { capitalize } from 'src/app/shared/utils/string-utils';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, OnDestroy {

  @ViewChild('inputUsername', {static: true}) inputUsername!: ElementRef;
  @ViewChild('inputPassword', {static: true}) inputPassword!: ElementRef;

  isLoading: boolean = false;
  pswdHide: boolean = true;
  isErrorPrimary: boolean = false;
  primaryErrorMessage!: string;
  recaptchaSubscriber!: Subscription;

  dataForm: FormGroup = this.formBuilder.group({
    username: [
      null, [Validators.required]
    ],
    email: [
      null, [Validators.required, Validators.email]
    ],
    password: [
      null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
    ],
    passwordConfirm: [
      null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
    ],
  });

  queryParam!: BaseQueryParam;

  constructor(
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private oauthService: OauthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.queryParamValidation();
  }

  queryParamValidation(): void {
    this.queryParam = this.activatedRoute.snapshot.queryParams as BaseQueryParam;
    if (!this.queryParam.redirect) {
      this.router.navigate([`/error`], {
        queryParams: {
          title: 'Bad Request',
          desc: 'The request redirect not found'
        },
      });
    }
  }

  getFormErrorMessage(control: string, errorName?: string, customControlName?: string): string | null {
    const controlName = customControlName ? customControlName : capitalize(control);
    if (control === 'primary')
      return this.primaryErrorMessage;
    if (errorName && this.valueForm[control]?.hasError(errorName))
      if (errorName === 'required')
        return `${controlName} required`;
      else if (errorName === 'email')
        return `${controlName} is not valid`;
    return null;
  }

  get valueForm(): FormGroup['controls'] {
    return this.dataForm.controls;
  }

  submitRecaptcha(): void {

    if (this.dataForm.invalid) {
      if (this.valueForm['username'].invalid) {
        this.inputUsername.nativeElement.focus();
      } else if (this.valueForm['password'].invalid) {
        this.inputPassword.nativeElement.focus();
      }
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isErrorPrimary = false;
    this.isLoading = true;

    this.recaptchaV3Service.execute('signup')
      .subscribe({
        next: token => this.submitForm(token),
        error: err => this.submitRecaptchaErrorHandler(err),
      });
  }

  submitForm(token: string): void {
    this.oauthService.signUp(
      this.valueForm['username'].value,
      this.valueForm['email'].value,
      this.valueForm['password'].value,
      this.valueForm['passwordConfirm'].value,
      token
    ).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (data: any) => console.log(data),
      error: (error: HttpErrorResponse) => {
        console.log("error", error);
        this.isErrorPrimary = true;
        this.primaryErrorMessage = error?.error?.message || error?.message || 'Something went wrong';
      }
    });
  }

  submitRecaptchaErrorHandler(error: HttpErrorResponse): void {
    console.log("error", error);

    this.isErrorPrimary = true;
    this.primaryErrorMessage = error?.error?.message || error?.message || 'Something went wrong';
  }

  goToSignin(): void {
    if (this.queryParam.redirect) {
      this.router.navigate([`/signin`], {
        queryParams: {
          redirect: this.queryParam.redirect,
          ref: this.queryParam.ref
        },
      });
    }
  }

  ngOnInit(): void {
  }

  recaptchaUnsubscribe(): void {
    if (this.recaptchaSubscriber) {
      this.recaptchaSubscriber.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.recaptchaUnsubscribe();
  }

}
