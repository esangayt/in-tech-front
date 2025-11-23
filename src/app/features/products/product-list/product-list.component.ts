import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ProductService } from '@core/services/product.service';
import { Product, ProductFilters } from '@core/models/product.model';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '@shared/components/empty-state/empty-state.component';
import { ConfirmDialogComponent, ConfirmDialogData } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ErrorAlertComponent
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products = signal<Product[]>([]);
  loading = signal(false);
  errorMessage = signal('');
  currentPage = signal(1);
  pageSize = signal(10);
  totalCount = signal(0);
  totalPages = signal(0);

  filterForm: FormGroup;
  Math = Math;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      q: [''],
      sku: [''],
      price_min: [''],
      price_max: [''],
      ordering: ['']
    });
  }

  ngOnInit(): void {
    this.loadProducts();

    // Search with debounce
    this.filterForm.get('q')?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadProducts();
      });
  }

  loadProducts(): void {
    this.loading.set(true);
    this.errorMessage.set('');

    const filters: ProductFilters = {
      ...this.filterForm.value,
      page: this.currentPage()
    };

    // Remove empty filters
    Object.keys(filters).forEach(key => {
      const value = filters[key as keyof ProductFilters];
      if (value === '' || value === null || value === undefined) {
        delete filters[key as keyof ProductFilters];
      }
    });

    this.productService.getProducts(filters).subscribe({
      next: (response) => {
        this.products.set(response.results);
        this.totalCount.set(response.count);
        this.totalPages.set(Math.ceil(response.count / this.pageSize()));
        this.loading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al cargar los productos');
        this.loading.set(false);
      }
    });
  }

  applyFilters(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.currentPage.set(1);
    this.loadProducts();
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.update(p => p - 1);
      this.loadProducts();
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(p => p + 1);
      this.loadProducts();
    }
  }

  confirmDelete(product: Product): void {
    const dialogData: ConfirmDialogData = {
      title: 'Confirmar eliminación',
      message: `¿Está seguro que desea eliminar el producto "${product.name}"?`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    };

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && product.id) {
        this.deleteProduct(product.id);
      }
    });
  }

  deleteProduct(productId: number): void {
    this.productService.deleteProduct(productId).subscribe({
      next: () => {
        this.loadProducts();
      },
      error: (error) => {
        this.errorMessage.set(error.message || 'Error al eliminar el producto');
      }
    });
  }
}

