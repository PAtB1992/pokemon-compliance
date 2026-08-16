import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { ComplianceCheckResult, Trainer, TournamentRule } from '../core/models';

@Component({
  selector: 'app-roster-check',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="card">
      <h2>Roster gegen eine Turnier-Regel prüfen</h2>

      <label>
        Trainer
        <select [(ngModel)]="selectedTrainerId">
          <option value="" disabled selected>Trainer wählen…</option>
          @for (trainer of trainers(); track trainer.id) {
            <option [value]="trainer.id">{{ trainer.name }} ({{ trainer.region }})</option>
          }
        </select>
      </label>

      <label>
        Regel
        <select [(ngModel)]="selectedRuleId">
          <option value="" disabled selected>Regel wählen…</option>
          @for (rule of rules(); track rule.id) {
            <option [value]="rule.id">{{ rule.name }}</option>
          }
        </select>
      </label>

      <button (click)="check()" [disabled]="!selectedTrainerId || !selectedRuleId || loading()">
        {{ loading() ? 'Prüfe…' : 'Prüfen' }}
      </button>

      @if (result(); as res) {
        <div class="result" [class.ok]="res.isCompliant" [class.fail]="!res.isCompliant">
          @if (res.isCompliant) {
            <p>✅ Regelkonform - keine Verstöße gefunden.</p>
          } @else {
            <p>⚠️ {{ res.violations.length }} Verstoß/Verstöße gefunden:</p>
            <ul>
              @for (v of res.violations; track v.id) {
                <li>[{{ v.severity }}] {{ v.details }}</li>
              }
            </ul>
          }
        </div>
      }
    </section>
  `,
})
export class RosterCheckComponent {
  private api = inject(ApiService);

  trainers = signal<Trainer[]>([]);
  rules = signal<TournamentRule[]>([]);
  result = signal<ComplianceCheckResult | null>(null);
  loading = signal(false);

  selectedTrainerId = '';
  selectedRuleId = '';

  constructor() {
    this.api.getTrainers().subscribe((t) => this.trainers.set(t));
    this.api.getRules().subscribe((r) => this.rules.set(r));
  }

  check() {
    this.loading.set(true);
    this.result.set(null);
    this.api.checkRoster(this.selectedTrainerId, this.selectedRuleId).subscribe({
      next: (res) => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
