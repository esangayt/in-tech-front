import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Observable, catchError, of, tap } from 'rxjs';
import { environment } from '@env/environment';
import { HealthStatus, BackendStatus } from '@core/models/health.model';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  public backendStatus = signal<BackendStatus>('checking');
  public healthData = signal<HealthStatus | null>(null);

  private checkInterval = 30000; // 30 segundos

  constructor(private http: HttpClient) {
    this.startHealthCheck();
  }

  private startHealthCheck(): void {
    // Primer check inmediato
    this.checkHealth();

    // Checks periódicos cada 30 segundos
    interval(this.checkInterval).subscribe(() => {
      this.checkHealth();
    });
  }

  private checkHealth(): void {
    this.backendStatus.set('checking');

    this.http.get<HealthStatus>(`${environment.apiBaseUrl}/healthz`)
      .pipe(
        tap(response => {
          this.healthData.set(response);
          this.backendStatus.set('online');
        }),
        catchError(err => {
          console.warn('Health check failed:', err);
          this.backendStatus.set('offline');
          this.healthData.set(null);
          return of(null);
        })
      )
      .subscribe();
  }

  manualCheck(): void {
    this.checkHealth();
  }
}

