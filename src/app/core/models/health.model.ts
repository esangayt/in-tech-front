export interface HealthStatus {
  status: string;
  service?: string;
}

export interface ReadyStatus {
  status: string;
  database: string;
  cache: string;
}

export type BackendStatus = 'online' | 'offline' | 'checking';

