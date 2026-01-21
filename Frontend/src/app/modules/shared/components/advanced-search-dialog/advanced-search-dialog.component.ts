import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AdvancedSearchDialogData } from '../../models/advanced-search-config.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SlidingFormComponent } from '../sliding-form/sliding-form.component';
import { SlidingDialogActionButtonConfig, ButtonAction } from '../../models/sliding-dialog-action-button-config';
import { SlidingFormConfig } from '../../models/sliding-form-config';
import { MatCardModule } from '@angular/material/card';
import { MtxSelectModule } from '@ng-matero/extensions/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MtxDatetimepicker, MtxDatetimepickerModule } from '@ng-matero/extensions/datetimepicker';
import { provideNativeDatetimeAdapter } from '@ng-matero/extensions/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TemplateIdDirective } from '../../directives/template-id-directive.directive';

@Component({
  selector: 'app-advanced-search-dialog',
  imports: [MatCheckboxModule, MatNativeDateModule, MtxDatetimepickerModule, MatDatepickerModule, MatRadioModule, MatCardModule, SlidingFormComponent, TemplateIdDirective, MtxSelectModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatIconModule, CommonModule, MatDialogModule, MatDialogModule, MatButtonModule, MatDividerModule],
  providers: [provideNativeDateAdapter(), provideNativeDatetimeAdapter(), DatePipe,],
  templateUrl: './advanced-search-dialog.component.html',
  styleUrl: './advanced-search-dialog.component.scss'
})
export class AdvancedSearchDialogComponent {
  form: FormGroup;

  mainButtons: SlidingDialogActionButtonConfig[] = [
    { text: 'Close', type: 'basic', action: ButtonAction.CancelClose },
    { text: "Submit", type: 'flat', customAction: () => this.submit() },
  ];

  views: SlidingFormConfig[] = [
    {
      name: 'main',
      title: "Advanced Search",
      buttons: this.mainButtons
    }
  ]
  mainId = this.views[0].name;

  dateTimePickerRef: { [key: string]: MtxDatetimepicker<Date> } = {};

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: AdvancedSearchDialogData,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AdvancedSearchDialogComponent>
  ) {

    this.form = this.fb.group({
      generic: [config.config.generic.value],
    });
    this.config.config.fields.forEach(field => {
      if (config.value?.advancedSearchQuery) {
        let fieldConfig = config.value?.advancedSearchQuery.find(x => x.key === field.key)

        if (fieldConfig) {
          this.form.addControl(field.key, this.fb.control(fieldConfig.value));
        }
        else {
          this.form.addControl(field.key, this.fb.control(null));
        }


        if (field.type === 'select' && field.selectOptions?.multiple && field.selectOptions?.displayInclusive) {
          this.form.addControl(field.key + '_inclusive', this.fb.control(true));
        }

        if (field.type === 'dateRange') {
          if (fieldConfig?.dateRangeConfig) {
            this.form.addControl(field.key + '_start', this.fb.control(fieldConfig.dateRangeConfig.startDate));
            this.form.addControl(field.key + '_end', this.fb.control(fieldConfig.dateRangeConfig.endDate));
          }
          else {
            this.form.addControl(field.key + '_start', this.fb.control(null));
            this.form.addControl(field.key + '_end', this.fb.control(null));
          }
        }

        if (field.type === 'date') {
          this.dateTimePickerRef[field.key] = new MtxDatetimepicker<Date>();
        }
      }
    });
  }

  submit() {
    this.dialogRef.close(this.form.value);
  }
}

