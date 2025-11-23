import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-error-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './error-alert.component.html'
})
export class ErrorAlertComponent {
  @Input() title = 'Error';
  @Input() message = '';
  @Output() dismissed = new EventEmitter<void>();


  close(): void {
    this.message = '';
    this.dismissed.emit();
  }
}

