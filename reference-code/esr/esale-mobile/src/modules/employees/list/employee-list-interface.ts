/**
 * Define interface ExtraSetting
 */
export interface ExtraSetting {
  key: string,
  value: string
}
/**
 * Define interface OrderBy
 */
export interface OrderBy {
  key: string,
  fieldType: number,
  value: string,
}
/**
 * Define function FilterConditions
 */
export interface FilterCondition {
  fieldId: number,
  fieldName: string,
  fieldType: number,
  filedBelong: number,
  filterType: number,
  filterOption: number,
  fieldValue: string,
  isNested: boolean
}
/**
 * Define function FilterListConditions
 */
export interface FilterListCondition {
  targetType: number,
  targetId: number
  filterConditions: Array<FilterCondition>

}
