import { Component, Input, Output, EventEmitter, ContentChildren, TemplateRef, QueryList, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ChangeDetectorRef } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ButtonAction, SlidingDialogActionButtonConfig } from '../../models/sliding-dialog-action-button-config';
import { SlidingFormConfig } from '../../models/sliding-form-config';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { TemplateIdDirective } from '../../directives/template-id-directive.directive';
import { CdkTableModule } from "@angular/cdk/table";
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ButtonAlignment } from '../../models/button-config.model';
import { MatMenuModule } from '@angular/material/menu';
import { ButtonRowComponent } from '../button-row/button-row.component';
import { DisplayButtonComponent } from "../display-button/display-button.component";


@Component({
  selector: 'app-sliding-form',
  imports: [CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatMenuModule,
    MatNativeDateModule,
    MatDialogActions,
    MatDialogContent,
    DisplayButtonComponent, CdkTableModule, MatTooltipModule, ButtonRowComponent, DisplayButtonComponent],
  animations: [
    trigger('slideAnimation', [
      state('active', style({
        opacity: 1,
        transform: 'translateX(0)',
        visibility: 'visible'
      })),
      state('inactive', style({
        opacity: 0,
        transform: 'translateX(100%)',
        visibility: 'hidden'
      })),
      transition('inactive => active', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-in-out')
      ]),
      transition('active => inactive', [
        animate('300ms ease-in-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
      ])
    ])
  ],
  templateUrl: './sliding-form.component.html',
  styleUrl: './sliding-form.component.scss'
})

export class SlidingFormComponent implements AfterContentInit {

  @Input() views: SlidingFormConfig[] = [];

  public ButtonAlightment = ButtonAlignment

  @Output() customAction = new EventEmitter<string>();
  currentViewIndex = 0;

  @ContentChildren(TemplateIdDirective) templates!: QueryList<TemplateIdDirective>;
  templateMap = new Map<string, TemplateRef<any>>();

  constructor(private cdr: ChangeDetectorRef, private dialogRef: MatDialogRef<SlidingFormComponent>) {
  }

  ngAfterContentInit() {
    this.templateMap.clear();
    this.templates.forEach(t => this.templateMap.set(t.id, t.template));

  }
  get currentview(): SlidingFormConfig {
    return this.views[this.currentViewIndex];
  }
  get currentTemplate(): TemplateRef<any> | null {
    const id = this.views[this.currentViewIndex]?.name;
    return id ? this.templateMap.get(id) || null : null;
  }
  showView(index: number) {
    if (index >= 0 && index < this.views.length) {
      this.currentViewIndex = index;
      this.cdr.detectChanges();
      // this.setUpResizeObserver()
    }
  }
  nextView() {
    this.showView(this.currentViewIndex + 1);
    this.cdr.detectChanges();
  }
  prevView() {
    this.showView(this.currentViewIndex - 1);
    this.cdr.detectChanges();
  }

  getAnimationState() {
    return this.currentViewIndex;
  }
  closeDialog() {
    this.dialogRef.close();
  }
  handleButtonAction(button: SlidingDialogActionButtonConfig) {
    if (button.action === ButtonAction.CancelPrevious) {
      this.prevView();
    }
    else if (button.action === ButtonAction.CancelClose) {
      this.closeDialog();
    }
    else if (button.action === ButtonAction.SubmitPrevious) {
      this.prevView();
    }
    else if (button.action === ButtonAction.SubmitNext) {
      this.nextView();
    }
    if (button.action === ButtonAction.SubmitClose) {
      button?.customAction != undefined ? button.customAction() : undefined;
      this.closeDialog();
    }
    else if (button.customAction) {
      button.customAction();
    }
  }


}
