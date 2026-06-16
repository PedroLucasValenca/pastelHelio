import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'inicio',
    loadComponent: () => import('./home/home-page/home-page').then((m) => m.HomePageComponent),
  },
  {
    path: 'cardapio',
    loadComponent: () => import('./menu/menu-page').then((m) => m.MenuPageComponent),
  },
  {
    path: 'locais',
    loadComponent: () => import('./locations/locations-page').then((m) => m.LocationsPageComponent),
  },
  {
    path: 'eventos',
    loadComponent: () => import('./events/events-page').then((m) => m.EventsPageComponent),
  },
  {
    path: 'fale-conosco',
    loadComponent: () => import('./contact/contact-page').then((m) => m.ContactPageComponent),
  },
  {
    path: '',
    redirectTo: 'inicio',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'inicio',
  },
];
