import moment from 'moment';
import _ from 'lodash';

import { LocalNavigation, TabFocus } from '../constants';
import { EmployeeIdsType, ScheduleListType } from '../api/schedule-list-type';
import { ResourceListType } from '../api/resource-list-type';
import { CalenderViewCommon } from '../api/common';
import { GetDataForCalendarByDay } from '../api/get-data-for-calendar-by-day-type';
import { GetResourcesForCalendarByDay } from '../api/get-resources-for-calendar-by-day-type';
import { GetDataForCalendarByList } from '../api/get-data-for-calendar-by-list-type';
import { GetResourcesForCalendarByList } from '../api/get-resources-for-calendar-by-list-type';
import { Images } from '../config';

export class DummyDataOfSchedule {
  private indexSchedule: number;
  private arrayColor: string[];

  constructor() {
    this.indexSchedule = 0;
    this.arrayColor = [
      '#0000FF',
      '#8A2BE2',
      '#A52A2A',
      '#DEB887',
      '#5F9EA0',
      '#7FFF00',
      '#D2691E',
      '#FF7F50',
      '#6495ED',
      '#00008B',
      '#00FFFF',
      '#008B8B',
      '#90EE90',
      '#ADFF2F',
      '#FF6347'
    ];
  }

  private getEmployeeIdsType = (id: number): EmployeeIdsType[] => [{ employeeId: id }];

  public createLocalNavigation = (): LocalNavigation => {
    const localNavigation: LocalNavigation = {
      searchStatic: {
        isAllTime: true,
        isDesignation: true
        // startDate?: any;
        // endDate?: any;
        // viewTab?: any;
        // task?: any;
        // milestone?: any;
        // isAttended?: any;
        // isAbsence?: any;
        // isUnconfirmed?: any;
        // isShared?: any;
      },

      searchDynamic: {
        customersFavourite: [],

        departments: [],

        groups: [],

        scheduleTypes: [],

        equipmentTypes: []
      },
      tabFocus: TabFocus.SCHEDULE
    };
    localNavigation.searchDynamic?.departments?.push({
      departmentId: 1,
      departmentName: 'departmentName 1',
      isSelected: true,
      employees: []
    });
    for (let i = 0; i < 1000; i++) {
      const mcolor = this.arrayColor[i % this.arrayColor.length];
      localNavigation.searchDynamic?.departments![0].employees?.push({
        employeeId: i,
        employeeName: 'employeeName ' + i,
        isSelected: true,
        color: mcolor
      });
    }

    return localNavigation;
  };

  // 7 loai du lieu
  private thamGiaCoMat = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[Tham gia/Co mat]';
    schedule.participationDivision = '00';
    schedule.attendanceDivision = '01';
    schedule.address ="Canh";
    return schedule;
  };

  private chuaXacNhan = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[ThamGia/ChuaXacNhan]';
    schedule.participationDivision = '00';
    schedule.attendanceDivision = '00';
    schedule.isOverDay= true;
    return schedule;
  };

  private vangMat = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[ThamGia/VangMat]';
    schedule.participationDivision = '00';
    schedule.attendanceDivision = '02';
    return schedule;
  };

  private chiaSe = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[ChiaSe]';
    schedule.participationDivision = '01';
    return schedule;
  };

  private trungLapThamGiaCoMat = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[TrungLap]';
    schedule.isDuplicate = true;
    this.thamGiaCoMat(schedule);
    return schedule;
  };

  private trungLapChuaXacNhan = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[TrungLap]';
    schedule.isDuplicate = true;
    this.chuaXacNhan(schedule);
    return schedule;
  };

  // private daBaoCao = (schedule: ScheduleListType): ScheduleListType => {
  //   schedule.itemName = schedule.itemName + '[DaBaoCao]';
  //   schedule.isReportActivity = true;
  //   return schedule;
  // };

  private tao7LoaiChoSchedule = (schedule: ScheduleListType): ScheduleListType[] => {
    const listFunction = [
      this.thamGiaCoMat,
      this.chuaXacNhan,
      this.vangMat,
      this.chiaSe,
      this.trungLapThamGiaCoMat,
      this.trungLapChuaXacNhan
    ];
    const listData: ScheduleListType[] = [];
    for (let i = 4; i < listFunction.length; i++) {
      const newSchedule = listFunction[i](_.cloneDeep(schedule));
      listData.push(newSchedule);
    }
    return listData;
  };
  // ----------- tao 7 loai cong khai
  private congKhai = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[CongKhai(○)]';
    schedule.isPublic = true;
    return schedule;
  };

  private khongCongKhai = (schedule: ScheduleListType): ScheduleListType => {
    if (schedule.isParticipantUser) {
      schedule.itemName = schedule.itemName + '[KoCongKhai(○)]';
    } else {
      schedule.itemName = schedule.itemName + '[KoCongKhai(✘)]';
    }
    schedule.isPublic = false;
    return schedule;
  };

  private cuaMinh = (schedule: ScheduleListType): ScheduleListType => {
    schedule.itemName = schedule.itemName + '[CuaMinh]';
    schedule.isParticipantUser = true;
    return schedule;
  };

  // private cuaNguoiKhac = (schedule: ScheduleListType): ScheduleListType => {
  //   schedule.itemName = schedule.itemName + '[CuaNguoiKhac]';
  //   schedule.isParticipantUser = false;
  //   return schedule;
  // };

  private taoScheduleCuaMinh = (schedule: ScheduleListType): ScheduleListType[] => {
    let listData: ScheduleListType[] = [];
    const mySchedule = this.cuaMinh(schedule);

    // ----------- tao 7 loai cong khai
    const sCuaMinhPublic = this.congKhai(_.cloneDeep(mySchedule));
    const listData7LoaiPublic: ScheduleListType[] = this.tao7LoaiChoSchedule(sCuaMinhPublic);
    listData = listData.concat(listData7LoaiPublic);

    // ----------- tao 7 loai ko cong khai
    const sCuaMinhNotPublic = this.khongCongKhai(_.cloneDeep(mySchedule));
    const listData7LoaiNotPublic: ScheduleListType[] = this.tao7LoaiChoSchedule(sCuaMinhNotPublic);
    listData = listData.concat(listData7LoaiNotPublic);

    return listData;
  };

  private tao3LoaiTask = (schedule: ScheduleListType): ScheduleListType[] => {
    const listData: ScheduleListType[] = [];
    const taksThongThuong: ScheduleListType = _.cloneDeep(schedule);
    taksThongThuong.taskStatus = '00'; // task thong thuong
    taksThongThuong.itemName += '[TaskThongThuong]';
    listData.push(taksThongThuong);
    const taksHoanThanh: ScheduleListType = _.cloneDeep(schedule);
    taksHoanThanh.taskStatus = '01';
    taksHoanThanh.itemName += '[TaskHoanThanh]';
    listData.push(taksHoanThanh);
    const taksQuaHan: ScheduleListType = _.cloneDeep(schedule);
    taksQuaHan.taskStatus = '02';
    taksQuaHan.itemName += '[TaskQuaHan]';
    listData.push(taksQuaHan);

    return listData;
  };
  private taoTaskCuaMinh = (schedule: ScheduleListType): ScheduleListType[] => {
    let listData: ScheduleListType[] = [];
    schedule.itemType = 2;
    // schedule.itemName = 'T' + schedule.itemId;
    const mySchedule = this.cuaMinh(schedule);

    // ----------- tao 7 loai cong khai
    const sCuaMinhPublic = this.congKhai(_.cloneDeep(mySchedule));
    const listData7LoaiPublic: ScheduleListType[] = this.tao3LoaiTask(sCuaMinhPublic);
    listData = listData.concat(listData7LoaiPublic);

    // ----------- tao 7 loai ko cong khai
    const sCuaMinhNotPublic = this.khongCongKhai(_.cloneDeep(mySchedule));
    const listData7LoaiNotPublic: ScheduleListType[] = this.tao3LoaiTask(sCuaMinhNotPublic);
    listData = listData.concat(listData7LoaiNotPublic);

    return listData;
  };

  private tao3LoaiMilestone = (schedule: ScheduleListType): ScheduleListType[] => {
    const listData: ScheduleListType[] = [];
    const taksThongThuong: ScheduleListType = _.cloneDeep(schedule);
    taksThongThuong.milestoneStatus = '00'; // task thong thuong
    taksThongThuong.itemName += '[MilestoneThongThuong]';
    listData.push(taksThongThuong);
    const taksHoanThanh: ScheduleListType = _.cloneDeep(schedule);
    taksHoanThanh.milestoneStatus = '01';
    taksHoanThanh.itemName += '[MilestoneHoanThanh]';
    listData.push(taksHoanThanh);
    const taksQuaHan: ScheduleListType = _.cloneDeep(schedule);
    taksQuaHan.milestoneStatus = '02';
    taksQuaHan.itemName += '[MilestoneQuaHan]';
    listData.push(taksQuaHan);

    return listData;
  };

  private taoMilestoneCuaMinh = (schedule: ScheduleListType): ScheduleListType[] => {
    let listData: ScheduleListType[] = [];
    // schedule.itemType = 2;
    // schedule.itemName = 'M' + schedule.itemId;
    const mySchedule = this.cuaMinh(schedule);

    // ----------- tao 7 loai cong khai
    const sCuaMinhPublic = this.congKhai(_.cloneDeep(mySchedule));
    const listData7LoaiPublic: ScheduleListType[] = this.tao3LoaiMilestone(sCuaMinhPublic);
    listData = listData.concat(listData7LoaiPublic);

    // ----------- tao 7 loai ko cong khai
    const sCuaMinhNotPublic = this.khongCongKhai(_.cloneDeep(mySchedule));
    const listData7LoaiNotPublic: ScheduleListType[] = this.tao3LoaiMilestone(sCuaMinhNotPublic);
    listData = listData.concat(listData7LoaiNotPublic);

    return listData;
  };

  // private taoScheduleCuaNguoiKhac = (schedule: ScheduleListType): ScheduleListType[] => {
  //   let listData: ScheduleListType[] = [];
  //   const mySchedule = this.cuaNguoiKhac(schedule);

  //   // ----------- tao 7 loai cong khai
  //   const sCuaMinhPublic = this.congKhai(_.cloneDeep(mySchedule));
  //   const listData7LoaiPublic: ScheduleListType[] = this.tao7LoaiChoSchedule(sCuaMinhPublic);
  //   listData = listData.concat(listData7LoaiPublic);

  //   // ----------- tao 7 loai ko cong khai
  //   const sCuaMinhNotPublic = this.khongCongKhai(_.cloneDeep(mySchedule));
  //   const listData7LoaiNotPublic: ScheduleListType[] = this.tao7LoaiChoSchedule(sCuaMinhNotPublic);
  //   listData = listData.concat(listData7LoaiNotPublic);

  //   return listData;
  // };

  // private taoTaskCuaNguoiKhac = (schedule: ScheduleListType): ScheduleListType[] => {
  //   let listData: ScheduleListType[] = [];
  //   // schedule.itemType = 2;
  //   // schedule.itemName = 'T' + schedule.itemId;
  //   const mySchedule = this.cuaNguoiKhac(schedule);

  //   // ----------- tao 7 loai cong khai
  //   const sCuaMinhPublic = this.congKhai(_.cloneDeep(mySchedule));
  //   const listData7LoaiPublic: ScheduleListType[] = this.tao3LoaiTask(sCuaMinhPublic);
  //   listData = listData.concat(listData7LoaiPublic);

  //   // ----------- tao 7 loai ko cong khai
  //   const sCuaMinhNotPublic = this.khongCongKhai(_.cloneDeep(mySchedule));
  //   const listData7LoaiNotPublic: ScheduleListType[] = this.tao3LoaiTask(sCuaMinhNotPublic);
  //   listData = listData.concat(listData7LoaiNotPublic);

  //   return listData;
  // };

  // private taoMilestoneCuaNguoiKhac = (schedule: ScheduleListType): ScheduleListType[] => {
  //   let listData: ScheduleListType[] = [];
  //   // schedule.itemType = 2;
  //   // schedule.itemName = 'M' + schedule.itemId;
  //   const mySchedule = this.cuaNguoiKhac(schedule);

  //   // ----------- tao 7 loai cong khai
  //   const sCuaMinhPublic = this.congKhai(_.cloneDeep(mySchedule));
  //   const listData7LoaiPublic: ScheduleListType[] = this.tao3LoaiMilestone(sCuaMinhPublic);
  //   listData = listData.concat(listData7LoaiPublic);

  //   // ----------- tao 7 loai ko cong khai
  //   const sCuaMinhNotPublic = this.khongCongKhai(_.cloneDeep(mySchedule));
  //   const listData7LoaiNotPublic: ScheduleListType[] = this.tao3LoaiMilestone(sCuaMinhNotPublic);
  //   listData = listData.concat(listData7LoaiNotPublic);

  //   return listData;
  // };
  private createBankSchedule = (prifixName?: string): ScheduleListType => {
    const schedule: ScheduleListType = {
      itemType: 3,
      itemId: this.indexSchedule++,
      itemName: (prifixName || 'S') + this.indexSchedule,
      employeeIds: this.getEmployeeIdsType(this.indexSchedule),
      startDate: null,
      finishDate: null,
      itemIcon: Images.schedule.ic_go_out,
      isFullDay: false,
      isOverDay: false,
      isRepeat: false,
      scheduleRepeatId: null,
      scheduleTypeId: null,
      isPublic: true,
      isReportActivity: false,
      isParticipantUser: true,
      isDuplicate: false,
      milestoneStatus: null,
      taskStatus: null,
      participationDivision: null,
      attendanceDivision: null,
      customers: [],
      productTradings: [],

      address: null,
      countBadge: null,
      badgeItemIds: [],

      businessCards: []
    };

    return schedule;
  };

  private createBankResource = (): ResourceListType => {
    const schedule: ResourceListType = {
      resourceId: this.indexSchedule++,
      resourceName: 'R' + this.indexSchedule,
      scheduleId: this.indexSchedule,
      scheduleRepeatId: 0,
      scheduleTypeId: 0,
      scheduleName: 'S' + this.indexSchedule,
      startDateSchedule: null,
      finishDateSchedule: null,
      isRepeat: false,
      startDate: null,
      finishDate: null,
      isOverDay: false,
      itemType: 3,
    };

    return schedule;
  };

  /**
   * initial data of month with param is date
   * @param date
   * @returns dataOfMonth data of month
   */
  private setNormalSchedule = (schedule: ScheduleListType, sDate: any, eDate?: any, isAutoAddName?: boolean) => {
    const startDate = moment(sDate)
      .clone()
      .seconds(0)
      .milliseconds(0);
    // const startHour = 8; // this.getRandomInt(8, 18);
    // startDate.hour(startHour);
    schedule.startDate = startDate.format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(eDate ? eDate : sDate.clone().hour(sDate.hour() + 1));
    //   .clone()
    //   .seconds(0)
    //   .milliseconds(0);

    // const endHour = this.getRandomInt(startHour + 1, 23);
    // startDate.hour(startDate.hour() + 1).minute(15);

    schedule.finishDate = endDate.format('YYYY-MM-DD HH:mm:ss');
    schedule.isFullDay = false;
    schedule.isOverDay = false;
    isAutoAddName && (schedule.itemName = schedule.itemName + '[Normal]');
  };

  /**
   * initial data of month with param is date
   * @param date
   * @returns dataOfMonth data of month
   */
  private setOverSchedule = (schedule: ScheduleListType, date: any, numOver: number) => {
    const startDate = moment(date)
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    schedule.startDate = startDate.format('YYYY-MM-DD HH:mm:ss');
    const endDate = moment(date)
      .add(numOver, 'days')
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0);
    schedule.finishDate = endDate.format('YYYY-MM-DD HH:mm:ss');
    schedule.isFullDay = false;
    schedule.isOverDay = true;
    schedule.itemName = schedule.itemName + '[OverDay]';
  };

  // /**
  //  * initial data of month with param is date
  //  * @param date
  //  * @returns dataOfMonth data of month
  //  */
  // private setFullDaySchedule = (schedule: ScheduleListType, sDate: any, eDate?: any) => {
  //   this.setNormalSchedule(schedule, sDate, eDate, false);
  //   schedule.isFullDay = true;
  //   schedule.itemName = schedule.itemName + '[FullDay]';
  // };

  /**
   * initial data of month with param is date
   * @param date
   * @returns dataOfMonth data of month
   */
  private setFullDayTask = (schedule: ScheduleListType, sDate: any, eDate?: any, status?: string) => {
    this.setNormalSchedule(schedule, sDate, eDate, false);
    schedule.isFullDay = true;
    schedule.itemType = 2; // loai task
    schedule.taskStatus = status || '00'; // trang thai task
    schedule.itemName = schedule.itemName + '[FullDayTask]';
    schedule.address = schedule.itemName + '[FullDayTask]';
  };

  /**
   * initial data of month with param is date
   * @param date
   * @returns dataOfMonth data of month
   */
  private setFullDayMIlstone = (schedule: ScheduleListType, sDate: any, eDate?: any, status?: string) => {
    this.setNormalSchedule(schedule, sDate, eDate, false);
    schedule.isFullDay = true;
    schedule.itemType = 1; // loai Milstone
    schedule.taskStatus = status || '00'; // trang thai task
    schedule.itemName = schedule.itemName + '[FullDayMilstone]';
  };

  /**
   * initial data of month with param is date
   * @param date
   * @returns dataOfMonth data of month
   */
  // private setOverTask = (schedule: ScheduleListType, date: any, numOver: number, status?: string) => {
  //   const startDate = moment(date)
  //     .clone()
  //     .hours(0)
  //     .minutes(0)
  //     .seconds(0)
  //     .milliseconds(0);
  //   schedule.startDate = startDate.format('YYYY-MM-DD HH:mm:ss');
  //   const endDate = moment(date)
  //     .add(numOver, 'days')
  //     .clone()
  //     .hours(0)
  //     .minutes(0)
  //     .seconds(0)
  //     .milliseconds(0);
  //   schedule.finishDate = endDate.format('YYYY-MM-DD HH:mm:ss');
  //   schedule.isFullDay = false;
  //   schedule.isOverDay = true;
  //   schedule.itemType = 2;
  //   schedule.taskStatus = status || '00';
  //   schedule.itemName = schedule.itemName + '[OverDayTask]';
  // };

  // /**
  //  * initial data of month with param is date
  //  * @param date
  //  * @returns dataOfMonth data of month
  //  */
  // private setOverMilstone = (schedule: ScheduleListType, date: any, numOver: number, status?: string) => {
  //   const startDate = moment(date)
  //     .clone()
  //     .hours(0)
  //     .minutes(0)
  //     .seconds(0)
  //     .milliseconds(0);
  //   schedule.startDate = startDate.format('YYYY-MM-DD HH:mm:ss');
  //   const endDate = moment(date)
  //     .add(numOver, 'days')
  //     .clone()
  //     .hours(0)
  //     .minutes(0)
  //     .seconds(0)
  //     .milliseconds(0);
  //   schedule.finishDate = endDate.format('YYYY-MM-DD HH:mm:ss');
  //   schedule.isFullDay = false;
  //   schedule.isOverDay = true;
  //   schedule.itemType = 1;
  //   schedule.taskStatus = status || '00';
  //   schedule.itemName = schedule.itemName + '[OverDayMilstone]';
  // };

  // /**
  //  * initial data of month with param is date
  //  * @param date
  //  * @returns dataOfMonth data of month
  //  */
  // private setOverResource = (schedule: ResourceListType, date: any, numOver: number) => {
  //   const startDate = moment(date)
  //     .clone()
  //     .hours(0)
  //     .minutes(0)
  //     .seconds(0)
  //     .milliseconds(0);
  //   schedule.startDate = startDate.format('YYYY-MM-DD HH:mm:ss');
  //   const endDate = moment(date)
  //     .add(numOver, 'days')
  //     .clone()
  //     .hours(0)
  //     .minutes(0)
  //     .seconds(0)
  //     .milliseconds(0);
  //   schedule.finishDate = endDate.format('YYYY-MM-DD HH:mm:ss');
  //   schedule.isOverDay = true;
  //   schedule.resourceName = schedule.resourceName + '[OverDay]';
  // };

  // const startDate = moment('2020/03/29');
  private getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
  };

  private createApiHeaderDay = (sDate: moment.Moment) => {
    const apiHeaderDayType: GetDataForCalendarByDay  = {
      date: sDate.format('YYYY-MM-DD HH:mm:ss'),
      dateByDay: sDate.format('YYYY-MM-DD HH:mm:ss'),
      perpetualCalendar: 'Tot',
      holidayName: 'Quoc Khanh',
      isWeekend: sDate.day() === 0 || sDate.day() === 6,
      isHoliday: false,
      companyHolidayName: 'Thanh lap cong ty',
      isCompanyHoliday: false
    };

    return apiHeaderDayType;
  };

  public createDataOfDay = (sDate: moment.Moment): GetDataForCalendarByDay => {
    const startOfView = sDate.clone(); // .startOf('month').startOf('isoWeek');
    const endOfView = sDate.clone(); // .endOf('month').endOf('isoWeek');

    const dataApi: GetDataForCalendarByDay = this.createApiHeaderDay(startOfView);
    dataApi.itemList = [];

    const startDate = startOfView
      .clone()
      .hours(9)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .subtract(2, 'days');
    const endDate = endOfView
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .add(1, 'days');
    const maxDate = Math.abs(CalenderViewCommon.getDaysDiff(startDate, endDate));

    for (let day = 0; day <= maxDate; day++) {
      const dateSet = startDate.clone().add(day, 'days');

      if (
        CalenderViewCommon.compareDateByDay(dateSet, startOfView) >= 0 &&
        CalenderViewCommon.compareDateByDay(dateSet, endOfView) <= 0
      ) {
        // const maxNormal = 1; // getRandomInt(0, 100);
        // for (let i = 0; i < maxNormal; i++) {
          const schedule2: ScheduleListType = this.createBankSchedule();
          this.setNormalSchedule(
            schedule2,
            dateSet
              .clone()
              .hour(8)
              .minute(15),
            dateSet
              .clone()
              .hour(9)
              .minute(15)
          );
          dataApi.itemList.push(schedule2);

          const schedule3: ScheduleListType = this.createBankSchedule();
          this.setNormalSchedule(
            schedule3,
            dateSet
              .clone()
              .hour(8)
              .minute(45),
            dateSet
              .clone()
              .hour(9)
              .minute(15)
          );
          dataApi.itemList.push(schedule3);

        //   const schedule4: ScheduleListType = this.createBankSchedule();
        //   this.setNormalSchedule(
        //     schedule4,
        //     dateSet
        //       .clone()
        //       .hour(9)
        //       .minute(15),
        //     dateSet
        //       .clone()
        //       .hour(10)
        //       .minute(0)
        //   );
        //   dataApi.itemList.push(schedule4);
        // }

        
        // SCHEDULE qua ngay (tuan 3)
        // cua minh chua bao cao
        // const scheduleLoop: ScheduleListType = this.createBankSchedule();
        // this.setNormalSchedule(
        //   scheduleLoop,
        //   dateSet
        //     .clone()
        //     .add(8, 'day')
        //     .hour(10),
        //   2
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoScheduleCuaMinh(scheduleLoop));

        // cua nguoi khac da bao cao
        // const schedule1DaBaoCao: ScheduleListType = this.createBankSchedule();
        // this.setNormalSchedule(
        //   schedule1DaBaoCao,
        //   dateSet
        //     .clone()
        //     .add(0, 'day')
        //     .hour(10)
        // );
        // this.daBaoCao(schedule1DaBaoCao);
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaMinh(schedule1DaBaoCao));

        // milstone
        const milstoneFullDay: ScheduleListType = this.createBankSchedule('M');
        this.setFullDayMIlstone(
          milstoneFullDay,
          dateSet
            .clone()
            .add(0, 'days')
            .hour(10),
          null,
          '00' // task thong thuong
        );
        dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaMinh(milstoneFullDay));

        // task orver day
        // const milstoneOverDay: ScheduleListType = this.createBankSchedule('M');
        // this.setOverMilstone(
        //   milstoneOverDay,
        //   dateSet
        //     .clone()
        //     .add(29, 'days')
        //     .hour(10),
        //   2,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaMinh(milstoneOverDay));

        // const milstoneFullDay1: ScheduleListType = this.createBankSchedule('M');
        // this.setFullDayMIlstone(
        //   milstoneFullDay1,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   null,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaNguoiKhac(milstoneFullDay1));

        // task orver day
        // const milstoneOverDay1: ScheduleListType = this.createBankSchedule('M');
        // this.setOverMilstone(
        //   milstoneOverDay1,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   2,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaNguoiKhac(milstoneOverDay1));
      }

      // const maxOver = 5; // this.getRandomInt(0, 5);
      // for (let i = 0; i < maxOver; i++) {
      //   const scheduleOver = this.createBankSchedule();
      //   const dateSetOver = startDate.clone().add(day, 'days');
      //   this.setOverSchedule(scheduleOver, dateSetOver, this.getRandomInt(1, 5));
      //   dataApi.itemList.push(scheduleOver);
      // }
        // milstone
        // const milstoneFullDay: ScheduleListType = this.createBankSchedule('M');
        // this.setFullDayMIlstone(
        //   milstoneFullDay,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   null,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList!.concat(this.taoMilestoneCuaMinh(milstoneFullDay));
        // task orver day
        // const milstoneOverDay1: ScheduleListType = this.createBankSchedule('M');
        // this.setOverMilstone(
        //   milstoneOverDay1,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   2,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaNguoiKhac(milstoneOverDay1));
    }

    return dataApi;
  };

  public createDataOfDayResource = (sDate: moment.Moment): GetResourcesForCalendarByDay => {
    const startOfView = sDate.clone(); // .startOf('month').startOf('isoWeek');
    const endOfView = sDate.clone(); // .endOf('month').endOf('isoWeek');

    const dataApi: GetResourcesForCalendarByDay = this.createApiHeaderDay(startOfView);
    dataApi.resourceList = [];

    const startDate = startOfView
      .clone()
      .hours(9)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .subtract(2, 'days');
    const endDate = endOfView
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .add(1, 'days');
    const maxDate = Math.abs(CalenderViewCommon.getDaysDiff(startDate, endDate));

    for (let day = 0; day <= maxDate; day++) {
      const dateSet = startDate.clone().add(day, 'days');

      if (
        CalenderViewCommon.compareDateByDay(dateSet, startOfView) >= 0 &&
        CalenderViewCommon.compareDateByDay(dateSet, endOfView) <= 0
      ) {
        // const maxNormal = 1; // getRandomInt(0, 100);
       // for (let i = 0; i < maxNormal; i++) {
          const schedule2: ScheduleListType = this.createBankResource();
          this.setNormalSchedule(
            schedule2,
            dateSet
              .clone()
              .hour(8)
              .minute(15),
            dateSet
              .clone()
              .hour(9)
              .minute(15)
          );
          dataApi.resourceList.push(schedule2);

          const schedule3: ScheduleListType = this.createBankResource();
          this.setNormalSchedule(
            schedule3,
            dateSet
              .clone()
              .hour(8)
              .minute(45),
            dateSet
              .clone()
              .hour(9)
              .minute(15)
          );
          dataApi.resourceList.push(schedule3);

          const schedule4: ScheduleListType = this.createBankResource();
          this.setNormalSchedule(
            schedule4,
            dateSet
              .clone()
              .hour(9)
              .minute(15),
            dateSet
              .clone()
              .hour(10)
              .minute(0)
          );
          dataApi.resourceList.push(schedule4);
        //}
      }

     //  const maxOver = 5; // this.getRandomInt(0, 5);
     // for (let i = 0; i < maxOver; i++) {
     // const scheduleOver = this.createBankResource();
     //   const dateSetOver = startDate.clone().add(day, 'days');
     //   this.setOverSchedule(scheduleOver, dateSetOver, this.getRandomInt(1, 5));
     //   dataApi.resourceList.push(scheduleOver);
     // }
    }

    return dataApi;
  };

  public createDataOfList = (sDate: moment.Moment, num: number): GetDataForCalendarByList => {
    const dataApi: GetDataForCalendarByList = {
      dateFromData: null,
      dateToData: null,
      isGetMoreData: true,
      dateList: [],
      itemList: [],
      countSchedule: 0
    };

    const startOfView = sDate.clone(); // .startOf('month').startOf('isoWeek');
    const endOfView = sDate.clone().add(num, 'days'); // .endOf('month').endOf('isoWeek');
    dataApi.dateFromData = startOfView.format('YYYY-MM-DD HH:mm:ss');
    dataApi.dateToData = endOfView.format('YYYY-MM-DD HH:mm:ss');

    for (let day = 0; day <= num; day++) {
      const dateSet = startOfView.clone().add(day, 'days');
      dataApi.dateList!.push(this.createApiHeaderDay(dateSet));
    }
    const startDate = startOfView
      .clone()
      .hours(9)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .subtract(2, 'days');
    const endDate = endOfView
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .add(1, 'days');
    const maxDate = Math.abs(CalenderViewCommon.getDaysDiff(startDate, endDate));

    for (let day = 0; day <= maxDate; day++) {
      const dateSet = startDate.clone().add(day, 'days');

      if (
        CalenderViewCommon.compareDateByDay(dateSet, startOfView) >= 0 &&
        CalenderViewCommon.compareDateByDay(dateSet, endOfView) <= 0
      ) {
        // const maxNormal = this.getRandomInt(0, 5);
        // for (let i = 0; i < maxNormal; i++) {
        //   const schedule2: ScheduleListType = this.createBankSchedule();
        //   this.setNormalSchedule(
        //     schedule2,
        //     dateSet
        //       .clone()
        //       .hour(8)
        //       .minute(15),
        //     dateSet
        //       .clone()
        //       .hour(9)
        //       .minute(15)
        //   );
        //   dataApi.itemList!.push(schedule2);

        //   const schedule3: ScheduleListType = this.createBankSchedule();
        //   this.setNormalSchedule(
        //     schedule3,
        //     dateSet
        //       .clone()
        //       .hour(8)
        //       .minute(45),
        //     dateSet
        //       .clone()
        //       .hour(9)
        //       .minute(15)
        //   );
        //   dataApi.itemList!.push(schedule3);

        //   const schedule4: ScheduleListType = this.createBankSchedule();
        //   this.setNormalSchedule(
        //     schedule4,
        //     dateSet
        //       .clone()
        //       .hour(9)
        //       .minute(15),
        //     dateSet
        //       .clone()
        //       .hour(10)
        //       .minute(0)
        //   );
        //   dataApi.itemList!.push(schedule4);
        // }

        // const maxOver = this.getRandomInt(0, 5);
        // for (let i = 0; i < maxOver; i++) {
        //   const scheduleOver = this.createBankSchedule();
        //   const dateSetOver = startDate.clone().add(day, 'days');
        //   this.setOverSchedule(scheduleOver, dateSetOver, this.getRandomInt(1, 5));
        //   dataApi.itemList!.push(scheduleOver);
        // }
        // SCHEDULE THONG THUONG (tuan 1)
        // cua minh chua bao cao
        // const schedule: ScheduleListType = this.createBankSchedule();
        // this.setNormalSchedule(schedule, dateSet.clone().hour(10));
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaMinh(schedule));

        // // cua minh da bao
        // const scheduleDaBaoCao: ScheduleListType = this.createBankSchedule();
        // this.setNormalSchedule(
        //   scheduleDaBaoCao,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10)
        // );
        // this.daBaoCao(scheduleDaBaoCao);
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaMinh(scheduleDaBaoCao));

        // cua nguoi khac chua bao cao
        // const schedule1: ScheduleListType = this.createBankSchedule();
        // this.setNormalSchedule(
        //   schedule1,
        //   dateSet
        //     .clone()
        //     .add(2, 'day')
        //     .hour(10)
        // );
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaNguoiKhac(schedule1));

        // cua nguoi khac da bao cao
        // const schedule1DaBaoCao: ScheduleListType = this.createBankSchedule();
        // this.setNormalSchedule(
        //   schedule1DaBaoCao,
        //   dateSet
        //     .clone()
        //     .add(3, 'day')
        //     .hour(10)
        // );
        // this.daBaoCao(schedule1DaBaoCao);
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaNguoiKhac(schedule1DaBaoCao));

        // SCHEDULE Full day (tuan 2)
        // cua minh chua bao cao

        // const scheduleFullDay: ScheduleListType = this.createBankSchedule();
        // this.setFullDaySchedule(
        //   scheduleFullDay,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10)
        // );
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaMinh(scheduleFullDay));

        // cua minh da bao
        // const scheduleDaBaoCaoFullDay: ScheduleListType = this.createBankSchedule();
        // this.setFullDaySchedule(
        //   scheduleDaBaoCaoFullDay,
        //   dateSet
        //     .clone()
        //     .add(5, 'days')
        //     .hour(10)
        // );
        // this.daBaoCao(scheduleDaBaoCaoFullDay);
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaMinh(scheduleDaBaoCaoFullDay));

        // task orver day
        // const taskOverDay: ScheduleListType = this.createBankSchedule('T');
        // this.setOverTask(
        //   taskOverDay,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(8),
        //   0,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList!.concat(this.taoTaskCuaMinh(taskOverDay));

        // cua nguoi khac chua bao cao
        // const schedule1FullDay: ScheduleListType = this.createBankSchedule();
        // this.setFullDaySchedule(
        //   schedule1FullDay,
        //   dateSet
        //     .clone()
        //     .add(6, 'day')
        //     .hour(10)
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoScheduleCuaNguoiKhac(schedule1FullDay));

        // cua nguoi khac da bao cao
        // const schedule1DaBaoCaoFullDay: ScheduleListType = this.createBankSchedule();
        // this.setFullDaySchedule(
        //   schedule1DaBaoCaoFullDay,
        //   dateSet
        //     .clone()
        //     .add(7, 'day')
        //     .hour(10)
        // );
        // this.daBaoCao(schedule1DaBaoCaoFullDay);
        // dataApi.itemList = dataApi.itemList.concat(this.taoScheduleCuaNguoiKhac(schedule1DaBaoCaoFullDay));

        // SCHEDULE qua ngay (tuan 3)
        // cua minh chua bao cao
        const scheduleLoop: ScheduleListType = this.createBankSchedule();
        this.setNormalSchedule(
          scheduleLoop,
          dateSet
            .clone()
            .add(1, 'day')
            .hour(10),
          2
        );
        dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaMinh(scheduleLoop));

        // cua minh da bao
        // const scheduleDaBaoCaoLoop: ScheduleListType = this.createBankSchedule();
        // this.setOverSchedule(
        //   scheduleDaBaoCaoLoop,
        //   dateSet
        //     .clone()
        //     .add(1, 'day')
        //     .hour(10),
        //   2
        // );
        // this.daBaoCao(scheduleDaBaoCaoLoop);
        // dataApi.itemList = dataApi.itemList!.concat(this.taoScheduleCuaMinh(scheduleDaBaoCaoLoop));

        // // cua nguoi khac chua bao cao
        // const schedule1Loop: ScheduleListType = this.createBankSchedule();
        // this.setOverSchedule(
        //   schedule1Loop,
        //   dateSet
        //     .clone()
        //     .add(2, 'day')
        //     .hour(10),
        //   2
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoScheduleCuaNguoiKhac(schedule1Loop));

        // cua nguoi khac da bao cao
        // const schedule1DaBaoCaoLoop: ScheduleListType = this.createBankSchedule();
        // this.setOverSchedule(
        //   schedule1DaBaoCaoLoop,
        //   dateSet
        //     .clone()
        //     .add(17, 'day')
        //     .hour(10),
        //   2
        // );
        // this.daBaoCao(schedule1DaBaoCaoLoop);
        // dataApi.itemList = dataApi.itemList.concat(this.taoScheduleCuaNguoiKhac(schedule1DaBaoCaoLoop));

        // Task Full day (tuan 3)
        const taskFullDay: ScheduleListType = this.createBankSchedule('T');
        this.setFullDayTask(
          taskFullDay,
          dateSet
            .clone()
            .hour(10),
          null,
          '00' // task thong thuong
        );
        dataApi.itemList = dataApi.itemList.concat(this.taoTaskCuaMinh(taskFullDay));

        // const taskFullDay1: ScheduleListType = this.createBankSchedule('T');
        // this.setFullDayTask(
        //   taskFullDay1,
        //   dateSet
        //     .clone()
        //     .add(24, 'days')
        //     .hour(10),
        //   null,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoTaskCuaNguoiKhac(taskFullDay1));

        // task orver day
        // const taskOverDay1: ScheduleListType = this.createBankSchedule('T');
        // this.setOverTask(
        //   taskOverDay1,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   2,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList!.concat(this.taoTaskCuaNguoiKhac(taskOverDay1));

        // milstone
        // const milstoneFullDay: ScheduleListType = this.createBankSchedule('M');
        // this.setFullDayMIlstone(
        //   milstoneFullDay,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   null,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList!.concat(this.taoMilestoneCuaMinh(milstoneFullDay));

        // task orver day
        // const milstoneOverDay: ScheduleListType = this.createBankSchedule('M');
        // this.setOverMilstone(
        //   milstoneOverDay,
        //   dateSet
        //     .clone()
        //     .add(29, 'days')
        //     .hour(10),
        //   2,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaMinh(milstoneOverDay));

        // const milstoneFullDay1: ScheduleListType = this.createBankSchedule('M');
        // this.setFullDayMIlstone(
        //   milstoneFullDay1,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   null,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaNguoiKhac(milstoneFullDay1));

        // task orver day
        // const milstoneOverDay1: ScheduleListType = this.createBankSchedule('M');
        // this.setOverMilstone(
        //   milstoneOverDay1,
        //   dateSet
        //     .clone()
        //     .add(1, 'days')
        //     .hour(10),
        //   2,
        //   '00' // task thong thuong
        // );
        // dataApi.itemList = dataApi.itemList.concat(this.taoMilestoneCuaNguoiKhac(milstoneOverDay1));
      }
    }

    return dataApi;
  };

  public createDataOfListResource = (sDate: moment.Moment, num: number): GetResourcesForCalendarByList => {
    const dataApi: GetResourcesForCalendarByList = {
      dateFromData: null,
      dateToData: null,
      isGetMoreData: true,
      dayList: [],
      resourceList: []
    };

    const startOfView = sDate.clone(); // .startOf('month').startOf('isoWeek');
    const endOfView = sDate.clone().add(num, 'days'); // .endOf('month').endOf('isoWeek');
    dataApi.dateFromData = startOfView.format('YYYY-MM-DD HH:mm:ss');
    dataApi.dateToData = endOfView.format('YYYY-MM-DD HH:mm:ss');

    for (let day = 0; day <= num; day++) {
      const dateSet = startOfView.clone().add(day, 'days');
      dataApi.dayList!.push(this.createApiHeaderDay(dateSet));
    }
    const startDate = startOfView
      .clone()
      .hours(9)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .subtract(2, 'days');
    const endDate = endOfView
      .clone()
      .hours(0)
      .minutes(0)
      .seconds(0)
      .milliseconds(0)
      .add(1, 'days');
    const maxDate = Math.abs(CalenderViewCommon.getDaysDiff(startDate, endDate));

    for (let day = 0; day <= maxDate; day++) {
      const dateSet = startDate.clone().add(day, 'days');

      if (
        CalenderViewCommon.compareDateByDay(dateSet, startOfView) >= 0 &&
        CalenderViewCommon.compareDateByDay(dateSet, endOfView) <= 0
      ) {
        const maxNormal = this.getRandomInt(0, 100);
        for (let i = 0; i < maxNormal; i++) {
          const schedule2: ScheduleListType = this.createBankResource();
          this.setNormalSchedule(
            schedule2,
            dateSet
              .clone()
              .hour(8)
              .minute(15),
            dateSet
              .clone()
              .hour(9)
              .minute(15)
          );
          dataApi.resourceList!.push(schedule2);

          const schedule3: ScheduleListType = this.createBankResource();
          this.setNormalSchedule(
            schedule3,
            dateSet
              .clone()
              .hour(8)
              .minute(45),
            dateSet
              .clone()
              .hour(9)
              .minute(15)
          );
          dataApi.resourceList!.push(schedule3);

          const schedule4: ScheduleListType = this.createBankResource();
          this.setNormalSchedule(
            schedule4,
            dateSet
              .clone()
              .hour(9)
              .minute(15),
            dateSet
              .clone()
              .hour(10)
              .minute(0)
          );
          dataApi.resourceList!.push(schedule4);
        }
      }

      const maxOver = this.getRandomInt(0, 5);
      for (let i = 0; i < maxOver; i++) {
        const scheduleOver = this.createBankResource();
        const dateSetOver = startDate.clone().add(day, 'days');
        this.setOverSchedule(scheduleOver, dateSetOver, this.getRandomInt(1, 5));
        dataApi.resourceList!.push(scheduleOver);
      }
    }

    return dataApi;
  };
}
