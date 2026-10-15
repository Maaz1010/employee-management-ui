import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee';

/**
 * Read-only page showing one employee.
 * Reads :id from the URL (/employees/:id), loads it with getById(),
 * and shows a not-found message if the backend returns 404.
 */

//! url : /employees/:id
@Component({
  selector: 'app-employee-detail',
  imports: [RouterLink],
  templateUrl: './employee-detail.html',
})
export class EmployeeDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private employeeService = inject(EmployeeService);

  employee = signal<Employee | null>(null);
  loading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.employeeService.getById(id).subscribe({
      next: (emp) => {
        this.employee.set(emp);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set(`Employee with id ${id} not found.`);
        this.loading.set(false);
      },
    });
  }
}