/**
 * Define data structure for API getBusinessCardList
 **/
export type ListInfoType = {
  listId?: any;
  listName?: any;
  displayOrder?: any;
  listType?: any;
  displayOrderOfFavoriteList?: any;
};
export type GetBusinessCardList = {
  listInfo?: ListInfoType[];
};
