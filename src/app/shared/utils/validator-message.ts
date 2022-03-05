import { FormGroup } from "@angular/forms";
import { capitalize } from "./string-utils";

export const validatorMessage = (primaryErrorMessage: string, valueForm: FormGroup['controls'], control: string, errorName?: string | string[], customControlName?: string): string | null => {
  const controlName = customControlName ? customControlName : capitalize(control);
  if (control === 'primary')
    return primaryErrorMessage;

  if (errorName) {
    let errorArray: string[] = [];
    if (typeof errorName === 'string') {
      errorArray.push(errorName);
    } else if (Array.isArray(errorName)) {
      errorArray = [...errorName];
    }

    let returnError = null;
    errorArray.forEach(error => {
      if (valueForm[control]?.hasError(error))
        if (error === 'required')
          returnError = `${controlName} required`;
        else if (error === 'email')
          returnError = `${controlName} is not valid`;
    });
    return returnError;
  }
  return null;
}
