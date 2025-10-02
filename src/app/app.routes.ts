import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Dashboard } from './shared/components/dashboard/dashboard';
import { Welcome } from './shared/components/welcome/welcome';
import { Todo } from './practice-tests/todo/todo';
import { Weather } from './practice-tests/weather/weather';
import { Maps } from './practice-tests/maps/maps';
import { Error } from './shared/components/error/error';
import { authGuardGuard } from './core/guards/auth-guard-guard';

export const routes: Routes = [
  { path: '', component: Login },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuardGuard],
    children: [
      { path: '', component: Welcome },
      { path: 'todo', component: Todo },
      { path: 'weather', component: Weather },
      { path: 'maps', component: Maps },
    ],
  },
  { path: '**', component: Error },
];
