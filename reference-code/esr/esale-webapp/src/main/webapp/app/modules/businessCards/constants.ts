export const BUSINESS_CARD_LIST_ID = 'BUSINESS_CARD_LIST_ID';

export const SHOW_MESSAGE = {
  NONE: 0,
  ERROR: 1,
  SUCCESS: 2,
  ERROR_LIST: 3,
  ERROR_EXCLUSIVE: 4,
  UPDATE: 5,
  UPLOAD_FILE: 6
};

export const SHOW_MESSAGE_SUCCESS = {
  NONE: 0,
  CREATE: 1,
  UPDATE: 2,
  DELETE: 3
};

export const EXPAND_ID = {
  FAVORITES_LIST: 1,
  MY_LIST: 2,
  SHARE_LIST: 3
};

export const EMPLOYEE_OPTION = {
  ALL: 0,
  MY: 1
};

export const CUSTOMER_OPTION = {
  ALL: 0,
  ONE: 1
};

export const MODE_SEARCH_LIST = {
  ALL: 1,
  OWNER: 2
};

export const TYPE_LIST = {
  ALL_CARD: 0,
  RECEIVER: 1,
  FAVORITE: 2,
  MY_LIST: 3,
  SHARED_LIST: 4
};

/**
 * CONST My shared List Modal
 */
export const ICON_BAR_BUSINESSCARDS = 'ic-sidebar-business-card.svg';
export const MY_LIST_MODES = {
  MODE_CREATE_LIST: 1,
  MODE_EDIT_LIST: 2,
  MODE_COPY_LIST: 3,
  MODE_CREATE_LIST_LOCAL: 4
};
export const SHARE_LISTS_MODES = {
  // setting mode add condition search businessCard
  ADD_CONDITION_SEARCH_MANUAL: 1,
  ADD_CONDITION_SEARCH_AUTO: 2,
  // actions with group
  MODE_CREATE_GROUP: 1,
  MODE_EDIT_GROUP: 2,
  MODE_COPY_GROUP: 3,
  MODE_CREATE_GROUP_LOCAL: 4,
  MODE_SWICH_GROUP_TYPE: 5
};

export const BUSINESS_SPECIAL_FIELD_NAMES = {
  businessCardId: 'business_card_id',
  businessCardImagePath: 'business_card_image_path',
  businessReceiveDate: 'receive_date',
  businessCardDepartments: 'department_name',
  businessCardPositions: 'position',
  businessCardFirstName: 'first_name',
  businessCardFirstNameKana: 'first_name_kana',
  businessCardLastName: 'last_name',
  businessCardLastNameKana: 'last_name_kana',
  receivedLastContactDate: 'received_last_contact_date',
  lastContactDate: 'last_contact_date',
  alternativeCustomerName: 'company_name',
  customerId: 'customer_id',
  customerName: 'customer_name',
  isWorking: 'is_working',
  campaign: 'campaign',
  createdUser: 'created_user',
  updatedUser: 'updated_user',
  createdDate: 'created_date',
  updatedDate: 'updated_date',
  employeeId: 'employee_id',
  businessCardEmailAddress: 'email_address',
  address: 'address',
  phoneNumber: 'phone_number',
  mobileNumber: 'mobile_number'
};

export const EDIT_SPECIAL_ITEM = {
  NAME: 'name',
  CONTACT: 'contact',
  DEPARTMENT_NAME: 'department_name',
  RECEIVE_DATE: 'receive_date',
  RECEIVED_LAST_CONTACT_DATE: 'received_last_contact_date',
  IMAGE: 'image',
  EPLOYEE_ID: 'employee_id',
  ISWOKING: 'is_working'
};

export const SPECIAL_COMMON = {
  prefecture: 'prefecture',
  addressUnderPrefecture: 'address_under_prefecture',
  building: 'building'
};

export const SEARCH_MODE = {
  NONE: 0,
  TEXT_DEFAULT: 1,
  CONDITION: 2
};

export const BUSINESS_CARD_DEF = {
  FIELD_BELONG: 4,
  EXTENSION_BELONG_LIST: 1,
  EXTENSION_BELONG_EDIT: 2
};
export const SORT_VIEW = {
  ASC: 1,
  DESC: 2
};

export const ORDER_BY_VIEW = {
  BUSINESS_CARD_NAME: 1,
  POSITION: 2,
  RECEIVER: 3,
  RECEIVER_NUMBER: 4,
  RECEIVE_DATE: 5,
  UPDATED_DATE: 6,
  LAST_CONTACT_DATE: 7
};

export const BUSINESS_CARD_ACTION_TYPES = {
  CREATE: 0,
  UPDATE: 1
};

export const BUSINESS_CARD_VIEW_MODES = {
  EDITABLE: 0,
  PREVIEW: 1
};

export const FILTER_MODE = {
  OFF: 0,
  ON: 1
};

export const DND_BUSINESS_CARD_LIST_TYPE = {
  CARD: 'BusinessCardListCard'
};

export const MENU_TYPE = {
  RECEIVE_BUSINESS_CARD: 0,
  ALL_BUSINESS_CARD: 1,
  FAVORITE_LIST: 2,
  MY_LIST: 3,
  SHARE_LIST: 4
};

export const MOVE_TYPE = {
  TRANSFER: 1,
  CONCURRENT: 2
};

export const SCALE = {
  SCALE_CHANGE_RANGE: 1,
  MAX_VALUE_SCALE: 25,
  MIN_VALUE_SCALE: 0
};

export const PARAM_GET_BUSINESS_CARDS = (
  selectedTargetType,
  selectedTargetId,
  searchConditions,
  orderBy,
  offset,
  limit,
  searchLocal,
  filterConditions,
  isFirstLoad
) =>
  `query{
    businessCards(
            selectedTargetType: ${selectedTargetType},
            selectedTargetId: ${selectedTargetId},
            searchConditions: ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')},
            orderBy: ${JSON.stringify(orderBy).replace(/"(\w+)"\s*:/g, '$1:')},
            offset: ${offset},
            limit: ${limit},
            searchLocal: ${JSON.stringify(searchLocal).replace(/"(\w+)"\s*:/g, '$1:')},
            filterConditions: ${JSON.stringify(filterConditions).replace(/"(\w+)"\s*:/g, '$1:')},
            isFirstLoad: ${isFirstLoad}
        ){
            totalRecords,
            businessCards{
              businessCardId,
              customerId,
              customerName,
              alternativeCustomerName,
              firstName,
              lastName,
              firstNameKana,
              lastNameKana,
              position,
              departmentName,
              zipCode,
              building,
              address,
              emailAddress,
              phoneNumber,
              mobileNumber,
              lastContactDate,
              isWorking,
              memo,
              isDigitalize,
              isHandMode,
              fax,
              url,
              saveMode,
              businessCardData{
                fieldType,
                key,
                value
              },
              createdDate,
              createdUser,
              updatedDate,
              updatedUser,
              businessCardImagePath,
              businessCardImageName,
              receiverNumber,
              businessCardsReceives {
                employeeId,
                employeeName,
                receiveDate,
                lastContactDateReceiver
              }
            },
            lastUpdateDate
        }
    }`;

export const PARAM_GET_CUSTOM_FIELD_INFO = fieldBelong =>
  `query {
    customFieldsInfo(fieldBelong: ${fieldBelong}) {
      fieldId
      fieldName
      fieldType
      fieldOrder
      isDefault
      isDoubleColumn
      availableFlag
      modifyFlag
      urlTarget
      urlEncode
      urlText
      configValue
      decimalPlace
      fieldLabel
      fieldItems {
        itemId
        isAvailable
        itemOrder
        isDefault
      }
    }
  }`;

export const PARAM_DELETE_LIST = idOfList =>
  `mutation {
    deleteBusinessCardList(idOfList: ${idOfList}) {
      idOfList
    }
  }`;

export const PARAM_DELETE_BUSINESSCARDS = processMode =>
  `mutation {
    deleteBusinessCards(
        businessCards : [
            {
                customerId : 2,
                businessCardIds : [4,5],
                businessCardNames : ["Hoa Duong", "Kim Kim"]
            },
    ],
    processMode :  ${processMode}){
        listOfBusinessCardId
        listOfCustomerId
        hasLastBusinessCard
        messageWarning
    }
}`;

export const PARAM_UPDATE_BUSINESS_CARD = arr =>
  `mutation {
    updateBusinessCards(data: ${JSON.stringify(arr).replace(/"(\w+)"\s*:/g, '$1:')}
    ){
      listOfBusinessCardId
     }
}`;

export const PARAM_BUSINESS_CARD_LIST = (idOfList, mode) =>
  `query {
  businessCardList(idOfList: ${idOfList}, mode: ${mode}){
      listInfo{
          listId,
          employeeId,
          listName,
          displayOrder,
          listType,
          listMode,
          ownerList,
          viewerList,
          isOverWrite,
          createdDate,
          createdUser,
          updatedDate,
          updatedUser,
          displayOrderOfFavoriteList
      }
  }
}`;

export const DRAG_DROP_BUSINESS_CARD = (listOfBusinessCardId, idOfNewList, idOfOldList) =>
  `mutation{
    dragDropBusinessCard(
      listOfBusinessCardId: ${JSON.stringify(listOfBusinessCardId).replace(/"(\w+)"\s*:/g, '$1:')},
      idOfNewList: ${idOfNewList},
      idOfOldList: ${idOfOldList},
    ){
      oldIds
      newIds
    }
  }`;

export const PARAM_BUSINESS_CARDS_TO_LIST = (listIdChecked, idOfList) =>
  `mutation{
  addBusinessCardsToList(
    listOfBusinessCardId: ${JSON.stringify(listIdChecked).replace(/"(\w+)"\s*:/g, '$1:')},
    idOfList: ${idOfList}
  ){
    listOfBusinessCardId
  }
}`;

export const ADD_TO_FAVORITE_LIST = idOfList =>
  `mutation{
    addListToFavorite(
      idOfList: ${idOfList}
       employeeId: 2
    ){
      idOfList
    }
  }`;

export const REMOVE_LIST_FROM_FAVORITE = (idOfList, employeeId) =>
  ` mutation {
    removeListFromFavorite(idOfList : ${idOfList}, employeeId : ${employeeId}) {
        idOfList
    }
  }`;

export const REFRESH_AUTO_LIST = idOfList =>
  ` mutation {
    refreshAutoList(idOfList : ${idOfList}){
      idOfList
    }
  }`;

export const LIST_TYPES = {
  MY_LIST: 1,
  SHARED_LIST: 2
};

/* my-businessCard */
export const MY_BUSINESS_CARD_MODES = {
  MODE_CREATE_MY_BUSINESS_CARD: 1,
  MODE_EDIT_MY_BUSINESS_CARD: 2,
  MODE_COPY_MY_BUSINESS_CARD: 3
};

export const PARAM_CREATE_BUSINESS_CARD = form => {
  const query = {};
  query['query'] = `
      mutation(
        $businessCardImageData : String
        $businessCardImagePath : String
        $businessCardImageName : String
        $customerId : Long
        $customerName : String
        $alternativeCustomerName : String
        $firstName : String
        $lastName : String
        $firstNameKana : String
        $lastNameKana : String
        $position : String
        $departmentName : String
        $zipCode : String
        $address : String
        $building : String
        $emailAddress : String
        $phoneNumber : String
        $mobileNumber : String
        $receivePerson : [CreateBusinessCardSubType1]
        $isWorking : Long
        $fax : String
        $isHandMode  : Boolean
        $url : String
        $memo : String
        $businessCardData : [BusinessCardDataIn]
        $saveMode : Long
        $files : [Upload]
      ){
        createBusinessCard(
          data: {
            businessCardImageData : $businessCardImageData
            businessCardImagePath : $businessCardImagePath
            businessCardImageName : $businessCardImageName
            customerId : $customerId
            customerName : $customerName
            alternativeCustomerName : $alternativeCustomerName
            firstName : $firstName
            lastName : $lastName
            firstNameKana : $firstNameKana
            lastNameKana : $lastNameKana
            position : $position
            departmentName : $departmentName
            zipCode : $zipCode
            address : $address
            building : $building
            emailAddress : $emailAddress
            phoneNumber : $phoneNumber
            mobileNumber : $mobileNumber
            receivePerson : $receivePerson
            isWorking : $isWorking
            fax : $fax
            isHandMode  : $isHandMode
            url : $url
            memo : $memo
            businessCardData : $businessCardData
            saveMode : $saveMode
          }
          fileInfos : $files
        )
      }`
    .replace(/"(\w+)"\s*:/g, '$1:')
    .replace(/\n/g, '')
    .replace('  ', ' ');
  query['variables'] = form;
  return query;
};

export const PARAM_BUSINESS_CARDS_LIST = businessCardListDetailId =>
  `query {
    businessCardsList(businessCardListDetailId:  ${businessCardListDetailId})
    {
      businessCardList{
        employeeId
        businessCardListName
        listType
        listMode
        ownerList
        viewerList
        isOverWrite
        updatedDate
        searchConditions{
            businessCardListSearchId
            fieldId
            searchType
            searchOption
            searchValue
            updatedDate
        }
      }
    }
}`;

export const CREATE_BUSINESS_CARDS = (
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  searchConditions,
  listOfBusinessCardId
) =>
  `mutation {
    createBusinessCardsList(
        businessCardList : {
            businessCardListName : ${JSON.stringify(businessCardListName).replace(
              /"(\w+)"\s*:/g,
              '$1:'
            )},
            listType : ${listType},
            listMode : ${listMode},
            ownerList :  ${JSON.stringify(ownerList).replace(/"(\w+)"\s*:/g, '$1:')},
            viewerList : ${JSON.stringify(viewerList).replace(/"(\w+)"\s*:/g, '$1:')},
            isOverWrite : ${isOverWrite}
        },
        searchConditions : ${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')},
        listOfBusinessCardId :${JSON.stringify(listOfBusinessCardId).replace(/"(\w+)"\s*:/g, '$1:')}
    ){
      businessCardListDetailId
    }
}`;

export const UPDATE_BUSINESS_CARDS = (
  businessCardListDetailId,
  businessCardListName,
  listType,
  listMode,
  ownerList,
  viewerList,
  isOverWrite,
  updatedDate,
  searchConditions
) =>
  `mutation {
    updateBusinessCardsList(
      businessCardListDetailId: ${businessCardListDetailId},
      businessCardList: {
        businessCardListName:${JSON.stringify(businessCardListName).replace(/"(\w+)"\s*:/g, '$1:')},
        listType: ${listType},
        listMode: ${listMode},
        ownerList: ${JSON.stringify(ownerList).replace(/"(\w+)"\s*:/g, '$1:')},
        viewerList: ${JSON.stringify(viewerList).replace(/"(\w+)"\s*:/g, '$1:')},
        isOverWrite: ${isOverWrite},
        updatedDate: ${JSON.stringify(updatedDate).replace(/"(\w+)"\s*:/g, '$1:')}
      },
      searchConditions:${JSON.stringify(searchConditions).replace(/"(\w+)"\s*:/g, '$1:')}
    ){
      businessCardListDetailId
    }
  }`;

/* __________business-card-detail__________ */
export const PARAM_GET_BUSINESSCARD = (
  businessCardId,
  businessCardHistoryId,
  isOnlyData,
  hasTimeLine
) =>
  `query {
  businessCard(businessCardId: ${JSON.stringify(businessCardId).replace(/"(\w+)"\s*:/g, '$1:')},
            isOnlyData:  ${isOnlyData},
            hasTimeLine : ${hasTimeLine},
            mode: "detail",
            businessCardHistoryId : ${JSON.stringify(businessCardHistoryId).replace(
              /"(\w+)"\s*:/g,
              '$1:'
            )},) {
      businessCardDetail {
        businessCardId
        businessCardImagePath,
        businessCardImageName,
        customerId
        customerName
        alternativeCustomerName
        firstName
        lastName
        firstNameKana
        lastNameKana
        position
        departmentName
        zipCode
        building
        address
        emailAddress
        phoneNumber
        mobileNumber
        lastContactDate
        isWorking
        memo
        isHandMode
        companyName
        branchName
        fax
        url
        saveMode
        businessCardData{
          fieldType
          key
          value
        }
        createdDate
        createdUser
        updatedDate
        updatedUser
        businessCardReceives{
          employeeId
          receiveDate
          receivedLastContactDate
          employeeSurname
          employeeName
        }
        hasActivity
      }
      businessCardHistoryDetail {
        businessCardHistoryId
        businessCardId
        businessCardImageName
        businessCardImagePath
        mergedBusinessCardId
        contentChange
        updateType
        customerId
        customerName
        alternativeCustomerName
        firstName
        lastName
        firstNameKana
        lastNameKana
        position
        departmentName
        zipCode
        building
        address
        emailAddress
        phoneNumber
        mobileNumber
        lastContactDate
        isWorking
        memo
        isHandMode
        companyName
        branchName
        fax
        url
        saveMode
        businessCardData{
          fieldType
          key
          value
        }
        createdDate
        createdUser
        updatedDate
        updatedUser
        businessCardsReceivesHistories {
          employeeId
          receiveDate
          receivedLastContactDate
          employeeSurname
          employeeName
        }
      }
      tabInfos{
        tabInfoId
        tabId
        tabOrder
        isDisplay
        isDisplaySummary
        maxRecord
        tabLabel
        updatedDate
      }
      fieldInfo{
        fieldId
        fieldBelong
        fieldName
        fieldLabel
        fieldType
        fieldOrder
        modifyFlag
        availableFlag
        isDoubleColumn
        defaultValue
        currencyUnit
        unit
        decimalPlace
        urlType
        urlTarget
        urlEncode
        urlText
        linkTarget
        configValue
        isLinkedGoogleMap
        fieldGroup
        lookupData{
          extensionBelong
          searchKey
          itemReflect
        }
        relationData{
            extensionBelong
            relationFormat
            relationFieldId
            displayTab
            isDisplayMenu,
            displayFields
            displayOrder {
              fieldId
              orderType
            }
        }
        fieldItems{
          itemId
          isAvailable
          itemOrder
          isDefault
          itemLabel
          fieldLabel
          fieldId
        }
        required
        isDefault
      }
    }
  }`;

/* __________business-card-edit__________ */
export const PARAM_GET_BUSINESSCARD_EDIT = (
  businessCardId,
  businessCardHistoryId,
  isOnlyData,
  hasTimeLine
) =>
  `query {
  businessCard(businessCardId: ${JSON.stringify(businessCardId).replace(/"(\w+)"\s*:/g, '$1:')},
            businessCardHistoryId : ${JSON.stringify(businessCardHistoryId).replace(
              /"(\w+)"\s*:/g,
              '$1:'
            )},
            isOnlyData:  ${isOnlyData},
            hasTimeLine : ${hasTimeLine}) {
      businessCardDetail {
        businessCardId
        businessCardImagePath,
        businessCardImageName,
        customerId
        customerName
        alternativeCustomerName
        firstName
        lastName
        firstNameKana
        lastNameKana
        position
        departmentName
        zipCode
        building
        address
        emailAddress
        phoneNumber
        mobileNumber
        lastContactDate
        isWorking
        memo
        isHandMode
        companyName
        branchName
        fax
        url
        saveMode
        businessCardData{
          fieldType
          key
          value
        }
        createdDate
        createdUser
        updatedDate
        updatedUser
        businessCardReceives{
          employeeId
          receiveDate
        }
        hasActivity
      }
      fieldInfo{
        fieldId
        fieldBelong
        fieldName
        fieldLabel
        fieldType
        fieldOrder
        modifyFlag
        availableFlag
        isDoubleColumn
        defaultValue
        currencyUnit
        unit
        decimalPlace
        urlType
        urlTarget
        urlEncode
        urlText
        linkTarget
        configValue
        isLinkedGoogleMap
        fieldGroup
        lookupData{
          extensionBelong
          searchKey
          itemReflect
        }
        relationData{
            extensionBelong
            relationFormat
            relationFieldId
            displayTab
            isDisplayMenu,
            displayFields
            displayOrder {
              fieldId
              orderType
            }
        }
        fieldItems{
          itemId
          isAvailable
          itemOrder
          isDefault
          itemLabel
          fieldLabel
          fieldId
        }
        required
        isDefault
      }
    }
  }`;

export const PARAM_GET_BUSINESSCARD_HISTORY = (businessCardId, offset, limit, orderBy) =>
  `query {
    businessCardHistory (businessCardId: ${businessCardId}, offset: ${offset}, limit: ${limit}, orderBy: ${orderBy}) {
      businessCardHistoryId
      businessCardId
      updatedDate
      updatedUserName
      updatedUserPhotoName
      updatedUserPhotoPath
      contentChange
    }
  }`;

export const PARAM_DELETE_BUSINESSCARD = `mutation deleteBusinessCards($businessCards: [DeleteBusinessCardsIn], $processMode: Int){
    deleteBusinessCards(businessCards : $businessCards, processMode :  $processMode){
      listOfBusinessCardId
      listOfCustomerId
      hasLastBusinessCard
      messageWarning
  }
}`;

/* tab-list */
export const BADGES = {
  maxBadges: 99
};

export const OPTION_DELETE = {
  checkDelete: 0,
  deleteOnly: 1,
  deleteMulti: 2
};

/* tab-trading */
export const DUMMY_PRODUCT_TRADING = {
  dataInfo: {
    totalRecord: 2,
    productTradingBadge: 30,
    productTradings: [
      {
        amountTotal: 100000,
        productsTradingsId: 101,
        customerId: 111,
        customerName: '顧客A',
        employeeId: 1,
        employeeName: '社員A',
        productId: 1002,
        productName: '商品C',
        productTradingProgressId: 1,
        progressName: 'アプローチ',
        endPlanDate: '2020/10/11',
        quantity: 1,
        price: 1000,
        amount: 2000,
        text1: 'productName'
      },
      {
        amountTotal: 100000,
        productsTradingsId: 101,
        customerId: 111,
        customerName: '顧客B',
        employeeId: 1,
        employeeName: '社員B',
        productId: 10421,
        productName: '商品C',
        productTradingProgressId: 1,
        progressName: 'アプローチ',
        endPlanDate: '2020/10/11',
        quantity: 1,
        price: 1000,
        amount: 2000,
        text1: 'productName'
      },
      {
        amountTotal: 100000,
        productsTradingsId: 101,
        customerId: 1112,
        customerName: '顧客C',
        employeeId: 1,
        employeeName: '社員A',
        productId: 10421,
        productName: '商品Z',
        productTradingProgressId: 1,
        progressName: 'アプローチ',
        endPlanDate: '2020/10/11',
        quantity: 1,
        price: 1000,
        amount: 2000,
        text1: 'productName'
      }
    ]
  },
  fieldInfo: [
    {
      fieldId: 2,
      fieldInfoTabId: 2,
      fieldInfoTabPersonalId: 2,
      fieldName: 'customerName',
      fieldLabel: '{"ja_jp": "顧客名"}',
      fieldType: 10,
      fieldOrder: 2,
      isColumnFixed: false,
      columnWidth: 50,
      fieldItems: []
    },
    {
      fieldId: 3,
      fieldInfoTabId: 3,
      fieldInfoTabPersonalId: 3,
      fieldName: 'employeeName',
      fieldLabel: '{"ja_jp": "客先担当者"}',
      fieldType: 10,
      fieldOrder: 3,
      isColumnFixed: false,
      columnWidth: 50,
      fieldItems: []
    },
    {
      fieldId: 4,
      fieldInfoTabId: 4,
      fieldInfoTabPersonalId: 4,
      fieldName: 'progressName',
      fieldLabel: '{"ja_jp": "進捗状況"}',
      fieldType: 10,
      fieldOrder: 4,
      isColumnFixed: false,
      columnWidth: 50,
      fieldItems: []
    },
    {
      fieldId: 5,
      fieldInfoTabId: 5,
      fieldInfoTabPersonalId: 5,
      fieldName: 'endPlanDate',
      fieldLabel: '{"ja_jp": "完了予定日"}',
      fieldType: 10,
      fieldOrder: 5,
      isColumnFixed: false,
      columnWidth: 50,
      fieldItems: []
    },
    {
      fieldId: 6,
      fieldInfoTabId: 6,
      fieldInfoTabPersonalId: 6,
      fieldName: 'amount',
      fieldLabel: '{"ja_jp": "金額"}',
      fieldType: 10,
      fieldOrder: 5,
      isColumnFixed: false,
      columnWidth: 50,
      fieldItems: []
    }
  ]
};

export const TAB_ID_LIST = {
  summary: 0,
  activity: 12,
  trading: 1,
  calendar: 9,
  mail: 6,
  history: 2
};
/* __________end business-card-detail__________ */

export const MY_LISTS_MODES = {
  MODE_CREATE_MY_LIST: 1,
  MODE_EDIT_MY_LIST: 2,
  MODE_COPY_MY_LIST: 3
};

export const CREATE_MY_LIST = (lstName, lstIds) =>
  `mutation {
  createBusinessCardsList(
    businessCardList : {
        businessCardListName : ${JSON.stringify(lstName).replace(/"(\w+)"\s*:/g, '$1:')},
        listType : ${1},
        listMode : ${1},
        ownerList :  ${JSON.stringify([]).replace(/"(\w+)"\s*:/g, '$1:')},
        viewerList : ${JSON.stringify([]).replace(/"(\w+)"\s*:/g, '$1:')},
        isOverWrite : ${0}
    },
    searchConditions : ${JSON.stringify([]).replace(/"(\w+)"\s*:/g, '$1:')},
    listOfBusinessCardId : ${JSON.stringify(lstIds).replace(/"(\w+)"\s*:/g, '$1:')}
  ){
    businessCardListDetailId
  }
}`;

export const CREATE_SHARE_LIST = (lstName, lstIds, ownerList, viewerList) =>
  `mutation {
  createBusinessCardsList(
    businessCardList : {
        businessCardListName : ${JSON.stringify(lstName).replace(/"(\w+)"\s*:/g, '$1:')},
        listType : ${2},
        listMode : ${1},
        ownerList :  ${JSON.stringify(ownerList).replace(/"(\w+)"\s*:/g, '$1:')},
        viewerList : ${JSON.stringify(viewerList).replace(/"(\w+)"\s*:/g, '$1:')},
        isOverWrite : ${0}
    },
    searchConditions : ${JSON.stringify([]).replace(/"(\w+)"\s*:/g, '$1:')},
    listOfBusinessCardId : ${JSON.stringify(lstIds).replace(/"(\w+)"\s*:/g, '$1:')}
  ){
    businessCardListDetailId
  }
}`;

export const MERGE_BUSINESS_CARDS = (
  listOfBusinessCardId,
  businessCardId,
  businessCardImagePath,
  businessCardImageName,
  customerId,
  alternativeCustomerName,
  firstName,
  lastName,
  firstNameKana,
  lastNameKana,
  position,
  departmentName,
  zipCode,
  prefecture,
  addressUnderPrefecture,
  building,
  emailAddress,
  phoneNumber,
  mobileNumber,
  isWorking,
  memo,
  businessCardData,
  updatedDate
) =>
  `mutation {
    mergeBusinessCards(
      listOfBusinessCardId :${JSON.stringify(listOfBusinessCardId).replace(/"(\w+)"\s*:/g, '$1:')},
      businessCardId : ${businessCardId},
      businessCardImagePath : ${JSON.stringify(businessCardImagePath).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )},
      businessCardImageName : ${JSON.stringify(businessCardImageName).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )},
      customerId : ${customerId},
      alternativeCustomerName : ${JSON.stringify(alternativeCustomerName).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )},
      firstName : ${JSON.stringify(firstName).replace(/"(\w+)"\s*:/g, '$1:')},
      lastName : ${JSON.stringify(lastName).replace(/"(\w+)"\s*:/g, '$1:')},
      firstNameKana : ${JSON.stringify(firstNameKana).replace(/"(\w+)"\s*:/g, '$1:')},
      lastNameKana : ${JSON.stringify(lastNameKana).replace(/"(\w+)"\s*:/g, '$1:')},
      position : ${JSON.stringify(position).replace(/"(\w+)"\s*:/g, '$1:')},
      departmentName : ${JSON.stringify(departmentName).replace(/"(\w+)"\s*:/g, '$1:')},
      zipCode : ${JSON.stringify(zipCode).replace(/"(\w+)"\s*:/g, '$1:')},
      prefecture : ${JSON.stringify(prefecture).replace(/"(\w+)"\s*:/g, '$1:')},
      addressUnderPrefecture : ${JSON.stringify(addressUnderPrefecture).replace(
        /"(\w+)"\s*:/g,
        '$1:'
      )},
      building : ${JSON.stringify(building).replace(/"(\w+)"\s*:/g, '$1:')},
      emailAddress : ${JSON.stringify(emailAddress).replace(/"(\w+)"\s*:/g, '$1:')},
      phoneNumber : ${JSON.stringify(phoneNumber).replace(/"(\w+)"\s*:/g, '$1:')},
      mobileNumber : ${JSON.stringify(mobileNumber).replace(/"(\w+)"\s*:/g, '$1:')},
      isWorking : ${isWorking},
      memo : ${JSON.stringify(memo).replace(/"(\w+)"\s*:/g, '$1:')},
      businessCardData : ${JSON.stringify(businessCardData).replace(/"(\w+)"\s*:/g, '$1:')},
      updatedDate : ${JSON.stringify(updatedDate).replace(/"(\w+)"\s*:/g, '$1:')}
    ) {
      businessCardId
    }
  }`;

export const TYPE_OF_LIST = {
  MANUAL: 1,
  AUTO: 2
};

export const REMOVE_BUSINESS_CARDS_FROM_LIST = (listOfBusinessCardId, idOfList) =>
  `mutation {
    removeBusinessCardsFromList(
      listOfBusinessCardId : ${JSON.stringify(listOfBusinessCardId).replace(/"(\w+)"\s*:/g, '$1:')},
      idOfList : ${idOfList}){
      listOfBusinessCardId
    }
  }`;

export const PARAM_EXPORT_BUSINESS_CARD = lstIds =>
  `query{
    downloadBusinessCards(listOfBusinessCardId : ${JSON.stringify(lstIds).replace(
      /"(\w+)"\s*:/g,
      '$1:'
    )})
}`;

export const MARK = {
  COMMA: ', '
};

export const CLASS_CUSTOM = 'block-feedback block-feedback-green text-left';

export const PARAM_UPDATE_CUSTOM_FIELD_INFO = (
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
) => ({
  fieldBelong,
  deletedFields,
  fields,
  tabs,
  deletedFieldsTab,
  fieldsTab
});

export const LICENSE = {
  TIMELINE_LICENSE: 3,
  ACTIVITIES_LICENSE: 6,
  CALENDAR_LICENSE: 2
};
