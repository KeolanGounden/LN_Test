import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from './modules/shared/services/theme.service';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  implements OnInit {
  title = 'value-tracker';
  themeService = inject(ThemeService);
  
  ngOnInit()
  {
    this.themeService.setThemeMode("dark-mode");
  }
}
