export const ACTION_TYPES = {
  TIMELINE_GET_USER_TIMELINES: 'timeline/TIMELINE_GET_USER_TIMELINES',
  TIMELINE_GET_LOCAL_NAVIGATION: 'timeline/TIMELINE_GET_LOCAL_NAVIGATION',
  TIMELINE_GET_ATTACHED_FILES: 'timeline/TIMELINE_GET_ATTACHED_FILES',
  TIMELINE_UPDATE_TIMELINE_FILTERS: 'timeline/TIMELINE_UPDATE_TIMELINE_FILTERS',
  TIMELINE_CREATE_COMMENT_AND_REPLY: 'timeline/TIMELINE_CREATE_COMMENT_AND_REPLY',
  TIMELINE_SHARE_TIMELINE: 'timeline/TIMELINE_SHARE_TIMELINE',
  TIMELINE_GET_TIMELINE_BY_ID: 'timeline/TIMELINE_GET_TIMELINE_BY_ID',
  TIMELINE_GET_RECENT_REACTIONS: 'timeline/TIMELINE_GET_RECENT_REACTIONS',
  TIMELINE_UPDATE_TIMELINE_FAVORITE: 'timeline/TIMELINE_UPDATE_TIMELINE_FAVORITE',
  TIMELINE_DELETE_TIMELINE: 'timeline/TIMELINE_DELETE_TIMELINE',
  TIMELINE_GET_COMMENT_AND_REPLIES_RENEW: 'timeline/TIMELINE_GET_COMMENT_AND_REPLIES_RENEW',
  TIMELINE_GET_COMMENT_AND_REPLIES_OLDER: 'timeline/TIMELINE_GET_COMMENT_AND_REPLIES_OLDER',
  TIMELINE_GET_COMMENT: 'timeline/TIMELINE_GET_COMMENT',
  TIMELINE_GET_REPLIES: 'timeline/TIMELINE_GET_REPLIES',
  TIMELINE_UPDATE_TIMELINE_REACTION: 'timeline/TIMELINE_UPDATE_TIMELINE_REACTION',
  TIMELINE_GET_TIMELINE_FILTERS: 'timeline/TIMELINE_GET_TIMELINE_FILTERS',
  TIMELINE_COMMON_LOGIC: 'timeline/TIMELINE_COMMON_LOGIC',
  TIMELINE_GET_FOLLOWED: 'timeline/TIMELINE_GET_FOLLOWED',
  TIMELINE_DELETE_FOLLOWED: 'timeline/TIMELINE_DELETE_FOLLOWED',
  TIMELINE_GET_COUNT_NEW: 'timeline/TIMELINE_GET_COUNT_NEW',
  SHOW_DETAIL: 'timeline/SHOW_DETAIL',
  TIMELINE_LIST_CHANGE_TO_DISPLAY: 'timeline/TIMELINE_LIST_CHANGE_TO_DISPLAY',
  TIMELINE_LIST_CHANGE_TO_EDIT: 'timeline/TIMELINE_LIST_CHANGE_TO_EDIT',
  TIMELINE_IS_VALUE_POST: 'timeline/TIMELINE_IS_VALUE_POST',
  TIMELINE_SET_ACTIVE_NAVIGATION: 'timeline/TIMELINE_SET_ACTIVE_NAVIGATION',
  TIMELINE_CLEAR_TIMELINE_FOLLOWER: 'timeline/TIMELINE_CLEAR_TIMELINE_FOLLOWER',
  /** group */
  TIMELINE_GET_TIMELINE_GROUPS: 'timeline/TIMELINE_GET_TIMELINE_GROUPS',
  TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE: 'timeline/TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE',
  TIMELINE_GET_FAVORITE_TIMELINE_GROUPS: 'timeline/TIMELINE_GET_FAVORITE_TIMELINE_GROUPS',
  TIMELINE_ADD_FAVORITE_TIMELINE_GROUP: 'timeline/TIMELINE_ADD_FAVORITE_TIMELINE_GROUP',
  TIMELINE_DELETE_FAVORITE_TIMELINE_GROUP: 'timeline/TIMELINE_DELETE_FAVORITE_TIMELINE_GROUP',
  TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP: 'timeline/TIMELINE_ADD_MEMBER_TO_TIMELINE_GROUP',
  TIMELINE_GET_LIST_TIMELINE_GROUP_NAME: 'timeline/TIMELINE_GET_LIST_TIMELINE_GROUP_NAME',
  TIMELINE_ADD_REQUEST_TO_TIMELINE_GROUP: 'timeline/TIMELINE_ADD_REQUEST_TO_TIMELINE_GROUP',
  TIMELINE_ADD_REQUEST_TO_JOIN_GROUP: 'timeline/TIMELINE_ADD_REQUEST_TO_JOIN_GROUP',
  TIMELINE_DELETE_REQUEST_TO_JOIN_GROUP: 'timeline/TIMELINE_DELETE_REQUEST_TO_JOIN_GROUP',
  TIMELINE_SUGGEST_TIMELINE_GROUP_NAME: 'timeline/TIMELINE_SUGGEST_TIMELINE_GROUP_NAME',
  TIMELINE_DELETE_TIMELINE_GROUP: 'timeline/TIMELINE_DELETE_TIMELINE_GROUP',
  TIMELINE_DELETE_MEMBER_OF_TIMELINE_GROUP: 'timeline/TIMELINE_DELETE_MEMBER_OF_TIMELINE_GROUP',
  TIMELINE_CREATE_TIMELINE_GROUP: 'timeline/TIMELINE_CREATE_TIMELINE_GROUP',
  TIMELINE_UPDATE_TIMELINE_GROUP: 'timeline/TIMELINE_UPDATE_TIMELINE_GROUP',
  TIMELINE_UPDATE_MEMBER_OF_TIMELINE_GROUP: 'timeline/TIMELINE_UPDATE_MEMBER_OF_TIMELINE_GROUP',
  TIMELINE_SEND_MAIL: 'timeline/TIMELINE_SEND_MAIL',
  TIMELINE_GET_USER_TIMELINES_SCROLL: 'timeline/TIMELINE_GET_USER_TIMELINES_SCROLL',
  TIMELINE_DELETE_TIMELINE_GROUP_NAME: 'timeline/TIMELINE_DELETE_TIMELINE_GROUP_NAME',
  TIMELINE_RESET: 'timeline/TIMELINE_RESET',
  TIMELINE_LIST_GROUP_RESET: 'timeline/TIMELINE_LIST_GROUP_RESET',
  TIMELINE_CREATE_TIMELINE: 'timeline/TIMELINE_CREATE_TIMELINE',
  CLEAR_VIEW_COMMEMT_REPLY_COMMON: 'timeline/CLEAR_VIEW_COMMEMT_REPLY_COMMON',
  TIMELINE_GET_EMPLOYEE_OF_TIMELINE_GROUPS: 'timeline/TIMELINE_GET_EMPLOYEE_OF_TIMELINE_GROUPS',
  // Update common
  TIMELINE_UPDATE_RECENTLY_DATE_CLICKED: 'timeline/TIMELINE_UPDATE_RECENTLY_DATE_CLICKED',
  // Update data formSearch
  TIMELINE_UPDATE_FORM_SEARCH: 'timeline/TIMELINE_UPDATE_FORM_SEARCH',
  UPDATE_SORTTYPE: 'timeline/ UPDATE_SORTTYPE',
  // Update data formSearch
  TIMELINE_TOGGLE_LIST_FILE: 'timeline/TIMELINE_CLOSE_LIST_FILE',
  TOGGLE_TIMELINE_MODAL: 'timeline/TOGGLE_TIMELINE_MODAL',
  TOGGLE_CONFIRM_POPUP: 'timeline/TOGGLE_CONFIRM_POPUP',
  TIMELINE_GET_ATTACHED_FILES_SCROLL: 'timeline/TIMELINE_GET_ATTACHED_FILES_SCROLL',
  TOGGLE_GROUP_PARTICIPANTS: 'timeline/TOGGLE_GROUP_PARTICIPANTS',
  TOGGLE_GROUP_PARTICIPANTS_OWNER: 'timeline/TOGGLE_GROUP_PARTICIPANTS_OWNER',
  // Pass id to detail
  TIMELINE_SET_DETAIL_ID: 'timeline/TIMELINE_SET_DETAIL_ID',
  TIMELINE_UPDATE_JOIN_REQUEST_GROUP_STATUS: 'timeline/TIMELINE_UPDATE_JOIN_REQUEST_GROUP_STATUS',
  GET_SUGGESTION_TIMELINE: 'timeline/GET_SUGGESTION_TIMELINE',
  // clear cache
  CLEAR_CACHE_GROUP_DETAIL: 'timeline/CLEAR_CACHE_GROUP_DETAIL',
  CLEAR_CACHE_LIST_ATTACHED_FILES: 'timeline/CLEAR_CACHE_LIST_ATTACHED_FILES',
  // ext zone
  TIMELINE_GET_EXT_TIMELINES: 'timeline/TIMELINE_GET_EXT_TIMELINES',
  TIMELINE_EXT_USER_TIMELINES_SCROLL: 'timeline/TIMELINE_EXT_USER_TIMELINES_SCROLL',
  TIMELINE_GET_EXT_TIMELINE_FILTERS: 'timeline/TIMELINE_GET_EXT_TIMELINE_FILTERS',
  TIMELINE_UPDATE_EXT_FORM_SEARCH: 'timeline/TIMELINE_UPDATE_EXT_FORM_SEARCH',
  TIMELINE_UPDATE_EXT_TIMELINE_FILTERS: 'timeline/TIMELINE_UPDATE_EXT_TIMELINE_FILTERS',
  RESET_EXT_TIMELINE_SCROLL: 'timeline/RESET_TIMELINE_SCROLL',
  RESET_TIMELINE_ATTACHED_SCROLL: 'timeline/RESET_TIMELINE_ATTACHED_SCROLL',
  TIMELINE_DELETE_EXT_TIMELINE: 'timeline/TIMELINE_EXT_DELETE_TIMELINE',
  RESET_MESSAGE_INFO: 'timeline/RESET_MESSAGE_INFO',
  RESET_PAGE_NUMBER_TIMELINE: 'timeline/RESET_PAGE_NUMBER_TIMELINE',
  SET_MODAL_MESSAGE_MODE: 'timeline/SET_MODAL_MESSAGE_MODE',
  SET_IS_CREATING: 'timeline/SET_IS_CREATING',
  SET_OPEN_CONFIRM_MODAL: 'timeline/SET_OPEN_CONFIRM_MODAL',
  RESET_TIMELINE_GROUP_ID_RES: 'timeline/RESET_TIMELINE_GROUP_ID_RES',
  CLEAR_LIST_SUGGESTIONT_TIMELINE: 'timeline/CLEAR_LIST_SUGGESTIONT_TIMELINE',
  TIMELINE_GET_FULL_LIST_REACTION: 'timeline/TIMELINE_GET_FULL_LIST_REACTION',
  TIMELINE_REACTION_UPDATE_MAP: 'timeline/TIMELINE_REACTION_UPDATE_MAP',
  CLEAR_TIMELINES: 'timeline/CLEAR_TIMELINES',
  CLEAR_TIMELINES_MEMBER: 'timeline/CLEAR_TIMELINES_MEMBER',
  TIMELINE_TOGGLE_DETAIL_MODAL_ORTHER: 'timeline/TIMELINE_TOGGLE_DETAIL_MODAL_ORTHER',
  CLEAR_MESS_REQUIRE: 'timeline/CLEAR_MESS_REQUIRE',
  CLEAR_LIST_TIMELINE_GROUP: 'timeline/CLEAR_LIST_TIMELINE_GROUP',
  TIMELINE_GET_TIMELINE_GROUPS_DETAIL: 'timeline/TIMELINE_GET_TIMELINE_GROUPS_DETAIL',
  TIMELINE_CLEAR_EXT_TIMELINE: 'timeline/TIMELINE_CLEAR_EXT_TIMELINE',
  GET_OUT_TIMELINE_GROUP: 'timeline/GET_OUT_TIMELINE_GROUP',
  CHECK_PUBLIC_GROUP: 'timeline/CHECK_PUBLIC_GROUP',
  CLEAR_IS_PUBLIC_GROUP: 'timeline/CLEAR_IS_PUBLIC_GROUP',
  RESET_IS_CLICK_NAVIGATION: 'timeline/RESET_IS_CLICK_NAVIGATION',
  RESET_IS_ADD_MEMBER_SUCCESS: 'timeline/RESET_IS_ADD_MEMBER_SUCCESS',
  SET_IS_SCROLLING: 'timeline/SET_IS_SCROLLING',
  SET_ACTIVE_STACK: 'timeline/SET_ACTIVE_STACK',
  TIMELINE_UPDATE_MAP_EXT_FORM_SEARCH: 'timeline/TIMELINE_UPDATE_MAP_EXT_FORM_SEARCH',
  TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE_FOR_DETAIL_EMP:
    'timeline/TIMELINE_GET_TIMELINE_GROUPS_OF_EMPLOYEE_FOR_DETAIL_EMP',
  TIMELINE_VALUE_FILTER: 'timeline/TIMELINE_VALUE_FILTER',
  TIMELINE_CLEAR_VALUE_FILTER: 'timeline/TIMELINE_CLEAR_VALUE_FILTER',
  SET_IS_DELETE_MEMBER: 'timeline/SET_IS_DELETE_MEMBER'
};

export const TIMELINE_SERVICE_TYPES = {
  CUSTOMER: 1,
  BUSSINESS_CARD: 2,
  ACTIVITY: 3,
  SCHEDULE: 4,
  TASK: 5,
  MILESTONE: 6
};

export const GROUP_TIMELINE_MODE = {
  MANAGER: 1,
  MANAGER_HAVE_REQUEST: 2,
  MEMBER: 3,
  NOT_MEMBER: 4
};

export const STATUS_REQUEST_JOIN = {
  REQUEST: 2,
  NOT_REQUEST: 3
};

export const TIMELINE_TYPE = {
  ALL_TIMELINE: 1,
  MY_TIMELINE: 2,
  FAV_TIMELINE: 3,
  GROUP_TIMELINE: 4,
  DEPARTMENT_TIMELINE: 5,
  CUSTOMER_TIMELINE: 6,
  FAV_BIZCARD_TIMELINE: 7,
  ADD_GROUP: 90,
  GROUP: 80
};

export const CREATE_POSITION = {
  PERSONAL: 1,
  GROUP: 2,
  CUSTOMER: 3,
  BIZCARD: 4,
  ACTIVITY: 5,
  SCHEDULE: 6,
  TASK: 7,
  MILESTONE: 8
};

export const TARGET_TYPE = {
  EMPLOYEE: 1,
  ALL: 2,
  DEPARTMENT: 3,
  GROUP: 4,
  CUSTOMER: 5,
  BIZCARD: 6,
  ACTIVITY: 7,
  SCHEDULE: 8,
  TASK: 9,
  MILESTONE: 10
};

export const enum FlagCreateTimelineGroup {
  true,
  false
}
export const TYPE_DETAIL_MODAL = {
  EMPLOYEE: 1,
  ALL: 2,
  DEPARTMENT: 3,
  GROUP: 4,
  CUSTOMER: 5,
  CARD: 6,
  ACTIVITY: 7,
  SCHEDULE: 8,
  TASK: 9,
  MILESTONE: 10
};

export const INVITE_TYPE = {
  EMPLOYEE: 2,
  DEPARTMENT: 1
};

export const MODE_CHECK = 2;
export const CHECK_LENGTH_CONTENT = 1000;
export const LIMIT = 20;
export const LIMIT_ATTACHED_FILE = 30;
export const LIMIT_EXT = 5;

export const LISTCOLOR = [
  { id: 0, style: 'color-0', value: '#FB7D7D' },
  { id: 1, style: 'color-1', value: '#FFB379' },
  { id: 2, style: 'color-2', value: '#FFD590' },
  { id: 3, style: 'color-3', value: '#88D9B0' },
  { id: 4, style: 'color-4', value: '#85ACDC' },
  { id: 5, style: 'color-5', value: '#FC82FC' },
  { id: 6, style: 'color-6', value: '#FF9D9D' },
  { id: 7, style: 'color-7', value: '#FF92B9' },
  { id: 8, style: 'color-8', value: '#B4D887' },
  { id: 9, style: 'color-9', value: '#D8CC75' },
  { id: 10, style: 'color-10', value: '#6DCACC' },
  { id: 11, style: 'color-11', value: '#7171E2' },
  { id: 12, style: 'color-12', value: '#CC8BD1' },
  { id: 13, style: 'color-13', value: '#CEAA91' },
  { id: 14, style: 'color-14', value: '#FED3D3' },
  { id: 15, style: 'color-15', value: '#FFE7D2' },
  { id: 16, style: 'color-16', value: '#FFF1DA' },
  { id: 17, style: 'color-17', value: '#D8F2E5' },
  { id: 18, style: 'color-18', value: '#D6E3F3' },
  { id: 19, style: 'color-19', value: '#FED5FE' },
  { id: 20, style: 'color-20', value: '#FFDEDE' },
  { id: 21, style: 'color-21', value: '#FFE0EB' },
  { id: 22, style: 'color-22', value: '#D7EABE' },
  { id: 23, style: 'color-23', value: '#ECE5B9' },
  { id: 24, style: 'color-24', value: '#C8EBEC' },
  { id: 25, style: 'color-25', value: '#DBDBF7' },
  { id: 26, style: 'color-26', value: '#E7D3EF' },
  { id: 27, style: 'color-27', value: '#E6D4C7' }
];

export const TIME_FORMAT_HM = 'HH:mm';

export const LIST_PERMISSION_TIMELINE_GROUP = [
  {
    itemId: 1,
    itemLabel: 'timeline.authority.owner'
  },
  {
    itemId: 2,
    itemLabel: 'timeline.authority.member'
  }
];

export const SERVICE_TYPE_MAP = [
  {
    serviceType: TIMELINE_SERVICE_TYPES.CUSTOMER,
    targetType: TARGET_TYPE.CUSTOMER,
    createPosition: CREATE_POSITION.CUSTOMER
  },
  {
    serviceType: TIMELINE_SERVICE_TYPES.BUSSINESS_CARD,
    targetType: TARGET_TYPE.BIZCARD,
    createPosition: CREATE_POSITION.BIZCARD
  },
  {
    serviceType: TIMELINE_SERVICE_TYPES.ACTIVITY,
    targetType: TARGET_TYPE.ACTIVITY,
    createPosition: CREATE_POSITION.ACTIVITY
  },
  {
    serviceType: TIMELINE_SERVICE_TYPES.SCHEDULE,
    targetType: TARGET_TYPE.SCHEDULE,
    createPosition: CREATE_POSITION.SCHEDULE
  },
  {
    serviceType: TIMELINE_SERVICE_TYPES.TASK,
    targetType: TARGET_TYPE.TASK,
    createPosition: CREATE_POSITION.TASK
  },
  {
    serviceType: TIMELINE_SERVICE_TYPES.MILESTONE,
    targetType: TARGET_TYPE.MILESTONE,
    createPosition: CREATE_POSITION.MILESTONE
  }
];

export const MODE_EXT_TIMELINE = {
  LIST: 0,
  DETAIL: 1
};

export const AUTHORITY = {
  OWNER: 1,
  MEMBER: 2
};

export const TYPE_OF_MEMBER = {
  DEPARTMENT: 1,
  EMPLOYEE_GROUP: 2
};

export const FILE_IMAGE = [
  'img',
  'jpeg',
  'gif',
  'bmp',
  'png',
  'jpg',
  'IMG',
  'JPEG',
  'BMP',
  'PNG',
  'JPG',
  'jfif',
  'JFIF'
];

export const LIST_AUTHORITY_DROPDOWN = [
  { label: 'timeline.group.sorttype.owner-order', value: 1 },
  { label: 'timeline.group.sorttype.member-order', value: 2 }
];

export const LIST_SORT_DROPDOWN = [
  { label: 'timeline.group.sorttype.last-post-date-descending-order', value: 1 },
  { label: 'timeline.group.sorttype.registration-date-descending-order', value: 2 }
];

export const STATUS_ONLINE = {
  OFFLINE: 0,
  ONLINE: 1,
  AWAY: 2
};

export const URL_TIMELINE = {
  TIMELINE_LIST: '/timeline/list',
  TIMELINE_CHANNEL: '/timeline/channel',
  TIMELINE_CHANNEL_DETAIL: '/timeline/channel/detail'
};

export const TYPE_DETAIL_MODAL_HEADER = {
  CHANNEL: 0,
  EMPLOYEE: 1,
  CUSTOMER: 5,
  CARD: 4,
  ACTIVITY: 6,
  SCHEDULE: 2,
  TASK: 15,
  MILESTONE: 1501,
  PRODUCT: 14
};

export const MODE_CONTENT = {
  CREATE_AUTO: 0,
  UPDATE_AUTO: 1,
  CREATE_NORMAL: 2
};

// get info translate
export const LABEL_AUTO = [
  {
    label: TYPE_DETAIL_MODAL_HEADER.CHANNEL + '_timeline_group_name',
    key: 'timeline.modal.group-name-label'
  },
  { label: TYPE_DETAIL_MODAL_HEADER.CHANNEL + '_is_public', key: 'timeline.modal.is-public-label' },
  { label: TYPE_DETAIL_MODAL_HEADER.CHANNEL + '_is_approval', key: 'timeline.modal.approval-label' },
  // businessard
  { label: TYPE_DETAIL_MODAL_HEADER.CARD + '_zip_code', key: 'dynamic-control.fieldDetail.layoutAddress.lable.zipCode' },
  { label: TYPE_DETAIL_MODAL_HEADER.CARD + '_building', key: 'dynamic-control.fieldDetail.layoutAddress.lable.buildingName' },
  { label: TYPE_DETAIL_MODAL_HEADER.CARD + '_alternative_customer_name', key: 'businesscards.detailHistory.comapnyName' },
  { label: TYPE_DETAIL_MODAL_HEADER.CARD + '_customer_name', key: 'businesscards.detailHistory.comapnyName' },
  // { label: TYPE_DETAIL_MODAL_HEADER.CARD + '_customer_id', key: 'businesscards.detailHistory.comapnyName' },
  { label: TYPE_DETAIL_MODAL_HEADER.CARD + '_url_target', key: 'businesscards.detailHistory.urlTarget' },
  { label: TYPE_DETAIL_MODAL_HEADER.CARD + '_url_text', key: 'businesscards.detailHistory.urlText' },
  // activity

  // customer
];

// get info auto
export const LABEL_INFO_AUTO = []

// get info auto language
export const LABEL_INFO_AUTO_LANG = {
  'timelineAuto.2.schedule_type_id':    {"en_us": "Type", "ja_jp": "種別", "zh_cn": "类型"}
, 'timelineAuto.2.schedule_name':    {"en_us": "Subject", "ja_jp": "件名", "zh_cn": "项目名称"}
, 'timelineAuto.2.start_date':    {"en_us": "Start date", "ja_jp": "開始日", "zh_cn": "开始日期"}
, 'timelineAuto.2.finish_date':    {"en_us": "Completion date (estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}
, 'timelineAuto.2.customer_id':    {"en_us": "Customer", "ja_jp": "顧客", "zh_cn": "客户"}
, 'timelineAuto.2.schedule_related_customer_id':    {"en_us": "Related customer", "ja_jp": "関連顧客", "zh_cn": "相关客户"}
, 'timelineAuto.2.customer_related_id':    {"en_us": "Related customer", "ja_jp": "関連顧客", "zh_cn": "相关客户"}
, 'timelineAuto.2.address':    {"en_us": "Address", "ja_jp": "住所", "zh_cn": "地址"}
, 'timelineAuto.2.business_card_id':    {"en_us": "Outside participant", "ja_jp": "社外参加者", "zh_cn": "公司外部参与者"}
, 'timelineAuto.2.paticipant_operator_id':    {"en_us": "Participant", "ja_jp": "参加者", "zh_cn": "参与者"}
, 'timelineAuto.2.shared_operator_id':    {"en_us": "Collaborator", "ja_jp": "共有者", "zh_cn": "共享者"}
, 'timelineAuto.2.sharer_operator_id':    {"en_us": "Collaborator", "ja_jp": "共有者", "zh_cn": "共享者"}
, 'timelineAuto.2.equipment_name':    {"en_us": "Facilities Preservation", "ja_jp": "会議室・設備", "zh_cn": "会议室/设备"}
, 'timelineAuto.2.note':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.2.file_name':    {"en_us": "Attached file", "ja_jp": "添付ファイル", "zh_cn": "附件文件"}
, 'timelineAuto.2.task_name':    {"en_us": "Task", "ja_jp": "タスク", "zh_cn": "任务"}
, 'timelineAuto.2.milestone_name':    {"en_us": "Milestone", "ja_jp": "マイルストーン", "zh_cn": "里程碑"}
, 'timelineAuto.2.is_public':    {"en_us": "Privacy setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}
, 'timelineAuto.2.can_modify':    {"en_us": "Modification setting", "ja_jp": "編集・公開設定", "zh_cn": "编辑/公开设置"}
, 'timelineAuto.2.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.2.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.2.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.2.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}

, 'timelineAuto.4.business_card_id':    {"en_us": "Business card code", "ja_jp": "名刺コード", "zh_cn": "名片代码"}
, 'timelineAuto.4.business_card_image_path':    {"en_us": "Business card image", "ja_jp": "名刺画像", "zh_cn": "名片图片"}
, 'timelineAuto.4.company_name':    {"en_us": "Customer name", "ja_jp": "顧客名", "zh_cn": "客户名称"}
, 'timelineAuto.4.first_name':    {"en_us": "Last name", "ja_jp": "名前（姓）", "zh_cn": "名称（姓）"}
, 'timelineAuto.4.last_name':    {"en_us": "First name", "ja_jp": "名前（名）", "zh_cn": "名称（名）"}
, 'timelineAuto.4.first_name_kana':    {"en_us": "Last name (Kana)", "ja_jp": "名前（かな）（姓）", "zh_cn": "名称（假名）（姓）"}
, 'timelineAuto.4.last_name_kana':    {"en_us": "First name (Kana)", "ja_jp": "名前（かな）（名）", "zh_cn": "名称（假名）（名）"}
, 'timelineAuto.4.department_name':    {"en_us": "Department name", "ja_jp": "部署名", "zh_cn": "部门名称"}
, 'timelineAuto.4.position':    {"en_us": "Position", "ja_jp": "役職名", "zh_cn": "职务名称"}
, 'timelineAuto.4.address':    {"en_us": "Address", "ja_jp": "住所", "zh_cn": "地址"}
, 'timelineAuto.4.email_address':    {"en_us": "Email", "ja_jp": "メールアドレス", "zh_cn": "电子邮件地址"}
, 'timelineAuto.4.phone_number':    {"en_us": "Phone number", "ja_jp": "電話番号", "zh_cn": "电话号码"}
, 'timelineAuto.4.mobile_number':    {"en_us": "Mobile number", "ja_jp": "携帯番号", "zh_cn": "手机号码"}
, 'timelineAuto.4.employee_id':    {"en_us": "Recipient", "ja_jp": "受取人", "zh_cn": "接收者"}
, 'timelineAuto.4.receive_date':    {"en_us": "Received date", "ja_jp": "受取日", "zh_cn": "接收日期"}
, 'timelineAuto.4.last_contact_date':    {"en_us": "Last contacted date", "ja_jp": "最終接触日", "zh_cn": "最后接触日期"}
, 'timelineAuto.4.received_last_contact_date':    {"en_us": "Last contacted date", "ja_jp": "最終接触日", "zh_cn": "最后接触日期"}
, 'timelineAuto.4.is_working':    {"en_us": "Employment status", "ja_jp": "在職フラグ", "zh_cn": "工作旗"}
, 'timelineAuto.4.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.4.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.4.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.4.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.4.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}
, 'timelineAuto.4.customer_id':    {"en_us": "Customer code", "ja_jp": "顧客コード", "zh_cn": "客户代码"}

, 'timelineAuto.5.customer_id':    {"en_us": "Customer code", "ja_jp": "顧客コード", "zh_cn": "客户代码"}
, 'timelineAuto.5.customer_parent':    {"en_us": "Parent customer", "ja_jp": "親顧客", "zh_cn": "父客户"}
, 'timelineAuto.5.customer_name':    {"en_us": "Customer name", "ja_jp": "顧客名", "zh_cn": "客户名称"}
, 'timelineAuto.5.customer_alias_name':    {"en_us": "Customer alias", "ja_jp": "顧客名(呼称)", "zh_cn": "客户名称(别称)"}
, 'timelineAuto.5.phone_number':    {"en_us": "Phone number", "ja_jp": "電話番号", "zh_cn": "电话号码"}
, 'timelineAuto.5.customer_address':    {"en_us": "Address", "ja_jp": "住所", "zh_cn": "地址"}
, 'timelineAuto.5.business_main_id':    {"en_us": "Industry sector", "ja_jp": "業種（大分類）", "zh_cn": "业务种类(大分类)"}
, 'timelineAuto.5.business_sub_id':    {"en_us": "Industry", "ja_jp": "業種（小分類）", "zh_cn": "业务种类(小分类)"}
, 'timelineAuto.5.url':    {"en_us": "URL", "ja_jp": "URL", "zh_cn": "URL"}
, 'timelineAuto.5.person_in_charge':    {"en_us": "Person in charge", "ja_jp": "担当", "zh_cn": "负责"}
, 'timelineAuto.5.scenario_id':    {"en_us": "Scenarios", "ja_jp": "シナリオ", "zh_cn": "场景"}
, 'timelineAuto.5.schedule_next':    {"en_us": "Next schedule", "ja_jp": "次回スケジュール", "zh_cn": "下一个时间表"}
, 'timelineAuto.5.action_next':    {"en_us": "Next action", "ja_jp": "ネクストアクション", "zh_cn": "下一步行动"}
, 'timelineAuto.5.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.5.customer_logo':    {"en_us": "Customer logo", "ja_jp": "顧客ロゴ", "zh_cn": "客户标识"}
, 'timelineAuto.5.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.5.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.5.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.5.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}
, 'timelineAuto.5.is_display_child_customers':    {"en_us": "Show child customers in search results", "ja_jp": "子顧客を検索結果に表示する", "zh_cn": "在搜索结果中显示子客户"}
, 'timelineAuto.5.last_contact_date':    {"en_us": "Last contacted date", "ja_jp": "最終接触日", "zh_cn": "最后接触日期"}

, 'timelineAuto.6.contact_date':    {"en_us": "Contacted date", "ja_jp": "接触日", "zh_cn": "接触日期"}
, 'timelineAuto.6.activity_time':    {"en_us": "Activity duration", "ja_jp": "活動時間", "zh_cn": "活动时间"}
, 'timelineAuto.6.activity_target_id':    {"en_us": "Select report object", "ja_jp": "報告対象を選択", "zh_cn": "选择报告对象"}
, 'timelineAuto.6.employee_id':    {"en_us": "Reporter", "ja_jp": "報告者", "zh_cn": "报告者"}
, 'timelineAuto.6.activity_format_id':    {"en_us": "Report format", "ja_jp": "報告フォーマット", "zh_cn": "报告格式"}
, 'timelineAuto.6.customer_id':    {"en_us": "Customer name", "ja_jp": "顧客名", "zh_cn": "客户名称"}
, 'timelineAuto.6.interviewer':    {"en_us": "Discussed person", "ja_jp": "当日面談者", "zh_cn": "当日面谈者"}
, 'timelineAuto.6.customer_relation_id':    {"en_us": "Related customer", "ja_jp": "関係顧客", "zh_cn": "相关客户"}
, 'timelineAuto.6.next_schedule_id':    {"en_us": "Next schedule", "ja_jp": "次回スケジュール", "zh_cn": "下一个时间表"}
, 'timelineAuto.6.product_trading_id':    {"en_us": "Trading product", "ja_jp": "取引商品", "zh_cn": "交易产品"}
, 'timelineAuto.6.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.6.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.6.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.6.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.6.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}
, 'timelineAuto.6.scenario_id':    {"en_us": "Scenarios", "ja_jp": "シナリオ", "zh_cn": "场景"}

, 'timelineAuto.8.employee_icon':    {"en_us": "Employee icon", "ja_jp": "社員アイコン", "zh_cn": "员工图标"}
, 'timelineAuto.8.employee_surname':    {"en_us": "Last name", "ja_jp": "名前（姓）", "zh_cn": "名称（姓）"}
, 'timelineAuto.8.employee_name':    {"en_us": "First name", "ja_jp": "名前（名）", "zh_cn": "名称（名）"}
, 'timelineAuto.8.employee_surname_kana':    {"en_us": "Last name (Kana)", "ja_jp": "名前（かな）（姓）", "zh_cn": "名称（假名）（姓）"}
, 'timelineAuto.8.employee_name_kana':    {"en_us": "First name (Kana)", "ja_jp": "名前（かな）（名）", "zh_cn": "名称（假名）（名）"}
, 'timelineAuto.8.employee_departments':    {"en_us": "Department name", "ja_jp": "部署名", "zh_cn": "部门名称"}
, 'timelineAuto.8.employee_positions':    {"en_us": "Position", "ja_jp": "役職名", "zh_cn": "职务名称"}
, 'timelineAuto.8.employee_managers':    {"en_us": "Manager", "ja_jp": "マネージャー", "zh_cn": "上级"}
, 'timelineAuto.8.email':    {"en_us": "Email", "ja_jp": "メールアドレス", "zh_cn": "电子邮件地址"}
, 'timelineAuto.8.telephone_number':    {"en_us": "Phone number", "ja_jp": "電話番号", "zh_cn": "电话号码"}
, 'timelineAuto.8.employee_subordinates':    {"en_us": "Staff", "ja_jp": "部下", "zh_cn": "下属"}
, 'timelineAuto.8.cellphone_number':    {"en_us": "Mobile number", "ja_jp": "携帯番号", "zh_cn": "手机号码"}
, 'timelineAuto.8.employee_packages':    {"en_us": "Package", "ja_jp": "パッケージ", "zh_cn": "包"}
, 'timelineAuto.8.language_id':    {"en_us": "Language", "ja_jp": "言語", "zh_cn": "语言"}
, 'timelineAuto.8.timezone_id':    {"en_us": "Timezone", "ja_jp": "タイムゾーン", "zh_cn": "时区"}
, 'timelineAuto.8.is_admin':    {"en_us": "Admin", "ja_jp": "管理権限", "zh_cn": "管理员权限"}

, 'timelineAuto.14.product_id':    {"en_us": "Product code", "ja_jp": "商品コード", "zh_cn": "产品代码"}
, 'timelineAuto.14.product_image_name':    {"en_us": "Product image", "ja_jp": "商品画像", "zh_cn": "产品图像"}
, 'timelineAuto.14.product_name':    {"en_us": "Product name", "ja_jp": "商品名", "zh_cn": "产品名称"}
, 'timelineAuto.14.unit_price':    {"en_us": "Price", "ja_jp": "単価", "zh_cn": "单价"}
, 'timelineAuto.14.product_category_id':    {"en_us": "Category name", "ja_jp": "カテゴリ名", "zh_cn": "类别名称"}
, 'timelineAuto.14.product_type_id':    {"en_us": "Product type", "ja_jp": "商品タイプ", "zh_cn": "产品类型"}
, 'timelineAuto.14.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.14.product_relation_id':    {"en_us": "Product Cart", "ja_jp": "商品内訳", "zh_cn": "产品细目"}
, 'timelineAuto.14.is_display':    {"en_us": "Status", "ja_jp": "使用フラグ", "zh_cn": "使用旗"}
, 'timelineAuto.14.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.14.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.14.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.14.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}

, 'timelineAuto.15.task_id':    {"en_us": "Task code", "ja_jp": "タスクコード", "zh_cn": "任务代码"}
, 'timelineAuto.15.task_name':    {"en_us": "Task Name", "ja_jp": "タスク名", "zh_cn": "任务名称"}
, 'timelineAuto.15.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.15.operator_id':    {"en_us": "Person in charge", "ja_jp": "担当者", "zh_cn": "负责人"}
, 'timelineAuto.15.start_date':    {"en_us": "Start date", "ja_jp": "開始日", "zh_cn": "开始日期"}
, 'timelineAuto.15.finish_date':    {"en_us": "Completion date (estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}
, 'timelineAuto.15.customer_name':    {"en_us": "Customer name", "ja_jp": "顧客名", "zh_cn": "客户名称"}
, 'timelineAuto.15.customer_id':    {"en_us": "Customer code", "ja_jp": "顧客コード", "zh_cn": "客户代码"}
, 'timelineAuto.15.milestone_name':    {"en_us": "Milestone", "ja_jp": "マイルストーン", "zh_cn": "里程碑"}
, 'timelineAuto.15.product_name':    {"en_us": "Trading product", "ja_jp": "取引商品", "zh_cn": "交易产品"}
, 'timelineAuto.15.file_name':    {"en_us": "Attach file", "ja_jp": "ファイル添付", "zh_cn": "附加文件"}
, 'timelineAuto.15.products_tradings_id':    {"en_us": "Trading product code", "ja_jp": "取引商品コード", "zh_cn": "交易产品代码"}
, 'timelineAuto.15.status':    {"en_us": "Status", "ja_jp": "ステータス", "zh_cn": "状态"}
, 'timelineAuto.15.is_public':    {"en_us": "Privacy setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}
, 'timelineAuto.15.parent_id':    {"en_us": "Subtask", "ja_jp": "サブタスク", "zh_cn": "子任务"}
, 'timelineAuto.15.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.15.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.15.milestone_id':    {"en_us": "Milestone code", "ja_jp": "マイルストーンコード", "zh_cn": "里程碑代码"}
, 'timelineAuto.15.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.15.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}

, 'timelineAuto.16.product_trading_id':    {"en_us": "Trading product code", "ja_jp": "取引商品コード", "zh_cn": "交易产品代码"}
, 'timelineAuto.16.customer_id':    {"en_us": "Customer name", "ja_jp": "顧客名", "zh_cn": "客户名称"}
, 'timelineAuto.16.product_id':    {"en_us": "Product name", "ja_jp": "商品名", "zh_cn": "产品名称"}
, 'timelineAuto.16.quantity':    {"en_us": "Quantity", "ja_jp": "数量", "zh_cn": "数量"}
, 'timelineAuto.16.price':    {"en_us": "Price", "ja_jp": "単価", "zh_cn": "单价"}
, 'timelineAuto.16.amount':    {"en_us": "Subtotal", "ja_jp": "金額", "zh_cn": "金额"}
, 'timelineAuto.16.product_trading_progress_id':    {"en_us": "Progress", "ja_jp": "進捗状況", "zh_cn": "进度状态"}
, 'timelineAuto.16.order_plan_date':    {"en_us": "Order date (estimated)", "ja_jp": "受注予定日", "zh_cn": "预定的订单日期"}
, 'timelineAuto.16.end_plan_date':    {"en_us": "Completion date (estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}
, 'timelineAuto.16.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.16.employee_id':    {"en_us": "Person in charge", "ja_jp": "担当者", "zh_cn": "负责人"}
, 'timelineAuto.16.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.16.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.16.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.16.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}
, 'timelineAuto.16.is_finish':    {"en_us": "Completion status", "ja_jp": "継続／終了", "zh_cn": "继续/结束"}

, 'timelineAuto.801.department_name':    {"en_us": "Department name", "ja_jp": "部署名", "zh_cn": "部门名称"}
, 'timelineAuto.801.parent_id':    {"en_us": "Parent department", "ja_jp": "親部署", "zh_cn": "父部门"}
, 'timelineAuto.801.manager_id':    {"en_us": "Department manager", "ja_jp": "部署管理者", "zh_cn": "部门管理员"}

, 'timelineAuto.1401.quantity':    {"en_us": "Quantity", "ja_jp": "数量", "zh_cn": "数量"}
, 'timelineAuto.1401.unit_price':    {"en_us": "Subtotal", "ja_jp": "金額", "zh_cn": "金额"}
, 'timelineAuto.1501.milestone_id':    {"en_us": "Milestone code", "ja_jp": "マイルストーンコード", "zh_cn": "里程碑代码"}
, 'timelineAuto.1501.milestone_name':    {"en_us": "Milestone name", "ja_jp": "マイルストーン名", "zh_cn": "里程碑名称"}
, 'timelineAuto.1501.customer_id':    {"en_us": "Customer name", "ja_jp": "顧客名", "zh_cn": "客户名称"}
, 'timelineAuto.1501.is_public':    {"en_us": "Privacy setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}
, 'timelineAuto.1501.finish_date':    {"en_us": "Completion date (estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}
, 'timelineAuto.1501.is_done':    {"en_us": "Completion setting", "ja_jp": "完了設定", "zh_cn": "完成设置"}
, 'timelineAuto.1501.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.1501.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.1501.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.1501.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.1501.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}
, 'timelineAuto.1502.updated_user':    {"en_us": "Last updated person", "ja_jp": "最終更新者", "zh_cn": "最后更新者"}
, 'timelineAuto.1502.task_name':    {"en_us": "Subtask name", "ja_jp": "サブタスク名", "zh_cn": "子任务名称"}
, 'timelineAuto.1502.memo':    {"en_us": "Memo", "ja_jp": "メモ", "zh_cn": "备忘录"}
, 'timelineAuto.1502.operator_id':    {"en_us": "Person in charge", "ja_jp": "担当者", "zh_cn": "负责人"}
, 'timelineAuto.1502.start_date':    {"en_us": "Start date", "ja_jp": "開始日", "zh_cn": "开始日期"}
, 'timelineAuto.1502.finish_date':    {"en_us": "Completion date (estimated)", "ja_jp": "完了予定日", "zh_cn": "预计完成日期"}
, 'timelineAuto.1502.created_date':    {"en_us": "Registration date", "ja_jp": "登録日", "zh_cn": "注册日期"}
, 'timelineAuto.1502.file_name':    {"en_us": "Attach file", "ja_jp": "ファイル添付", "zh_cn": "附加文件"}
, 'timelineAuto.1502.status':    {"en_us": "Status", "ja_jp": "ステータス", "zh_cn": "状态"}
, 'timelineAuto.1502.is_public':    {"en_us": "Privacy setting", "ja_jp": "公開設定", "zh_cn": "公开设置"}
, 'timelineAuto.1502.created_user':    {"en_us": "Registrant", "ja_jp": "登録者", "zh_cn": "注册者"}
, 'timelineAuto.1502.updated_date':    {"en_us": "Last updated date", "ja_jp": "最終更新日", "zh_cn": "最后更新日期"}
, 'timelineAuto.2101.date_time':    {"en_us": "Date&Time", "ja_jp": "日時", "zh_cn": "日期和时间"}
, 'timelineAuto.2101.employee_id':    {"en_us": "Employee ID", "ja_jp": "社員ID", "zh_cn": "员工ID"}
, 'timelineAuto.2101.account_name':    {"en_us": "Employee name", "ja_jp": "社員名", "zh_cn": "员工名称"}
, 'timelineAuto.2101.ip_address':    {"en_us": "IP Address", "ja_jp": "IPアドレス", "zh_cn": "IP地址"}
, 'timelineAuto.2101.event':    {"en_us": "Event", "ja_jp": "イベント", "zh_cn": "事件"}
, 'timelineAuto.2101.result':    {"en_us": "Results", "ja_jp": "結果", "zh_cn": "结果"}
, 'timelineAuto.2101.error_information':    {"en_us": "Error information", "ja_jp": "エラー情報", "zh_cn": "错误信息"}
, 'timelineAuto.2101.entity_id':    {"en_us": "ID", "ja_jp": "ID", "zh_cn": "ID"}
, 'timelineAuto.2101.additional_information':    {"en_us": "Additional information", "ja_jp": "補足情報", "zh_cn": "附加信息"}
}

export const DATE_FIELD = [
  "created_date",
  "updated_date",
  "receive_date",
  "last_contact_date",
  "received_last_contact_date",
  "start_date",
  "finish_date",
  "order_plan_date",
  "end_plan_date",
  "contact_date"
]

export const TYPE_DETAIL_AUTO = {
  '5.parent_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER
  , '5.employee_id': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '5.next_schedule_id': TYPE_DETAIL_MODAL_HEADER.SCHEDULE
  , '5.product_id': TYPE_DETAIL_MODAL_HEADER.PRODUCT
  , '5.created_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '5.updated_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '5.customer_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER

  , '4.employee_id': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '4.created_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '4.updated_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '4.customer_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER
  , '4.business_card_id': TYPE_DETAIL_MODAL_HEADER.CARD

  , '6.employee_id': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '6.customer_relation_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER
  , '6.business_card_id': TYPE_DETAIL_MODAL_HEADER.CARD
  , '6.customer_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER
  , '6.task_id': TYPE_DETAIL_MODAL_HEADER.TASK
  , '6.schedule_id': TYPE_DETAIL_MODAL_HEADER.SCHEDULE
  , '6.next_schedule_id': TYPE_DETAIL_MODAL_HEADER.SCHEDULE
  , '6.product_id': TYPE_DETAIL_MODAL_HEADER.PRODUCT

  , '2.customer_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER
  , '2.business_card_id': TYPE_DETAIL_MODAL_HEADER.CARD
  , '2.milestone_id': TYPE_DETAIL_MODAL_HEADER.MILESTONE
  , '2.task_id': TYPE_DETAIL_MODAL_HEADER.TASK
  , '2.created_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '2.updated_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE

  , '15.customer_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER
  , '15.parent_id': TYPE_DETAIL_MODAL_HEADER.TASK
  , '15.milestone_id': TYPE_DETAIL_MODAL_HEADER.MILESTONE
  , '15.created_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '15.updated_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '15.task_id': TYPE_DETAIL_MODAL_HEADER.TASK

  , '1501.customer_id': TYPE_DETAIL_MODAL_HEADER.CUSTOMER
  , '1501.created_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '1501.updated_user': TYPE_DETAIL_MODAL_HEADER.EMPLOYEE
  , '1501.milestone_id': TYPE_DETAIL_MODAL_HEADER.MILESTONE
}
