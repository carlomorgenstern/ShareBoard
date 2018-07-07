import { AbstractControl, FormArray, FormGroup } from '@angular/forms';

export function markAsTouchedDeep(control: AbstractControl): void {
  control.markAsTouched();

  if (control instanceof FormGroup) {
    Object.values(control.controls).forEach(markAsTouchedDeep);
  } else if (control instanceof FormArray) {
    control.controls.forEach(markAsTouchedDeep);
  }
}
