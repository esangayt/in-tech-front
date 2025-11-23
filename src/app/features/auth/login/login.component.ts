import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { ErrorAlertComponent } from '@shared/components/error-alert/error-alert.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ErrorAlertComponent
  ],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = signal(false);
  errorMessage = signal('');
  hidePassword = true;
  returnUrl: string = '/persons';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // Get return url from route parameters or default to '/persons'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/persons';
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate([this.returnUrl]);
      },
      error: (error: any) => {
        this.loading.set(false);
        this.errorMessage.set(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    });
  }
}

