export type SaleInfo = {
  listId?: number;
  listName?: string;
  displayOrder?: number;
  listType?: number;
  displayOrderOfFavoriteList?: number;
};
export type GetListSales = {
  data?: {
    listInfo?: SaleInfo[];
  };
};
