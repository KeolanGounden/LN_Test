import { ButtonConfig } from "./button-config.model";
import { SlidingDialogActionButtonConfig } from "./sliding-dialog-action-button-config";
import { HelpTooltipConfig } from "./help-tooltip-config";



export interface SlidingFormConfig {
  name: string;
  title?: string;
  titleButton?: ButtonConfig;
  buttons: SlidingDialogActionButtonConfig[];
  helpTooltip?: HelpTooltipConfig
  headerButtons?: ButtonConfig[];

}
