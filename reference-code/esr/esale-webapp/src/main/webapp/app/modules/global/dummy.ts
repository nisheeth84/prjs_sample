export const DUMMY_FIELD_INFO_GLOBAL_TASK = statusMilestoneID => {
  if (statusMilestoneID === 0) {
    return {
      data: {
        data: {
          getTaskGlobalTools: {
            dataGlobalTools: [
              {
                taskData: {
                  taskId: 101,
                  numeric1: 111,
                  checkbox1: '0',
                  checkbox2: '1',
                  statusTaskId: 1,
                  parentTaskId: null,
                  parentStatusTaskId: null,
                  taskName: 'task 1aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                  startDate: '2019/01/05',
                  finishDate: '2019/02/01',
                  milestoneId: 104,
                  milestoneName: '契約契約契約契約',
                  memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
                  customers: [
                    // {
                    //   customerId: 2001,
                    //   customerName: '未来会社未来会社'
                    // },
                    // {
                    //   customerId: 2003,
                    //   customerName: '未来会社1'
                    // }
                  ],
                  productTradings: [
                    // {
                    //   productTradingId: 7771,
                    //   productName: 'カテゴカテゴ'
                    // }
                  ],
                  subtasks: [
                    {
                      taskId: 100001,
                      statusTaskId: 1,
                      taskName: '20190110 完了'
                    },
                    {
                      taskId: 100002,
                      statusTaskId: 2,
                      taskName: '20190120 完了'
                    },
                    {
                      taskId: 100004,
                      statusTaskId: 3,
                      taskName: '20190130 完了'
                    }
                  ],
                  countSubtask: 3,
                  files: [
                    {
                      fileId: 33333,
                      fileName: 'filea.jpg',
                      filePath: 'https://dl.dropboxusercontent.com/s/1dhwdxqr7vguyyr/Annotation%202020-03-19%20170210.png'
                    }
                  ],
                  countFile: 1,
                  employees: [
                    {
                      employeeId: 5,
                      employeeName: '高高野高野野1',
                      departmentName: 'マーケティング部',
                      positionName: '部長',
                      photoFilePath: 'dsds',
                      employeeNameKana: 'kanateki',
                      flagActivity: '1',
                      phoneNumber: '0222-3333-22',
                      email: 'sankakisino@gmail.com'
                    },
                    {
                      employeeId: 6,
                      employeeName: 'B野高高野1',
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
                      employeeName: '野高野高野高野1',
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
                      employeeName: 'A高野高野高1',
                      departmentName: 'マーケティング部',
                      positionName: '部長',
                      photoFilePath: 'sdadaa',
                      employeeNameKana: 'kanateki',
                      flagActivity: '1',
                      phoneNumber: '0222-3333-22',
                      email: 'sankakisino@gmail.com'
                    }
                  ],
                  countEmployee: 4
                }
              },
              {
                taskData: {
                  taskId: 100001,
                  numeric1: 111,
                  checkbox1: '0',
                  checkbox2: '1',
                  statusTaskId: 1,
                  parentTaskId: 101,
                  parentStatusTaskId: 1,
                  taskName: 'task 2 3333333333333333333333333333333333333333333333333333333333333',
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
                      productName: 'カテゴカテゴ'
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
                    },
                    {
                      employeeId: 6,
                      employeeName: '高野高野高野1',
                      departmentName: 'マーケティング部',
                      positionName: '部長',
                      photoFilePath: 'sdadaa',
                      employeeNameKana: 'kanateki',
                      flagActivity: '1',
                      phoneNumber: '0222-3333-22',
                      email: 'sankakisino@gmail.com'
                    }
                  ],
                  countEmployee: 2
                }
              },
              {
                taskData: {
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
                      customerName: '未来会社1'
                    }
                  ],
                  productTradings: [
                    {
                      productTradingId: 7771,
                      productName: 'カテゴカテゴ'
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
                    },
                    {
                      employeeId: 6,
                      employeeName: '高野高野高野1',
                      departmentName: 'マーケティング部',
                      positionName: '部長',
                      photoFilePath: 'sdadaa',
                      employeeNameKana: 'kanateki',
                      flagActivity: '1',
                      phoneNumber: '0222-3333-22',
                      email: 'sankakisino@gmail.com'
                    }
                  ],
                  countEmployee: 2
                }
              },
              {
                milestoneData: {
                  milestoneId: 104,
                  statusMilestoneId: 0,
                  milestoneName: 'asdasfeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
                  finishDate: '2019/02/01',
                  memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
                  tasks: [
                    {
                      taskId: 100007,
                      taskName: '20190110 完了',
                      statusTaskId: '3'
                    },
                    {
                      taskId: 100009,
                      taskName: '20190120 完了',
                      statusTaskId: '3'
                    }
                  ],
                  countTask: 2
                }
              }
            ]
          }
        }
      }
    };
  } else {
    return {
      data: {
        data: {
          getTaskGlobalTools: {
            dataGlobalTools: [
              {
                taskData: {
                  taskId: 101,
                  numeric1: 111,
                  checkbox1: '0',
                  checkbox2: '1',
                  statusTaskId: 3,
                  parentTaskId: null,
                  parentStatusTaskId: null,
                  taskName: '契約書に署名する',
                  startDate: '2019/01/05',
                  finishDate: '2019/02/01',
                  milestoneId: 104,
                  milestoneName: '契約契約契約契約',
                  memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
                  customers: [
                    {
                      customerId: 2001,
                      customerName: '未来会社未来会社'
                    },
                    {
                      customerId: 2003,
                      customerName: '未f'
                    }
                  ],
                  productTradings: [
                    {
                      productTradingId: 7771,
                      productName: 'カテゴカテゴ'
                    }
                  ],
                  subtasks: [
                    {
                      taskId: 100001,
                      statusTaskId: 1,
                      taskName: '20190110 完了'
                    },
                    {
                      taskId: 100002,
                      statusTaskId: 2,
                      taskName: '20190120 完了'
                    },
                    {
                      taskId: 100004,
                      statusTaskId: 3,
                      taskName: '20190130 完了'
                    }
                  ],
                  countSubtask: 3,
                  files: [
                    {
                      fileId: 33333,
                      fileName: 'filea.jpg',
                      filePath: 'https://dl.dropboxusercontent.com/s/1dhwdxqr7vguyyr/Annotation%202020-03-19%20170210.png'
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
                  ],
                  countEmployee: 1
                }
              },
              {
                taskData: {
                  taskId: 100001,
                  numeric1: 111,
                  checkbox1: '0',
                  checkbox2: '1',
                  statusTaskId: 3,
                  parentTaskId: 101,
                  parentStatusTaskId: 1,
                  taskName: '20190110 完了',
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
                      productName: 'カテゴカテゴ'
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
                  ],
                  countEmployee: 1
                }
              },
              {
                milestoneData: {
                  milestoneId: 104,
                  statusMilestoneId: 1,
                  milestoneName: 'czf dfgdfbf',
                  finishDate: '2019/02/01',
                  memo: 'カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1カテゴリ1',
                  tasks: [
                    {
                      taskId: 100007,
                      taskName: '20190110 完了',
                      statusTaskId: '3'
                    },
                    {
                      taskId: 100009,
                      taskName: '20190120 完了',
                      statusTaskId: '3'
                    }
                  ],
                  countTask: 2
                }
              }
            ]
          }
        }
      }
    };
  }
};

export const DUMMY_UPDATE_STATUS_TASK = (id, success) => {
  return {
    data: {
      data: {
        updateTaskStatus: {
          taskIds: {
            taskId: id
          }
        }
      }
    }
  };
};
