import { ButtonConfig } from "./button-config.model";

export interface HeaderConfig {
    title: string;
    id: string;
    subtitle?: string;
    headerFunctionCallback?: (title_id: string) => void;
    headerButton?: ButtonConfig
    selected?: boolean
}

export interface ContentHeaderConfig extends HeaderConfig {
    headerButton?: ButtonConfig
    overrideTemplate?: boolean
}