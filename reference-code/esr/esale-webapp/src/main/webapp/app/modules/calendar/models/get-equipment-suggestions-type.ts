import { Moment } from 'moment';

type EquipmentSuggestion = {
  equipmentId: number;
  equipmentName: string;
  equipmentTypeId: number;
  equipmentTypeName: string;
  isAvailable: boolean;
  displayOrder: number;
};
/**
 * Define data structure for API getEquipmentSuggestion
 **/
export type GetEquipmentSuggestionsType = {
  data: Array<EquipmentSuggestion>;
};

export type EquipmentSuggestionType = {
  equipmentId: number;
  equipmentName: string;
  equipmentTypeId: number;
  equipmentTypeName: string;
  isVailable: boolean;
  displayOrder: number;
  updatedDate: Date;
};
