import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="navbar-container">
        <div class="navbar-brand" (click)="navigate('/dashboard')">
          <h2>📊 Sistema Gestión Proyectos</h2>
        </div>
        <ul class="navbar-menu">
          <li><a routerLink="/dashboard" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/proyectos" routerLinkActive="active">Proyectos</a></li>
        </ul>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .navbar-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .navbar-brand {
      cursor: pointer;
    }

    .navbar-brand h2 {
      margin: 0;
      font-size: 1.5rem;
    }

    .navbar-menu {
      display: flex;
      list-style: none;
      gap: 2rem;
      margin: 0;
      padding: 0;
    }

    .navbar-menu a {
      color: white;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.3s;
    }

    .navbar-menu a:hover,
    .navbar-menu a.active {
      background-color: rgba(255, 255, 255, 0.2);
    }

    @media (max-width: 768px) {
      .navbar-container {
        flex-direction: column;
        gap: 1rem;
      }

      .navbar-menu {
        gap: 1rem;
      }
    }
  `]
})
export class NavbarComponent {
  constructor(private router: Router) {}

  navigate(path: string): void {
    this.router.navigate([path]);
  }
}
