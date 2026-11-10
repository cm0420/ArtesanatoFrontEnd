import { Injectable, computed, inject, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';

/**
 * Estado global de "carregando" para o overlay do app.
 *
 * Fica ativo enquanto há navegação de rota em andamento OU alguma leitura (GET) da
 * API pendente — assim a página só aparece quando os dados (catálogo/estoque) chegam,
 * em vez de abrir vazia e preencher de uma vez. Ações (POST/PUT/...) não movem o
 * overlay; elas têm o próprio feedback nos botões.
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pending = signal(0);
  private readonly navigating = signal(false);

  readonly active = computed(() => this.navigating() || this.pending() > 0);

  constructor() {
    const router = inject(Router);
    router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.navigating.set(true);
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        this.navigating.set(false);
      }
    });
  }

  start(): void {
    this.pending.update((n) => n + 1);
  }

  done(): void {
    this.pending.update((n) => Math.max(0, n - 1));
  }
}
