export enum DnDItemTypes {
  EMPLOYEE = 'employee'
}

export interface DragItem {
  data: any;
  name: string;
  type: string;
}

export const AvatarColor = [
  'light-orange',
  'green',
  'pink',
  'orange',
  'purple',
  'light-green',
  'light-blue',
  'green',
  'light-pink',
  'orange'
];

export enum TagAutoCompleteType {
  None,
  Product,
  ProductTrading,
  Employee,
  BusinessCard,
  Milestone,
  Calendar,
  Customer,
  Task,
  Activity
}

export enum TagAutoCompleteMode {
  None,
  Single,
  Multi
}

export enum TagAutoCompletePostMessageAction {
  ProductTrading
}

export enum SearchType {
  Department = 1,
  Employee = 2,
  Group = 3
}

export enum IndexSaveSuggestionChoice {
  Employee = 'employee',
  Department = 'employee_department',
  Group = 'employee_group',
  Product = 'product',
  Milestone = 'milestones',
  Task = 'task',
  Customer = 'customer',
  ProductTrading = 'product_trading',
  BusinessCard = 'business_card'
}

export const LOOKUP_TYPE_SEARCH_LIKES = ['9', '10', '11', '12', '13', '14', '15'];

export const LOOKUP_TYPE_SEARCH_EQUALS = ['5', '6', '7', '8', '16'];

export const LOOKUP_TYPE_SEARCH_OPTION_ORS = ['9', '10', '13'];

export const SUGGESTION_CSS = {
  WRAP_TAG: 'wrap-tag height-40 w80',
  TAG: 'tag text-ellipsis'
};
