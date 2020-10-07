/**
 * Define data structure for API getViewTypesForCalendar
 **/
export type ItemListType = {
  itemLabel?: any;
  itemId?: any;
  itemValue?: any;
  itemType?: any;
  updatedDate?: any;
};
export type GetViewTypesForCalendar = {
  itemList?: ItemListType[];
};

export const UPDATE_DATA_VIEW_TYPE_FOR_CALENDAR = (itemId, itemValue, updatedDate) => {
  return {
    itemId,
    itemValue,
    updatedDate
  };
};
