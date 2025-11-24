import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PersonService } from '@core/services/person.service';
import { Person } from '@core/models/person.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-person-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    LoadingSpinnerComponent,
    ErrorAlertComponent
  ],
  templateUrl: './person-form.component.html'
})
export class PersonFormComponent implements OnInit {
  personForm: FormGroup;
  loading = signal(false);
  initialLoading = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  personId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.personForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.maxLength(100)]],
      last_name: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.personId = `${id}`
      this.isEditMode.set(true);
      this.loadPerson();
    }
  }

  loadPerson(): void {
    if (!this.personId) return;

    this.initialLoading.set(true);
    this.personService.getPerson(this.personId).subscribe({
      next: (person) => {
        this.personForm.patchValue(person);
        this.initialLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al cargar la persona');
        this.initialLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.personForm.invalid) {
      this.personForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const personData: Person = this.personForm.value;

    const request = this.isEditMode() && this.personId
      ? this.personService.updatePerson(this.personId, personData)
      : this.personService.createPerson(personData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/persons']);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al guardar la persona');
        this.loading.set(false);
      }
    });
  }
}

