export const DUMMY_BUSINESS_CARDS_RESPONSE = {
  businessCards: [
    {
    businessCardId: 1,
    firstName: "直樹1",
    lastName: "直樹1",
    firstNameKana: "タナカ",
    lastNameKana: "タナカ",
    position: null,
    departmentName: "直樹",
    businessCardsReceives: [
        {
          employeeId: 1,
          receiveDate: "2019/02/22 09:30:00",
          lastContactDateReceiver: "2019/02/25 10:20:12"
        },
        {
          employeeId: 2,
          receiveDate: "2019/02/22 09:30:00",
          lastContactDateReceiver: "2019/02/25 10:20:12"
        },
      ],
    totalRecords: 100,
    fieldInfo:
        {
          fieldId: 1,
          fieldName: "businessCardId",
        }
    },
    {
    businessCardId: 2,
    firstName: "直樹2",
    lastName: "直樹2",
    firstNameKana: "タナカ",
    lastNameKana: "タナカ",
    position: null,
    departmentName: "直樹",
    businessCardsReceives: [
        {
          employeeId: 3,
          receiveDate: "2019/02/22 09:30:00",
          lastContactDateReceiver: "2019/02/25 10:20:12"
        },
        {
          employeeId: 4,
          receiveDate: "2019/02/22 09:30:00",
          lastContactDateReceiver: "2019/02/25 10:20:12"
        },
      ],
    totalRecords: 110,
    fieldInfo:
        {
          fieldId: 1,
          fieldName: "businessCardId",
        }
    }
  ]
}
export const DUMMY_CUSTOMERS_RESPONSE = {
  customer: [
    {
      customerId: 1,
      customerName: "Osaka",
      customerAliasName: "Maria",
      phoneNumber: "19744",
      zipCode: "214",
      prefecture: "111",
      building: "A",
      address: "Bz",
      businessMainId: 5,
      businessMainName: "製造業",
      businessSubId: 3,
      businessSubName: "繊維工業",
      url: "https://www.softbrain.co.jp/",
      memo: "data memo",
      customerData : [
        {
          fieldType: 10,
          key: "text_1",
          value: "test"
        }
        ],
      productTradingData:[
        {
          "productTradings": [
            {
              productId:1,
              productName:"商品A",
              customerId:1,
              customerName:"Tran",
              businessCardId:1,
              businessCardName:"BusinessCardName",
              employeeId:1,
              employeeName:"社員A",
              progressName:"アプローチ",
              tradingDate:"2020/10/11",
              quantity:1,
              amount:1000,
            },
            {
              productId:2,
              productName:"商品B",
              customerId:1,
              customerName:"Tran",
              businessCardId:1,
              businessCardName:"BusinessCardName",
              employeeId:2,
              employeeName:"社員B",
              progressName:"アプローチ",
              tradingDate:"2020/10/11",
              quantity:1,
              amount:1000,
            },
          ],
          fieldInfo: [
            {
              fieldId:1,
            }
          ],
        }
      ],
          personInCharge:{
          employeeName: "社員1",
          departmentId : "1",
          },
    fieldInfo:[
        {
          fieldId: 1,
          fieldName: "text1",
        },
    ]
    },
    {
      customerId: 2,
      customerName: "Laura",
      customerAliasName: "Aki",
      phoneNumber: "19744",
      zipCode: "214",
      prefecture: "111",
      building: "A",
      address: "Bz",
      businessMainId: 5,
      businessMainName: "製造業",
      businessSubId: 3,
      businessSubName: "繊維工業",
      url: "https://www.softbrain.co.jp/",
      memo: "data memo",
      customerData : [
        {
          fieldType: 10,
          key: "text_1",
          value: "test"
        }
        ],
      productTradingData:[
        {
          "productTradings": [
            {
              productId:1,
              productName:"商品A",
              customerId:1,
              customerName:"Tran",
              businessCardId:1,
              businessCardName:"BusinessCardName",
              employeeId:1,
              employeeName:"社員A",
              progressName:"アプローチ",
              tradingDate:"2020/10/11",
              quantity:1,
              amount:1000,
            },
            {
              productId:2,
              productName:"商品B",
              customerId:1,
              customerName:"Tran",
              businessCardId:1,
              businessCardName:"BusinessCardName",
              employeeId:2,
              employeeName:"社員B",
              progressName:"アプローチ",
              tradingDate:"2020/10/11",
              quantity:1,
              amount:1000,
            },
          ],
          fieldInfo: [
            {
              fieldId:1,
            }
          ],
        }
      ],
          personInCharge:{
          employeeName: "社員1",
          departmentId : "1",
          },
    fieldInfo:[
        {
          fieldId: 1,
          fieldName: "text1",
        },
    ]
    },
  ]
}
export const CUSTOMER_FAVORITE_LIST = [
  {
    listId: 1,
    listName: '社員A',
    isAutoList: true,
    customer_list_type: 3,
  },
  {
    listId: 2,
    listName: '社員B',
    isAutoList: true,
    customer_list_type: 4,
  },
]
export const BUSINESS_CARD_LIST = [
  {
    listId: 1,
    listName: '社員AC',
    displayOrder: 10,
    listType: 1,
    displayOrderOfFavoriteList: 2,
  },
  {
    listId: 2,
    listName: '社員D',
    displayOrder: 20,
    listType: 1,
    displayOrderOfFavoriteList: 3,
  },
]
export const PRODUCT_TRADINGS = [
  {
    listId: 1,
    listName: '社員AE',
    displayOrder: 10,
    listType: 1,
    displayOrderOfFavoriteList: 2,
  },
  {
    listId: 2,
    listName: '社員AF',
    displayOrder: 20,
    listType: 1,
    displayOrderOfFavoriteList: 3,
  },
]