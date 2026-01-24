import { Component } from '@angular/core';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { HeaderConfig } from '../../../shared/models/header-config.model';
import { ButtonType } from '../../../shared/models/button-config.model';

@Component({
  selector: 'app-categories-wrapper',
  imports: [ PageHeaderComponent],
  templateUrl: './categories-wrapper.component.html',
  styleUrl: './categories-wrapper.component.scss',
})
export class CategoriesWrapperComponent {

    headerConfig: HeaderConfig[] = [
      {
        id: "categories", title: "Categories",
        selected: true
      }
     
    ]
  

}
