import { ChangeDetectorRef, Component, Inject, TemplateRef, ViewChild, signal } from '@angular/core';
import { AsyncPipe, formatDate, NgTemplateOutlet } from '@angular/common';
import { SlidingFormComponent } from '../../../shared/components/sliding-form/sliding-form.component';
import { SlidingFormConfig } from '../../../shared/models/sliding-form-config';
import { ButtonAction, SlidingDialogActionButtonConfig } from '../../../shared/models/sliding-dialog-action-button-config';
import { TemplateIdDirective } from '../../../shared/directives/template-id-directive.directive';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { TakealotContentResponse } from '../../../ct-client';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput, MatLabel } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MtxGridColumn, MtxGridModule } from '@ng-matero/extensions/grid';
import { HeaderConfig } from '../../../shared/models/header-config.model';
import { ButtonAlignment, ButtonConfig, ButtonType } from '../../../shared/models/button-config.model';
import { ContentHeaderComponent } from '../../../shared/components/content-header/content-header.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from "@angular/material/menu";
import { MatIconModule } from '@angular/material/icon';
import { MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { provideNativeDatetimeAdapter } from '@ng-matero/extensions/core';
import { MatNativeDateModule } from '@angular/material/core';
import {CdkTextareaAutosize, TextFieldModule} from '@angular/cdk/text-field';
import {Tree, TreeItem, TreeItemGroup} from '@angular/aria/tree';
import { CategoriesState } from '../../../categories/state/categories.state';

@Component({
  selector: 'app-view-item-metadata-dialog',
  standalone: true,
  imports: [
    FormsModule,
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
    TextFieldModule,
    Tree, 
    TreeItem, 
    TreeItemGroup, 
    NgTemplateOutlet,
    AsyncPipe
],
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.scss'],
  providers: [provideNativeDatetimeAdapter()]
})
export class ProductEditDialogComponent {


  item: TakealotContentResponse;
  @ViewChild(SlidingFormComponent) slidingForm!: SlidingFormComponent;
  @ViewChild('menuTemplate', { static: true }) menuTemplate!: TemplateRef<any>;


  readonly nodes$ = this.categoriesState.treeNodes$;
  readonly selected = signal<string[]>([]);

  form: FormGroup;

  public ButtonAlightment = ButtonAlignment

  mainId = 'main';


    mainButtons: SlidingDialogActionButtonConfig[] = [
    { text: 'Close', type: 'basic', action: ButtonAction.CancelClose },
    { text: 'Save', type: 'flat', action: ButtonAction.SubmitClose }
  ];

  editButtons: SlidingDialogActionButtonConfig[] = [
    {
      text: 'Cancel', type: 'basic', action: ButtonAction.CancelPrevious, customAction: () => {

      }
    },
    {
      text: 'Save', type: 'flat', action: ButtonAction.SubmitPrevious, customAction: () => {
      }, disabled: () => { return !this.form.valid }, hide: () => { return this.form.disabled }
    }
  ];



  details: HeaderConfig = {
    id: 'details',
    title: 'Product Details',
  }

category: HeaderConfig = {
    id: 'category',
    title: 'Category',
  }

  views: SlidingFormConfig[] = [
    {
      name: 'main',
      title: "Create Product",
      buttons: this.mainButtons
    }
  ];



  constructor(@Inject(MAT_DIALOG_DATA) private content: TakealotContentResponse, private dialogRef: MatDialogRef<ProductEditDialogComponent>, private fb: FormBuilder, private cdr: ChangeDetectorRef, private categoriesState: CategoriesState) {
    this.item = content;
    categoriesState.fetchCategoriesTree();

    if(content && content?.id)
    {
       this.views[0].title = `Edit Product - ${content.id}`;
    }

    this.form = this.fb.group({
      name: ['name'],
    });


  }


}


// TreeNode type is provided by CategoriesState