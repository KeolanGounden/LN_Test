import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject, Observable, of } from 'rxjs';
import { switchMap, tap, catchError, finalize, map } from 'rxjs/operators';
import { PlatformContentService, TakealotContentResponse, TakealotContentResponsePagedResult, TakealotSearchRequest } from "../../ct-client";

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private takealotContentSubject = new BehaviorSubject<TakealotContentResponsePagedResult | undefined>(undefined);
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  private searchTrigger$ = new Subject<TakealotSearchRequest>();

  constructor(private _takealotContentService: PlatformContentService) {
    this.searchTrigger$.pipe(
      switchMap((payload: TakealotSearchRequest) => {
        this.isLoadingSubject.next(true);
        return this._takealotContentService.apiPlatformContentSearchTakealotPost(payload).pipe(
          tap(res => this.takealotContentSubject.next(res)),
          catchError(error => {
            this.takealotContentSubject.next(undefined);
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

  get takealotContent$(): Observable<TakealotContentResponsePagedResult | undefined> {
    return this.takealotContentSubject.asObservable();
  }

  get takealotItems$(): Observable<TakealotContentResponse[] | undefined | null> {
    return this.takealotContentSubject.asObservable().pipe(map(r => r?.items));
  }

  get takealotTotalCount$(): Observable<number> {
    return this.takealotContentSubject.asObservable().pipe(map(r => r?.totalCount ?? 0));
  }

  // Actions 
  search(payload: TakealotSearchRequest) {
    this.searchTrigger$.next(payload);
  }

  clear() {
    this.takealotContentSubject.next(undefined);
    this.isLoadingSubject.next(false);
  }
}




