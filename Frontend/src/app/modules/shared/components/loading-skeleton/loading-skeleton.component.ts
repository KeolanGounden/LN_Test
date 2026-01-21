import { Component, Input } from '@angular/core';
import { LoadingType } from '../../models/loading-type.model';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-skeleton',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-skeleton.component.html',
  styleUrl: './loading-skeleton.component.scss'
})
export class LoadingSkeletonComponent {
  @Input() loadingType: LoadingType = LoadingType.Spinner;

  loadingTypeEnum: typeof LoadingType = LoadingType

}
