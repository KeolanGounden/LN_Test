import { DialogButtonText } from "./dialog-button-text.enum";



export interface ConfirmationDialogContent{
    title?:string;
    message: string
    requireExplicitConfirmation?:boolean
    customConfirmationWord?:string
    buttons?:DialogButtonText;
    showNote?: boolean;
     cardConfig?: {
    title?: string;
    details?: Array<{ label: string; value?: string; chips?: string[] }>;
  }[];
}