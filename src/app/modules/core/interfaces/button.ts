export interface Button {
  style: 'text' | 'filled' | 'border';
  label: string;
  icon: string;
  notifications: number;
  showLabel: boolean;
  showIcon: boolean;
}
