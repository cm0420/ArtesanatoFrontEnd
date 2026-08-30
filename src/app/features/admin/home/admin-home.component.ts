import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
import { AdminOrdersService } from '../admin-orders.service';
import { AdminHeaderComponent } from '../../../shared/ui/admin-header/admin-header.component';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [RouterLink, AdminHeaderComponent],
  templateUrl: './admin-home.component.html',
})
export class AdminHomeComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly adminOrdersService = inject(AdminOrdersService);

  readonly pendingShipmentCount = signal(0);
  readonly refundRequestedCount = signal(0);
  readonly ordersNeedingAttention = computed(() => this.pendingShipmentCount() + this.refundRequestedCount());

  ngOnInit(): void {
    this.adminService.getPendingShipmentOrders(0, 1).subscribe((page) => {
      this.pendingShipmentCount.set(page.totalElements);
    });
    this.adminOrdersService.listAllOrders(0, 1, 'ESTORNO_SOLICITADO').subscribe((page) => {
      this.refundRequestedCount.set(page.totalElements);
    });
  }
}
