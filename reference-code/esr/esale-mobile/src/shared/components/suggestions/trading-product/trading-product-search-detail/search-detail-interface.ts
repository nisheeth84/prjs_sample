

/**
 * Define milestone search detail
 */
export interface ISearchDetailProps {
  updateStateElement: (searchCondition: any) => void; // callback when change status control
  closeDetaiSearchModal: () => void; // call when click close button
  openResultSearchModal: () => void; // call when click apply button
}

/**
 * Define values of fieldInfoPersonal
 */
export interface IFieldInfoPersonal {
  fieldId: number;
  fieldName: string;
  fieldLabel: string;
  fieldType: number;
  fieldOrder: number;
  selectedTargetType: number;
  selectedTargetId: number;
  fieldItems: {
    itemId: number;
    itemLabel: string;
    itemOrder: number;
    isDefault: boolean;
  }[];
}

/**
 * Define values of props
 */
export interface ISearchCondition {
  isSearchBlank: boolean;
  fieldId: number;
  fieldType: string;
  isDefault: boolean;
  fieldName: string;
  fieldValue: string;
  searchType: number;
  searchOption: number;
}

/**
 * define value of SearchConditions
 */
export interface SearchConditions {
  fieldId: number;
  fieldType: string;
  isDefault: boolean;
  fieldName: string;
  fieldValue: string;
  searchType: number;
  searchOption: number;
}