import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/persons',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'persons',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/persons/person-list/person-list.component').then(m => m.PersonListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/persons/person-form/person-form.component').then(m => m.PersonFormComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/persons/person-form/person-form.component').then(m => m.PersonFormComponent)
      }
    ]
  },
  {
    path: 'products',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/products/product-list/product-list.component').then(m => m.ProductListComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      },
      {
        path: ':id/edit',
        loadComponent: () => import('./features/products/product-form/product-form.component').then(m => m.ProductFormComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/persons'
  }
];
