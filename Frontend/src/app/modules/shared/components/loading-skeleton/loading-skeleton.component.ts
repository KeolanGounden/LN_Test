import { Component, Input } from '@angular/core';
import { LoadingType } from '../../models/loading-type.model';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-skeleton',
  imports: [MatProgressSpinnerModule],
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss'
})
export class LoadingSkeletonComponent {
  @Input() loadingType: LoadingType = LoadingType.Spinner;

  loadingTypeEnum: typeof LoadingType = LoadingType

}
