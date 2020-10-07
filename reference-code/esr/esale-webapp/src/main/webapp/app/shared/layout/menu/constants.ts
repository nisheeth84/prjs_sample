export const GLOBAL_SEARCH = {
  ALL: 1
};

export const SHOW_MESSAGE = {
  NONE: 0,
  ERROR: 1,
  SUCCESS: 2,
  NO_RECORD: 3,
  CAN_NOT_DELETE: 3
};
export const TYPE_GET = {
  NOTIFICATION: 1,
  TIMEZONE: 2,
  LANGUAGES: 3,
  EMPLOYEE: 4
};

export const QUERY_GET_NOTIFICATION = (limit, textSearch) =>
  `query{
        getNotifications(
            limit : ${JSON.stringify(limit).replace(/'(\w+)'\s*:/g, '$1:')}
            textSearch : ${JSON.stringify(textSearch).replace(/'(\w+)'\s*:/g, '$1:')}
        ){
            employeeId
            data {
                notificationId 
                createdNotificationDate 
                confirmNotificationDate 
                message 
                icon 
                notificationSender
                updatedDate
            }
        }
    }
    `;
export const QUERY_UPDATE_NOTIFICATION = (employeeId, param) =>
  `mutation {    
        updateNotificationAddress(
            employeeId : ${employeeId},
            notificationId :  ${JSON.stringify(param.notificationId).replace(
              /'(\w+)'\s*:/g,
              '$1:'
            )},
            updatedDate:  ${JSON.stringify(param.updatedDate).replace(/'(\w+)'\s*:/g, '$1:')})
            {
            employeeId
            }
        }
    `;
export const DUMMY_NOTIFICATION_TRADING = {
  getNotifications: {
    employeeId: 2,
    data: [
      {
        notificationId: 1,
        createdNotificationDate: '2020-05-31T17:00:00Z',
        confirmNotificationDate: null,
        message: '通知内容通知内容通知内容通知内容通知内容通知内容1',
        icon: 'ic-user2.svg',
        notificationSender: '1',
        updatedDate: '2020-05-31T17:00:00Z',
        url: '/product/list'
      },
      {
        notificationId: 2,
        createdNotificationDate: '2020-05-31T17:00:00Z',
        confirmNotificationDate: '2020-06-02T07:14:54Z',
        message: '通知内容通知内容通知内容通知内容通知内容通知内容-1',
        icon: 'ic-user2.svg',
        notificationSender: '1',
        updatedDate: '2020-05-31T17:00:00Z',
        url: '/employee/list'
      },
      {
        notificationId: 3,
        createdNotificationDate: '2020-05-31T17:00:00Z',
        confirmNotificationDate: null,
        message: '通知内容通知内容通知内容通知内容通知内容通知内容2',
        icon: 'ic-user2.svg',
        notificationSender: '1',
        updatedDate: '2020-05-31T17:00:00Z',
        url: '/sales/list'
      },
      {
        notificationId: 4,
        createdNotificationDate: '2020-05-31T17:00:00Z3',
        confirmNotificationDate: null,
        message: '通知内容通知内容通知内容通知内容通知内容通知内容4',
        icon: 'ic-user2.svg',
        notificationSender: '1',
        updatedDate: '2020-05-31T17:00:00Z',
        url: '/employee/list'
      },
      {
        notificationId: 5,
        createdNotificationDate: '2020-05-31T17:00:00Z',
        confirmNotificationDate: null,
        message: '通知内容通知内容通知内容通知内容通知内容通知内容5',
        icon: 'ic-user2.svg',
        notificationSender: '1',
        updatedDate: '2020-05-31T17:00:00Z',
        url: '/product/list'
      },
      {
        notificationId: 6,
        createdNotificationDate: '2020-05-31T17:00:00Z',
        confirmNotificationDate: null,
        message: '通知内容通知内容通知内容通知内容通知内容通知内容6',
        icon: 'ic-user2.svg',
        notificationSender: '1',
        updatedDate: '2020-05-31T17:00:00Z',
        url: '/employee/list'
      }
    ]
  }
};

export const QUERY_GET_COUNT_NOTIFICATION = () =>
  `query{
	  countUnreadNotification{
		  unreadNotificationNumber
	  }
}`;

export const QUERY_GET_COMPANY_NAME = tenantName =>
  `query{
	  getCompanyName(tenantName:${tenantName}){
      companyName
    }
}`;

export const QUERY_GET_SERVICES_INFO = servicesType =>
  `query{
	  servicesInfo(
      serviceType : ${servicesType}
    ) {
      serviceId
      serviceName
      serviceType 
      iconPath
      servicePath
      updatedDate
  }
}`;

export enum WindowActionMessage {
  ReloadList,
  ReloadServiceSideBar,
  ReloadLocalNavigationTask
}
