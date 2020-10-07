/**
 * Define data structure for API updateCustomFieldsInfo
 **/

type FieldInfoTabIdsType = {};
type TabInfoIdsType = {};
type FieldIdsType = {};

export type UpdateCustomFieldsInfo = {
  updateCustomFieldsInfo?: {
    fieldIds?: FieldIdsType[];

    tabInfoIds?: TabInfoIdsType[];

    fieldInfoTabIds?: FieldInfoTabIdsType[];
  };
};
