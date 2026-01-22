
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ButtonConfig, ButtonType } from '../../models/button-config.model';

@Component({
  selector: 'app-display-button',
  imports: [MatButtonModule, MatSlideToggleModule, MatIconModule, MatTooltipModule, MatMenuModule, MatChipsModule],

  templateUrl: './display-button.component.html',
  styleUrl: './display-button.component.scss'
})
export class DisplayButtonComponent {

  @Input() buttonConfig!: ButtonConfig

  public ButtonType = ButtonType
}
