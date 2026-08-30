import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddressRequest } from '../../../core/models/customer.model';

const PHONE_PATTERN = /^\(?\d{2}\)?[\s-]?9?\d{4}-?\d{4}$/;
const ZIP_PATTERN = /^\d{8}$/;

@Component({
  selector: 'app-address-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './address-form.component.html',
})
export class AddressFormComponent {
  private readonly fb = inject(FormBuilder);

  @Input() submitting = false;
  @Input() showCancel = false;
  @Output() save = new EventEmitter<AddressRequest>();
  @Output() cancel = new EventEmitter<void>();

  readonly form = this.fb.nonNullable.group({
    label: ['', [Validators.required, Validators.maxLength(50)]],
    recipientName: ['', [Validators.required, Validators.maxLength(100)]],
    recipientPhone: ['', [Validators.required, Validators.pattern(PHONE_PATTERN)]],
    zipCode: ['', [Validators.required, Validators.pattern(ZIP_PATTERN)]],
    street: ['', [Validators.required]],
    number: ['', [Validators.required]],
    complement: [''],
    neighborhood: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required, Validators.maxLength(2)]],
    isDefault: [false],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.save.emit(this.form.getRawValue());
  }

  resetForm(): void {
    this.form.reset({ isDefault: false });
  }
}
