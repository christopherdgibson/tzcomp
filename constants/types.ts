export interface BlockAttributes {
    align: string;
    calendarBgColor: string;
    calendarFontColor: string;
    cardBgColor: string;
    cardFontColor: string;
    gradientColorLeft: string;
    gradientColorRight: string;
}

export interface SetAttributesProps {
    setAttributes: (attrs: Partial<BlockAttributes>) => void;
}

export interface EditProps extends SetAttributesProps {
    attributes: BlockAttributes;
}

export interface CompareZoneProps {
  timeZone: string;
  difference: number;
}

export interface SelectedCard {
    index: number | null;
    subIndex: number | null;
}

export type OnClick = () => void;

export type OnChange<T> = (value: T) => void;

export interface ThemeStyles extends React.CSSProperties {
    "--base-bg"?: string;
    "--font-selected"?: string;
    "--accent-primary"?: string;
    "--accent-secondary"?: string;
}
