import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoriesState } from '../../state/categories.state';
import { CategoryDto } from '../../../ct-client';
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatLabel } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { MtxGridModule } from '@ng-matero/extensions/grid';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { ContentHeaderComponent } from '../../../shared/components/content-header/content-header.component';
import { SlidingFormComponent } from '../../../shared/components/sliding-form/sliding-form.component';
import { TemplateIdDirective } from '../../../shared/directives/template-id-directive.directive';
import { ButtonAlignment } from '../../../shared/models/button-config.model';
import { ButtonAction, SlidingDialogActionButtonConfig } from '../../../shared/models/sliding-dialog-action-button-config';
import { HeaderConfig } from '../../../shared/models/header-config.model';
import { SlidingFormConfig } from '../../../shared/models/sliding-form-config';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-category-edit-dialog',
  imports: [FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatIconModule,
    MatCheckboxModule,
    MatCardModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInput,
    MatLabel,
    MtxGridModule,
    MtxSelectModule,
    ContentHeaderComponent,
    SlidingFormComponent,
    TemplateIdDirective,
    MatNativeDateModule,
    MtxDatetimepickerModule,
    CdkTextareaAutosize,
    TextFieldModule, AsyncPipe],
  templateUrl: './category-edit-dialog.component.html',
  styleUrl: './category-edit-dialog.component.scss',
})
export class CategoryEditDialogComponent {


    readonly nodes$ = this.categoriesState.categoriesFlat$;
  form: FormGroup;

    public ButtonAlightment = ButtonAlignment
  
    mainId = 'main';

     mainButtons: SlidingDialogActionButtonConfig[] = [
        { text: 'Close', type: 'basic', action: ButtonAction.CancelClose },
        { text: 'Save', type: 'flat', action: ButtonAction.SubmitClose,  
          customAction: () => this.submit(),
          disabled: () => !this.formValid()
           }
      ];

      details: HeaderConfig = {
        id: 'details',
        title: 'Category Details',
      }
    
      
      views: SlidingFormConfig[] = [
        {
          name: 'main',
          title: "Create Category",
          buttons: this.mainButtons
        }
      ];
  
  constructor( private fb: FormBuilder, private categoriesState: CategoriesState) 
  {

    categoriesState.fetchCategoriesFlat();

    this.form = this.fb.group({
      parent:  [null, []],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],

    });

  }
  formValid(): boolean {
    return this.form.valid;
  }
    submit()
    {

       let req:CategoryDto = {
            name: this.form.controls['name'].value,
            description: this.form.controls['description'].value,
            parentCategoryId: this.form.controls['parent'].value
           
          }

      this.categoriesState.addCategory(req);
      
    }
}
