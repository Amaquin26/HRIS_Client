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
    SelectModule
  ],
  templateUrl: './entra-users.html',
  styleUrl: './entra-users.css',
})
export class EntraUsers implements OnInit{

  private readonly employeeService = inject(EmployeeService);
  private readonly destroyRef = inject(DestroyRef);
  
  entraUsers = signal<EntraUser[]>([]);
  skipToken = signal<string | null | undefined>(null);
  totalRecords = signal(0);
  isTableLoading = signal(true);
  pageSize = 10;
  searchTerm = "";
  pageSizes = [1,10,20,30,50]

  ngOnInit(): void {
    this.getGraphUsersPaginated();
  }

  onPageSizeChange(){
    this.getGraphUsersPaginated();
  }

  onSearchTermChange(){
    this.getGraphUsersPaginated();
  }

  onLoadMore(){
    this.getGraphUsersPaginated(true);
  }

  getGraphUsersPaginated(isLoadMore:boolean = false){
    this.isTableLoading.set(true);

    this.employeeService.getGraphUsersPaginated({
      pageNumber: 1,
      pageSize: this.pageSize,
      skipToken: this.skipToken(),
      searchTerm: this.searchTerm
    })
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (response) => {
        this.skipToken.set(response.skipToken);
        this.totalRecords.set(response.totalRecords)

        if (!isLoadMore){
          this.entraUsers.set(response.items);
        }else{
          this.entraUsers.update((prev) => [...prev,...response.items]);
        }
      },
      complete: () => this.isTableLoading.set(false)
    })
  }


}
