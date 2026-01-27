import { ChangeDetectorRef, Component, Inject, TemplateRef, ViewChild, signal } from '@angular/core';
import { AsyncPipe, formatDate, NgTemplateOutlet } from '@angular/common';
import { SlidingFormComponent } from '../../../shared/components/sliding-form/sliding-form.component';
import { SlidingFormConfig } from '../../../shared/models/sliding-form-config';
import { ButtonAction, SlidingDialogActionButtonConfig } from '../../../shared/models/sliding-dialog-action-button-config';
import { TemplateIdDirective } from '../../../shared/directives/template-id-directive.directive';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductResponse } from '../../../ct-client';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatInput, MatLabel } from "@angular/material/input";
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { ProductState } from '../../states/product.state';

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


  item: ProductResponse | undefined;
  @ViewChild(SlidingFormComponent) slidingForm!: SlidingFormComponent;


  readonly nodes$ = this.categoriesState.treeNodes$;
  readonly product$ = this.productState.productDetail$;
  readonly loading$ = this.productState.isGettingProduct$;
  readonly selected = signal<string[]>([]);

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



  constructor(@Inject(MAT_DIALOG_DATA) private productId: string,  private fb: FormBuilder, private categoriesState: CategoriesState, private productState: ProductState) {
 
    categoriesState.fetchCategoriesTree();

    this.form = this.fb.group({
      name:  [null, [Validators.required]],
      desc: [null, [Validators.required]],
      sku: [null, [Validators.required]],
      price: [null, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
      quantity: [null, [Validators.required,  Validators.pattern(/^\d+$/) ]]
    });

    if(productId)
    {
       this.productState.getById(productId);
       this.views[0].title = `Edit Product`;

       this.productState.productDetail$.subscribe(content=>{

      this.item = content;
      this.views[0].title = `Edit Product - ${content?.name}`;

      let category = content?.categoryId ? content?.categoryId : undefined;

      if(category)
      {
        this.selected.set([category]);
      }

      this.form.patchValue({
        name: content?.name,
        desc: content?.description,  
        sku: content?.sku,
        price: content?.price,
        quantity: content?.quantity
      });
    });

      
    }


  }

  formValid():boolean
  {
     let category = this.selected()
     
     if(category[0] && this.form.valid )
     {
      return true
     }

     return false
  }

  submit()
  {

    let req:ProductResponse = {
      name: this.form.controls['name'].value,
      description: this.form.controls['desc'].value,
      sku: this.form.controls['sku'].value,
      price: this.form.controls['price'].value,
      quantity: this.form.controls['quantity'].value,
      categoryId: this.selected()[0]
    }

    if(this.item)
    {
        req.id = this.item.id

        this.productState.edit(req)

    }
    else
    {
        this.productState.create(req)
    }
    
  }


}