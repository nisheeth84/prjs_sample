export const dataGetTimelineGroupsDummy = {
  timelineGroup: [
    {
      timelineGroupId: 10001,
      timelineGroupName: "チャンネルA",
      comment:
        "ここにチャンネルのメモが入ります。ここにチャンネルのメモが入ります。ここにチャンネルのメモが入ります。",
      createdDate: "2019-05-12",
      isPublic: true,
      color: "#0xFFFFC8",
      imagePath:
        "https://indainam.com/wp-content/uploads/2017/10/mau-background-don-gian-02-1024x768.jpg",
      imageName: "groupImage",
      width: 15,
      height: 12,
      changedDate: "2019-05-12",
      invites: [
        {
          inviteId: 19,
          inviteType: 1,
          inviteName: "部署名A",
          inviteImagePath:
            "https://imgt.taimienphi.vn/cf/Images/huy/2020/3/19/hinh-avatar-cho-nu-dep-1.jpg",
          employeeNames: ["aa", "bbb", "ccc"],
          department: {
            parentId: 1,
            parentName: "部署名AS2",
            employeeId: [1, 2, 3],
            employeeName: ["aa", "bbb", "ccc"],
          },
          status: 1,
          authority: 2,
        },
        {
          inviteId: 20,
          inviteType: 1,
          inviteName: "Dororo",
          inviteImagePath:
            "https://lazi.vn/uploads/photo/lazi_5de282653208e_1575125605_58.jpg",
          employeeNames: [],
          department: {
            parentId: 1,
            parentName: "部署名AS2",
            employeeId: [3, 4, 5],
            employeeName: ["aa", "bbb", "ccc"],
          },
          status: 1,
          authority: 1,
        },
        {
          inviteId: "19",
          inviteType: "2",
          inviteName: "Hotaru",
          inviteImagePath:
            "https://lazi.vn/uploads/photo/lazi_5de282653208e_1575125605_58.jpg",
          status: "1",
          authority: "2",
          employee: [
            {
              departmentName: "部署名A",
              positionName: "役職名A",
            }
          ]
        },
        {
          inviteId: "19",
          inviteType: "3",
          inviteName: "Kana",
          inviteImagePath:
            "https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png",
          status: "1",
          authority: "1",
          employee: [
            {
              departmentName: "部署名A",
              positionName: "役職名A",
            }
          ]
        },
        {
          inviteId: "19",
          inviteType: "3",
          inviteName: "Kana",
          inviteImagePath:
            "https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png",
          status: "1",
          authority: "1",
          employee: [
            {
              departmentName: "部署名A",
              positionName: "役職名A",
            }
          ]
        },
        {
          inviteId: "19",
          inviteType: "3",
          inviteName: "Kana",
          inviteImagePath:
            "https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png",
          status: "1",
          authority: "1",
          employee: [
            {
              departmentName: "部署名A",
              positionName: "役職名A",
            }
          ]
        },
        {
          inviteId: "19",
          inviteType: "3",
          inviteName: "Kana",
          inviteImagePath:
            "https://cdn4.iconfinder.com/data/icons/reaction/32/happy-512.png",
          status: "1",
          authority: "1",
          employee: [
            {
              departmentName: "部署名A",
              positionName: "役職名A",
            }
          ]
        },
      ],
      status: 0,
    },
    // {
    //   timelineGroupId: "10001",
    //   timelineGroupName: "test1",
    //   comment: "test group1",
    //   createdDate: "2019-05-12",
    //   isPublic: true,
    //   imagePath: "/group/ImagePath",
    //   imageName: "groupImage",
    //   width: "15px",
    //   height: "12px",
    //   changedDate: "2019-05-12",
    //   invites: [
    //     {
    //       inviteId: "19",
    //       inviteType: "3",
    //       inviteName: "Dai",
    //       inviteImagePath: "/s3/path…",
    //       status: "1",
    //       authority: "1",
    //     },
    //     {
    //       inviteId: "19",
    //       inviteType: "3",
    //       inviteName: "abc",
    //       inviteImagePath: "/s3/path…",
    //       status: "1",
    //       authority: "1",
    //     },
    //   ],
    // },
  ],
};

export const dataGetUserTimelinesDummy = {
  timelines: [
    {
      group: {
        groupId: 1,
        groupImagePath: "/image/image.png",
        groupName: "GroupTimelineA",
      },
      createdUser: {
        createdUserId: 1,
        createdUserName: "Employee A",
        createdUserImage: "/image/image.png",
      },
      createdDate: "2020-02-02 20:12:11",
      timelineId: 1000,
      parentId: null,
      rootId: null,
      header: {
        headerId: 10000,
        headerName: ["Business card A"],
        relate: ["Customer A"],
      },
      targerDelivers: [
        {
          targetType: 1,
          targetId: 1000,
          targetName: "AAA",
        },
      ],
      comment: "This is a post",
      sharedTimeline: {
        createdUser: {
          createdUserId: 1,
          createdUserName: "Employee A",
          createdUserImage: "/image/image.png",
        },
        createdDate: "2020-02-02 20:12:11",
        sharedTimelineId: 123,
        header: {
          headerId: 10000,
          headerName: ["Business card A"],
          relate: ["Customer A"],
        },
      },
      attachedFiles: [
        {
          filePath: "documents/document.docx",
          fileName: "document.docx",
        },
      ],
      reactions: [
        {
          reactionType: 1,
          employees: [
            {
              employeeId: 222,
              employeeName: "Emp A",
              employeeImagePath: "/image/image.png",
            },
          ],
        },
      ],
      isFavorite: true,
      childTimelines: [
        {
          createdUser: {
            createdUserId: 1,
            createdUserName: "Employee A",
            createdUserImage: "/image/image.png",
          },
          createdDate: "2020-02-02 20:12:11",
          timelineId: 1000,
          parentId: null,
          targerDelivers: [
            {
              targetType: 1,
              targetId: 1000,
              targetName: "AAA",
            },
          ],
          comment: "This is a post",
          sharedTimeline: {
            createdUser: {
              createdUserId: 1,
              createdUserName: "Employee A",
              createdUserImage: "/image/image.png",
            },
            createdDate: "2020-02-02 20:12:11",
            sharedTimelineId: 123,
            header: {
              headerId: 10000,
              headerName: ["Business card A"],
              relate: ["Customer A"],
            },
          },
          attachedFiles: [
            {
              filePath: "documents/document.docx",
              fileName: "document.docx",
            },
          ],
          reactions: [
            {
              reactionType: 1,
              employees: [
                {
                  employeeId: 222,
                  employeeName: "Emp A",
                  employeeImagePath: "/image/image.png",
                },
              ],
            },
          ],
          isFavorite: false,
          replyCount: 4,
        },
      ],
      commentCount: 5,
    },
    {
      group: {
        groupId: 1,
        groupImagePath: "/image/image.png",
        groupName: "GroupTimelineA",
      },
      createdUser: {
        createdUserId: 1,
        createdUserName: "Employee A",
        createdUserImage: "/image/image.png",
      },
      createdDate: "2020-02-02 20:12:11",
      timelineId: 1001,
      parentId: null,
      rootId: null,
      header: {
        headerId: 10000,
        headerName: ["Business card A"],
        relate: ["Customer A"],
      },
      targerDelivers: [
        {
          targetType: 1,
          targetId: 1000,
          targetName: "AAA",
        },
      ],
      comment: "This is a post",
      sharedTimeline: {
        createdUser: {
          createdUserId: 1,
          createdUserName: "Employee A",
          createdUserImage: "/image/image.png",
        },
        createdDate: "2020-02-02 20:12:11",
        sharedTimelineId: 123,
        header: {
          headerId: 10000,
          headerName: ["Business card A"],
          relate: ["Customer A"],
        },
      },
      attachedFiles: [
        {
          filePath: "documents/document.docx",
          fileName: "document.docx",
        },
      ],
      reactions: [
        {
          reactionType: 1,
          employees: [
            {
              employeeId: 222,
              employeeName: "Emp A",
              employeeImagePath: "/image/image.png",
            },
          ],
        },
      ],
      isFavorite: true,
      childTimelines: [
        {
          createdUser: {
            createdUserId: 1,
            createdUserName: "Employee A",
            createdUserImage: "/image/image.png",
          },
          createdDate: "2020-02-02 20:12:11",
          timelineId: 1001,
          parentId: null,
          targerDelivers: [
            {
              targetType: 1,
              targetId: 1000,
              targetName: "AAA",
            },
          ],
          comment: "This is a post",
          sharedTimeline: {
            createdUser: {
              createdUserId: 1,
              createdUserName: "Employee A",
              createdUserImage: "/image/image.png",
            },
            createdDate: "2020-02-02 20:12:11",
            sharedTimelineId: 123,
            header: {
              headerId: 10000,
              headerName: ["Business card A"],
              relate: ["Customer A"],
            },
          },
          attachedFiles: [
            {
              filePath: "documents/document.docx",
              fileName: "document.docx",
            },
          ],
          reactions: [
            {
              reactionType: 1,
              employees: [
                {
                  employeeId: 222,
                  employeeName: "Emp A",
                  employeeImagePath: "/image/image.png",
                },
              ],
            },
          ],
          isFavorite: false,
          replyCount: 4,
        },
      ],
      commentCount: 5,
    },
  ],
};

export const dataGetTimelineGroupsOfEmployeeDummy = {
  timelineGroup: [
    {
      timelineGroupId: 10001,
      timelineGroupName: "abc",
      imagePath: "S3/…",
      inviteId: 10001,
      inviteType: 2,
      status: null,
      authority: 1,
    },
  ],
};

export const dataGetEmployeesSuggestionDummy = {
  data: {
    employees: [
      {
        employeeId: 1,
        employeeName: "EmployeeA",
        photoFilePath:
          "https://thuthuatnhanh.com/wp-content/uploads/2018/07/avatar-girl-xinh-cute.jpg",
        employeeDepartments: {
          departmentId: 1,
          departmentName: "departmentNameA",
          positionName: "positionA",
        },
        isBusy: true,
      },
      {
        employeeId: 2,
        employeeName: "EmployeeB",
        photoFilePath:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQRdZ9mBq4RrYJojGUOngp5neYPFpSUIiYrOeamRy4OF87bxNnG&usqp=CAU",
        employeeDepartments: {
          departmentId: 2,
          departmentName: "departmentNameB",
          positionName: "positionB",
        },
        isBusy: true,
      },
      {
        employeeId: 3,
        employeeName: "EmployeeC",
        photoFilePath:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQRdZ9mBq4RrYJojGUOngp5neYPFpSUIiYrOeamRy4OF87bxNnG&usqp=CAU",
        employeeDepartments: {
          departmentId: 2,
          departmentName: "departmentNameB",
          positionName: "positionB",
        },
        isBusy: true,
      },
      {
        employeeId: 4,
        employeeName: "EmployeeD",
        photoFilePath:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQRdZ9mBq4RrYJojGUOngp5neYPFpSUIiYrOeamRy4OF87bxNnG&usqp=CAU",
        employeeDepartments: {
          departmentId: 1,
          departmentName: "departmentNameA",
          positionName: "positionA",
        },
        isBusy: true,
      },
      {
        employeeId: 5,
        employeeName: "EmployeeE",
        photoFilePath:
          "https://thuthuatnhanh.com/wp-content/uploads/2018/07/avatar-girl-xinh-cute.jpg",
        employeeDepartments: {
          departmentId: 1,
          departmentName: "departmentNameA",
          positionName: "positionA",
        },
        isBusy: true,
      },
    ],
    departments: [],
    groups: [],
  },
};
