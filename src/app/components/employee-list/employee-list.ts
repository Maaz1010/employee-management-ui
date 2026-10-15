import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Employee } from '../../models/employee';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink],
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  loading = signal(true);
  errorMessage = signal('');
  searchTerm = signal('');

  ngOnInit() {
    this.employeeService.getAll().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load employees. Is the backend running?');
        this.loading.set(false);
      },
    });
  }

  deleteEmployee(id: number) {
    if (!confirm('Delete this employee?')) return;

    this.employeeService.delete(id).subscribe({
      next: () => {
        this.employees.update(list => list.filter(e => e.id !== id));
      },
      error: () => alert('Could not delete employee.'),
    });
  }


  filteredEmployees = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return this.employees();

    return this.employees().filter(
      (e) => e.name.toLowerCase().includes(term) || e.email.toLowerCase().includes(term) || e.phone.includes(term)
    );
  });

  applySearch(value: string) {
    this.searchTerm.set(value);
  }

  clearSearch(box: HTMLInputElement) {
    box.value = '';
    this.searchTerm.set('');
  }

}