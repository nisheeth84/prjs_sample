/**
 * Define data structure for API getTimelineGroups
 **/

export type InvitesType = {
  inviteId?: any;
  inviteType?: any;
  inviteName?: any;
  inviteImagePath?: any;
  employeeNames?: any;
  status?: any;
  authority?: any;
  employees?: Employees[];
  departments?: Department[];
};
export type Employees = {
  employeeNames?: any;
  employeeDepartments?: EmployeesDepartments[];
};
export type EmployeesDepartments = {
  departmentName?: any;
  positionName?: any;
};
export type Department = {
  employeeNames?: any;
  employeeId?: any;
  parentId?: any;
  parentName?: any;
};
export type TimelineGroupType = {
  timelineGroupId?: any;
  timelineGroupName?: any;
  comment?: any;
  createdDate?: any;
  isPublic?: any;
  isApproval?: any;
  color?: any;
  imagePath?: any;
  imageName?: any;
  width?: any;
  height?: any;
  changedDate?: any;
  invites?: InvitesType[];
};
export type GetTimelineGroups = {
  timelineGroup?: TimelineGroupType[];
};
