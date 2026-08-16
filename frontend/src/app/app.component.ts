import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header>
        <h1>Pokémon Compliance Center</h1>
        <nav>
          <a routerLink="/check" routerLinkActive="active">Roster-Check</a>
          <a routerLink="/violations" routerLinkActive="active">Verstöße</a>
        </nav>
      </header>
      <main>
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
