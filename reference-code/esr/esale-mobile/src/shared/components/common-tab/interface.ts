
export interface TabScreen {
  fieldInfo?: FieldInfo,
  name: string,
  badges ?:any,
  component: React.ComponentType<any>,
  sortOrder? : number;
}

export interface FieldInfo {
  fieldId: number,
  fieldBelong: number,
  fieldName: string,
  fieldLabel: any,
  fieldType: number,
  fieldOrder: number,
  isDefault: boolean,
  maxLength: number,
  modifyFlag: number,
  availableFlag: number,
  isDoubleColumn: boolean,
  ownPermissionLevel: number,
  othersPermissionLevel: number,
  defaultValue: string,
  currencyUnit: string,
  typeUnit: number,
  decimalPlace: number,
  urlType: number,
  urlTarget: string,
  urlEncode: number,
  urlText: string,
  linkTarget: number,
  configValue: string,
  isLinkedGoogleMap: boolean,
  fieldGroup: number,
  lookupData: any,
  lookedFieldId: number,
  relationData: any,
  tabData: any,
  fieldItems: any[]
}