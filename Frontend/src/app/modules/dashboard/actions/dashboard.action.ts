
import { HttpErrorResponse } from "@angular/common/http";
import { TakealotContentResponsePagedResult, TakealotSearchRequest } from "../../ct-client";


let TypeName = "Takealot-Content";

export class SearchTakealotContent {
  static readonly type = `[${TypeName}] ${this.name}`;
  constructor(public payload:TakealotSearchRequest) { }
}

export class SearchTakealotContentSuccess {
    static readonly type = `[${TypeName}] ${this.name}`;
  constructor(public payload: TakealotContentResponsePagedResult) { }
}

export class SearchTakealotContentError {
  static readonly type = `[${TypeName}] ${this.name}`;
  constructor(public payload: HttpErrorResponse) { }
}

export class ClearDashboardState {
  static readonly type = `[${TypeName}] ${this.name}`;
  constructor() { }
}