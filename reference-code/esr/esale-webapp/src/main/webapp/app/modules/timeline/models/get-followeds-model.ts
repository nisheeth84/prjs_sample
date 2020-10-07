/**
 * Define data structure for API getFolloweds
 **/

export type FollowedsType = {
  followTargetId?: any;
  followTargetType?: any;
  followTargetName?: any;
  createdDate?: any;
};
export type GetFolloweds = {
  followeds?: FollowedsType[];
  total?: number;
};
export type ObjectDetail = {
  objectId: number;
  objectType: number;
};
