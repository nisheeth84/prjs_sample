export const emojiPopular = [
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Blow_Kiss_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1571606037",
];

export const emoji = [
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Blow_Kiss_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Blow_Kiss_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1571606037",
  "https://i.pinimg.com/originals/99/45/7b/99457b734bbe3178c0f36ae52e97ec31.png",
  "https://i.pinimg.com/originals/6f/b2/5e/6fb25ec688734457311ae5b7278cf8d9.png",
  "https://i.pinimg.com/originals/ff/a4/e8/ffa4e8161253da3663b143158806a2d7.png",
  "https://i.pinimg.com/originals/15/05/d8/1505d854716c5e6e236de2b6cdae28b0.png",
  "https://i.pinimg.com/originals/67/89/05/67890520749355d947192a1e3a941fcf.png",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Blow_Kiss_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Blow_Kiss_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1571606037",
  "https://i.pinimg.com/originals/99/45/7b/99457b734bbe3178c0f36ae52e97ec31.png",
  "https://i.pinimg.com/originals/6f/b2/5e/6fb25ec688734457311ae5b7278cf8d9.png",
  "https://i.pinimg.com/originals/ff/a4/e8/ffa4e8161253da3663b143158806a2d7.png",
  "https://i.pinimg.com/originals/15/05/d8/1505d854716c5e6e236de2b6cdae28b0.png",
  "https://i.pinimg.com/originals/67/89/05/67890520749355d947192a1e3a941fcf.png",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Blow_Kiss_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Blow_Kiss_Emoji_large.png?v=1571606037",
  "https://cdn.shopify.com/s/files/1/1061/1924/products/Heart_Eyes_Emoji_large.png?v=1571606037",
  "https://i.pinimg.com/originals/99/45/7b/99457b734bbe3178c0f36ae52e97ec31.png",
  "https://i.pinimg.com/originals/6f/b2/5e/6fb25ec688734457311ae5b7278cf8d9.png",
  "https://i.pinimg.com/originals/ff/a4/e8/ffa4e8161253da3663b143158806a2d7.png",
];

export const TIMELINE = {
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
  comment:
    "社員Aへの返信ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。",
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
    {
      filePath: "documents/document.docx",
      fileName: "document2.docx",
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
  childTimelines: [
    {
      createdUser: {
        createdUserId: 1,
        createdUserName: "Employee B",
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
          createdUserName: "Employee C",
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
      isStar: false,
      replyCount: 4,
    },
  ],
  commentCount: 5,
};

export const TIMELINE_ARRAY = [
  {
    group: {
      groupId: 1,
      groupImagePath: "/image/image.png",
      groupName: "GroupTimelineA",
    },
    createdUser: {
      createdUserId: -1,
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
    comment:
      "にはテキストが入りまにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますすにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入りますにはテキストが入ります。",
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
    isStar: true,
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
        isStar: false,
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
      createdUserName: "Employee B",
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
    comment:
      "社員Aへの返信ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。",
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
    isStar: true,
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
        isStar: false,
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
      createdUserName: "Employee B",
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
    comment:
      "社員Aへの返信ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。ここにはテキストが入ります。",
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
    isStar: true,
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
        isStar: false,
        replyCount: 4,
      },
    ],
    commentCount: 5,
  },
];

export const COMMENT_DUMMY = {
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
      rootId: null,
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
      isStar: false,
      replyCount: 4,
    },
    {
      createdUser: {
        createdUserId: 1,
        createdUserName: "Employee A",
        createdUserImage: "/image/image.png",
      },
      createdDate: "2020-02-02 20:12:11",
      timelineId: 1000,
      parentId: null,
      rootId: null,
      targerDelivers: [
        {
          targetType: 1,
          targetId: 1000,
          targetName: "AAA",
        },
      ],
      comment: "にはテキストが入ります。ここにはテキストが",
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
      isStar: false,
      replyCount: 4,
    },
  ],
  commentCount: 5,
};

export const TIMELINE_LIST = [
      {
          timelineId: 650,
          parentId: null,
          rootId: null,
          timelineType: [
              {
                  timelineTypeId: 1
              }
          ],
          createdUser: 1,
          createdUserName: 'tesst',
          createdUserPhoto: null,
          createdDate: "2020-07-18T03:32:42Z",
          changedDate: "2020-07-18T09:44:00Z",
          timelineGroupId: 69,
          timelineGroupName: "チャンネルを検索 1",
          color: "#FFE0EB",
          imagePath: null,
          header: null,
          targetDelivers: [
              {
                  targetType: 1,
                  targetId: 1,
                  targetName: null
              },
              {
                  targetType: 4,
                  targetId: 69,
                  targetName: null
              }
          ],
          comment: {
              mode: 2,
              content: "03_タイムライン_110303_タイムライン共有_UT_Event"
          },
          sharedTimeline: {
              timelineId: 390,
              parentId: null,
              rootId: null,
              createdUser: 1,
              createdUserName: null,
              createdUserPhoto: null,
              createdDate: "2020-07-18T03:00:54Z",
              timelineGroupId: 69,
              timelineGroupName: "チャンネルを検索 1",
              imagePath: null,
              header: null,
              comment: {
                  mode: 2,
                  content: "投稿"
              }
          },
          attachedFiles: [
              {
                  fileName: "1_Nguyen_Huy_Binh1_20200718033242476.jpg",
                  filePath: "tenant1/timeline/1_Nguyen_Huy_Binh1_20200718033242476.jpg"
              }
          ],
          reactions: [],
          isFavorite: false,
          commentTimelines: [
              {
                  timelineId: 651,
                  parentId: 650,
                  rootId: 650,
                  createdUser: 1,
                  createdUserName: 'nameCreate',
                  createUserPhoto: null,
                  createdDate: "2020-07-18T03:34:51Z",
                  targetDeliver: [
                      {
                          targetType: 1,
                          targetId: 1,
                          targetName: 'long1'
                      },
                      {
                          targetType: 1,
                          targetId: 1,
                          targetName: 'long2'
                      }
                  ],
                  comment: {
                      mode: 0,
                      content: "comment"
                  },
                  quotedTimeline: {
                      timelineId: null,
                      parentId: null,
                      rootId: null,
                      comment: null,
                      createdUser: null,
                      createdUserName: null,
                      createdUserPhoto: null,
                      createdDate: null
                  },
                  attachedFiles: [],
                  reactions: [],
                  replyTimelines: [
                      {
                        timelineId: 651,
                        parentId: 650,
                        rootId: 650,
                        createdUser: 1,
                        createdUserName: 'repllyname',
                        createUserPhoto: null,
                        createdDate: "2020-07-18T03:34:51Z",
                        targetDeliver: [
                            {
                                targetType: 1,
                                targetId: 1,
                                targetName: 'long1'
                            },
                            {
                                targetType: 1,
                                targetId: 1,
                                targetName: 'long2'
                            }
                        ],
                        comment: {
                            mode: 0,
                            content: "comment reply"
                        },
                        quotedTimeline: {
                            timelineId: null,
                            parentId: null,
                            rootId: null,
                            comment: null,
                            createdUser: null,
                            createdUserName: null,
                            createdUserPhoto: null,
                            createdDate: null
                        },
                        attachedFiles: [],
                        reactions: [],
                        isFavorite: false,
                        updatedDate: null
                    },
                      {
                        timelineId: 651,
                        parentId: 650,
                        rootId: 650,
                        createdUser: 1,
                        createdUserName: 'repllyname',
                        createUserPhoto: null,
                        createdDate: "2020-07-18T03:34:51Z",
                        targetDeliver: [
                            {
                                targetType: 1,
                                targetId: 1,
                                targetName: 'long1'
                            },
                            {
                                targetType: 1,
                                targetId: 1,
                                targetName: 'long2'
                            }
                        ],
                        comment: {
                            mode: 0,
                            content: "comment reply"
                        },
                        quotedTimeline: {
                            timelineId: null,
                            parentId: null,
                            rootId: null,
                            comment: null,
                            createdUser: null,
                            createdUserName: null,
                            createdUserPhoto: null,
                            createdDate: null
                        },
                        attachedFiles: [],
                        reactions: [],
                        isFavorite: false,
                        updatedDate: null
                    },
                  ],
                  isFavorite: false,
                  updatedDate: null
              },
              {
                  timelineId: 652,
                  parentId: 650,
                  rootId: 650,
                  createdUser: 1,
                  createdUserName: null,
                  createUserPhoto: null,
                  createdDate: "2020-07-18T03:34:52Z",
                  targetDelivers: [
                      {
                          targetType: 1,
                          targetId: 1,
                          targetName: null
                      }
                  ],
                  comment: {
                      mode: 0,
                      content: "comment"
                  },
                  quotedTimeline: {
                      timelineId: null,
                      parentId: null,
                      rootId: null,
                      comment: null,
                      createdUser: null,
                      createdUserName: null,
                      createdUserPhoto: null,
                      createdDate: null
                  },
                  attachedFiles: [],
                  reactions: [],
                  replyTimelines: [],
                  isFavorite: false,
                  updatedDate: null
              },
              {
                  timelineId: 739,
                  parentId: 650,
                  rootId: 650,
                  createdUser: 1,
                  createdUserName: null,
                  createUserPhoto: null,
                  createdDate: "2020-07-18T09:44:00Z",
                  targetDelivers: [
                      {
                          targetType: 1,
                          targetId: 1,
                          targetName: null
                      }
                  ],
                  comment: {
                      mode: 0,
                      content: "tạo comment "
                  },
                  quotedTimeline: {
                      timelineId: null,
                      parentId: null,
                      rootId: null,
                      comment: null,
                      createdUser: null,
                      createdUserName: null,
                      createdUserPhoto: null,
                      createdDate: null
                  },
                  attachedFiles: [],
                  reactions: [],
                  replyTimelines: [],
                  isFavorite: false,
                  updatedDate: null
              },
              {
                timelineId: 739,
                parentId: 650,
                rootId: 650,
                createdUser: 1,
                createdUserName: null,
                createUserPhoto: null,
                createdDate: "2020-07-18T09:44:00Z",
                targetDelivers: [
                    {
                        targetType: 1,
                        targetId: 1,
                        targetName: null
                    }
                ],
                comment: {
                    mode: 0,
                    content: "tạo comment "
                },
                quotedTimeline: {
                    timelineId: null,
                    parentId: null,
                    rootId: null,
                    comment: null,
                    createdUser: null,
                    createdUserName: null,
                    createdUserPhoto: null,
                    createdDate: null
                },
                attachedFiles: [],
                reactions: [],
                replyTimelines: [],
                isFavorite: false,
                updatedDate: null
            },
            
          ],
          updatedDate: "2020-07-18T09:44:00Z"
      },
      {
        timelineId: 650,
        parentId: null,
        rootId: null,
        timelineType: [
            {
                timelineTypeId: 1
            }
        ],
        createdUser: 1,
        createdUserName: null,
        createdUserPhoto: null,
        createdDate: "2020-07-18T03:32:42Z",
        changedDate: "2020-07-18T09:44:00Z",
        timelineGroupId: 69,
        timelineGroupName: "チャンネルを検索 1",
        color: "#FFE0EB",
        imagePath: null,
        header: null,
        targetDelivers: [
            {
                targetType: 1,
                targetId: 1,
                targetName: null
            },
            {
                targetType: 4,
                targetId: 69,
                targetName: null
            }
        ],
        comment: {
            mode: 2,
            content: "03_タイムライン_110303_タイムライン共有_UT_Event"
        },
        sharedTimeline: {
            timelineId: 390,
            parentId: null,
            rootId: null,
            createdUser: 1,
            createdUserName: null,
            createdUserPhoto: null,
            createdDate: "2020-07-18T03:00:54Z",
            timelineGroupId: 69,
            timelineGroupName: "チャンネルを検索 1",
            imagePath: null,
            header: null,
            comment: {
                mode: 2,
                content: "投稿"
            }
        },
        attachedFiles: [
            {
                fileName: "1_Nguyen_Huy_Binh1_20200718033242476.jpg",
                filePath: "tenant1/timeline/1_Nguyen_Huy_Binh1_20200718033242476.jpg"
            }
        ],
        reactions: [],
        isFavorite: false,
        commentTimelines: [
            {
                timelineId: 651,
                parentId: 650,
                rootId: 650,
                createdUser: 1,
                createdUserName: 'nameCreate',
                createUserPhoto: null,
                createdDate: "2020-07-18T03:34:51Z",
                targetDeliver: [
                    {
                        targetType: 1,
                        targetId: 1,
                        targetName: 'long1'
                    },
                    {
                        targetType: 1,
                        targetId: 1,
                        targetName: 'long2'
                    }
                ],
                comment: {
                    mode: 0,
                    content: "comment"
                },
                quotedTimeline: {
                    timelineId: null,
                    parentId: null,
                    rootId: null,
                    comment: null,
                    createdUser: null,
                    createdUserName: null,
                    createdUserPhoto: null,
                    createdDate: null
                },
                attachedFiles: [],
                reactions: [],
                replyTimelines: [
                    {
                      timelineId: 651,
                      parentId: 650,
                      rootId: 650,
                      createdUser: 1,
                      createdUserName: 'repllyname',
                      createUserPhoto: null,
                      createdDate: "2020-07-18T03:34:51Z",
                      targetDeliver: [
                          {
                              targetType: 1,
                              targetId: 1,
                              targetName: 'long1'
                          },
                          {
                              targetType: 1,
                              targetId: 1,
                              targetName: 'long2'
                          }
                      ],
                      comment: {
                          mode: 0,
                          content: "comment reply"
                      },
                      quotedTimeline: {
                          timelineId: null,
                          parentId: null,
                          rootId: null,
                          comment: null,
                          createdUser: null,
                          createdUserName: null,
                          createdUserPhoto: null,
                          createdDate: null
                      },
                      attachedFiles: [],
                      reactions: [],
                      isFavorite: false,
                      updatedDate: null
                  },
                    {
                      timelineId: 651,
                      parentId: 650,
                      rootId: 650,
                      createdUser: 1,
                      createdUserName: 'repllyname',
                      createUserPhoto: null,
                      createdDate: "2020-07-18T03:34:51Z",
                      targetDeliver: [
                          {
                              targetType: 1,
                              targetId: 1,
                              targetName: 'long1'
                          },
                          {
                              targetType: 1,
                              targetId: 1,
                              targetName: 'long2'
                          }
                      ],
                      comment: {
                          mode: 0,
                          content: "comment reply"
                      },
                      quotedTimeline: {
                          timelineId: null,
                          parentId: null,
                          rootId: null,
                          comment: null,
                          createdUser: null,
                          createdUserName: null,
                          createdUserPhoto: null,
                          createdDate: null
                      },
                      attachedFiles: [],
                      reactions: [],
                      isFavorite: false,
                      updatedDate: null
                  },
                ],
                isFavorite: false,
                updatedDate: null
            },
            {
                timelineId: 652,
                parentId: 650,
                rootId: 650,
                createdUser: 1,
                createdUserName: null,
                createUserPhoto: null,
                createdDate: "2020-07-18T03:34:52Z",
                targetDelivers: [
                    {
                        targetType: 1,
                        targetId: 1,
                        targetName: null
                    }
                ],
                comment: {
                    mode: 0,
                    content: "comment"
                },
                quotedTimeline: {
                    timelineId: null,
                    parentId: null,
                    rootId: null,
                    comment: null,
                    createdUser: null,
                    createdUserName: null,
                    createdUserPhoto: null,
                    createdDate: null
                },
                attachedFiles: [],
                reactions: [],
                replyTimelines: [],
                isFavorite: false,
                updatedDate: null
            },
            {
                timelineId: 739,
                parentId: 650,
                rootId: 650,
                createdUser: 1,
                createdUserName: null,
                createUserPhoto: null,
                createdDate: "2020-07-18T09:44:00Z",
                targetDelivers: [
                    {
                        targetType: 1,
                        targetId: 1,
                        targetName: null
                    }
                ],
                comment: {
                    mode: 0,
                    content: "tạo comment "
                },
                quotedTimeline: {
                    timelineId: null,
                    parentId: null,
                    rootId: null,
                    comment: null,
                    createdUser: null,
                    createdUserName: null,
                    createdUserPhoto: null,
                    createdDate: null
                },
                attachedFiles: [],
                reactions: [],
                replyTimelines: [],
                isFavorite: false,
                updatedDate: null
            },
            {
              timelineId: 739,
              parentId: 650,
              rootId: 650,
              createdUser: 1,
              createdUserName: null,
              createUserPhoto: null,
              createdDate: "2020-07-18T09:44:00Z",
              targetDelivers: [
                  {
                      targetType: 1,
                      targetId: 1,
                      targetName: null
                  }
              ],
              comment: {
                  mode: 0,
                  content: "tạo comment "
              },
              quotedTimeline: {
                  timelineId: null,
                  parentId: null,
                  rootId: null,
                  comment: null,
                  createdUser: null,
                  createdUserName: null,
                  createdUserPhoto: null,
                  createdDate: null
              },
              attachedFiles: [],
              reactions: [],
              replyTimelines: [],
              isFavorite: false,
              updatedDate: null
          },
          
        ],
        updatedDate: "2020-07-18T09:44:00Z"
    }
]
