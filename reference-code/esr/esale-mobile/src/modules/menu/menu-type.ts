import { AvailableIcons } from "../../shared/components/icon/icon-map";

export interface Feature {
  active?: boolean;
  title: string;
  icon?: AvailableIcons;
  handler?: () => void;
  navigate?: string;
}
export interface Service {
  serviceId: number;
  employeeId?: number;
  serviceName: any;
  active?: boolean;
  iconPath?: string;
  handler?: () => void;
}
export interface CompanyName {
  companyName: string;
}
