import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { switchMap, tap, catchError, finalize, map } from 'rxjs/operators';
import { PlatformContentService, ProductResponse, ProductResponsePagedResult, ProductSearchRequest, ProductsService, TakealotContentResponse, TakealotContentResponsePagedResult, TakealotSearchRequest } from "../../ct-client";

@Injectable({ providedIn: 'root' })
export class ProductState {
  private productSubject = new BehaviorSubject<ProductResponsePagedResult | undefined>(undefined);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private searchTrigger$ = new Subject<ProductSearchRequest>();

  

  constructor(private _productService: ProductsService) {
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

  // Actions 
  search(payload: ProductResponse) {
    this.searchTrigger$.next(payload);
  }

  clear() {
    this.productSubject.next(undefined);
    this.isLoadingSubject.next(false);
  }
}




