import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from "../../../shared/components/page-header/page-header.component";
import { HeaderConfig } from '../../../shared/models/header-config.model';
import { CategoriesState } from '../../state/categories.state';
import {AsyncPipe, NgTemplateOutlet} from '@angular/common';
import {Tree, TreeItem, TreeItemGroup} from '@angular/aria/tree';
import { MatDialog } from '@angular/material/dialog';
import { ButtonConfig, ButtonType } from '../../../shared/models/button-config.model';
import { ButtonRowComponent } from "../../../shared/components/button-row/button-row.component";
import { CategoryEditDialogComponent } from '../category-edit-dialog/category-edit-dialog.component';

@Component({
  selector: 'app-categories-wrapper',
  imports: [PageHeaderComponent, Tree, TreeItem, TreeItemGroup, NgTemplateOutlet, AsyncPipe, ButtonRowComponent],
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

      actionButtons: ButtonConfig[] = [
    
        {
          icon: "add_task",
          action: () =>  this.openEditDialog() ,
          type: ButtonType.Flat,
          tooltip: "Add Category",
          label: "Add Category"
        }
      ]

  constructor( private dialog: MatDialog,private categoriesState: CategoriesState) {

    categoriesState.fetchCategoriesTree()

  }
  
  readonly nodes$ = this.categoriesState.treeNodes$;
  readonly selected = signal<string[]>([]);


    openEditDialog()
    {
  
     this.dialog.open(CategoryEditDialogComponent, {
                  disableClose:true,
                  width: "50vw"
                })
  
    }

}
