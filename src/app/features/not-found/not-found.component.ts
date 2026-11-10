import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteHeaderComponent } from '../../shared/ui/site-header/site-header.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, SiteHeaderComponent],
  template: `
    <div class="min-h-screen">
      <app-site-header />
      <main
        id="conteudo"
        class="max-w-3xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center flex flex-col items-center gap-6"
      >
        <p class="font-body text-xs font-semibold uppercase tracking-[0.16em] text-clay">Erro 404</p>
        <h1 class="font-display text-5xl sm:text-6xl text-ink">Página não encontrada</h1>
        <p class="font-body text-lg text-stone max-w-md">
          O endereço que você tentou abrir não existe ou foi movido.
        </p>
        <a
          routerLink="/"
          class="inline-flex items-center h-12 px-7 rounded-full bg-forest text-canvas font-body text-sm font-semibold hover:bg-moss"
        >
          Voltar para a loja
        </a>
      </main>
    </div>
  `,
})
export class NotFoundComponent {}
