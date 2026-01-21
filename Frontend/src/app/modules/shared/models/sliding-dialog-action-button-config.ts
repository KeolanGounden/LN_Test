

export interface SlidingDialogActionButtonConfig {
  text: string;
  customAction?: Function;
  color?: MaterialColor;
  type?: 'flat' | 'stroked' | 'raised' | 'basic' | 'icon' | 'fab' | 'mini-fab';
  disabled?: Function;
  action?: ButtonAction;
  hide?: () => boolean;

}

export type MaterialColor = 'primary' | 'accent' | 'warn';


/**
 * Represents the available actions for a button in the application.
 *
 * @remarks
 * This enum is used to specify the intended action when a button is clicked,
 * such as cancelling, submitting, or navigating between steps.
 *
 * @enum {number}
 */
export enum ButtonAction {
  /**
   * Cancels the current operation and closes the dialog or form.
   */
  CancelClose = 0,

  /**
   * Cancels the current operation and returns to the previous step.
   */
  CancelPrevious = 1,

  /**
   * Submits the current data and closes the dialog or form.
   */
  SubmitClose = 2,

  /**
   * Submits the current data and returns to the previous step.
   */
  SubmitPrevious = 3,

  /**
   * Submits the current data and proceeds to the next step.
   */
  SubmitNext = 4,
}