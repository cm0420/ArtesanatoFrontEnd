import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogService } from '../catalog.service';
import { SiteHeaderComponent } from '../../../shared/ui/site-header/site-header.component';
import { CategoryResponse, PieceResponse, PieceSetResponse } from '../../../core/models/catalog.model';

const SEARCH_PAGE_SIZE = 100;
const SETS_PAGE_SIZE = 12;

type CatalogView = 'pecas' | 'conjuntos';

@Component({
  selector: 'app-catalog-list',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, SiteHeaderComponent],
  templateUrl: './catalog-list.component.html',
})
export class CatalogListComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);

  private static readonly PAGE_SIZE = 12;

  readonly view = signal<CatalogView>('pecas');

  readonly categories = signal<CategoryResponse[]>([]);
  readonly selectedCategoryId = signal<string | null>(null);
  readonly pieces = signal<PieceResponse[]>([]);
  readonly page = signal(0);
  readonly totalPages = signal(0);
  readonly loading = signal(true);

  readonly searchQuery = signal('');
  readonly searchResults = signal<PieceResponse[] | null>(null);
  readonly isSearching = computed(() => this.searchQuery().trim().length > 0);
  readonly filteredSearchResults = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    return (this.searchResults() ?? []).filter((piece) => piece.name.toLowerCase().includes(query));
  });

  readonly displayedPieces = computed(() => (this.isSearching() ? this.filteredSearchResults() : this.pieces()));

  readonly hasPrev = computed(() => this.page() > 0);
  readonly hasNext = computed(() => this.page() + 1 < this.totalPages());

  readonly sets = signal<PieceSetResponse[]>([]);
  readonly setsPage = signal(0);
  readonly setsTotalPages = signal(0);
  readonly setsLoading = signal(true);
  private setsLoaded = false;

  readonly setsHasPrev = computed(() => this.setsPage() > 0);
  readonly setsHasNext = computed(() => this.setsPage() + 1 < this.setsTotalPages());

  ngOnInit(): void {
    this.catalogService.listCategories().subscribe((categories) => this.categories.set(categories));
    this.loadPieces();
  }

  switchView(view: CatalogView): void {
    this.view.set(view);
    if (view === 'conjuntos' && !this.setsLoaded) {
      this.setsLoaded = true;
      this.loadSets();
    }
  }

  goToSetsPage(delta: number): void {
    this.setsPage.update((current) => current + delta);
    this.loadSets();
  }

  private loadSets(): void {
    this.setsLoading.set(true);
    this.catalogService.listSets(this.setsPage(), SETS_PAGE_SIZE).subscribe((result) => {
      this.sets.set(result.content);
      this.setsTotalPages.set(result.totalPages);
      this.setsLoading.set(false);
    });
  }

  selectCategory(categoryId: string | null): void {
    if (this.selectedCategoryId() === categoryId) {
      return;
    }
    this.selectedCategoryId.set(categoryId);
    this.page.set(0);
    this.loadPieces();
    if (this.isSearching()) {
      this.loadSearchPool();
    }
  }

  onSearchInput(query: string): void {
    this.searchQuery.set(query);
    if (query.trim().length > 0 && this.searchResults() === null) {
      this.loadSearchPool();
    }
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  goToPage(delta: number): void {
    this.page.update((current) => current + delta);
    this.loadPieces();
  }

  private loadPieces(): void {
    this.loading.set(true);
    this.catalogService
      .listPieces(this.page(), CatalogListComponent.PAGE_SIZE, this.selectedCategoryId() ?? undefined)
      .subscribe((result) => {
        this.pieces.set(result.content);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      });
  }

  private loadSearchPool(): void {
    this.catalogService
      .listPieces(0, SEARCH_PAGE_SIZE, this.selectedCategoryId() ?? undefined)
      .subscribe((result) => this.searchResults.set(result.content));
  }
}
