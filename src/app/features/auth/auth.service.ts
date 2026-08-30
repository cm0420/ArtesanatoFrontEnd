import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DecodedAccessToken, LoginRequest, Role, SignupRequest, TokenResponse } from '../../core/models/auth.model';
import { decodeAccessToken } from '../../core/utils/jwt.util';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly accessToken = signal<string | null>(null);
  private readonly decoded = computed<DecodedAccessToken | null>(() => {
    const token = this.accessToken();
    return token ? decodeAccessToken(token) : null;
  });

  readonly isAuthenticated = computed(() => this.accessToken() !== null);
  readonly role = computed<Role | null>(() => this.decoded()?.role ?? null);

  constructor(private readonly http: HttpClient) {}

  login(request: LoginRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/login`, request, { withCredentials: true })
      .pipe(tap((response) => this.accessToken.set(response.accessToken)));
  }

  signup(request: SignupRequest): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/signup`, request, { withCredentials: true })
      .pipe(tap((response) => this.accessToken.set(response.accessToken)));
  }

  refresh(): Observable<TokenResponse> {
    return this.http
      .post<TokenResponse>(`${environment.apiUrl}/auth/refresh`, null, { withCredentials: true })
      .pipe(tap((response) => this.accessToken.set(response.accessToken)));
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(`${environment.apiUrl}/auth/logout`, null, { withCredentials: true })
      .pipe(tap(() => this.accessToken.set(null)));
  }

  getAccessToken(): string | null {
    return this.accessToken();
  }
}
