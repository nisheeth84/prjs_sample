export const TimelineGroupsOfEmployee = {
  timelineGroup: [
    {
      timelineGroupId: 10001,
      timelineGroupName: "社員 A",
      imagePath: "https://avatarfiles.alphacoders.com/791/79102.png",
      inviteId: 10001,
      status: 2,
      authority: 1,
    },
    {
      timelineGroupId: 10002,
      timelineGroupName: "社員 B",
      imagePath:
        "http://hotprintdesign.com/wp-content/uploads/2019/02/Sani-Sebastian.png",
      inviteId: 10002,
      status: 1,
      authority: 2,
    },
    {
      timelineGroupId: 10001,
      timelineGroupName: "社員 C",
      imagePath: "https://avatarfiles.alphacoders.com/791/79102.png",
      inviteId: 10001,
      status: 1,
      authority: 1,
    },
    {
      timelineGroupId: 10002,
      timelineGroupName: "社員 D",
      imagePath:
        "http://hotprintdesign.com/wp-content/uploads/2019/02/Sani-Sebastian.png",
      inviteId: 10002,
      status: 2,
      authority: 1,
    },
    {
      timelineGroupId: 10001,
      timelineGroupName: "社員 E",
      imagePath: "https://avatarfiles.alphacoders.com/791/79102.png",
      inviteId: 10001,
      status: 2,
      authority: 1,
    },
  ],
};

export const timelineGroupDummy = {
  timelineGroup: [
    {
      timelineGroupId: "10001",
      timelineGroupName: "test1",
      comment: "test group1",
      createdDate: "2019-05-12",
      isPublic: true,
      color: "0x00012354",
      imagePath: "/group/ImagePath",
      imageName: "groupImage",
      width: "15px",
      height: "12px",
      changedDate: "2019-05-12",
      invites: [
        {
          inviteId: "1",
          inviteType: "2",
          inviteName: "Dai p1",
          inviteImagePath:
            "http://hotprintdesign.com/wp-content/uploads/2019/02/Sani-Sebastian.png",
          departmentEmployees: [
            {
              employeeId: 1,
              employeeName: "aa",
            },
          ],
          status: "1",
          authority: "1",
        },
        {
          inviteId: "2",
          inviteType: "2",
          inviteName: "Dai p2",
          inviteImagePath:
            "http://hotprintdesign.com/wp-content/uploads/2019/02/Sani-Sebastian.png",
          departmentEmployees: [
            {
              employeeId: 1,
              employeeName: "aa",
            },
          ],
          status: "2",
          authority: "1",
        },
        {
          inviteId: "3",
          inviteType: "1",
          inviteName: "Dai p3",
          inviteImagePath: "/s3/path…",
          departmentEmployees: [
            {
              employeeId: 1,
              employeeName: "aa",
            },
          ],
          status: "1",
          authority: "2",
        },
        {
          inviteId: "4",
          inviteType: "1",
          inviteName: "Dai p4",
          inviteImagePath: "/s3/path…",
          departmentEmployees: [
            {
              employeeId: 1,
              employeeName: "aa",
            },
          ],
          status: "2",
          authority: "2",
        },
        {
          inviteId: "5",
          inviteType: "3",
          inviteName: "abc p5",
          inviteImagePath: "/s3/path…",
          departmentEmployees: [
            {
              employeeId: 1,
              employeeName: "aa",
            },
          ],
          status: "1",
          authority: "2",
        },
        {
          inviteId: "6",
          inviteType: "3",
          inviteName: "abc p6",
          inviteImagePath: "/s3/path…",
          departmentEmployees: [
            {
              employeeId: 1,
              employeeName: "aa",
            },
          ],
          status: "1",
          authority: "2",
        },
      ],
    },
  ],
};
export const timelineGroupOfEmployeeDummy = {
  timelineGroup: [
    {
      timelineGroupId: 10001,
      timelineGroupName: "abc",
      imagePath: "S3/…",
      inviteId: 10001,
      inviteType: 2,
      status: 1,
      authority: 1,
    },
  ],
};