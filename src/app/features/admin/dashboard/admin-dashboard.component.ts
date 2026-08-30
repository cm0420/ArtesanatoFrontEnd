import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminService } from '../admin.service';
import { BestSellingPieceResponse, SalesReportResponse } from '../../../core/models/admin.model';
import { OrderResponse } from '../../../core/models/order.model';
import { AdminHeaderComponent } from '../../../shared/ui/admin-header/admin-header.component';
import { BackLinkComponent } from '../../../shared/ui/back-link/back-link.component';

function toDateInputValue(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const PENDING_PAGE_SIZE = 10;

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink, AdminHeaderComponent, BackLinkComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);

  private readonly today = new Date();
  private readonly thirtyDaysAgo = new Date(this.today.getTime() - 29 * 24 * 60 * 60 * 1000);

  readonly startDate = signal(toDateInputValue(this.thirtyDaysAgo));
  readonly endDate = signal(toDateInputValue(this.today));

  readonly salesReport = signal<SalesReportResponse | null>(null);
  readonly salesLoading = signal(true);

  readonly bestSelling = signal<BestSellingPieceResponse[]>([]);
  readonly bestSellingLoading = signal(true);

  readonly pendingOrders = signal<OrderResponse[]>([]);
  readonly pendingPage = signal(0);
  readonly pendingTotalPages = signal(0);
  readonly pendingLoading = signal(true);

  readonly pendingHasPrev = computed(() => this.pendingPage() > 0);
  readonly pendingHasNext = computed(() => this.pendingPage() + 1 < this.pendingTotalPages());

  ngOnInit(): void {
    this.loadSalesReport();
    this.loadBestSelling();
    this.loadPendingShipment();
  }

  loadSalesReport(): void {
    this.salesLoading.set(true);
    this.adminService.getSalesReport(this.startDate(), this.endDate()).subscribe((report) => {
      this.salesReport.set(report);
      this.salesLoading.set(false);
    });
  }

  goToPendingPage(delta: number): void {
    this.pendingPage.update((current) => current + delta);
    this.loadPendingShipment();
  }

  private loadBestSelling(): void {
    this.bestSellingLoading.set(true);
    this.adminService.getBestSellingPieces(10).subscribe((pieces) => {
      this.bestSelling.set(pieces);
      this.bestSellingLoading.set(false);
    });
  }

  private loadPendingShipment(): void {
    this.pendingLoading.set(true);
    this.adminService.getPendingShipmentOrders(this.pendingPage(), PENDING_PAGE_SIZE).subscribe((result) => {
      this.pendingOrders.set(result.content);
      this.pendingTotalPages.set(result.totalPages);
      this.pendingLoading.set(false);
    });
  }
}
