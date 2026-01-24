import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-wrapper',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatListModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './admin-wrapper.component.html',
  styleUrls: ['./admin-wrapper.component.scss'],
})
export class AdminWrapperComponent {
  router = inject(Router);
  private breakpointObserver = inject(BreakpointObserver);

  /** Emits true when on handset (mobile) */
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe([Breakpoints.Handset, Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
    .pipe(map(result => result.matches));
}
