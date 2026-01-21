import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-login-page',
  imports: [RouterLink,MatCardModule, MatButtonModule,MatInputModule,MatFormFieldModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

}
