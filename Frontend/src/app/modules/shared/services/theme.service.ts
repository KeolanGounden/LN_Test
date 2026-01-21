import { effect, Injectable, signal } from '@angular/core';

export interface Theme {
  id: string;
  displayName: string;
}



@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly themes: Theme[] = [
    { id: 'default-theme', displayName: 'Default'},
    { id: 'mayz-theme',  displayName: 'Mayz' },
    
  ];

  private readonly themeModes: Theme[] = [
    { id: 'light-mode', displayName: 'Light'},
    { id: 'dark-mode', displayName: 'Dark' },
    { id: 'system-mode',  displayName: 'System' },
  ];

  currentTheme = signal<Theme>(this.themes[0]);
  currentMode = signal<Theme>(this.themeModes[0]);

  getThemes(): Theme[] {
    return this.themes;
  }

  setTheme(themeId: string): void {
    const theme = this.themes.find((t) => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
    }
  }

  getModes(): Theme[] {
    return this.themeModes;
  }

  setThemeMode(modeId: string): void {
    const mode = this.themeModes.find((t) => t.id === modeId);
    if (mode) {
      this.currentMode.set(mode);
    }
  }


  updateThemeClass = effect(() => {
    const theme = this.currentTheme();
    document.body.classList.remove(...this.themes.map((t) => `${t.id}`));
    document.body.classList.add(`${theme.id}`);
  });

  updateThemeMode = effect(() => {
    const theme = this.currentMode();
    document.body.classList.remove(...this.themeModes.map((t) => `${t.id}`));
    document.body.classList.add(`${theme.id}`);
  });
}
