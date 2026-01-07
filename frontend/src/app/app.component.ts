import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <div class="main-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .main-container {
      padding: 2rem;
      min-height: calc(100vh - 64px);
    }
  `]
})
export class AppComponent {
  title = 'Sistema de Gestión Integral de Proyectos';
}
