import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '@core/services/auth.service';
import { HealthService } from '@core/services/health.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './navbar.component.html',
  styles: [`
    .status-chip-online {
      background-color: #a5e1a7 !important;
      color: white !important;
    }

    .status-chip-offline {
      background-color: #f44336 !important;
      color: white !important;
    }

    .status-chip-checking {
      background-color: #ff9800 !important;
      color: white !important;
    }
  `]
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
