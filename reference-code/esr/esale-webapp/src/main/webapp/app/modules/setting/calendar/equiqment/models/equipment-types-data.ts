/**
 * Define data structure for list Equipment Type Data
 **/

export type Equipment = {
  equipmentId?: number;
  equipmentName?: any;
  equipmentTypeId?: number;
  isAvailable?: any;
  displayOrder?: number;
  isDelete?: number;
  isUpdate?: number;
};

export type EquipmentTypesData = {
  equipmentTypeId?: number;
  equipmentTypeName?: any;
  displayOrder?: number;
  equipments?: Equipment[];
  isDelete?: number;
  isUpdate?: number;
};
