import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../services/loading.service';

/**
 * Liga o overlay global enquanto uma leitura (GET) da nossa API está pendente.
 * Só GET: é o que carrega dados de página (catálogo, estoque, pedidos). POST/PUT etc.
 * são ações do usuário e têm feedback próprio. Terceiros (ex: ViaCEP) passam intactos.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = environment.apiUrl
    ? req.url.startsWith(environment.apiUrl)
    : req.url.startsWith('/api') || req.url.startsWith('/auth');

  if (!isApiRequest || req.method !== 'GET') {
    return next(req);
  }

  const loading = inject(LoadingService);
  loading.start();
  return next(req).pipe(finalize(() => loading.done()));
};
