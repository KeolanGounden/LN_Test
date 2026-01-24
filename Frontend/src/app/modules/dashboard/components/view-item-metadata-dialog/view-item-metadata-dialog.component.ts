import { ChangeDetectorRef, Component, Inject, TemplateRef, ViewChild, signal } from '@angular/core';
import { formatDate, NgTemplateOutlet } from '@angular/common';
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
    NgTemplateOutlet
],
  templateUrl: './view-item-metadata-dialog.component.html',
  styleUrls: ['./view-item-metadata-dialog.component.scss'],
  providers: [provideNativeDatetimeAdapter()]
})
export class ViewItemMetadataDialogComponent {


  item: TakealotContentResponse;
  @ViewChild(SlidingFormComponent) slidingForm!: SlidingFormComponent;
  @ViewChild('menuTemplate', { static: true }) menuTemplate!: TemplateRef<any>;


  readonly nodes: TreeNode[] = [
    {
      name: 'public',
      value: 'public',
      children: [
        {name: 'index.html', value: 'public/index.html'},
        {name: 'favicon.ico', value: 'public/favicon.ico'},
        {name: 'styles.css', value: 'public/styles.css'},
      ],
      expanded: true,
    },
    {
      name: 'src',
      value: 'src',
      children: [
        {
          name: 'app',
          value: 'src/app',
          children: [
            {name: 'app.ts', value: 'src/app/app.ts'},
            {name: 'app.html', value: 'src/app/app.html'},
            {name: 'app.css', value: 'src/app/app.css'},
          ],
          expanded: false,
        },
        {
          name: 'assets',
          value: 'src/assets',
          children: [{name: 'logo.png', value: 'src/assets/logo.png'}],
          expanded: false,
        },
        {
          name: 'environments',
          value: 'src/environments',
          children: [
            {
              name: 'environment.prod.ts',
              value: 'src/environments/environment.prod.ts',
              expanded: false,
            },
            {name: 'environment.ts', value: 'src/environments/environment.ts'},
          ],
          expanded: false,
        },
        {name: 'main.ts', value: 'src/main.ts'},
        {name: 'polyfills.ts', value: 'src/polyfills.ts'},
        {name: 'styles.css', value: 'src/styles.css', disabled: true},
        {name: 'test.ts', value: 'src/test.ts'},
      ],
      expanded: false,
    },
    {name: 'angular.json', value: 'angular.json'},
    {name: 'package.json', value: 'package.json'},
    {name: 'README.md', value: 'README.md'},
  ];
  readonly selected = signal(['angular.json']);

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



  constructor(@Inject(MAT_DIALOG_DATA) private content: TakealotContentResponse, private dialogRef: MatDialogRef<ViewItemMetadataDialogComponent>, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.item = content;

    if(content && content?.id)
    {
       this.views[0].title = `Edit Product - ${content.id}`;
    }

    this.form = this.fb.group({
      name: ['name'],
    });


  }


}


type TreeNode = {
  name: string;
  value: string;
  children?: TreeNode[];
  disabled?: boolean;
  expanded?: boolean;
};