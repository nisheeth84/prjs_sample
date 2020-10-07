// import moment from "moment";
// import _ from "lodash";

// import {
//   EmployeeIdsType,
//   ScheduleListType,
// } from "../type";
// import { CalenderViewCommon } from "../calendar-util";
// import { LocalNavigation, TabFocus } from "../../../../../../config/constants/calendar";

// export class DummyDataOfSchedule {
//   private indexSchedule: number;
//   private arrayColor: string[];

//   constructor() {
//     this.indexSchedule = 0;
//     this.arrayColor = [
//       "#0000FF",
//       "#8A2BE2",
//       "#A52A2A",
//       "#DEB887",
//       "#5F9EA0",
//       "#7FFF00",
//       "#D2691E",
//       "#FF7F50",
//       "#6495ED",
//       "#00008B",
//       "#00FFFF",
//       "#008B8B",
//       "#90EE90",
//       "#ADFF2F",
//       "#FF6347",
//     ];
//   }

//   private getEmployeeIdsType = (id: number): EmployeeIdsType[] => [
//     { employeeId: id },
//   ];

//   public createLocalNavigation = (): LocalNavigation => {
//     const localNavigation: LocalNavigation = {
//       searchStatic: {
//         isAllTime: true,
//         isDesignation: true,
//       },

//       searchDynamic: {
//         customersFavourite: [],

//         departments: [],

//         groups: [],

//         scheduleTypes: [],

//         equipmentTypes: [],
//       },
//       tabFocus: TabFocus.Schedule,
//     };
//     localNavigation.searchDynamic?.departments?.push({
//       departmentId: 1,
//       departmentName: "departmentName 1",
//       isSelected: true,
//       employees: [],
//     });
//     for (let i = 0; i < 1000; i++) {
//       const mcolor = this.arrayColor[i % this.arrayColor.length];
//       localNavigation.searchDynamic?.departments![0].employees?.push({
//         employeeId: i,
//         employeeName: "employeeName " + i,
//         isSelected: true,
//         color: mcolor,
//       });
//     }

//     return localNavigation;
//   };

//   // 7 create data
//   private joinPresent = (schedule: ScheduleListType): ScheduleListType => {
//     schedule.itemName = schedule.itemName + "Join/Present";
//     schedule.participationDivision = "00";
//     schedule.attendanceDivision = "01";
//     return schedule;
//   };

//   private joinUnconfimred = (schedule: ScheduleListType): ScheduleListType => {
//     schedule.itemName = schedule.itemName + "Join/Unconfimred";
//     schedule.participationDivision = "00";
//     schedule.attendanceDivision = "00";
//     return schedule;
//   };

//   private absent = (schedule: ScheduleListType): ScheduleListType => {
//     schedule.itemName = schedule.itemName + "Join/Absent";
//     schedule.participationDivision = "00";
//     schedule.attendanceDivision = "02";
//     return schedule;
//   };

//   private share = (schedule: ScheduleListType): ScheduleListType => {
//     schedule.itemName = schedule.itemName + "Share";
//     schedule.participationDivision = "01";
//     return schedule;
//   };

//   private neutralJoinPresent = (
//     schedule: ScheduleListType
//   ): ScheduleListType => {
//     schedule.itemName = schedule.itemName + "Neutral";
//     schedule.isDuplicate = true;
//     this.joinPresent(schedule);
//     return schedule;
//   };

//   private neutralJoinConfimred = (
//     schedule: ScheduleListType
//   ): ScheduleListType => {
//     schedule.itemName = schedule.itemName + "Neutral";
//     schedule.isDuplicate = true;
//     this.joinUnconfimred(schedule);
//     return schedule;
//   };

//   private createSevenTaskSchedule = (
//     schedule: ScheduleListType
//   ): ScheduleListType[] => {
//     const listFunction = [
//       this.joinPresent,
//       this.joinUnconfimred,
//       this.absent,
//       this.share,
//       this.neutralJoinPresent,
//       this.neutralJoinConfimred,
//     ];
//     const listData: ScheduleListType[] = [];
//     for (let i = 4; i < listFunction.length; i++) {
//       const newSchedule = listFunction[i](_.cloneDeep(schedule));
//       listData.push(newSchedule);
//     }
//     return listData;
//   };
//   // ----------- create seven task public
//   private public = (schedule: ScheduleListType): ScheduleListType => {
//     schedule.itemName = schedule.itemName;
//     schedule.isPublic = true;
//     return schedule;
//   };

//   private noPublic = (schedule: ScheduleListType): ScheduleListType => {
//     if (schedule.isParticipantUser) {
//       schedule.itemName = schedule.itemName;
//     } else {
//       schedule.itemName = schedule.itemName;
//     }
//     schedule.isPublic = false;
//     return schedule;
//   };

//   private mine = (schedule: ScheduleListType): ScheduleListType => {
//     schedule.itemName = schedule.itemName;
//     schedule.isParticipantUser = true;
//     return schedule;
//   };

//   private createScheduleMine = (
//     schedule: ScheduleListType
//   ): ScheduleListType[] => {
//     let listData: ScheduleListType[] = [];
//     const mySchedule = this.mine(schedule);

//     // ----------- create seven task public
//     let minePublic = this.public(_.cloneDeep(mySchedule));
//     let listDataSeventTaskPublic: ScheduleListType[] = this.createSevenTaskSchedule(
//       minePublic
//     );
//     listData = listData.concat(listDataSeventTaskPublic);

//     // ----------- create seven task not public
//     let mineNotPublic = this.noPublic(_.cloneDeep(mySchedule));
//     let listDataSevenTaskNotPublic: ScheduleListType[] = this.createSevenTaskSchedule(
//       mineNotPublic
//     );
//     listData = listData.concat(listDataSevenTaskNotPublic);

//     return listData;
//   };

//   private createThreeTask = (
//     schedule: ScheduleListType
//   ): ScheduleListType[] => {
//     const listData: ScheduleListType[] = [];
//     let taksUsually: ScheduleListType = _.cloneDeep(schedule);
//     taksUsually.taskStatus = "00"; // task Usually
//     taksUsually.itemName += "Usually";
//     listData.push(taksUsually);
//     const taskFinish: ScheduleListType = _.cloneDeep(schedule);
//     taskFinish.taskStatus = "01";
//     taskFinish.itemName += "Finish";
//     listData.push(taskFinish);
//     const taskOutOfDate: ScheduleListType = _.cloneDeep(schedule);
//     taskOutOfDate.taskStatus = "02";
//     taskOutOfDate.itemName += "Out of date";
//     listData.push(taskOutOfDate);

//     return listData;
//   };
//   private createTaskMine = (schedule: ScheduleListType): ScheduleListType[] => {
//     let listData: ScheduleListType[] = [];
//     schedule.itemType = 2;
//     // schedule.itemName = 'T' + schedule.itemId;
//     const mySchedule = this.mine(schedule);

//     // ----------- create seven task public
//     const minePublic = this.public(_.cloneDeep(mySchedule));
//     let listDataSevenTaskPublic: ScheduleListType[] = this.createThreeTask(
//       minePublic
//     );
//     listData = listData.concat(listDataSevenTaskPublic);

//     // ----------- create seven task not public
//     const mineNotPublic = this.noPublic(_.cloneDeep(mySchedule));
//     let listDataSevenTaskNotPublic: ScheduleListType[] = this.createThreeTask(
//       mineNotPublic
//     );
//     listData = listData.concat(listDataSevenTaskNotPublic);

//     return listData;
//   };

//   private createThreeMilestone = (
//     schedule: ScheduleListType
//   ): ScheduleListType[] => {
//     const listData: ScheduleListType[] = [];
//     let taksUsually: ScheduleListType = _.cloneDeep(schedule);
//     taksUsually.milestoneStatus = "00"; // task thong thuong
//     taksUsually.itemName += "Milestone Usually";
//     listData.push(taksUsually);
//     let taksFinish: ScheduleListType = _.cloneDeep(schedule);
//     taksFinish.milestoneStatus = "01";
//     taksFinish.itemName += "Milestone Finish";
//     listData.push(taksFinish);
//     let taskOutOfDate: ScheduleListType = _.cloneDeep(schedule);
//     taskOutOfDate.milestoneStatus = "02";
//     taskOutOfDate.itemName += "Milestone Out of date";
//     listData.push(taskOutOfDate);

//     return listData;
//   };

//   private taoMilestoneCuaMinh = (
//     schedule: ScheduleListType
//   ): ScheduleListType[] => {
//     let listData: ScheduleListType[] = [];
//     const mySchedule = this.mine(schedule);

//     // ----------- create seven task public
//     let minePublic = this.public(_.cloneDeep(mySchedule));
//     let listDataSevenTaskPublic: ScheduleListType[] = this.createThreeMilestone(
//       minePublic
//     );
//     listData = listData.concat(listDataSevenTaskPublic);

//     // ----------- create seven task not public
//     let mineNotPublic = this.noPublic(_.cloneDeep(mySchedule));
//     let listDataSevenTaskNotPublic: ScheduleListType[] = this.createThreeMilestone(
//       mineNotPublic
//     );
//     listData = listData.concat(listDataSevenTaskNotPublic);

//     return listData;
//   };

//   private createBankSchedule = (prifixName?: string): ScheduleListType => {
//     const schedule: ScheduleListType = {
//       itemType: 3,
//       itemId: this.indexSchedule++,
//       itemName: (prifixName || "S") + this.indexSchedule,
//       employeeIds: this.getEmployeeIdsType(this.indexSchedule),
//       startDate: null,
//       finishDate: null,
//       itemIcon: require("../../../../../../../assets/icons/ic_user.png"),
//       isFullDay: false,
//       isOverDay: false,
//       isRepeat: false,
//       scheduleRepeatId: null,
//       scheduleTypeId: null,
//       isPublic: true,
//       isReportActivity: false,
//       isParticipantUser: true,
//       isDuplicate: false,
//       milestoneStatus: null,
//       taskStatus: null,
//       participationDivision: null,
//       attendanceDivision: null,
//       customers: [],
//       productTradings: [],

//       address: null,
//       countBadge: null,
//       badgeItemIds: [],

//       businessCards: [],
//     };

//     return schedule;
//   };

//   /**
//    * initial data of month with param is date
//    * @param date
//    * @returns dataOfMonth data of month
//    */
//   private setNormalSchedule = (
//     schedule: ScheduleListType,
//     sDate: any,
//     eDate?: any,
//     isAutoAddName?: boolean
//   ) => {
//     const startDate = moment(sDate).clone().seconds(0).milliseconds(0);
//     // startDate.hour(startHour);
//     schedule.startDate = startDate.format("YYYY-MM-DD HH:mm:ss");
//     const endDate = moment(
//       eDate ? eDate : sDate.clone().hour(sDate.hour() + 1)
//     );

//     schedule.finishDate = endDate.format("YYYY-MM-DD HH:mm:ss");
//     schedule.isFullDay = false;
//     schedule.isOverDay = false;
//     isAutoAddName && (schedule.itemName = schedule.itemName + "[Normal]");
//   };

//   /**
//    * initial data of month with param is date
//    * @param date
//    * @returns dataOfMonth data of month
//    */
//   private setFullDayTask = (
//     schedule: ScheduleListType,
//     sDate: any,
//     eDate?: any,
//     status?: string
//   ) => {
//     this.setNormalSchedule(schedule, sDate, eDate, false);
//     schedule.isFullDay = true;
//     schedule.itemType = 2; // loai task
//     schedule.taskStatus = status || "00"; // trang thai task
//     schedule.itemName = schedule.itemName + "[FullDayTask]";
//   };

//   /**
//    * initial data of month with param is date
//    * @param date
//    * @returns dataOfMonth data of month
//    */
//   private setFullDayMIlstone = (
//     schedule: ScheduleListType,
//     sDate: any,
//     eDate?: any,
//     status?: string
//   ) => {
//     this.setNormalSchedule(schedule, sDate, eDate, false);
//     schedule.isFullDay = true;
//     schedule.itemType = 1; // loai Milstone
//     schedule.taskStatus = status || "00"; // trang thai task
//     schedule.itemName = schedule.itemName + "[FullDayMilstone]";
//   };

//   private createApiHeaderDay = (sDate: moment.Moment) => {
//     const apiHeaderDayType = {
//       dateByDay: sDate.format("YYYY-MM-DD HH:mm:ss"),
//       perpetualCalendar: "負",
//       holidayName: "Quoc Khanh",
//       isWeekend: sDate.day() === 0 || sDate.day() === 6,
//       isHoliday: false,
//       companyHolidayName: "先負",
//       isCompanyHoliday: false,
//     };

//     return apiHeaderDayType;
//   };

//   public createDataOfDay = (sDate: moment.Moment) => {
//     const startOfView = sDate.clone(); // .startOf('month').startOf('isoWeek');
//     const endOfView = sDate.clone(); // .endOf('month').endOf('isoWeek');

//     const dataApi: any = this.createApiHeaderDay(
//       startOfView
//     );
//     dataApi.itemList = [];

//     const startDate = startOfView
//       .clone()
//       .hours(9)
//       .minutes(0)
//       .seconds(0)
//       .milliseconds(0)
//       .subtract(2, "days");
//     const endDate = endOfView
//       .clone()
//       .hours(0)
//       .minutes(0)
//       .seconds(0)
//       .milliseconds(0)
//       .add(1, "days");
//     const maxDate = Math.abs(
//       CalenderViewCommon.getDaysDiff(startDate, endDate)
//     );

//     for (let day = 0; day <= maxDate; day++) {
//       const dateSet = startDate.clone().add(day, "days");

//       if (
//         CalenderViewCommon.compareDateByDay(dateSet, startOfView) >= 0 &&
//         CalenderViewCommon.compareDateByDay(dateSet, endOfView) <= 0
//       ) {
//         // for (let i = 0; i < maxNormal; i++) {
//         const schedule2: ScheduleListType = this.createBankSchedule();
//         this.setNormalSchedule(
//           schedule2,
//           dateSet.clone().hour(8).minute(15),
//           dateSet.clone().hour(9).minute(15)
//         );
//         dataApi.itemList.push(schedule2);

//         const schedule3: ScheduleListType = this.createBankSchedule();
//         this.setNormalSchedule(
//           schedule3,
//           dateSet.clone().hour(8).minute(45),
//           dateSet.clone().hour(9).minute(15)
//         );
//         dataApi.itemList.push(schedule3);

//         // milstone
//         const milstoneFullDay: ScheduleListType = this.createBankSchedule("M");
//         this.setFullDayMIlstone(
//           milstoneFullDay,
//           dateSet.clone().add(0, "days").hour(10),
//           null,
//           "00" // task thong thuong
//         );
//         dataApi.itemList = dataApi.itemList!.concat(
//           this.taoMilestoneCuaMinh(milstoneFullDay)
//         );
//       }
//     }

//     return dataApi;
//   };

//   public createDataOfList = (
//     sDate: moment.Moment,
//     num: number
//   ) => {
//     const dataApi: any = {
//       dateFromData: null,
//       dateToData: null,
//       isGetMoreData: true,
//       dateList: [],
//       itemList: [],
//       countSchedule: 0,
//     };

//     const startOfView = sDate.clone(); // .startOf('month').startOf('isoWeek');
//     const endOfView = sDate.clone().add(num, "days"); // .endOf('month').endOf('isoWeek');
//     dataApi.dateFromData = startOfView.format("YYYY-MM-DD HH:mm:ss");
//     dataApi.dateToData = endOfView.format("YYYY-MM-DD HH:mm:ss");

//     for (let day = 0; day <= num; day++) {
//       const dateSet = startOfView.clone().add(day, "days");
//       dataApi.dateList!.push(this.createApiHeaderDay(dateSet));
//     }
//     const startDate = startOfView
//       .clone()
//       .hours(9)
//       .minutes(0)
//       .seconds(0)
//       .milliseconds(0)
//       .subtract(2, "days");
//     const endDate = endOfView
//       .clone()
//       .hours(0)
//       .minutes(0)
//       .seconds(0)
//       .milliseconds(0)
//       .add(1, "days");
//     const maxDate = Math.abs(
//       CalenderViewCommon.getDaysDiff(startDate, endDate)
//     );

//     for (let day = 0; day <= maxDate; day++) {
//       const dateSet = startDate.clone().add(day, "days");

//       if (
//         CalenderViewCommon.compareDateByDay(dateSet, startOfView) >= 0 && 
//         CalenderViewCommon.compareDateByDay(dateSet, endOfView) <= 0
//       ) {
//         // SCHEDULE by day
//         const scheduleLoop: ScheduleListType = this.createBankSchedule();
//         this.setNormalSchedule(
//           scheduleLoop,
//           dateSet.clone().add(1, "day").hour(10),
//           2
//         );
//         dataApi.itemList = dataApi.itemList!.concat(
//           this.createScheduleMine(scheduleLoop)
//         );

//         // Task Full day
//         const taskFullDay: ScheduleListType = this.createBankSchedule("T");
//         this.setFullDayTask(
//           taskFullDay,
//           dateSet.clone().hour(10),
//           null,
//           "00" // task  usually
//         );
//         dataApi.itemList = dataApi.itemList.concat(
//           this.createTaskMine(taskFullDay)
//         );
//       }
//     }

//     return dataApi;
//   };

// }
