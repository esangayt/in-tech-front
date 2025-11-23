import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PersonService } from '@core/services/person.service';
import { Person, PersonFilters } from '@core/models/person.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-person-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ConfirmDialogComponent,
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
  showDeleteDialog = signal(false);
  personToDelete = signal<Person | null>(null);

  filterForm: FormGroup;
  Math = Math;

  constructor(
    private personService: PersonService,
    private fb: FormBuilder
  ) {
    this.filterForm = this.fb.group({
      email: [''],
      last_name: [''],
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
      page: this.currentPage()
    };

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

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadPersons();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadPersons();
    }
  }

  confirmDelete(person: Person): void {
    this.personToDelete.set(person);
    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.personToDelete.set(null);
    this.showDeleteDialog.set(false);
  }

  deletePerson(): void {
    const person = this.personToDelete();
    if (!person?.id) return;

    this.personService.deletePerson(person.id).subscribe({
      next: () => {
        this.showDeleteDialog.set(false);
        this.personToDelete.set(null);
        this.loadPersons();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al eliminar la persona');
        this.showDeleteDialog.set(false);
      }
    });
  }
}

