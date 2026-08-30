import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/auth.service';
import { CartService } from '../../../features/cart/cart.service';

@Component({
  selector: 'app-site-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './site-header.component.html',
})
export class SiteHeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly cartService = inject(CartService);

  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly itemCount = this.cartService.itemCount;

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.cartService.loadCart().subscribe();
    }
  }
}
