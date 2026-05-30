import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { EmployeeDto } from '../../models/employee/employee.dto';
import { MessageService } from 'primeng/api';
import { EmployeeService } from '../../services/employee-service/employee-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { FormatDatePipe } from '../../pipes/format-date/format-date-pipe';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees-page',
  imports: [
    ButtonModule,
    ToastModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    CardModule,
    InputIconModule,
    FormsModule,
    PaginatorModule,
    FormatDatePipe,
  ],
  templateUrl: './employees-page.html',
  styleUrl: './employees-page.css',
})
export class EmployeesPage implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  employees = signal<EmployeeDto[]>([]);

  isTableLoading = signal(true);
  skipToken = signal<string | null | undefined>(null);
  totalRecords = signal(50);
  pageNumber = 1;
  pageSize = 10;
  searchTerm = '';
  pageSizes = [10, 20, 30, 50];

  ngOnInit(): void {
    this.getEmployees();
  }

  getEmployees() {
    this.isTableLoading.set(true);

    this.employeeService
      .getEmployeesPaginated({
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        searchTerm: this.searchTerm,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isTableLoading.set(false)),
      )
      .subscribe({
        next: (result) => {
          this.employees.set(result.items);
          this.totalRecords.set(result.totalRecords);
        },
      });
  }

  onSearchTermChange() {
    this.pageNumber = 1;
    this.getEmployees();
  }

  onPageChange(event: PaginatorState) {
    this.pageNumber = event.page ? event.page + 1 : 1;
    this.pageSize = event.rows ?? 10;

    this.getEmployees();
  }

  navigateToEmployeeProfile(id: number) {
    this.router.navigate(['employees', id]);
  }
}
