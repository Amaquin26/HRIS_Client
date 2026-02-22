import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { EntraUser } from '../../models/entra-user/entra-user.model';
import { ButtonModule } from 'primeng/button';
import { EmployeeService } from '../../services/employee-service/employee-service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { finalize } from 'rxjs';
import { CreateRecordDialog } from './components/create-record-dialog/create-record-dialog';
import { EmployeeStatusService } from '../../services/employee-status-service/employee-status-service';
import { EmployeeStatus } from '../../models/employee/employee-status.model';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AddEmployeeRecord } from '../../models/employee/add-employee-record';
import { ProblemDetails } from '../../models/exception/problem-details.model';

@Component({
  selector: 'app-entra-users',
  imports: [
    CardModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    TableModule,
    ButtonModule,
    FormsModule,
    SelectModule,
    CreateRecordDialog,
    ToastModule,
  ],
  templateUrl: './entra-users-page.html',
  styleUrl: './entra-users-page.css',
  providers: [MessageService],
})
export class EntraUsersPage implements OnInit {
  private readonly employeeService = inject(EmployeeService);
  private readonly employeeStatusService = inject(EmployeeStatusService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly messageService = inject(MessageService);

  entraUsers = signal<EntraUser[]>([]);
  employeeStatuses = signal<EmployeeStatus[]>([]);

  isCreateRecordDialogVisible = signal(false);
  selectedEntraUser = signal<EntraUser | null>(null);

  isTableLoading = signal(true);
  skipToken = signal<string | null | undefined>(null);
  totalRecords = signal(0);
  pageSize = 10;
  searchTerm = '';
  pageSizes = [10, 20, 30, 50];

  ngOnInit(): void {
    this.getEmployeeStatus();
    this.getGraphUsersPaginated();
  }

  onLoadMore() {
    this.getGraphUsersPaginated(true);
  }

  getGraphUsersPaginated(isLoadMore: boolean = false) {
    this.isTableLoading.set(true);

    this.employeeService
      .getGraphUsersPaginated({
        pageNumber: 1,
        pageSize: this.pageSize,
        skipToken: this.skipToken(),
        searchTerm: this.searchTerm,
      })
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.isTableLoading.set(false)),
      )
      .subscribe({
        next: (response) => {
          this.skipToken.set(response.skipToken);
          this.totalRecords.set(response.totalRecords);

          if (!isLoadMore) {
            this.entraUsers.set(response.items);
          } else {
            this.entraUsers.update((prev) => [...prev, ...response.items]);
          }
        },
      });
  }

  getEmployeeStatus() {
    this.employeeStatusService
      .getEmployeeStatuses()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (result) => this.employeeStatuses.set(result),
      });
  }

  onOpenCreateRecordDialog(entraUser: EntraUser) {
    this.selectedEntraUser.set(entraUser);
    this.isCreateRecordDialogVisible.set(true);
  }

  onCloseCreateRecordDialog() {
    this.isCreateRecordDialogVisible.set(false);
    this.selectedEntraUser.set(null);
  }

  onFormSubmit(employeeRecord: AddEmployeeRecord) {
    this.messageService.add({
      severity: 'info',
      summary: 'Processing Request',
      detail: 'Adding employee record.',
    });

    this.employeeService
      .addEmployeeRecord(employeeRecord)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee record added successfully',
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: err?.error?.title ?? 'An error occured',
            detail: err?.error?.detail ?? 'Something went wrong while processing your request.',
          });
        },
      });
  }
}
