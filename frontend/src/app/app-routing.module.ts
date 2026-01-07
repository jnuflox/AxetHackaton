import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProyectoListComponent } from './components/proyecto-list/proyecto-list.component';
import { ProyectoDetailComponent } from './components/proyecto-detail/proyecto-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'proyectos', component: ProyectoListComponent },
  { path: 'proyectos/:id', component: ProyectoDetailComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

