export const SUGGEST_RECORDS = 5;
export const MAX_RECORD = 5;

export const DOMAIN = 'https://sb-dev-helpsite.ms2-dev.com';

export const RATE_LIMIT = {
  SEARCH_ONCHANGE_CHECK_RATE: 500,
  SCROLL_CHECK_RATE: 250
};

export const HELP_ACTION_TYPES = {
  HELP_GET_POST_FROM_WORDPRESS: 'help/GET_POST_FROM_WORDPRESS',
  HELP_GET_POST_SUGGEST_FROM_WORDPRESS: 'help/HELP_GET_POST_SUGGEST_FROM_WORDPRESS',
  HELP_GET_POST_FROM_WORDPRESS_LAZY_LOAD: 'help/HELP_GET_POST_FROM_WORDPRESS_LAZY_LOAD',
  HELP_SET_CURRENT_CATEGORY: 'help/HELP_SET_CURRENT_CATEGORY'
};

export const LIMIT_CURRENT_CATEGORY_ITEM = 10;
export const SUGGEST_ITEM_LIMIT = 5;

export const CATEGORIES = {
  87: {
    screen: 'カレンダー',
    icon: 'ic-sidebar-calendar.svg'
  },
  12: {
    screen: 'タイムライン',
    icon: 'ic-sidebar-timeline.svg'
  },
  13: {
    screen: '名刺',
    icon: 'ic-sidebar-business-card.svg'
  },
  47: {
    screen: '顧客',
    icon: 'ic-sidebar-client.svg'
  },
  45: {
    screen: '活動',
    icon: 'ic-sidebar-activity.svg'
  },
  1: {
    screen: '社員',
    icon: 'ic-sidebar-employee.svg'
  },
  49: {
    screen: '分析',
    icon: 'ic-sidebar-analysis.svg'
  },
  2: {
    screen: '商品',
    icon: 'ic-sidebar-product.svg'
  },
  59: {
    screen: 'タスク',
    icon: 'task/ic-time1.svg'
  },
  9: {
    screen: '取引管理',
    icon: 'ic-sidebar-calendar.svg'
  },
  11: {
    screen: '出退勤',
    icon: 'ic-sidebar-attendance.svg'
  },
  14: {
    screen: '設定',
    icon: 'ic-sidebar-configuration.svg'
  }
};

export const CATEGORIES_ID = {
  employee: 1,
  product: 2,
  calendar: 87,
  timeline: 12,
  businessCard: 13,
  customer: 47,
  activity: 45,
  analysis: 49,
  tasks: 59,
  settings: 14,
  sales: 9,
  attendance: 11
};
