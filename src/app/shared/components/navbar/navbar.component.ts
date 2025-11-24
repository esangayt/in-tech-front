import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { HealthService } from '@core/services/health.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  authService = inject(AuthService);
  healthService = inject(HealthService);

  isAuthenticated = this.authService.isAuthenticated;
  backendStatus = this.healthService.backendStatus;

  userGreeting = computed(() => {
    const user = this.authService.getCurrentUser();
    if (!user) return 'Usuario';

    if (user.first_name || user.last_name) {
      return `${user.first_name || ''} ${user.last_name || ''}`.trim();
    }

    return user.username;
  });


  logout(): void {
    this.authService.logout();
  }

  refreshHealthCheck(): void {
    this.healthService.manualCheck();
  }

  getStatusColor(): string {
    const status = this.backendStatus();
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'checking':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  }

  getStatusText(): string {
    const status = this.backendStatus();
    switch (status) {
      case 'online':
        return 'En línea';
      case 'offline':
        return 'Desconectado';
      case 'checking':
        return 'Verificando...';
      default:
        return 'Desconocido';
    }
  }
}

