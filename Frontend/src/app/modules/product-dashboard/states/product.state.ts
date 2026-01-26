import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { switchMap, tap, catchError, finalize, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PlatformContentService, ProductResponse, ProductResponsePagedResult, ProductSearchRequest, ProductsService, TakealotContentResponse, TakealotContentResponsePagedResult, TakealotSearchRequest } from "../../ct-client";

@Injectable({ providedIn: 'root' })
export class ProductState {
  private productSubject = new BehaviorSubject<ProductResponsePagedResult | undefined>(undefined);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private isDeletingSubject = new BehaviorSubject<boolean>(false);
  private deleteDoneSubject = new Subject<boolean>();
  private lastSearchRequest: ProductSearchRequest | undefined;
  private searchTrigger$ = new Subject<ProductSearchRequest>();
  private deleteTrigger$ = new Subject<string>();

  

  constructor(private _productService: ProductsService, private _snackBar: MatSnackBar) {
    this.searchTrigger$.pipe(
      switchMap((payload: ProductSearchRequest) => {
        this.isLoadingSubject.next(true);
        return this._productService.apiProductsGet( 
    payload.name ?? undefined,
    payload.categoryId ?? undefined,
    payload.lastUpdatedStart ?? undefined,
    payload.lastUpdatedEnd ?? undefined,
    payload.sku ?? undefined,
    payload.inStock ?? undefined,
    payload.pageNumber ?? undefined,
    payload.pageSize ?? undefined,
    payload.sort_by ?? undefined,   
    payload.descending ?? undefined
).pipe(
          tap(res => this.productSubject.next(res)),
          catchError(error => {
            this.productSubject.next(undefined);
            return of(undefined);
          }),
          finalize(() => this.isLoadingSubject.next(false))
        );
      })
    ).subscribe();

    this.deleteTrigger$.pipe(
      switchMap((id: string) => {
        this.isDeletingSubject.next(true);
        return this._productService.apiProductsIdDelete(id).pipe(
          tap(() => {
            this._snackBar.open('Product deleted', 'Close', { duration: 3000 });
            this.deleteDoneSubject.next(true);
            // re-run last search if available
            if (this.lastSearchRequest) {
              this.searchTrigger$.next(this.lastSearchRequest);
            }
          }),
          catchError(error => {
            this._snackBar.open('Failed to delete product', 'Close', { duration: 5000 });
            this.deleteDoneSubject.next(false);
            return of(undefined);
          }),
          finalize(() => this.isDeletingSubject.next(false))
        );
      })
    ).subscribe();
  }

  // Observables 
  get isLoading$(): Observable<boolean> {
    return this.isLoadingSubject.asObservable();
  }

  get productContent$(): Observable<ProductResponsePagedResult | undefined> {
    return this.productSubject.asObservable();
  }

  get productItems$(): Observable<ProductResponse[] | undefined | null> {
    return this.productSubject.asObservable().pipe(map(r => r?.items));
  }

  get productTotalCount$(): Observable<number> {
    return this.productSubject.asObservable().pipe(map(r => r?.totalCount ?? 0));
  }

  get isDeleting$(): Observable<boolean> {
    return this.isDeletingSubject.asObservable();
  }

  get deleteDone$(): Observable<boolean> {
    return this.deleteDoneSubject.asObservable();
  }

  // Actions 
  search(payload: ProductSearchRequest) {
    this.lastSearchRequest = payload;
    this.searchTrigger$.next(payload);
  }

  delete(id: string): void {
    this.deleteTrigger$.next(id);
  }

  clear() {
    this.productSubject.next(undefined);
    this.isLoadingSubject.next(false);
    this.isDeletingSubject.next(false);
  }
}




