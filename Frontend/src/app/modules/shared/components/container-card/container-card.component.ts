
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingType } from '../../models/loading-type.model';
import { LoadingSkeletonComponent } from '../loading-skeleton/loading-skeleton.component';

@Component({
  selector: 'app-container-card',
  imports: [MatCardModule, MatProgressSpinnerModule, LoadingSkeletonComponent],
  templateUrl: './container-card.component.html',
  styleUrl: './container-card.component.scss'
})
export class ContainerCardComponent {
  @Input() loading = false;
  @Input() loadingtype: LoadingType = LoadingType.Spinner;
}
