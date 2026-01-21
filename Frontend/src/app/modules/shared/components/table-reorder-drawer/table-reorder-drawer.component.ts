import { Component, Inject, OnInit } from '@angular/core';
import { MTX_DRAWER_DATA, MtxDrawerRef } from '@ng-matero/extensions/drawer';
import { HeaderConfig } from '../../models/header-config.model';
import { ButtonConfig, ButtonType } from '../../models/button-config.model';
import { MtxGrid } from '@ng-matero/extensions/grid';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HeaderGroupComponent } from "../header-group/header-group.component";

@Component({
  selector: 'app-table-reorder-drawer',
  imports: [MatTooltipModule, MatIconModule, FormsModule, ReactiveFormsModule, MatSlideToggleModule, CdkDropList, CdkDrag, CdkDragHandle, HeaderGroupComponent],
  templateUrl: './table-reorder-drawer.component.html',
  styleUrl: './table-reorder-drawer.component.scss'
})
export class TableReorderDrawerComponent implements OnInit {


  headerConfig: HeaderConfig[] = [{ title: 'Edit Columns', id: 'table' }]
  pageButtons: ButtonConfig[] = [{ label: 'Close', icon: 'close', action: () => { this.close() }, tooltip: "Close", type: ButtonType.Icon }]

  table: MtxGrid


  constructor(public drawerRef: MtxDrawerRef<TableReorderDrawerComponent>, @Inject(MTX_DRAWER_DATA) private mtxGrid: MtxGrid) {
    this.table = mtxGrid;
  }

  ngOnInit(): void {

  }

  close(): void {
    this.drawerRef.dismiss(true)
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.table.columns, event.previousIndex, event.currentIndex);

  }

  onToggleChange(column: any) {
    this.table.columns.find(x => x.header === column.header)!.hide = !column.hide;

  }

}
