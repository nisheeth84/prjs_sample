/**
 * Define data structure for API suggestTimelineGroupName
 **/

export type DataType = {
  timelineGroupId?: any;
  timelineGroupName?: any;
  imagePath?: any;
  isPublic?: boolean;
  color?: string;
};
export type SuggestTimelineGroupName = {
  data?: DataType[];
};
export type PositionScreen = {
  top?: number;
  bottom?: number;
  left: number;
};
