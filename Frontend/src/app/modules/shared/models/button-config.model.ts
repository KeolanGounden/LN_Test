export interface ButtonConfig {
  label?: string;
  icon?: string;
  tooltip?: string;
  action: () => void;
  disabled?: Function;
  hide?: () => boolean;
  type: ButtonType;
}

export enum ButtonType {
  Flat = 'flat',
  FlatWithText = 'flat-with-text',
  Stroked = 'stroked',
  Raised = 'raised',
  Basic = 'basic',
  Icon = 'icon',
  Fab = 'fab',
  MiniFab = 'mini-fab',
  SlideToggle = 'slide-toggle',
  Chip = 'chip',
  Badge = 'badge'
}

export enum ButtonAlignment {
  Start = 'start',
  End = 'end'
}