import { ImageSourcePropType } from 'react-native';

export interface Card {
  avatarUrl: any;
  name: string;
  role: string;
}

export interface Task {
  name: string;
  deadline: string;
  customerName: string;
  productName: string;
  personInCharge: string;
}

export interface TradingProduct {
  name: string;
  completeDate: string;
  progress: string;
  amount: number;
}

export interface Job {
  name: string;
  time: string;
}

export interface Calendar {
  flag: boolean;
  day: string;
  data: Array<Job>;
}

export interface Employee {
  linkAvatar: ImageSourcePropType;
  name: string;
}

export interface Group {
  name: string;
  flagStar: boolean;
  title: string;
  createDate: string;
  bgc: string;
  listMember: Array<Employee>;
  isJoin: boolean;
}
