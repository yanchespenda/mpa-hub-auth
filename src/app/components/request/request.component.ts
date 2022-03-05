import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { finalize, Subscription, timeout, timer } from 'rxjs';
import { RECAPTCHA_IDENTIFIER } from 'src/app/shared/constant/recaptcha';
import { OauthService } from 'src/app/shared/services/oauth.service';
import { BaseQueryParam } from 'src/app/shared/types';
import { actionGenerator } from 'src/app/shared/utils/string-utils';
import { validatorMessage } from 'src/app/shared/utils/validator-message';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  isErrorPrimary: boolean = false;
  primaryErrorMessage!: string;
  recaptchaSubscriber!: Subscription;
  tokenVerified: boolean = false;
  requestStep: number = 0;
  stepOneTitle!: string;
  stepNineNineTitle!: string;
  pswdHide: boolean = true;
  mainTitle!: string;
  mainSubTitle!: string;
  mainButtonText!: string;
  tokenName!: string;

  queryParam!: BaseQueryParam;

  dataForm: FormGroup = this.formBuilder.group({
    password: [
      null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
    ],
    passwordConfirm: [
      null, [Validators.required, Validators.minLength(2), Validators.maxLength(25)]
    ],
  });

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

    if (this.queryParam.action && this.queryParam.token && this.queryParam.request) {
      return;
    }

    this.router.navigate([`/error`], {
      queryParams: {
        title: 'Bad Request',
        desc: 'Some requests are missing'
      },
    });
  }

  getFormErrorMessage(control: string, errorName?: string | string[], customControlName?: string): string | null {
    return validatorMessage(this.primaryErrorMessage, this.valueForm, control, errorName, customControlName);
  }

  getTitle(): string {
    return this.mainTitle;
  }

  getSubTitle(): string {
    return this.mainSubTitle;
  }

  getButtonText(): string {
    return this.mainButtonText;
  }

  generateStepper(): void {
    if (this.queryParam.action) {
      if (this.queryParam.action === 'email-verification') {
        this.stepOneTitle = "Verifying email";
        this.mainTitle = "Verifying email";
        this.requestStep = 1;
        this.isLoading = true;

        timer(1000).subscribe(() => {
          this.tokenName = RECAPTCHA_IDENTIFIER.EMAIL_VERIFICATION;
          this.submitRecaptcha((token) => this.submitEmailVerifiation(token));
        });
      } else if (this.queryParam.action === 'reset-password') {
        this.mainTitle = "Reset password";
        this.mainSubTitle = "Enter your new password";
        this.mainButtonText = "CONFIRM";
        this.requestStep = 3;
      }
    }
  }

  get valueForm(): FormGroup['controls'] {
    return this.dataForm.controls;
  }

  submitRecaptcha(callback?: (token: string) => void): void {
    if (this.isLoading) {
      return;
    }

    this.isErrorPrimary = false;
    this.isLoading = true;
    this.stateDisabledInput(true);

    this.recaptchaV3Service.execute(this.tokenName)
      .pipe(
        timeout({
          each: 5000,
          with: () => {
            throw new Error('timeout')
          }
        })
      )
      .subscribe({
        next: token => callback && callback(token),
        error: err => this.submitRecaptchaErrorHandler(err),
      });
  }

  verifyToken(token: string): void {
    if (this.queryParam.action && this.queryParam.token && this.queryParam.request)
      this.oauthService.requestVerify({
        action: actionGenerator(this.queryParam.action),
        tokenKey: this.queryParam.token,
        requestId: this.queryParam.request
      }, token)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.stateDisabledInput(false);
        })
      ).subscribe({
        next: () => this.generateStepper(),
        error: (error: HttpErrorResponse) => {
          console.log("error", error);
          this.isErrorPrimary = true;
          this.primaryErrorMessage = error?.error?.message || error?.message || 'Something went wrong';
        }
      });
  }

  submitEmailVerifiation(token: string): void {
    if (this.queryParam.token && this.queryParam.request)
      this.oauthService.requestEmailVerification({
        requestId: this.queryParam.request,
        tokenKey: this.queryParam.token
      }, token)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.stateDisabledInput(false);
        })
      ).subscribe({
        next: () => {
          this.stepNineNineTitle = "Email verified, you can close this tab window";
          this.requestStep = 99;
        },
        error: (error: HttpErrorResponse) => {
          console.log("error", error);
          this.isErrorPrimary = true;
          this.primaryErrorMessage = error?.error?.message || error?.message || 'Something went wrong';
        }
      });
  }

  submitResetPassword(token: string): void {
    if (this.queryParam.token && this.queryParam.request)
      this.oauthService.requestForgotPasswordConfirm({
        password: this.valueForm['password'].value,
        passwordConfirm: this.valueForm['passwordConfirm'].value,
        requestId: this.queryParam.request,
        tokenKey: this.queryParam.token
      }, token)
      .pipe(
        finalize(() => {
          this.isLoading = false;
          this.stateDisabledInput(false);
        })
      ).subscribe({
        next: () => {
          this.stepNineNineTitle = "Password changed, you can close this tab window";
          this.requestStep = 99;
        },
        error: (error: HttpErrorResponse) => {
          console.log("error", error);
          this.isErrorPrimary = true;
          this.primaryErrorMessage = error?.error?.message || error?.message || 'Something went wrong';
        }
      });
  }

  submitRecaptchaErrorHandler(error: HttpErrorResponse): void {
    console.log("error", error);

    this.stateDisabledInput(false);
    this.isErrorPrimary = true;
    if (error?.message === 'timeout')
      this.primaryErrorMessage = 'Recaptcha not valid';
    else
      this.primaryErrorMessage = error?.error?.message || error?.message || 'Something went wrong';
  }

  stateDisabledInput(state: boolean): void {
    if (state) {
      this.valueForm['password']?.disable();
      this.valueForm['passwordConfirm']?.disable();
    } else {
      this.valueForm['password']?.enable();
      this.valueForm['passwordConfirm']?.enable();
    }
  }

  submitButton(): void {
    if (this.requestStep === 3) {
      this.tokenName = RECAPTCHA_IDENTIFIER.FORGOT_PASSWORD_CONFIRM;
      this.submitRecaptcha((token) => this.submitResetPassword(token));
    }
  }

  ngOnInit(): void {
    this.requestStep = 1;
    this.stepOneTitle = "Verifying";
    this.tokenName = RECAPTCHA_IDENTIFIER.TOKEN_VERIFY;
    this.submitRecaptcha((token) => this.verifyToken(token));
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
