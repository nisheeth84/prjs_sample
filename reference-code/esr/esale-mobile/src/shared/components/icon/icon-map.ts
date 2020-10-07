import { ImageSourcePropType } from "react-native";

export type AvailableIcons =
  | "add"
  | "addActive"
  | "addCircleOutline"
  | "refresh"
  | "search"
  | "ascending"
  | "ascendingActive"
  | "check"
  | "calendar"
  | "close"
  | "businessCard"
  | "closeActive"
  | "dashboard"
  | "configuration"
  | "configurationActive"
  | "copy"
  | "copyActive"
  | "delete"
  | "deleteActive"
  | "descending"
  | "descendingActive"
  | "detailSearch"
  | "detailSearchActive"
  | "edit"
  | "editActive"
  | "erase"
  | "eraseActive"
  | "earth"
  | "filter"
  | "filterActive"
  | "file"
  | "help"
  | "helpActive"
  | "image"
  | "integration"
  | "integrationActive"
  | "link"
  | "linkActive"
  | "list"
  | "menu"
  | "milestone"
  | "milestoneActive"
  | "not"
  | "noteActive"
  | "notice"
  | "noticeActive"
  | "other"
  | "preNext"
  | "preNextActive"
  | "quote"
  | "quoteActive"
  | "reaction"
  | "reactionActive"
  | "remove"
  | "removeActive"
  | "reply"
  | "replyActive"
  | "share"
  | "shareActive"
  | "timeline"
  | "timelineActive"
  | "arrowRight"
  | "arrowDown"
  | "arrowUp"
  | "arrowLeft"
  | "beginnerPerson"
  | "response"
  | "logout"
  | "activities"
  | "activityAdd"
  | "activityArrowDownSign"
  | "activityShoppingGreen"
  | "activityShoppingPink"
  | "activityClose"
  | "activityRemove"
  | "activityUserSmall"
  | "activityRun"
  | "activityComment"
  | "activityQuote"
  | "activityShare"
  | "activitySmile"
  | "activityStar"
  | "activitySearchAd"
  | "activitySearch"
  | "activityUser"
  | "activityPen"
  | "closeCircle"
  | "icClose"
  | "icBook"
  | "icOther"
  | "checkActive"
  | "checkDone"
  | "emojiAngry"
  | "emojiHappy"
  | "responsePencil"
  | "favourite"
  | "unFavourite"
  | "back"
  | "backArrow"
  | "next"
  | "closer"
  | "warning"
  | "fowardArrow"
  | "userAvatar"
  | "analysis"
  | "attendance"
  | "customer"
  | "email"
  | "employees"
  | "expansionSheet"
  | "extendedApplication"
  | "commodity"
  | "task"
  | "transactionManagement"
  | "lock"
  | "bigBell"
  | "languageTime"
  | "start"
  | "unStart"
  | "people"
  | "people1"
  | "people2"
  | "business"
  | "fab"
  | "icMenu"
  | "icSmile"
  | "icStar"
  | "icComment"
  | "bin"
  | "doubleQuotes"
  | "startIc"
  | "addIc"
  | "emailIc"
  | "phone"
  | "activeSortAscending"
  | "inActiveSortAscending"
  | "inActiveSortDescending"
  | "activeSortDescending"
  | "filterFalse"
  | "filterTrue"
  | "headerMenu"
  | "ppt"
  | "xls"
  | "doc"
  | "etc"
  | "pdf"
  | "landline"
  | "comment"
  | "emoji"
  | "options"
  | "detail"
  | "tagIcon"
  | "textIcon"
  | "groupIcon"
  | "attach"
  | "dashWord"
  | "iconFinderBold"
  | "iconFinderItalic"
  | "zoomOut"
  | "ERR"
  | "WAR"
  | "SUS"
  | "INF"
  | "human"
  | "yellowStar"
  | "grayStar"
  | "tabEdit"
  | "information"
  | "checkedGroupItem"
  | "uncheckedGroupItem"
  | "callIcon"
  | "emailIcon"
  | "arrowBack"
  | "circleCheck"
  | "selected"
  | "unchecked"
  | "total"
  | "total_press"
  | "favourite_false"
  | "favourite_press"
  | "favourite_false_press"
  | "attend"
  | "attend_press"
  | "absent"
  | "absent_press"
  | "up"
  | "up_press"
  | "dow"
  | "dow_press"
  | "icArrow"
  | "icFlagRed"
  | "icFlagGreenCheck"
  | "icFlagGreen"
  | "icChecklist"
  | "icList"
  | "icMiss"
  | "icPerson"
  | "icMr"
  | "circle"
  | "ellipseBlue"
  | "iconDelete"
  | "verticalLine"
  | "address"
  | "edit_selected"
  | "avatarEmployee"
  | "icon_modal"
  | "closeSearch"
  | "closeGroup"
  | "iconArrowRight"
  | "commentPress"
  | "forward"
  | "forwardPress"
  | "starIc"
  | "iconEmployee"
  | "productTrading"
  | "milestoneRelation";

// export type IconPack = Map<string, ImageSourcePropType>;

export const iconMap = new Map(
  Object.entries<ImageSourcePropType>({
    fowardArrow: require("../../../../assets/icons/foward_arrow.png"),
    add: require("../../../../assets/icons/add.png"),
    addActive: require("../../../../assets/icons/add_active.png"),
    addCircleOutline: require("../../../../assets/icons/add_circle_outline.png"),
    refresh: require("../../../../assets/icons/refresh.png"),
    search: require("../../../../assets/icons/search.png"),
    ascending: require("../../../../assets/icons/ascending.png"),
    ascendingActive: require("../../../../assets/icons/ascending_active.png"),
    close: require("../../../../assets/icons/close.png"),
    businessCard: require("../../../../assets/icons/business_card.png"),
    check: require("../../../../assets/icons/check.png"),
    checkv2: require("../../../../assets/icons/check_v2.png"),
    calendar: require("../../../../assets/icons/calendar.png"),
    closeActive: require("../../../../assets/icons/close_active.png"),
    configuration: require("../../../../assets/icons/configuration.png"),
    configurationActive: require("../../../../assets/icons/configuration_active.png"),
    copy: require("../../../../assets/icons/copy.png"),
    copyActive: require("../../../../assets/icons/copy_active.png"),
    dashboard: require("../../../../assets/icons/dashboard.png"),
    delete: require("../../../../assets/icons/delete.png"),
    deleteActive: require("../../../../assets/icons/delete_active.png"),
    descending: require("../../../../assets/icons/descending.png"),
    descendingActive: require("../../../../assets/icons/descending_active.png"),
    detailSearch: require("../../../../assets/icons/detail_search.png"),
    detailSearchActive: require("../../../../assets/icons/detail_search_active.png"),
    edit: require("../../../../assets/icons/edit.png"),
    editActive: require("../../../../assets/icons/edit_active.png"),
    erase: require("../../../../assets/icons/erase.png"),
    eraseActive: require("../../../../assets/icons/erase_active.png"),
    earth: require("../../../../assets/icons/earth.png"),
    filter: require("../../../../assets/icons/filter.png"),
    filterActive: require("../../../../assets/icons/filter_active.png"),
    file: require("../../../../assets/icons/file.png"),
    help: require("../../../../assets/icons/help.png"),
    helpActive: require("../../../../assets/icons/help_active.png"),
    image: require("../../../../assets/icons/image.png"),
    integration: require("../../../../assets/icons/integration.png"),
    integrationActive: require("../../../../assets/icons/integration_active.png"),
    link: require("../../../../assets/icons/link.png"),
    linkActive: require("../../../../assets/icons/link_active.png"),
    list: require("../../../../assets/icons/list.png"),
    menu: require("../../../../assets/icons/menu.png"),
    milestone: require("../../../../assets/icons/milestone.png"),
    milestoneActive: require("../../../../assets/icons/milestone_active.png"),
    note: require("../../../../assets/icons/note.png"),
    noteActive: require("../../../../assets/icons/note_active.png"),
    notice: require("../../../../assets/icons/notice.png"),
    noticeActive: require("../../../../assets/icons/notice_active.png"),
    other: require("../../../../assets/icons/other.png"),
    preNext: require("../../../../assets/icons/pre_next.png"),
    preNextActive: require("../../../../assets/icons/pre_next_active.png"),
    quote: require("../../../../assets/icons/quote.png"),
    quoteActive: require("../../../../assets/icons/quote_active.png"),
    reaction: require("../../../../assets/icons/reaction.png"),
    reactionActive: require("../../../../assets/icons/reaction_active.png"),
    remove: require("../../../../assets/icons/remove.png"),
    removeActive: require("../../../../assets/icons/remove_active.png"),
    reply: require("../../../../assets/icons/reply.png"),
    replyActive: require("../../../../assets/icons/reply_active.png"),
    share: require("../../../../assets/icons/share.png"),
    shareActive: require("../../../../assets/icons/share_active.png"),
    timeline: require("../../../../assets/icons/timeline.png"),
    timelineActive: require("../../../../assets/icons/timeline_active.png"),
    arrowRight: require("../../../../assets/icons/arrow_right.png"),
    arrowLeft: require("../../../../assets/icons/arrow_left.png"),
    arrowDown: require("../../../../assets/icons/arrow_down.png"),
    arrowUp: require("../../../../assets/icons/arrow_up.png"),
    editSelected: require("../../../../assets/icons/edit_selected.png"),
    selected: require("../../../../assets/icons/selected.png"),
    unchecked: require("../../../../assets/icons/unchecked.png"),
    employee: require("../../../../assets/icons/employee.png"),
    warning: require("../../../../assets/icons/warning.png"),
    activities: require("../../../../assets/icons/activities.png"),
    activityAdd: require("../../../../assets/activity/ic_add.png"),
    activityArrowDownSign: require("../../../../assets/activity/ic_arrow_down_sign.png"),
    activityShoppingGreen: require("../../../../assets/activity/ic_shopping_green.png"),
    activityShoppingPink: require("../../../../assets/activity/ic_shopping_pink.png"),
    activityClose: require("../../../../assets/activity/icon_close.png"),
    activityRemove: require("../../../../assets/activity/icon_remove.png"),
    activityUserSmall: require("../../../../assets/activity/icon_user_small.png"),
    activityRun: require("../../../../assets/activity/icon_run.png"),
    activityComment: require("../../../../assets/activity/icon_comment.png"),
    activityQuote: require("../../../../assets/activity/icon_quote.png"),
    activityShare: require("../../../../assets/activity/icon_share.png"),
    activitySmile: require("../../../../assets/activity/icon_smile.png"),
    activityStar: require("../../../../assets/activity/icon_star.png"),
    activitySearchAd: require("../../../../assets/activity/icon-search_ad.png"),
    activitySearch: require("../../../../assets/activity/icon-search.png"),
    activityUser: require("../../../../assets/activity/icon_user.png"),
    activityPen: require("../../../../assets/activity/icon_pen.png"),
    iosMenu: require("../../../../assets/icons/ios_menu.png"),
    closeCircle: require("../../../../assets/icons/close_circle.png"),
    icClose: require("../../../../assets/icons/ic_close.png"),
    icBook: require("../../../../assets/icons/ic_book.png"),
    icOther: require("../../../../assets/icons/ic_other.png"),
    searchIcon: require("../../../../assets/icons/search.png"),
    checkedIcon: require("../../../../assets/icons/selected.png"),
    unCheckedIcon: require("../../../../assets/icons/unchecked.png"),
    activityCalendar: require("../../../../assets/activity/ic-calendar.png"),
    activityTask: require("../../../../assets/activity/ic-task.png"),
    activityFlag: require("../../../../assets/activity/ic-flag-green.png"),
    beginnerPerson: require("../../../../assets/icons/beginner_person.png"),
    response: require("../../../../assets/icons/response.png"),
    logout: require("../../../../assets/icons/logout.png"),
    checkActive: require("../../../../assets/icons/check_active.png"),
    checkDone: require("../../../../assets/icons/check_done.png"),
    emojiAngry: require("../../../../assets/icons/emoji_angry.png"),
    emojiHappy: require("../../../../assets/icons/emoji_happy.png"),
    responsePencil: require("../../../../assets/icons/response_pencil.png"),
    favourite: require("../../../../assets/icons/favourite.png"),
    unFavourite: require("../../../../assets/icons/unFavourite.png"),
    back: require("../../../../assets/icons/back.png"),
    backArrow: require("../../../../assets/icons/back_arrow.png"),
    next: require("../../../../assets/icons/next.png"),
    closer: require("../../../../assets/icons/closer.png"),
    memo: require("../../../../assets/icons/memo.png"),
    plusGray: require("../../../../assets/icons/plus_gray.png"),
    userAvatar: require("../../../../assets/avatar/user.png"),
    analysis: require("../../../../assets/icons/analysis.png"),
    attendance: require("../../../../assets/icons/attendance.png"),
    customer: require("../../../../assets/icons/customer.png"),
    email: require("../../../../assets/icons/email.png"),
    employees: require("../../../../assets/icons/employee.png"),
    expansionSheet: require("../../../../assets/icons/expansion_sheet.png"),
    extendedApplication: require("../../../../assets/icons/extended_application.png"),
    commodity: require("../../../../assets/icons/product.png"),
    task: require("../../../../assets/icons/task.png"),
    transactionManagement: require("../../../../assets/icons/transaction_management.png"),
    icMenu: require("../../../../assets/icons/ic_menu.png"),
    menuHeader: require("../../../../assets/icons/menu_header.png"),
    bell: require("../../../../assets/icons/bell.png"),
    unChecked: require("../../../../assets/icons/unchecked.png"),
    lock: require("../../../../assets/icons/iconLock.png"),
    languageTime: require("../../../../assets/icons/iconLanguage.png"),
    bigBell: require("../../../../assets/icons/iconBell.png"),
    formatText: require("../../../../assets/icons/ic_format_color_text.png"),
    drop: require("../../../../assets/icons/ic_drop.png"),
    uploadFile: require("../../../../assets/icons/ic_attach_file.png"),
    closeWhite: require("../../../../assets/icons/close_white.png"),
    start: require("../../../../assets/icons/start.png"),
    unStart: require("../../../../assets/icons/unStart.png"),
    people: require("../../../../assets/icons/people.png"),
    people1: require("../../../../assets/icons/people1.png"),
    people2: require("../../../../assets/icons/people2.png"),
    business: require("../../../../assets/icons/business.png"),
    fab: require("../../../../assets/icons/fab.png"),
    icSmile: require("../../../../assets/icons/icon_smile.png"),
    icStar: require("../../../../assets/icons/icon_star.png"),
    icComment: require("../../../../assets/icons/icon_comment.png"),
    bin: require("../../../../assets/icons/delete_2.png"),
    doubleQuotes: require("../../../../assets/icons/double_quotes.png"),
    startIc: require("../../../../assets/icons/start_ic.png"),
    addIc: require("../../../../assets/icons/add_ic.png"),
    phone: require("../../../../assets/icons/phone.png"),
    emailIc: require("../../../../assets/icons/email_ic.png"),
    landline: require("../../../../assets/icons/landline.png"),
    activeSortAscending: require("../../../../assets/icons/sorting.png"),
    inActiveSortAscending: require("../../../../assets/icons/sortingA.png"),
    inActiveSortDescending: require("../../../../assets/icons/sorting2.png"),
    activeSortDescending: require("../../../../assets/icons/sortingB.png"),
    filterFalse: require("../../../../assets/icons/filterFalse.png"),
    filterTrue: require("../../../../assets/icons/filterTrue.png"),
    headerMenu: require("../../../../assets/icons/menu_header.png"),
    ppt: require("../../../../assets/icons/ppt.png"),
    xls: require("../../../../assets/icons/xls.png"),
    doc: require("../../../../assets/icons/doc.png"),
    etc: require("../../../../assets/icons/etc.png"),
    pdf: require("../../../../assets/icons/pdf.png"),
    radioSelected: require("../../../../assets/icons/ic_radio_selected.png"),
    radioUnSelected: require("../../../../assets/icons/ic_radio_unselect.png"),
    linePresent: require("../../../../assets/icons/line_present.png"),
    milestoneCalendarOvertime: require("../../../../assets/icons/milestone_calendar_overtime.png"),
    taskComplete: require("../../../../assets/icons/task_complete.png"),
    schedule: require("../../../../assets/icons/schedule.png"),
    taskOvertime: require("../../../../assets/icons/task_over_time.png"),
    milestoneCalendar: require("../../../../assets/icons/milestone_calendar.png"),
    milestoneCalendarComplete: require("../../../../assets/icons/milestone_calendar_complete.png"),
    borderCircle: require("../../../../assets/icons/boder_circle.png"),
    triangleGreen: require("../../../../assets/icons/triangle_green.png"),
    xGreen: require("../../../../assets/icons/×_green.png"),
    circleGreen: require("../../../../assets/icons/circle_green.png"),
    arrowDownBlue: require("../../../../assets/icons/arrowDownBlue.png"),
    options: require("../../../../assets/icons/options.png"),
    iconItemSearch: require("../../../../assets/icons/iconItemSearch.png"),
    comment: require("../../../../assets/icons/comment.png"),
    emoji: require("../../../../assets/icons/emoji.png"),
    detail: require("../../../../assets/icons/detail.png"),
    tagIcon: require("../../../../assets/icons/tag_icon.png"),
    textIcon: require("../../../../assets/icons/text_icon.png"),
    groupIcon: require("../../../../assets/icons/group_icon.png"),
    attach: require("../../../../assets/icons/attach.png"),
    dashWord: require("../../../../assets/icons/dash_word.png"),
    iconFinderBold: require("../../../../assets/icons/iconfinder_format-bold.png"),
    iconFinderItalic: require("../../../../assets/icons/iconfinder_italic.png"),
    zoomOut: require("../../../../assets/icons/zoom_out.png"),
    human: require("../../../../assets/icons/human.png"),
    yellowStar: require("../../../../assets/icons/yellow_star.png"),
    grayStar: require("../../../../assets/icons/gray_star.png"),
    tabEdit: require("../../../../assets/icons/tab_edit.png"),
    information: require("../../../../assets/icons/information.png"),
    checkedGroupItem: require("../../../../assets/icons/checked_group_item.png"),
    uncheckedGroupItem: require("../../../../assets/icons/unchecked_group_item.png"),
    unCheckGroupItem: require("../../../../assets/icons/uncheck_group_item.png"),
    callIcon: require("../../../../assets/icons/call_icon.png"),
    emailIcon: require("../../../../assets/icons/email_icon.png"),
    arrowBack: require("../../../../assets/icons/arrow_back.png"),
    circleCheck: require("../../../../assets/icons/circle_check.png"),
    ERR: require("../../../../assets/icons/ERR.png"),
    WAR: require("../../../../assets/icons/WAR.png"),
    SUS: require("../../../../assets/icons/SUS.png"),
    INF: require("../../../../assets/icons/INF.png"),
    total: require("../../../../assets/icons/total.png"),
    total_press: require("../../../../assets/icons/total_press.png"),
    favourite_false: require("../../../../assets/icons/favourite_false.png"),
    favourite_press: require("../../../../assets/icons/favourite_press.png"),
    favourite_false_press: require("../../../../assets/icons/favourite_false_press.png"),
    attend: require("../../../../assets/icons/attend.png"),
    attend_press: require("../../../../assets/icons/attend_press.png"),
    absent: require("../../../../assets/icons/absent.png"),
    absent_press: require("../../../../assets/icons/absent_press.png"),
    up: require("../../../../assets/icons/up.png"),
    up_press: require("../../../../assets/icons/up_press.png"),
    down: require("../../../../assets/icons/down.png"),
    down_press: require("../../../../assets/icons/down_press.png"),
    icArrow: require("../../../../assets/icons/ic_arrow.png"),
    icArrowDownSign: require("../../../../assets/icons/ic_arrow_down_sign.png"),
    icFlagRed: require("../../../../assets/icons/flag_red.png"),
    icFlagGreenCheck: require("../../../../assets/icons/flag_green_check.png"),
    icFlagGreen: require("../../../../assets/icons/flag_green.png"),
    icChecklist: require("../../../../assets/icons/checklist.png"),
    icList: require("../../../../assets/icons/list.png"),
    icMiss: require("../../../../assets/icons/person1.png"),
    icPerson: require("../../../../assets/icons/person2.png"),
    icMr: require("../../../../assets/icons/person3.png"),
    circle: require("../../../../assets/icons/circle.png"),
    group_661: require('../../../../assets/icons/Group661.png'),
    sortClose: require('../../../../assets/icons/sort_close.png'),
    arowUp: require('../../../../assets/icons/arow_up.png'),
    arowDown: require('../../../../assets/icons/arow_down.png'),
    ellipseBlue: require("../../../../assets/icons/ellipse_blue.png"),
    verticalLine: require("../../../../assets/icons/vertical_line.png"),
    circleCheckSmall: require("../../../../assets/icons/circle_check_small.png"),
    avatarEmployee: require("../../../../assets/avatar_employee.png"),
    iconDelete: require("../../../../assets/icons/icon_delete.png"),
    searchOption: require("../../../../assets/icons/search_option.png"),
    iconCloseExtension: require("../../../../assets/icons/close_extension.png"),
    iconOpenExtension: require("../../../../assets/icons/open_extension.png"),
    NoImage: require("../../../../assets/icons/no_image.png"),
    iconModal: require("../../../../assets/icons/icon_modal.png"),
    closeSearch: require("../../../../assets/icons/close_search.png"),
    closeGroup: require("../../../../assets/icons/close_group.png"),
    iconEmployee: require("../../../../assets/icons/ic_follow_employee.png"),
    cameraCirclerBlue: require("../../../../assets/icons/cameraBlue.png"),
    album: require("../../../../assets/icons/album.png"),
    editBlue: require("../../../../assets/icons/edit_blue.png"),
    commentPress: require("../../../../assets/icons/commentPress.png"),
    forward: require("../../../../assets/icons/forward.png"),
    forwardPress: require("../../../../assets/icons/forwardPress.png"),
    starIc: require("../../../../assets/icons/star-Ic.png"),
    productTrading: require("../../../../assets/icons/product_trading.png"),
    milestoneRelation: require("../../../../assets/icons/ic-milestone.png"),
  })
);