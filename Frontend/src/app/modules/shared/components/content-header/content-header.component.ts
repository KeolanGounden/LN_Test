import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { ContentHeaderConfig } from '../../models/header-config.model';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonConfig } from '../../models/button-config.model';
import { ButtonRowComponent } from "../button-row/button-row.component";
import { DisplayButtonComponent } from "../display-button/display-button.component";

@Component({
  selector: 'app-content-header',
  imports: [MatCardModule, ButtonRowComponent, MatChipsModule, MatIconModule, MatMenuModule, CommonModule, MatTooltipModule, ButtonRowComponent, DisplayButtonComponent],
  templateUrl: './content-header.component.html',
  styleUrl: './content-header.component.scss'
})
/**
 * The `ContentHeaderComponent` is an Angular component responsible for displaying
 * a configurable content header section. It supports dynamic configuration via
 * the `headerConfig` input, displays a selection count, and renders a set of
 * action buttons.
 *
 * @remarks
 * This component is designed to be reusable and flexible, allowing parent components
 * to control its appearance and behavior through input properties.
 *
 * @example
 * ```html
 * <app-content-header
 *   [headerConfig]="myHeaderConfig"
 *   [selectionDisplay]="selectedItems.length"
 *   [actionButtons]="myActionButtons">
 * </app-content-header>
 * ```
 *
 * @see ContentHeaderConfig
 * @see ButtonConfig
 */
export class ContentHeaderComponent {

  /**
   * Configuration object for the content header.
   * 
   * This input property expects an instance of `ContentHeaderConfig` that defines
   * the settings and data to be displayed in the content header component.
   *
   * @see ContentHeaderConfig
   */
  @Input() headerConfig!: ContentHeaderConfig;

  /**
   * The number representing the current selection to be displayed in the content header.
   * 
   * @remarks
   * This input is used to control how the selection is shown in the header component.
   * 
   * @example
   * <app-content-header [selectionDisplay]="selectedItems.length"></app-content-header>
   */
  @Input() selectionDisplay!: string;

  /**
   * An array of button configuration objects used to render action buttons in the content header.
   * Each object in the array should conform to the `ButtonConfig` interface.
   * 
   * @see ButtonConfig
   */
  @Input() actionButtons: ButtonConfig[] = [];

  @Input() titleButton!: ButtonConfig

  constructor() {
  }
}
