import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ComplianceCheckResult, Trainer, TournamentRule, Violation } from './models';

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  getTrainers(): Observable<Trainer[]> {
    return this.http.get<Trainer[]>(`${BASE_URL}/trainers`);
  }

  getRules(): Observable<TournamentRule[]> {
    return this.http.get<TournamentRule[]>(`${BASE_URL}/rules`);
  }

  getViolations(): Observable<Violation[]> {
    return this.http.get<Violation[]>(`${BASE_URL}/violations`);
  }

  checkRoster(trainerId: string, ruleId: string): Observable<ComplianceCheckResult> {
    return this.http.post<ComplianceCheckResult>(`${BASE_URL}/compliance/check`, { trainerId, ruleId });
  }
}
