import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PersonService } from '@core/services/person.service';
import { Person, PersonFilters } from '@core/models/person.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorAlertComponent
  ],
  templateUrl: './person-list.component.html'
})
export class PersonListComponent implements OnInit {
  persons = signal<Person[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);

  filterForm: FormGroup;
  Math = Math;

  // Columnas de la tabla Material
  displayedColumns: string[] = ['name', 'email', 'created_at', 'actions'];

  constructor(
    private personService: PersonService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      search: [''],
      ordering: ['']
    });
  }

  ngOnInit(): void {
    this.loadPersons();
  }

  loadPersons(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const filters: PersonFilters = {
      ...this.filterForm.value,
      page: this.currentPage(),
      page_size: this.pageSize()
    };

    console.log(filters, 'filters')

    Object.keys(filters).forEach(key => {
      if (!filters[key as keyof PersonFilters]) {
        delete filters[key as keyof PersonFilters];
      }
    });

    this.personService.getPersons(filters).subscribe({
      next: (response) => {
        this.persons.set(response.results);
        this.totalCount.set(response.count);
        this.totalPages.set(Math.ceil(response.count / this.pageSize()));
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al cargar las personas');
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadPersons();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage.set(1);
    this.loadPersons();
  }

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
    this.loadPersons();
  }

  confirmDelete(person: Person): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar a ${person.first_name} ${person.last_name}?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && person.id) {
        this.deletePerson(person.id);
      }
    });
  }

  deletePerson(personId: number): void {
    this.personService.deletePerson(personId).subscribe({
      next: () => {
        this.loadPersons();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al eliminar la persona');
      }
    });
  }
}
