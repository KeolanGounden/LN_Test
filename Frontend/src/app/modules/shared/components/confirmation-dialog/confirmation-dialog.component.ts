import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContent, MatDialogActions } from '@angular/material/dialog';
import { ConfirmationDialogContent } from '../../models/confirmation-dialog';
import { FormControl, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ConfirmationDialogResult } from '../../models/confirmation-dialog-result';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatTable, MatColumnDef, MatHeaderCellDef, MatHeaderCell, MatCellDef, MatCell, MatHeaderRowDef, MatHeaderRow, MatRowDef, MatRow } from '@angular/material/table';
import { MatChipListbox, MatChip, MatChipsModule } from '@angular/material/chips';
import { MatFormField, MatLabel, MatError } from '@angular/material/select';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';;
import { MatCardModule } from "@angular/material/card";
import { HeaderConfig } from '../../models/header-config.model';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

import { DialogButtonText } from '../../models/dialog-button-text.enum';

@Component({
    selector: 'app-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: ['./confirmation-dialog.component.scss'],
    imports: [CdkScrollable, MatChipsModule, CommonModule,MatButtonModule,MatDialogContent,MatFormField, MatLabel, MatInput, FormsModule, ReactiveFormsModule, MatError, MatDialogActions, MatButton, MatCardModule,]
})
export class ConfirmationDialogComponent implements OnInit {

  title: string
  message: string | SafeHtml | undefined

  showNote: boolean = false;
  notePlaceholder: string | undefined;
  noteInput = new FormControl('');

  requireExplicitConfirmation: boolean = false;
  confirmationWord: string | undefined
  confirmationPlaceholder: string | undefined
  buttons: DialogButtonText | undefined;
  confirmButtonText: string | undefined;
  cancelButtonText: string | undefined;
  confirmationInput = new FormControl('', Validators.required);

  headerconfig:HeaderConfig[]=[]


  constructor(private dialogRef: MatDialogRef<ConfirmationDialogComponent>, @Inject(MAT_DIALOG_DATA) private dialogContent: ConfirmationDialogContent, private sanitizer: DomSanitizer) {
    this.title = dialogContent.title || 'Confirmation';
    if (dialogContent) {
    
        this.message = dialogContent.message
      
    
      this.requireExplicitConfirmation = dialogContent.requireExplicitConfirmation ?? false;
      this.confirmationWord = dialogContent.customConfirmationWord ?? "CONFIRM";
      this.confirmationPlaceholder = this.confirmationWord ?? "Type confirmation word";

      this.setButtonText();

      this.showNote = dialogContent.showNote ?? false;
      if (this.showNote) {
              this.noteInput.setValidators(Validators.required);
          
      }
    }
       this.headerconfig=[{title:this.title,id:'1'}];
  }

  private setButtonText() {
    switch (this.dialogContent.buttons) {
      case DialogButtonText.CancelDelete:
        this.confirmButtonText = "Delete";
        this.cancelButtonText = "Cancel";
        break;
      case DialogButtonText.NoYes:
        this.confirmButtonText ="Yes";
        this.cancelButtonText = "No";
        break;
      default:
        break;
        case DialogButtonText.CancelProceed:
        this.confirmButtonText = "Proceed"; 
        this.cancelButtonText ="Cancel";
        break;
    }
  }

  ngOnInit(): void {
  
  }

  
  isConfirmationValid(): boolean {
      if (this.requireExplicitConfirmation && 
        this.confirmationInput.value !== this.confirmationWord) {
        return false;
    }

    if (this.showNote && this.noteInput.hasValidator(Validators.required)) {
        return this.noteInput.valid && !!this.noteInput.value?.trim();
    }

    return true;
  }

  confirm() {
    if (this.isConfirmationValid()) {
      const result :ConfirmationDialogResult={
        note:this.showNote ? this.noteInput?.value : undefined
      };
        this.dialogRef.close(result);
    }
  }
  cancel() {
    this.dialogRef.close(false);
  }

}
