/**
 * Define data structure for API checkDuplicatedEquipments
 **/

type PeriodsType = {
  startDate?: any;
  endDate?: any;
  canUse?: any;
};
type EquipmentsType = {
  equipmentId?: any;
  periods?: PeriodsType[];
};
export type CheckDuplicatedEquipments = {
  equipments?: EquipmentsType[];
};
