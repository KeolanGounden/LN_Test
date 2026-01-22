import { ChangeDetectorRef, Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
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

@Component({
  selector: 'app-view-item-metadata-dialog',
  standalone: true,
  imports: [
    CommonModule,
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
    MtxDatetimepickerModule
  ],
  templateUrl: './view-item-metadata-dialog.component.html',
  styleUrls: ['./view-item-metadata-dialog.component.scss'],
  providers: [provideNativeDatetimeAdapter()]
})
export class ViewItemMetadataDialogComponent {


  item: TakealotContentResponse;
  @ViewChild(SlidingFormComponent) slidingForm!: SlidingFormComponent;
  @ViewChild('menuTemplate', { static: true }) menuTemplate!: TemplateRef<any>;
  form: FormGroup;
  addScheduleForm: FormGroup

  public ButtonAlightment = ButtonAlignment



  constructor(@Inject(MAT_DIALOG_DATA) private content: TakealotContentResponse, private dialogRef: MatDialogRef<ViewItemMetadataDialogComponent>, private fb: FormBuilder, private cdr: ChangeDetectorRef) {
    this.item = content;
    this.form = this.fb.group({
      rule: ['rule'],
      name: ['Setpoint'],
      delay: ['5'],
      alertGroup: ['group-a'],
      template: ['Template 1'],
      backInRange: [true],
      alertType: ['default'],
      max: [null],
      min: [null],
      enableAlertSchedules: [false]
    });

    this.addScheduleForm = this.fb.group({
      day: ['Monday'],
      startTime: [new Date()],
      endTime: [new Date()],
      snooze: [false]
    })

    this.form.controls['enableAlertSchedules'].valueChanges.subscribe(value => {
      this.enableSchedulesButton.label = value ? 'Disable Schedules' : 'Enable Schedules';
    });

  }

  mainButtons: SlidingDialogActionButtonConfig[] = [
    { text: 'Close', type: 'basic', action: ButtonAction.CancelClose },
    { text: 'Save', type: 'flat', action: ButtonAction.SubmitClose }
  ];

  editButtons: SlidingDialogActionButtonConfig[] = [
    {
      text: 'Cancel', type: 'basic', action: ButtonAction.CancelPrevious, customAction: () => {
        this.tabIndex = 1
      }
    },
    {
      text: 'Save', type: 'flat', action: ButtonAction.SubmitPrevious, customAction: () => {
        this.tabIndex = 1
      }, disabled: () => { return !this.form.valid }, hide: () => { return this.form.disabled }
    }
  ];

  schedulesButtons: SlidingDialogActionButtonConfig[] = [
    {
      text: 'Cancel', type: 'basic', action: ButtonAction.CancelPrevious, customAction: () => {
        this.tabIndex = 1
      }
    },
    {
      text: 'Save', type: 'flat', action: ButtonAction.SubmitPrevious, customAction: () => {
        this.tabIndex = 1
      }
    }
  ]

  rulesHeader: HeaderConfig = { id: 'rules', title: 'Rules' }

  editRulesHeader: HeaderConfig = { id: 'rules', title: 'Rule Settings' }

  schedulesHeader: HeaderConfig = { id: 'schedules', title: 'Schedules' }

  enableRules: ButtonConfig = {
    icon: 'edit',
    type: ButtonType.Chip,
    label: 'Enable Editing',
    action: () => {
      this.form.enable()
    },
    hide: () => {
      return this.form.enabled
    }
  }


  editSchedulesButtons: ButtonConfig[] = [{
    icon: 'add',
    label: 'Add Schedules',
    type: ButtonType.Chip,
    action: () => {
      this.editSchedules()
    },
    hide: () => {
      return !this.form.controls['enableAlertSchedules'].value
    }
  }]

  editConfigHeader: HeaderConfig = { id: 'rules', title: 'Config' }

  tabIndex: number = 0;

  selectedRule: RuleData | null = null;

  details: HeaderConfig = {
    id: 'details',
    title: 'Details',
  }

  enableSchedulesHeader: HeaderConfig = { id: 'schedules', title: 'Alert Schedules' }

  enableSchedulesButton: ButtonConfig = {
    label: 'Enable',
    type: ButtonType.SlideToggle,
    action: () => {
      this.form.controls['enableAlertSchedules'].setValue(!this.form.controls['enableAlertSchedules'].value);
    },
    disabled: () => {
      return this.form.disabled
    },
  }

  ruleButtons: ButtonConfig[] = [
    {
      icon: 'add',
      type: ButtonType.Chip,
      action: () => {
        this.slidingForm.showView(1)
        this.tabIndex = 1
      },
      label: 'Add Rule',
      tooltip: 'Add Rule'
    }
  ]

  ruleData: RuleData[] = [{
    name: 'Sample Rule',
    delay: 5,
    alertGroup: 'Group A',
    template: 'Template 1',
    backInRange: true,
    alertType: 'Type 1',
    config: {},
    alertSchedules: []
  }]

  ruleColumns: MtxGridColumn[] = [
    { header: 'Name', field: 'name', sortable: true },
    {
      header: "Options", field: 'options', pinned: 'right', width: '100px'
    }
  ]

  addSchedule: HeaderConfig = { id: 'add-schedule', title: 'Add Schedule' }


  views: SlidingFormConfig[] = [
    {
      name: 'main',
      title: "View Metadata",
      buttons: this.mainButtons
    },
    {
      name: 'rules',
      title: "Edit Rules",
      buttons: this.editButtons,
      headerButtons: [this.enableRules],
    
    },
    {
      name: 'schedules',
      title: "Edit Schedules",
      buttons: this.schedulesButtons,
    }
  ];

  showSchedules: boolean = false;

  schedulesDatasource: Schedule[] = [
    {
      day: DayEnum.Monday,
      start: new Date(),
      end: new Date(),
      snooze: false
    },
    {
      day: DayEnum.Tuesday,
      start: new Date(),
      end: new Date(),
      snooze: false
    },
    {
      day: DayEnum.Wednesday,
      snooze: true
    }

  ];

  schedulesColumns: MtxGridColumn[] = [
    {
      header: 'Day', field: 'day', sortable: true, formatter: (data: any) => {
        switch (data.day) {
          case DayEnum.Sunday:
            return 'Sunday';
          case DayEnum.Monday:
            return 'Monday';
          case DayEnum.Tuesday:
            return 'Tuesday';
          case DayEnum.Wednesday:
            return 'Wednesday';
          case DayEnum.Thursday:
            return 'Thursday';
          case DayEnum.Friday:
            return 'Friday';
          case DayEnum.Saturday:
            return 'Saturday';
          default:
            return '';
        }
      }
    },
    {
      header: 'Snooze', field: 'snooze', sortable: true, formatter: (data: any) => {
        return data.snooze ? 'Yes' : 'No';
      }
    },
    {
      header: 'Start Time', field: 'start', sortable: true, formatter: (data: any) => {
        if (data.start) {
          return formatDate(data.start, 'shortTime', 'en-US');
        }
        return ''
      }
    },
    {
      header: 'End Time', field: 'end', sortable: true, formatter: (data: any) => {
        if (data.end) {
          return formatDate(data.end, 'shortTime', 'en-US');
        }
        return ''
      }
    },
    {
      header: 'Actions', field: 'actions', type: 'button', buttons: [
        {
          type: 'icon',
          icon: 'delete',
          tooltip: 'Delete',
          click: () => { }
        }
      ]
    }
  ];


  mainId = this.views[0].name;
  rulesId = this.views[1].name;
  schedulesId = this.views[2].name;


  editRule(rule: RuleData) {
    this.selectedRule = rule;
    this.form.enable()
    this.tabIndex = 1
    this.slidingForm.showView(1);
  }

  deleteRule(rule: RuleData) {
    this.ruleData = this.ruleData.filter(r => r !== rule);
    this.tabIndex = 1
    this.selectedRule = null;
  }

  viewRule(rule: RuleData) {
    this.selectedRule = rule;
    this.form.disable()
    this.slidingForm.showView(1);
    this.tabIndex = 1

  }

  editSchedules() {
    this.slidingForm.showView(2);
  }

}

export interface RuleData {
  name: string;
  delay: number;
  alertGroup: string;
  template: string;
  backInRange: boolean;
  alertType: string;
  config: any;
  alertSchedules: any[];
}

export interface Schedule {
  day: DayEnum,
  start?: Date,
  end?: Date,
  snooze: boolean

}

export enum DayEnum {
  Sunday = 'Sunday',
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday'
}
