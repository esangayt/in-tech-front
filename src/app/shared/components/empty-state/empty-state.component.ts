import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  templateUrl: './empty-state.component.html'
})
export class EmptyStateComponent {
  @Input() title = 'No hay resultados';
  @Input() message = 'No se encontraron elementos para mostrar.';
}

