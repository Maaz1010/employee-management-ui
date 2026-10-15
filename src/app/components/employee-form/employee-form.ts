import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.html',
})

/**
 * Reactive form used for both Add and Edit employee.
 * The mode comes from the URL: /employees/new has no :id (add mode, empty form, POST),
 * while /employees/:id/edit has an :id (edit mode, form pre-filled via getById, PUT).
 * * ngOnInit() reads the :id and sets isEditMode, and 
 * ? onSubmit() uses that flag to choose between create() and update(). On success it navigates back to the list.
 */

// ! url : /employees/new , url : /employees/:id/edit

export class EmployeeForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);

  employeeId: number | null = null;
  isEditMode = signal(false);
  generalError = signal('');
  loadFailed = signal(false);
  submitting = signal(false);

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.employeeId = Number(idParam);
      this.isEditMode.set(true);
      this.employeeService.getById(this.employeeId).subscribe({
        next: (emp) => this.form.patchValue(emp),
        error: () => this.loadFailed.set(true),
      });
    }
  }

  onSubmit() {
    this.generalError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const employee: Employee = this.form.getRawValue();
    const request = this.isEditMode()
      ? this.employeeService.update(this.employeeId!, employee)
      : this.employeeService.create(employee);

    this.submitting.set(true);

    request.subscribe({
      next: () => this.router.navigate(['/employees']),
      error: (err) =>
        this.generalError.set(
          err.error?.message ?? 'Could not save. Please check the data and try again.'
        ),
    });
  }
}