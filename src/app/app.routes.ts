import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Upload } from './components/upload/upload';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'upload', component: Upload },
  { path: '**', redirectTo: '' }
];
