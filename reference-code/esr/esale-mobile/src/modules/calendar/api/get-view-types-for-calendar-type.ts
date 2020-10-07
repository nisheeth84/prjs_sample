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

export const GET_VIEW_TYPE_FOR_CALENDAR = () => {
  return `
    {
      viewTypesForCalendar {
          itemList {
              itemId
              itemValue
              itemType
              updatedDate
          }
          
      }
    }`;
};

export const UPDATE_DATA_VIEW_TYPE_FOR_CALENDAR = (itemId: number, itemValue: any, updatedDate: any) => {
  return `
    mutation {
      updateViewTypeForCalendar(itemId: ${itemId},itemValue: "${itemValue}", updatedDate: "${updatedDate}" )
    }`;
};
