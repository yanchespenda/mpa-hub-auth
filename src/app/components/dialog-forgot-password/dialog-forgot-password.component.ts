import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { finalize, Subscription, timeout } from 'rxjs';
import { RECAPTCHA_IDENTIFIER } from 'src/app/shared/constant/recaptcha';
import { OauthService } from 'src/app/shared/services/oauth.service';
import { capitalize } from 'src/app/shared/utils/string-utils';
import { validatorMessage } from 'src/app/shared/utils/validator-message';

interface DialogData {
  currentEmail?: string;
}

@Component({
  selector: 'app-dialog-forgot-password',
  templateUrl: './dialog-forgot-password.component.html',
  styleUrls: ['./dialog-forgot-password.component.scss']
})
export class DialogForgotPasswordComponent implements OnInit, OnDestroy {

  @ViewChild('inputEmail', {static: true}) inputEmail!: ElementRef;

  isLoading: boolean = false;
  isErrorPrimary: boolean = false;
  primaryErrorMessage!: string;
  recaptchaSubscriber!: Subscription;

  dataForm: FormGroup = this.formBuilder.group({
    email: [
      null, [Validators.required, Validators.email]
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private recaptchaV3Service: ReCaptchaV3Service,
    private oauthService: OauthService,
    private matSnackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DialogForgotPasswordComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    ) {
      if (data.currentEmail) {
        this.dataForm.patchValue({
          email: data.currentEmail,
        });
      }
    }

  getFormErrorMessage(control: string, errorName?: string | string[], customControlName?: string): string | null {
    return validatorMessage(this.primaryErrorMessage, this.valueForm, control, errorName, customControlName);
  }

  get valueForm(): FormGroup['controls'] {
    return this.dataForm.controls;
  }

  submitRecaptcha(): void {

    if (this.dataForm.invalid) {
      if (this.valueForm['email'].invalid) {
        this.inputEmail.nativeElement.focus();
      }
      return;
    }

    if (this.isLoading) {
      return;
    }

    this.isErrorPrimary = false;
    this.isLoading = true;

    this.stateDisabledInput(true);

    this.recaptchaSubscriber = this.recaptchaV3Service.execute(RECAPTCHA_IDENTIFIER.FORGOT_PASSWORD)
      .pipe(
        timeout({
          each: 5000,
          with: () => {
            throw new Error('timeout')
          }
        })
      )
      .subscribe({
        next: token => this.onConfirm(token),
        error: err => this.submitRecaptchaErrorHandler(err),
      });
  }

  onConfirm(token: string): void {

    this.oauthService.requestForgotPassword(
      {
        email: this.valueForm['email'].value
      },
      token
    ).pipe(
      finalize(() => {
        this.isLoading = false;
        this.stateDisabledInput(false);
      })
    ).subscribe({
      next: (data: any) => {
        console.log(data)

        this.matSnackBar.open('Reset password link has been sent to your email', 'close', {
          duration: 3000
        });
        this.dialogRef.close(true);
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

    this.isErrorPrimary = true;
    this.isLoading = false;
    this.stateDisabledInput(false);
    if (error?.message === 'timeout')
      this.primaryErrorMessage = 'Recaptcha not valid';
    else
      this.primaryErrorMessage = error?.error?.message || error?.message || 'Something went wrong';
  }

  stateDisabledInput(state: boolean): void {
    if (state) {
      this.valueForm['email'].disable();
    } else {
      this.valueForm['email'].enable();
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
