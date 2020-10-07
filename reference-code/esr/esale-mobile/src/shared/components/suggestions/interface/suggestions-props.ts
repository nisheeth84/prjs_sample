import { TypeTradingProduct, TypeShowResult } from "../../../../config/constants/enum"

export interface ISuggestionsProps {
  typeSearch: TypeTradingProduct, // type search (SINGLE or MULTI)
  fieldLabel: string, // label of field
  typeShowResult?: TypeShowResult // type show result in  case multiple choose
  updateStateElement: (searchValue: any) => void; // callback when change status control
}