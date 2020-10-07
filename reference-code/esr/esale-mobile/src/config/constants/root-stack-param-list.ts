import { RouteProp } from '@react-navigation/native';

interface BussinessCardItem {
  id: number;
  department: string;
  manager: string;
  check: boolean;
  species: string;
  position: string;
}

type RootStackParamList = {
  ProductDetail: { productId: number };

  ProductSetDetail: { productSetId: number };

  BussinessCardSavedList: { param: Array<BussinessCardItem> };

  TaskDetail: {
    taskId: number;
  };

  MilestoneDetail: {
    milestoneId: number;
  };

  CreateMilestone: {
    data: any;
    type: number;
    milestoneId: number;
  };

  BusinessCardDetail: {
    businessCardId: number;
    prevBusinessCardId: number;
    nextBusinessCardId: number;
    currentIndex: number;
    businessCardHistoryId: number;
    updatedDate: string;
    isShowPrevNext: boolean;
  };

  PersonListReactionProps: {
    index: number;
    timelineId: number;
  };

  CreateTimeline: {
    title: string;
    comment: any;
  };

  TaskEdit: {
    taskId: number;
    type: number;
    isSubTask: boolean;
    customerId: number;
    customerName: string;
    milestoneId: number;
    milestoneName: string;
  };

  CreateTimelineGroup: {
    timelineGroupId: number;
  };

  ColorProps: {
    id: number;
    hexColor: string;
  };

  EmployeeListProps: {
    data: Array<any>;
  };

  TradingDetail: {
    tradingId: number;
    customerName: string;
    customerId: number;
    endPlanDate: string;
    progressName: string;
    amount: number;
    productName: string;
    productId: number;
    employeeName: string;
    employeeId: number;
  };
  TimelineGroupParticipant: {
    timelineGroupId: number;
    user: number;
  };
  AddMoveToList: {
    totalRecords: number;
    recordIds: Array<number>;
    idOfOldList: number;
    listId: number;
    type: number;
    listName: string;
  };
};

export type BussinessSavedListRouteProp = RouteProp<
  RootStackParamList,
  'BussinessCardSavedList'
>;

export type ProductDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductDetail'
>;
export type ProductSetDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'ProductSetDetail'
>;
export type ProductTradingDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'TradingDetail'
>;
export type TaskDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'TaskDetail'
>;
export type MilestoneDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  'MilestoneDetail'
>;
export type CreateMilestoneScreenRouteProp = RouteProp<
  RootStackParamList,
  'CreateMilestone'
>;

export type BusinessCardScreenRouteProp = RouteProp<
  RootStackParamList,
  'BusinessCardDetail'
>;

export type PersonListReactionRouteProp = RouteProp<
  RootStackParamList,
  'PersonListReactionProps'
>;

export type CreateTimelineRouteProp = RouteProp<
  RootStackParamList,
  'CreateTimeline'
>;

export type CreateTimelineGroupRouteProp = RouteProp<
  RootStackParamList,
  'CreateTimelineGroup'
>;

export type ColorRouteProp = RouteProp<RootStackParamList, 'ColorProps'>;

export type EmployeeListRouteProp = RouteProp<
  RootStackParamList,
  'EmployeeListProps'
>;

export type TimelineGroupParticipantRouteProp = RouteProp<
  RootStackParamList,
  'TimelineGroupParticipant'
>;
export type AddMoveToListRouteProp = RouteProp<
  RootStackParamList,
  'AddMoveToList'
>;

export type EditTaskRouteProp = RouteProp<RootStackParamList, 'TaskEdit'>;
