export const TIME_OUT_MESSAGE = 2000;

export const LANGUAGES = {
  JA_JP: 'ja_jp',
  EN_US: 'en_us',
  ZH_CN: 'zh_cn'
};

export const DEFAULT_LANG_STATE = {
  [LANGUAGES.JA_JP]: '',
  [LANGUAGES.EN_US]: '',
  [LANGUAGES.ZH_CN]: ''
};

// lang state to store error code
export const DEFAULT_LANG_VALID_STATE = {
  [LANGUAGES.JA_JP]: null,
  [LANGUAGES.EN_US]: null,
  [LANGUAGES.ZH_CN]: null
};

export const MAX_INPUT_LENGTH = 60;
export const MAX_INPUT_LENGTH_2 = 30;

export const LANG_KEY_ACCAUNT = {
  JP: 0,
  US: 1,
  ZH: 2
};
export const TYPEMASTER = {
  LIST: 0,
  OBJ: 1
};

export const CALENDAR_TYPE = {
  EQUIPMENT: 0,
  EQUIPMENT_TYPE: 1
};
export const CUSTOMER_TYPE = {
  MASTER_STANDS: 0,
  MASTER_MOTIVATIONS: 1
};

export enum SHOW_MESSAGE {
  NONE,
  ERROR,
  SUCCESS,
  NO_RECORD,
  CAN_NOT_DELETE
}
export const OPERATION_FUNICTION = '取引商品';
export enum SETTING_MENU {
  MENU_HOME,
  MENU_SYSTEM,
  MENU_CALENDAR,
  MENU_TASK,
  MENU_CUSTOMER,
  MENU_PRODUCT,
  MENU_PRODUCT_TRADE,
  MENU_EMPLOYEE
}
export const SYSTEM_TAB = {
  TAB_IP: 1,
  TAB_SAML: 2,
  TAB_PERIOD: 4,
  TAB_TIME: 3,
  TAB_LOG: 5,
  TAB_API: 6
};
export const TASK_TAB = {
  TAB_DEFAULT: 1,
  TAB_ACTIVITY_FORMAT: 2
};
export const PRODUCT_TAB = {
  PRODUCT_TRADE: 1
};
export const CALENDAR_TAB = {
  TAB_GOOGLE: 1,
  TAB_SCHEDULE_TYPE: 2,
  TAB_HOLIDAY: 3,
  TAB_EQUIQMENT_TYPE: 4
};
export const CUSTOMER_TAB = {
  DEFAULT: 1,
  MASTER_POSITION: 2,
  SCENARIOS: 3
};
export const SYSTEM_EMPLOYEE = {
  ITEM_SETTINGSS: 1,
  JOB_TITLE_MASTER: 2
};
export const MODE_POPUP = {
  CREATE: 1,
  EDIT: 2
};
export const MASTER_MOTIVATIONS_BACGROUND = {
  RED: 1,
  ORANGE: 2,
  YELLOW: 3,
  GREEN: 4,
  BLUE: 5,
  PURPLE: 6,
  CORAL: 7,
  GRAY: 8
};
export const MASTER_MOTIVATIONS_ICON_TYPE = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  OTHER: 0
};

export const SETTING_BELONG = 2101;
export const ACCESS_LOG = 'accessLog';

/* +++++++++++++++++++++++QUERY++++++++++++++++++++++++++++++ */
export const QUERY_GET_SCHEDULE_TYPE = () =>
  `query{
    getScheduleTypes {
        scheduleTypes {
            scheduleTypeId   
            scheduleTypeName  
            iconType       
            iconName         
            iconPath      
            isAvailable   
            displayOrder    
            updatedDate 
        }
    }
}`;

export const QUERY_GET_EQUTPMENT_TYPE = () =>
  `query {
    getEquipmentTypes(isContainEquipment : true){
       equipmentTypes {
           equipmentTypeId				
           equipmentTypeName					
           displayOrder					
           updatedDate
       }
       equipments {
           	equipmentId						
            equipmentName						
            isAvailable						
            equipmentTypeId						
            displayOrder						
            updatedDate
       }
    }
}`;

export const QUERY_GET_EQUTPMENT = id =>
  `query {
    getEquipments(equipmentTypeId  : ${JSON.stringify(id).replace(/"(\w+)"\s*:/g, '$1:')} , 
      listEquipmentId : []){
        equipments  {
          equipmentId
          equipmentName
          isAvailable
          equipmentTypeId
          displayOrder
          updatedDate
       }
    }
}`;

export const QUERY_UPDATE_EQUTPMENT = (
  equipmentTypes,
  equipments,
  deletedEquipmentTypes,
  deletedEquipments
) =>
  `mutation {
    updateEquipments(
      equipmentTypes   : ${JSON.stringify(equipmentTypes).replace(/"(\w+)"\s*:/g, '$1:')} , 
      equipments   : ${JSON.stringify(equipments).replace(/"(\w+)"\s*:/g, '$1:')} , 
      deletedEquipmentTypes   : ${JSON.stringify(deletedEquipmentTypes).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )} , 
      deletedEquipments   : ${JSON.stringify(deletedEquipments).replace(/"(\w+)"\s*:/g, '$1:')} ){
          deletedEquipmentTypes
          deletedEquipments
          createdEquipmentTypes
          createdEquipments
          updatedEquipmentTypes
          updatedEquipments
      }
}`;

export const QUERY_CHECK_EQUITPMENT = id =>
  `query {
    checkDeleteEquipments (equipmentIds  : ${JSON.stringify(id).replace(/"(\w+)"\s*:/g, '$1:')}){
      equipments {
        equipmentId 
        scheduleId 
        }
    }
}`;

export const QUERY_CHECK_EQUIPMENT_TYPE = id =>
  `query {
  checkDeleteEquipmentTypes(equipmentTypeIds : ${JSON.stringify(id).replace(
    /"(\w+)"\s*:/g,
    '$1:'
  )}){
      equipmentTypes {
          equipmentTypeId
          equipmentId
      }
  }
}`;

export const QUERY_CHECK_DELETE_PRODUCT_TYPE = lstId =>
  `query {
    checkDeleteProductTypes(productTypeIds: ${JSON.stringify(lstId).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )}) {
      productTypes {
        productTypeId ,
        productId
      }
    }
}`;

export const QUERY_GET_PRODUCT_TYPE = () =>
  `query{
    getProductTypes {
      productTypes {
            productTypeId  
            productTypeName 
            fieldUse      
            isAvailable
            displayOrder 
            updatedDate 
        }
        fieldInfo {
            fieldId 
            fieldLabel
        }
    }
}`;

export const QUERY_UPDATE_PRODUCT_TYPE = (productTypes, deletedProductTypes) =>
  `mutation {
    updateProductTypes(
        deletedProductTypes : ${JSON.stringify(deletedProductTypes).replace(/"(\w+)"\s*:/g, '$1:')}
        productTypes : ${JSON.stringify(productTypes).replace(/"(\w+)"\s*:/g, '$1:')}) {
          deletedProductTypes,
          createdProductTypes,
          updatedProductTypes
    }
}`;

export const QUERY_GET_ACTIVITY_FORMAT = () =>
  `query {
    getActivityFormats {
        fieldInfo{
            fieldId
            fieldLabel
            
        },
        productTradingFieldInfo{
            fieldId
            fieldLabel
            
        }
        activityFormats{
            activityFormatId      
            name
            displayOrder           
            isAvailable            
            fieldUse               
            productTradingFieldUse 
            updatedDate            
        },
        activityFormatsByFieldId
        {
            activityFormatId 
            name             
        }
    }
}`;

export const QUERY_UPDATE_ACTIVITY_FORMAT = (activityFormats, deletedActivityFormats) =>
  `mutation  {
    updateActivityFormats(
      activityFormats : ${JSON.stringify(activityFormats).replace(/"(\w+)"\s*:/g, '$1:')},
      deletedActivityFormats: ${JSON.stringify(deletedActivityFormats).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )}){
            deletedActivityFormats 
            insertedActivityFormats 
            updatedActivityFormats
      }
  }`;

export const QUERY_UPDATE_SCHEDULE_TYPE = scheduleTypes =>
  `mutation  {
      updateScheduleTypes {
        
      }
  }`;

export const QUERY_IP_ADDRESSES = () =>
  `query {
    getIPAddresses{
        ipAddresses{
            ipAddressId  
            ipAddress     
            updatedDate 
        }
    } 
}`;

export const UPDATE_IP_ADDRESSES = (ipAddresses, ipAddressesDel) =>
  `mutation {    
    updateIpAddresses(
        ipAddresses : ${JSON.stringify(ipAddresses).replace(/"(\w+)"\s*:/g, '$1:')},
            deletedIPAddresses: []){
             deletedIpAddresses  
             insertedIpAddresses 
             updatedIpAddresses 
        }
    }`;

export const GET_AUTHENTICATION_SAML = () =>
  `query {
    getAuthenticationSAML{
      saml {
            samlId
            isPc 
            isApp
            referenceFieldId
            referenceType
            referenceValue
            issuer
            certificateData
            certificateName
            urlLogin
            urLogout
            updatedDate
      }
      referenceField{
            fieldId 
            fieldLabel 
      }
    }
  }`;

export const UPDATE_AUTHENTICATION_SAML = data => {
  const query = {};
  query['query'] = `
    mutation(
      $samlId          : Long,
      $isPc            : Boolean,
      $isApp           : Boolean,
      $referenceFieldId: Long,
      $referenceType   : Long,
      $referenceValue  : String,
      $issuer          : String,
      $certificateData : String,
      $certificateName : String,
      $urlLogin        : String,
      $urLogout        : String,
      $updatedDate     : DateTime,
      $files : [Upload]
    ){
      updatedAuthenticationSaml(
        dataInput : {
          samlId: $samlId,
          isPc: $isPc,
          isApp: $isApp,
          referenceFieldId: $referenceFieldId,
          referenceType: $referenceType,
          referenceValue: $referenceValue,
          issuer: $issuer,
          certificateData: $certificateData,
          certificateName: $certificateName,
          urlLogin: $urlLogin,
          urLogout: $urLogout,
          updatedDate: $updatedDate
        },
        fileInfos : $files
      ){
        samlId
      }
    }
  `
    .replace(/"(\w+)"\s*:/g, '$1:')
    .replace(/\n/g, '')
    .replace('  ', ' ');

  query['variables'] = data;

  return query;
};

export const GET_PRODUCT_TRADE = isOnlyUsableData =>
  `query {
      getProgresses(isOnlyUsableData:${isOnlyUsableData} 
      , productTradingProgressIds : []){
          progresses {
            productTradingProgressId 
            progressName 
            isAvailable 
            progressOrder 
            bookedOrderType 
            isEnd 
            updatedDate 
          }
     }
  }`;

export const UPDATE_PRODUCT_TRADE = (lstProgress, lstProgressId) =>
  `mutation {
    updateProgresses(progresses:${JSON.stringify(lstProgress).replace(/"(\w+)"\s*:/g, '$1:')},
    deletedProgresses:${JSON.stringify(lstProgressId).replace(/"(\w+)"\s*:/g, '$1:')}){
      deletedProgresses  
      insertedProgresses 
      updatedProgresses
  }
}`;

export const GET_EMPLOYEES_TRADE = () =>
  `query {
    getPositions{
      positions{
          positionId
          positionName
          isAvailable
          positionOrder
          updatedDate
      }
  }
}`;

export const QUERY_GET_CUSTOMER_CONNECTION_MAP = () =>
  `query{
    getCustomerConnectionsMap{
        masterMotivations{
            masterMotivationId 
            masterMotivationName 
            iconType 
            iconPath 
            iconName 
            backgroundColor 
            isAvailable 
            displayOrder 
            updatedDate 
        }
        mastersStands{
            masterStandId 
            masterStandName 
            isAvailable 
            displayOrder 
            updatedDate 
        }
    }
}`;

export const QUERY_UPDATE_CUSTOMER_CONNECTION_MAP = (
  deletedMasterMotivations,
  masterMotivations,
  deletedMasterStands,
  masterStands
) =>
  `mutation{
    updateCustomerConnectionsMap(
        deletedMasterMotivations : ${JSON.stringify(deletedMasterMotivations).replace(
          /"(\w+)"\s*:/g,
          '$1:'
        )},
        masterMotivations : ${JSON.stringify(masterMotivations).replace(/"(\w+)"\s*:/g, '$1:')},
        deletedMasterStands : ${JSON.stringify(deletedMasterStands).replace(/"(\w+)"\s*:/g, '$1:')},
        masterStands : ${JSON.stringify(masterStands).replace(/"(\w+)"\s*:/g, '$1:')}  
    ){
        masterMotivation{
            deletedMasterMotivations
            insertedMasterMotivations
            updatedMasterMotivations
        }
        masterStand{
            deletedMasterStands 
            insertedMasterStands 
            updatedMasterStands
        }
    }
}`;

export const QUERY_CHECK_DELETE_MASTER_MOTIVATIONS = id =>
  `query{
      checkDeleteMasterMotivations(masterMotivationIds : ${JSON.stringify(id).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )}){
          masterMotivationIds
      }
  }`;

export const QUERY_CHECK_DELETE_MASTER_STANDS = id =>
  `query{
      checkDeleteMasterStands(masterStandIds : ${JSON.stringify(id).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )}){
          masterStandIds
      }
  }`;

export const QUERY_GET_PERIOD = () =>
  `query {
    getPeriod{
        monthBegin
        isCalendarYear
        updatedDate
    }
}`;

export const QUERY_UPDATE_PERIOD = period =>
  `mutation{
    updatePeriod(
        monthBegin : ${period.monthBegin},
        isCalendarYear : ${period.isCalendarYear},
        updatedDate : "${period.updatedDate}"
    ){
      periodId
    }
}`;

export const CHECK_PROGRESSES = id =>
  `query {
    getCheckDeleteProgresses( listProgressId : ${JSON.stringify(id).replace(/"(\w+)"\s*:/g, '$1:')})
    {
      productTradingProgressIds
    }
}`;

export const CHECK_EMPLOYEES_TRADE = id =>
  `query {
    getCheckDeletePositions( positionIds : ${JSON.stringify(id).replace(/"(\w+)"\s*:/g, '$1:')})
    {
        positionIds
    }
}`;

export const CHECK_ACTIVITY_FORMATS = id =>
  `query {
    checkDeleteActivityFormats(activityFormatIds : ${JSON.stringify(id).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )})
    {
        activityFormatIds
    }
}`;
