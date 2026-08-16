import { Routes } from '@angular/router';
import { RosterCheckComponent } from './compliance/roster-check.component';
import { ViolationListComponent } from './compliance/violation-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'check', pathMatch: 'full' },
  { path: 'check', component: RosterCheckComponent },
  { path: 'violations', component: ViolationListComponent },
];
