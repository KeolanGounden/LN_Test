import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PlatformContentService, TakealotContentResponse, TakealotContentResponsePagedResult, TakealotSearchRequest } from "../../ct-client";
import { Injectable } from "@angular/core";
import { ClearDashboardState, SearchTakealotContent, SearchTakealotContentError, SearchTakealotContentSuccess } from "../actions/dashboard.action";
import { catchError, map, of, Subject, switchMap, tap } from "rxjs";


export class DashboardModel {
    takealotContent: TakealotContentResponsePagedResult | undefined;
    isLoading: boolean | undefined;
}


@State<DashboardModel>({
    name: 'dashboard',
    defaults: {
        takealotContent: undefined,
        isLoading: undefined
    }
})


@Injectable()
export class DashboardState {
    constructor(private _takealotContentService: PlatformContentService) { }

    private searchTrigger$ = new Subject<TakealotSearchRequest>();

    ngxsOnInit(ctx: StateContext<DashboardModel>) {

  this.searchTrigger$.pipe(
    switchMap((payload:TakealotSearchRequest) => {
      ctx.patchState({ isLoading: true });
      return this._takealotContentService.apiPlatformContentSearchTakealotPost(payload).pipe(
        tap(res => ctx.dispatch(new SearchTakealotContentSuccess(res))),
        catchError(error => of(ctx.dispatch(new SearchTakealotContentError(error))))
      );
    })
  ).subscribe();
  
}

    
    @Selector()
    static isLoading(state: DashboardModel): boolean | undefined {

        return state.isLoading;
    }

    @Selector()
    static GetTakealotContent(state: DashboardModel): TakealotContentResponse[] | undefined | null {
        return state.takealotContent?.items;
    }

    @Selector()
    static GetTakealotContentCount(state: DashboardModel): number {
        return state.takealotContent?.totalCount ?? 0;
    }


    @Action(SearchTakealotContent)
    DispatchSearchTakealotContent({ dispatch, patchState }: StateContext<DashboardModel>, { payload }: SearchTakealotContent) {
        patchState({ isLoading: true })
      
         this.searchTrigger$.next(payload);


    }

    @Action(SearchTakealotContentSuccess)
    DispatchSearchTakealotContentSuccess({ patchState }: StateContext<DashboardModel>, { payload }: SearchTakealotContentSuccess) {
        patchState({ isLoading: false, takealotContent: payload });
    }

    @Action(SearchTakealotContentError)
    DispatchSearchTakealotContentError({ patchState }: StateContext<DashboardModel>, { payload }: SearchTakealotContentError) {
        patchState({ isLoading: false, takealotContent: undefined });
    }

      @Action(ClearDashboardState)
  ClearDeviceState({ patchState }: StateContext<DashboardModel>, { }: ClearDashboardState) {
    patchState({
      takealotContent: undefined,
      isLoading: false
    });
  }

}


