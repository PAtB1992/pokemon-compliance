import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../core/api.service';
import { Violation } from '../core/models';

@Component({
  selector: 'app-violation-list',
  standalone: true,
  imports: [DatePipe],
  template: `
    <section class="card">
      <h2>Alle bisher erkannten Verstöße</h2>
      @if (violations().length === 0) {
        <p>Noch keine Verstöße erfasst - führe zuerst einen Roster-Check durch.</p>
      } @else {
        <table>
          <thead>
            <tr><th>Regel</th><th>Schwere</th><th>Details</th><th>Erstellt</th></tr>
          </thead>
          <tbody>
            @for (v of violations(); track v.id) {
              <tr>
                <td>{{ v.ruleName }}</td>
                <td>{{ v.severity }}</td>
                <td>{{ v.details }}</td>
                <td>{{ v.createdAt | date: 'short' }}</td>
              </tr>
            }
          </tbody>
        </table>
      }
    </section>
  `,
})
export class ViolationListComponent {
  private api = inject(ApiService);
  violations = signal<Violation[]>([]);

  constructor() {
    this.api.getViolations().subscribe((v) => this.violations.set(v));
  }
}
