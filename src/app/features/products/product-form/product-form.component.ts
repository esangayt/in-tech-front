import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '@core/services/product.service';
import { PersonService } from '@core/services/person.service';
import { Product } from '@core/models/product.model';
import { Person } from '@core/models/person.model';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-product-form',
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
    MatSelectModule,
    ErrorAlertComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './product-form.component.html'
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  loading = signal(false);
  initialLoading = signal(false);
  loadingPersons = signal(false);
  errorMessage = signal('');
  isEditMode = signal(false);
  productId: string | null = null;
  persons = signal<Person[]>([]);

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private personService: PersonService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(150)]],
      sku: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      price: [0, [Validators.required, Validators.min(0)]],
      owner: [null]
    });
  }

  ngOnInit(): void {
    this.loadPersons();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productId = `${id}`
      this.isEditMode.set(true);
      this.loadProduct();
    }
  }

  loadPersons(): void {
    this.loadingPersons.set(true);
    this.personService.getPersons().subscribe({
      next: (response) => {
        this.persons.set(response.results);
        this.loadingPersons.set(false);
      },
      error: (error) => {
        console.error('Error loading persons:', error);
        this.loadingPersons.set(false);
      }
    });
  }

  loadProduct(): void {
    if (!this.productId) return;

    this.initialLoading.set(true);
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.name,
          sku: product.sku,
          price: product.price,
          owner: product.owner
        });
        this.initialLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al cargar el producto');
        this.initialLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      Object.keys(this.productForm.controls).forEach(key => {
        this.productForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    const productData: Product = {
      ...this.productForm.value,
      owner: this.productForm.value.owner || null
    };

    const request = this.isEditMode() && this.productId
      ? this.productService.updateProduct(this.productId, productData)
      : this.productService.createProduct(productData);

    request.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al guardar el producto');
        this.loading.set(false);
      }
    });
  }
}

