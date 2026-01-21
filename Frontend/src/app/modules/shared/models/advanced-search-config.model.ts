export interface AdvancedSearchConfig {
  generic: GenericSearchConfig;
  fields: AdvancedSearchFieldConfig[];
}

export interface AdvancedSearchFieldConfig {
  key: string;
  label: string;
  filterDisplay: (config: AdvancedSearchConfig, value: any) => string[]
  type: 'text' | 'select' | 'date' | 'dateRange' | 'checkbox';
  selectOptions?: SelectOption;
  placeholder?: string;
}

export interface GenericSearchConfig {
  label: string;
  value: string;
  placeholder?: string
}

export interface SelectOption {
  options?: { label: string; value: any }[];
  multiple?: boolean;
  displayInclusive?: boolean;
}

export interface SearchQueryValue {
  genericSearchTerm: string | null
  advancedSearchQuery?: AdvancedSearchQuery[]
}

export interface AdvancedSearchQuery {
  key: string
  value: any
  selectConfig?: SelectQueryConfig
  dateRangeConfig?: DateRangeConfig
  label: string[]
}

export interface FilterRemovedEvent {
  event: string;
  index?: number;
}

export interface AdvancedSearchDialogData {
  config: AdvancedSearchConfig;
  value: SearchQueryValue
}

export interface SelectQueryConfig {
  multiple?: boolean
  inclusive?: boolean
}

export interface DateRangeConfig {
  startDate: Date | null;
  endDate: Date | null;
}

