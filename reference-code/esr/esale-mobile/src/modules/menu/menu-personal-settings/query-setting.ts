export const changeNormalPassword = (
  params = {
    userId: 1,
    password: "",
    oldPassword: "",
  }
) => {
  return {
    query: `
      {
        changeNormalPassword(
            userId: ${params.userId},
            password: ${params.password},
            oldPassword: ${params.oldPassword}
          ) 
      }`,
  };
};
export const queryUpdateEmployee = (employees: any) => {
  return {
    query: `mutation {
      updateEmployees(employees: ${JSON.stringify(employees).replace(
        /"(\w+)"\s*:/g,
        "$1:"
      )})
    }`,
  };
};

export const getNotificationSettings = (employeesID: number) => {
  return {
    query: `
        {
          getNotificationSetting(
            employeesID: ${employeesID}
            ) 
        }`,
  };
};
export const updateNotificationSetting = (
  params = {
    employeeId: 1,
    notificationType: 1,
    notificationSubtype: 1,
    isNotification: false,
    settingNotificationDate: "2020/12/10",
  }
) =>
  `mutation {
    updateNotificationDetailSetting(
      employeeId:${params.employeeId},
      notificationType:${params.notificationType},
      notificationSubtype:${params.notificationSubtype},
      isNotification:${params.isNotification},
      settingNotificationDate:${params.settingNotificationDate}
   )
  }`;
export const getListLanguage = () => {
  return {
    query: `query
    {
      getLanguages()
        {
          languages
          {
            language_id					
            language_name					
            language_code					         
          }						
        } 
    }`,
  };
};
export const getListTimeZone = () => {
  return {
    query: `query
    {
      getTimezones() 
      {
        timezones
        {
          timezone_id					
          timezone_short_name					
          timezone_name
        }						
      }
    }`,
  };
};
