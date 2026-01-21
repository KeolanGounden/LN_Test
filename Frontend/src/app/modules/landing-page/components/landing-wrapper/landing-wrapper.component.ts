import { Component, OnInit } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatMenuModule} from '@angular/material/menu';
import {MatRadioModule} from '@angular/material/radio';
import {RouterLink} from '@angular/router';
import { Theme, ThemeService } from '../../../shared/services/theme.service';


@Component({
  selector: 'app-landing-wrapper',
  imports: [RouterLink,FormsModule, MatButtonModule, MatFormFieldModule, MtxSelectModule, MatIconModule, MatInputModule, MatSidenavModule, MatToolbarModule, MatCardModule, MatChipsModule,MatMenuModule,MatRadioModule],
  templateUrl: './landing-wrapper.component.html',
  styleUrl: './landing-wrapper.component.scss'
})
export class LandingWrapperComponent implements OnInit {

  selectedTheme: Theme | undefined;
  themes: Theme[] = [];

  constructor(public themeService: ThemeService)
  {
    
  }

  ngOnInit()
  {
    this.themes = this.themeService.getThemes()
  }

}
