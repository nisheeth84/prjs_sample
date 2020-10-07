export const DUMMY_LOCAL_MENU = {
  data: {
    data: {
      getLocalNavigation: {
        searchStatic: {
          isAllTime: 1,
          isDesignation: 0
        },
        searchDynamic: {
          customersFavourite: [
            {
              listId: 1,
              listName: 'MyList1',
              isSelected: 0
            },
            {
              listId: 2,
              listName: 'MyList2',
              isSelected: 1
            }
          ],
          departments: [
            {
              departmentId: 1,
              departmentName: '部署A',
              isSelected: 1,
              employees: [
                {
                  employeeId: 1,
                  employeeName: 'TaiTD',
                  isSelected: 1
                },
                {
                  employeeId: 2,
                  employeeName: 'HuyenDT',
                  isSelected: 0
                }
              ]
            },
            {
              departmentId: 2,
              departmentName: '部署B',
              isSelected: 1,
              employees: [
                {
                  employeeId: 1,
                  employeeName: 'TaiTD',
                  isSelected: 0
                },
                {
                  employeeId: 2,
                  employeeName: 'HuyenDT',
                  isSelected: 0
                }
              ]
            }
          ],

          groups: [
            {
              groupId: 1,
              groupName: 'グループA',
              isSelected: '0'
            },
            {
              groupId: 2,
              groupName: 'グループB',
              isSelected: '0'
            }
          ]
        }
      }
    }
  }
};

export const DUMMY_GET_TASK = {
  data: {
    data: {
      getTasks: {
        dataInfo: {
          tasks: [
            {
              taskId: 101,
              numeric1: 111,
              checkbox1: '0',
              checkbox2: '1',
              statusTaskId: 1,
              parentTaskId: null,
              parentStatusTaskId: null,
              taskName: 'task12222222222222222222222222222222222222222222222',
              startDate: '2019/01/05',
              finishDate: '2019/02/01',
              milestoneId: 2221,
              milestoneName: '契約契約契約契約ddddddddddddddddddd',
              memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
              customers: [
                // {
                //   customerId: 2001,
                //   customerName: '未来会社未来会社'
                // },
                // {
                //   customerId: 2003,
                //   customerName: '未来会dsdsdsdsadasds社1'
                // }
              ],
              productTradings: [
                // {
                //   productTradingId: 7771,
                //   productId: 1333,
                //   productName: 'カテカテ'
                // }
              ],
              subtasks: [
                {
                  taskId: 100001,
                  taskName: '20190110 完了ddddddddddddddddddddd',
                  statusTaskId: 1
                },
                {
                  taskId: 100002,
                  taskName: '20190120 完了',
                  statusTaskId: 2
                },
                {
                  taskId: 100004,
                  taskName: '20190130 完了',
                  statusTaskId: 3
                }
              ],
              countSubtask: 3,
              files: [
                {
                  fileId: 33333,
                  fileName: 'filefffffffffffffffffffffffffffffffffffa.pdf',
                  filePath: 'cacsavava.sdadad/dsaddd'
                }
              ],
              countFile: 1,
              employees: [
                {
                  employeeId: 5,
                  employeeName: '高野高野高野1',
                  departmentName: 'マーケティング部',
                  positionName: '部長',
                  photoFilePath: 'sdadaa',
                  employeeNameKana: 'kanateki',
                  flagActivity: '1',
                  phoneNumber: '0222-3333-22',
                  email: 'sankakisino@gmail.com'
                },
                {
                  employeeId: 6,
                  employeeName: '高野高野高野2',
                  departmentName: 'マーケティング部',
                  positionName: '部長',
                  photoFilePath: 'sdadaa',
                  employeeNameKana: 'kanateki',
                  flagActivity: '1',
                  phoneNumber: '0222-3333-22',
                  email: 'sankakisino@gmail.com'
                },
                {
                  employeeId: 7,
                  employeeName: '高野高野高野3',
                  departmentName: 'マーケティング部',
                  positionName: '部長',
                  photoFilePath: 'sdadaa',
                  employeeNameKana: 'kanateki',
                  flagActivity: '1',
                  phoneNumber: '0222-3333-22',
                  email: 'sankakisino@gmail.com'
                },
                {
                  employeeId: 8,
                  employeeName: '高野高野高野3',
                  departmentName: 'マーケティング部',
                  positionName: '部長',
                  photoFilePath: 'sdadaa',
                  employeeNameKana: 'kanateki',
                  flagActivity: '1',
                  phoneNumber: '0222-3333-22',
                  email: 'sankakisino@gmail.com'
                }
              ],
              countEmployee: 1
            },
            {
              taskId: 100001,
              numeric1: 111,
              checkbox1: '0',
              checkbox2: '1',
              statusTaskId: 1,
              parentTaskId: 101,
              parentStatusTaskId: 1,
              taskName: 'task 2',
              startDate: '2019/01/05',
              finishDate: '2019/01/10',
              milestoneId: 2221,
              milestoneName: '契約契約契約契約',
              memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
              customers: [
                {
                  customerId: 2001,
                  customerName: '未来会社未来会社'
                },
                {
                  customerId: 2003,
                  customerName: '未来会社eeeeeeeeeeeeeeeeeeeeeeee1'
                }
              ],
              productTradings: [
                {
                  productTradingId: 7771,
                  productId: 1333,
                  productName: 'カテカテ'
                }
              ],
              subtasks: [],
              countSubtask: 0,
              files: [
                {
                  fileId: 2221,
                  fileName: 'filea.pdf',
                  filePath: 'cacsavava.sdadad/dsad'
                }
              ],
              countFile: 1,
              employees: [
                {
                  employeeId: 5,
                  employeeName: '高野高野高野1',
                  departmentName: 'マーケティング部',
                  positionName: '部長',
                  photoFilePath: 'sdadaa',
                  employeeNameKana: 'kanateki',
                  flagActivity: '1',
                  phoneNumber: '0222-3333-22',
                  email: 'sankakisino@gmail.com'
                }
              ]
            },
            {
              taskId: 100002,
              numeric1: 111,
              checkbox1: '0',
              checkbox2: '1',
              statusTaskId: 1,
              parentTaskId: 101,
              parentStatusTaskId: 1,
              taskName: 'task 3',
              startDate: '2019/01/05',
              finishDate: '2019/01/10',
              milestoneId: 2221,
              milestoneName: '契約契約契約契約',
              memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
              customers: [
                {
                  customerId: 2001,
                  customerName: '未来会社未来会社'
                },
                {
                  customerId: 2003,
                  customerName: '未来会社1'
                }
              ],
              productTradings: [
                {
                  productTradingId: 7771,
                  productId: 1332,
                  productName: 'カテカテ'
                }
              ],
              subtasks: [],
              countSubtask: 0,
              files: [
                {
                  fileId: 2221,
                  fileName: 'filea.pdf',
                  filePath: 'cacsavava.sdadad/dsad'
                }
              ],
              countFile: 1,
              employees: [
                {
                  employeeId: 5,
                  employeeName: '高野高野高野1',
                  departmentName: 'マーケティング部',
                  positionName: '部長',
                  photoFilePath: 'sdadaa',
                  employeeNameKana: 'kanateki',
                  flagActivity: '1',
                  phoneNumber: '0222-3333-22',
                  email: 'sankakisino@gmail.com'
                }
              ]
            },
            {
              taskId: 100004,
              numeric1: 111,
              checkbox1: '0',
              checkbox2: '1',
              statusTaskId: 1,
              parentTaskId: 101,
              parentStatusTaskId: 1,
              taskName: 'task 4',
              startDate: '2019/01/05',
              finishDate: '2019/01/10',
              milestoneId: 2221,
              milestoneName: '契約契約契約契約',
              memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
              customers: [
                {
                  customerId: 2001,
                  customerName: '未来会社未来会社'
                },
                {
                  customerId: 2003,
                  customerName: '未来会社1'
                }
              ],
              productTradings: [
                {
                  productTradingId: 7771,
                  productId: 132,
                  productName: 'カテカテ'
                }
              ],
              subtasks: [{}],
              countSubtask: 0,
              files: [
                {
                  fileId: 2221,
                  fileName: 'filea.pdf',
                  filePath: 'cacsavava.sdadad/dsad'
                }
              ],
              countFile: 1,
              employees: [
                {
                  employeeId: 5,
                  employeeName: '高野高野高野1',
                  departmentName: 'マーケティング部',
                  positionName: '部長',
                  photoFilePath: 'sdadaa',
                  employeeNameKana: 'kanateki',
                  flagActivity: '1',
                  phoneNumber: '0222-3333-22',
                  email: 'sankakisino@gmail.com'
                }
              ]
            }
          ],
          countTask: 4,
          countTotaltask: 6
        },
        fieldInfo: [
          {
            fileldID: 1,
            fileName: 'numeric1'
          },
          {
            fileldID: 2,
            fileName: 'checkbox1'
          }
        ]
      }
    }
  }
};

export const DUMMY_UPDATE_TASK = {
  data: {
    data: {
      updateTask: {
        taskId: 1
      }
    }
  }
};

export const DUMMY_GET_FIELD_INFO_PERSONNAL = {
  data: {
    fieldInfoPersonals: [
      {
        fieldId: 15010,
        fieldName: 'is_public',
        fieldLabel: '公開設定',
        fieldType: 3,
        fieldOrder: 7,
        isDoubleColumn: true,
        doubleColumnOption: 2,
        searchType: 1,
        searchOption: 1,
        columnWidth: null,
        isColumnFixed: false,
        required: false,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: null,
            itemLabel: null,
            itemOrder: null,
            isDefault: null
          }
        ]
      },
      {
        fieldId: 15012,
        fieldName: 'created_date',
        fieldLabel: '登録日',
        fieldType: 8,
        fieldOrder: 8,
        isDoubleColumn: true,
        doubleColumnOption: 1,
        searchType: 1,
        searchOption: 1,
        columnWidth: null,
        isColumnFixed: null,
        required: false,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: null,
            itemLabel: null,
            itemOrder: null,
            isDefault: null
          }
        ]
      },
      {
        fieldId: 15001,
        fieldName: 'task_name',
        fieldLabel: 'タスク名',
        fieldType: 10,
        fieldOrder: 1,
        isDoubleColumn: true,
        doubleColumnOption: 1,
        searchType: 1,
        searchOption: 1,
        columnWidth: 160,
        isColumnFixed: false,
        required: true,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: null,
            itemLabel: null,
            itemOrder: null,
            isDefault: null
          }
        ]
      },
      {
        fieldId: 15002,
        fieldName: 'status',
        fieldLabel: 'ステータス',
        fieldType: 1,
        fieldOrder: 5,
        isDoubleColumn: true,
        doubleColumnOption: 2,
        searchType: 1,
        searchOption: 1,
        columnWidth: null,
        isColumnFixed: false,
        required: true,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: 310817,
            itemLabel: 'ステータス',
            itemOrder: 1,
            isDefault: false
          },
          {
            itemId: 310818,
            itemLabel: 'ステータス',
            itemOrder: 2,
            isDefault: false
          },
          {
            itemId: 310819,
            itemLabel: 'ステータス',
            itemOrder: 3,
            isDefault: false
          }
        ]
      },
      {
        fieldId: 15003,
        fieldName: 'customer_id',
        fieldLabel: '顧客名',
        fieldType: 10,
        fieldOrder: 4,
        isDoubleColumn: true,
        doubleColumnOption: 1,
        searchType: 1,
        searchOption: 1,
        columnWidth: null,
        isColumnFixed: false,
        required: false,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: null,
            itemLabel: null,
            itemOrder: null,
            isDefault: null
          }
        ]
      },
      {
        fieldId: 15004,
        fieldName: 'products_tradings_id',
        fieldLabel: '取引商品',
        fieldType: 10,
        fieldOrder: 2,
        isDoubleColumn: true,
        doubleColumnOption: 2,
        searchType: 1,
        searchOption: 1,
        columnWidth: null,
        isColumnFixed: false,
        required: false,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: null,
            itemLabel: null,
            itemOrder: null,
            isDefault: null
          }
        ]
      },
      {
        fieldId: 15005,
        fieldName: 'operator_id',
        fieldLabel: '担当者',
        fieldType: 10,
        fieldOrder: 3,
        isDoubleColumn: false,
        doubleColumnOption: 1,
        searchType: 1,
        searchOption: 1,
        columnWidth: null,
        isColumnFixed: false,
        required: true,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: null,
            itemLabel: null,
            itemOrder: null,
            isDefault: null
          }
        ]
      },
      {
        fieldId: 15007,
        fieldName: 'start_date',
        fieldLabel: '開始日',
        fieldType: 7,
        fieldOrder: 6,
        isDoubleColumn: true,
        doubleColumnOption: 1,
        searchType: 1,
        searchOption: 1,
        columnWidth: null,
        isColumnFixed: false,
        required: false,
        isDefault: true,
        isAvailable: true,
        isModify: null,
        isMobileModify: null,
        ownPermissionLevel: null,
        othersPermissionLevel: null,
        urlTarget: null,
        urlEncode: null,
        urlText: null,
        iframeHeight: null,
        isLineNameDisplay: null,
        configValue: null,
        decimalPlace: null,
        fieldItems: [
          {
            itemId: null,
            itemLabel: null,
            itemOrder: null,
            isDefault: null
          }
        ]
      }
    ]
  }
};

export const DUMMY_GET_PRODUCT_TRADING_SUGGESTIONS = {
  productTradings: [
    {
      productTradingId: 1,
      customerId: 1,
      customerName: 'customer1',
      productId: 1,
      productName: 'product1',
      memoProduct: 'ここに詳細説明文書が入ります。',
      quantity: 1,
      price: 2000,
      amount: 2000,
      employeeId: 1,
      employeeName: 'employee1',
      endPlanDate: '2020/05/15',
      orderPlanDate: '2020/05/14',
      progressName: 'finish',
      productImageName: 'product1',
      productImagePath: '../../../content/images/product1.svg',
      productCategoryId: 1,
      productCategoryName: 'category1',
      memo: 'memo1'
    },
    {
      productTradingId: 2,
      customerId: 1,
      customerName: 'customer1',
      productId: 2,
      productName: 'product2',
      memoProduct: 'memoProduct2',
      quantity: 1,
      price: 3000,
      amount: 3000,
      employeeId: 1,
      employeeName: 'employee1',
      endPlanDate: '2020/05/15',
      orderPlanDate: '2020/05/14',
      progressName: 'finish',
      productImageName: 'product2',
      productImagePath: '../../../content/images/product1.svg',
      productCategoryId: 1,
      productCategoryName: 'category1',
      memo: 'memo2'
    }
  ]
};
