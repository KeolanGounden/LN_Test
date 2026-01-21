import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { HeaderConfig } from '../../models/header-config.model';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MAT_MENU_DEFAULT_OPTIONS, MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DisplayButtonComponent } from '../display-button/display-button.component';

@Component({
  selector: 'app-page-header',
  imports: [DisplayButtonComponent, MatTooltipModule, MatButtonModule, MatIconModule, CommonModule, MatCardModule, MatMenuModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: MAT_MENU_DEFAULT_OPTIONS,
      useValue: {
        overlayPanelClass: 'menu-overlay-pane',
      },
    },
  ],
})
export class PageHeaderComponent {
  @Input() headerConfig: HeaderConfig[] = [];

  onHeaderClick(config: HeaderConfig) {
    if (config.headerFunctionCallback) {
      config.headerFunctionCallback(config.id);
    }
  }

}
