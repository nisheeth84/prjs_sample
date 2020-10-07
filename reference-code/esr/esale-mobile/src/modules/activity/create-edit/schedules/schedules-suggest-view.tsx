import React, { useState, useEffect } from "react"
import {
  SectionList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native"
import Modal from "react-native-modal"
import moment from 'moment'
import { isEqual } from 'lodash'
import { translate } from "../../../../config/i18n"
import { messages } from "../activity-create-edit-messages"
import { theme } from "../../../../config/constants"
import { getHeight, getWidth, normalize } from "../../common"
import { Icon } from "../../../../shared/components/icon"
import { APP_DATE_FORMAT, TEXT_EMPTY } from "../../../../config/constants/constants"
import { getMilestonesSuggestion, getScheduleSuggestions, Schedule, Milestone, Task, GetTasksSuggestion } from "./schedules-suggest-view-repository"
import { TargetReport, IconTargetReport } from "../../constants"
import { useDebounce } from "../../../../config/utils/debounce"
import { useSelector } from "react-redux"
import { activityDetailSelector } from "../../detail/activity-detail-selector"
import { LoadState } from "../../../../types"
import { AppIndicator } from "../../../../shared/components/app-indicator/app-indicator"
import { DetailScreenStyles } from "../../../employees/detail/detail-style"

interface Props {
  customerId?: number | any
  typeSearch?: number | any
  updateSelectedItem: (scheduleItem: any) => void // callback when change status control
}

interface sectionTargetReport {
  icon: string
  title: string
  type: string
  data: []
  renderItem: ({item, index, section : {data}}: any) => any // renderItem({item, index, data}, TargetReport.SCHEDULE)
}

export const ReportSuggestView: React.FC<Props> = (props) => {
  const activityData = useSelector(activityDetailSelector)
  const [searchValue, setSearchValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  /**
   * Object target report selected
   */
  const [selectedItem, setSelectedItem] = useState<any | Schedule | Milestone | Task>({})

  /**
   * schedules from api getSchedulesSuggestions
   */
   const [schedules, setSchedules] = useState<any>([])
  
   /**
   * milestones from api getMilestonesSuggestions
   */
   const [milestones, setMilestones] = useState<any>([])

   /**
   * tasks from api getTasksSuggestions
   */
   const [tasks, setTasks] = useState<any>([])

  /**
   * start offset search API
   */
  const [currentOffset, setCurrentOffset] = useState(0)

  /**
   * true: call API getProductTrading, false: call API getProduct
   */
  const [typeTargetReport, setTypeTargetReport] = useState<string>(TargetReport.SCHEDULE)

  /**
   * Map section of sectionList
   */
  const [contentTargetReport, setContentTargetReport] = useState<Map<string, sectionTargetReport>>(new Map())

  /**
   * Array section of sectionList
   */
  const [arrSectionTargetReport, setArrSectionTargetReport] = useState<sectionTargetReport[]>([])

  /**
   * Status of action call API
   */
  const [loadState, setLoadState] = useState<LoadState>('initial')

  useEffect(() => {
    if (activityData?.schedule) {
      setSelectedItem(activityData.schedule)
      props.updateSelectedItem(activityData.schedule.scheduleId)
    } else if (activityData?.task) {
      setSelectedItem(activityData.task)
      props.updateSelectedItem(activityData.task.taskId)
    } else if (activityData?.milestone) {
      setSelectedItem(activityData.milestone)
      props.updateSelectedItem(activityData.milestone.milestoneId)
    }
  }, [])
  /** 
   * Reset all when customerId changed
   */
  useEffect(() => {
    // Reset all
    setSelectedItem({})
    setSchedules([])
    setMilestones([])
    setTasks([])
    setArrSectionTargetReport([])
    setCurrentOffset(0)
    setTypeTargetReport(TargetReport.SCHEDULE)
    setContentTargetReport(new Map())
  }, [props.customerId])

  /**
   * Update contentTargetReport
   */
  const updateContentTargetReport = () => {
    let mapSection = contentTargetReport
    switch (typeTargetReport) {
      case TargetReport.SCHEDULE:
        mapSection.set(TargetReport.SCHEDULE, {
          icon: IconTargetReport.ACTIVITY_CALENDAR,
          title: translate(messages.scheduleTitle),
          type: TargetReport.SCHEDULE,
          data: schedules,
          renderItem: ({item, index, section : {data}}) => renderItem({item, index, data}, TargetReport.SCHEDULE)
        })
        break
      case TargetReport.MILESTONE:
        mapSection.set(TargetReport.MILESTONE, {
          icon: IconTargetReport.ACTIVITY_FLAG,
          title: translate(messages.milestoneTitle),
          type: TargetReport.MILESTONE,
          data: milestones,
          renderItem: ({ item, index,  section : {data} }) => renderItem({item, index, data}, TargetReport.MILESTONE),
        })
        break
      case TargetReport.TASK:
        mapSection.set(TargetReport.TASK, {
          icon: IconTargetReport.ACTIVITY_TASK,
          title: translate(messages.taskTitle),
          type: TargetReport.TASK,
          data: tasks,
          renderItem: ({ item, index, section : {data} }) => renderItem({item, index, data}, TargetReport.TASK),
        })
        break
      default:
        break
    }
    setContentTargetReport(mapSection)
    let arrSection : Array<sectionTargetReport> = []
    mapSection.forEach(item => {arrSection.push(item)})
    setArrSectionTargetReport(arrSection)
  }

  useEffect(() => {
    updateContentTargetReport()
  }, [schedules, milestones, tasks, typeTargetReport])
  /**
   * handle call api
   * @param offset 
   * @param customerId 
   */
  const handleCallAPI = async (_typeTargetReport: string, _offset: number, _searchValue: string) => {
    setCurrentOffset(_offset)
    let response
    switch (_typeTargetReport) {
      case TargetReport.SCHEDULE:
        response = await getScheduleSuggestions({searchValue: _searchValue, customerId: props?.customerId, offset: _offset})
        break
      case TargetReport.MILESTONE:
        response = await getMilestonesSuggestion({searchValue: _searchValue, listIdChoice: props?.customerId? [props?.customerId]: [], offset: _offset, limit: 10})
        break
      case TargetReport.TASK:
        response = await GetTasksSuggestion({searchValue: _searchValue, listIdChoice: props?.customerId? [props?.customerId]: [], offset: _offset, limit: 10, relationFieldId: null})
        break
      default:
        break
    }
    handleErrorGetTargetReport(_typeTargetReport, response)
  }
  /**
   * handle error to load continue data
   * @param response
   */
  const handleErrorGetTargetReport = (_typeTargetReport: string, response: any) => {
    if (response.status) {
      if (response.status === 200) {
        setLoadState('succeeded')
        switch (_typeTargetReport) {
          case TargetReport.SCHEDULE:
            if (response?.data?.schedules !== null && response?.data?.schedules?.length > 0 ) {
              let scheduleSuggestionList = []
              scheduleSuggestionList = schedules.concat(response.data.schedules)
              setSchedules(scheduleSuggestionList)
            } else {
              setTypeTargetReport(TargetReport.MILESTONE)
              setCurrentOffset(0)
              setLoadState('loading')
              handleCallAPI(TargetReport.MILESTONE, 0, searchValue)
            }
            break
          case TargetReport.MILESTONE:
            if (response?.data?.milestoneData !== null && response?.data?.milestoneData?.length > 0) {
              let milestoneSuggestionList = []
              milestoneSuggestionList = milestones.concat(response.data.milestoneData)
              setMilestones(milestoneSuggestionList)
            } else {
              setTypeTargetReport(TargetReport.TASK)
              setCurrentOffset(0)
              setLoadState('loading')
              handleCallAPI(TargetReport.TASK, 0, searchValue)
            }
            break
          case TargetReport.TASK:
            if (response?.data?.tasks !== null && response?.data?.tasks?.length > 0) {
              let taskSuggestionList = []
              taskSuggestionList = tasks.concat(response.data.tasks)
              setTasks(taskSuggestionList)
            } else {
              setCurrentOffset(0)
            }
            break
          default:
            break
        }
      }
      setLoadState('failed')
      setErrorMessage(TEXT_EMPTY)
    } else {
      setErrorMessage(translate(messages.errorCallAPI))
    }
  }

  const debouncedSearchValue = useDebounce(searchValue, 500);
  useEffect(() => {
    setLoadState('loading')
    handleCallAPI(TargetReport.SCHEDULE, currentOffset, searchValue)
  },[debouncedSearchValue])

  const onHideModal = () => {
    setModalVisible(false)
    setSearchValue(TEXT_EMPTY)
  }

  const onShowModal = () => {
    setModalVisible(true)
    setSearchValue(TEXT_EMPTY)
  }
  
  const onSelectItem = (item: any) => {
    setSelectedItem(item)
    props.updateSelectedItem(item)
    setModalVisible(false)
  }
  
  const removeSelection = () => {
    setSelectedItem({})
  }
  
  const renderItem = ({ item, index, data }: any, type = '') => {
    const itemDetail = getItemDetail(item, type)
    const expireStyle = (type === TargetReport.TASK && itemDetail?.isExpired) ? { color: "red" } : {}
    const separatorStyle = (data.length - 1) === index ? styles.borderBottom : {}

    return (
      <TouchableOpacity onPress={() => onSelectItem({...item, itemDetail })} style={[styles.itemWrap, separatorStyle]}>
        <View style={styles.contentItem}>
          <Text style={styles.des1}>{itemDetail?.firstLine}</Text>
          <Text style={[styles.des2, expireStyle]}>{itemDetail?.secondLine ? itemDetail?.secondLine : TEXT_EMPTY}</Text>
          {itemDetail?.thirdLine !== undefined && itemDetail?.thirdLine !== TEXT_EMPTY && <Text style={styles.des1}>{itemDetail?.thirdLine}</Text>}
        </View>
      </TouchableOpacity>
    )
  }

  const CheckNVL = (value: string) : string => {
    if (value !== null) {
      return value
    }
    return TEXT_EMPTY
  }
  
  const getItemDetail = (item: any , type: string) => {
    const isFinishDateExpired = type === 'activityTask' && (Date.parse(item?.finishDate) - new Date().getTime()) > 0
    switch (type) {
      case TargetReport.SCHEDULE:
        return {
          firstLine: `${CheckNVL(item?.parentCustomerName)} - 
            ${CheckNVL(item?.customerName)}/${CheckNVL(item?.productTradingName)}`,
          secondLine: item[`${type}Name`],
          thirdLine: item?.endDate ? moment(item?.endDate).format(APP_DATE_FORMAT) : TEXT_EMPTY
        }
      case TargetReport.MILESTONE:
        return {
          firstLine: `${CheckNVL(item?.parentCustomerName)} -  ${CheckNVL(item?.customerName)}`,
          secondLine: `${item[`${type}Name`]} (${item?.endDate ? moment(item?.endDate).format(APP_DATE_FORMAT) : TEXT_EMPTY})`,
          thirdLine: TEXT_EMPTY,
        }
      case TargetReport.TASK:
        return {
          isExpired: isFinishDateExpired && item?.status < 3,
          firstLine: `${CheckNVL(item?.milestone?.milestoneName)} (${CheckNVL(item?.customer?.parentCustomerName)} -  
            ${CheckNVL(item?.customer?.customerName)}/${item?.productTradings? item?.productTradings[0]?.productTradingName: ''})`,
          secondLine: `${CheckNVL(item?.taskName)} (${item?.endDate ? moment(item?.endDate).format(APP_DATE_FORMAT) : TEXT_EMPTY})`,
          thirdLine: CheckNVL(item?.employee),
        }
      default:
        return {}
    }
  }
  
  /** 
   * check scroll bottom
   */
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    return layoutMeasurement?.height + contentOffset?.y >= contentSize?.height - 20;
  }

  const renderList = () => {
    return (
      <View style={styles.borderList}>
        <SectionList
          renderSectionHeader={({ section: { title, icon } }) => (
            <View style={styles.titleSectionContent}>
              <Icon name={icon} style={styles.titleIconFormat}/>
              <Text style={styles.titleTextFormat}>{title}</Text>
            </View>
          )}
          sections={arrSectionTargetReport}
          keyExtractor={(item: any) => item.key}
          onScroll={({nativeEvent}) => {
            if (isCloseToBottom(nativeEvent)) {
              // TODO get data continue
              setLoadState('loading')
              setTimeout(() => {
                handleCallAPI(typeTargetReport , currentOffset + 10, searchValue)
              }, (500));
            }
          }}
        />
      </View>
    )
  }
  
  const handleSearch = (offset: number = 0, text: string) => {
    setSearchValue(text)
    setSchedules([])
    setMilestones([])
    setTasks([])
    setArrSectionTargetReport([])
    setCurrentOffset(offset)
    setTypeTargetReport(TargetReport.SCHEDULE)
    setContentTargetReport(new Map())
  }

  const isSelected = !isEqual(selectedItem, {})
  
  return (
    <>
      <Text style={styles.textHolder} onPress={onShowModal}>
        {translate(messages.selectReportTarget)}
      </Text>
      {isSelected && <View style={styles.formatItemSelected}>
        <View style={styles.formatContentSelected}>
          <Text style={styles.des1}>{selectedItem?.itemDetail?.firstLine}</Text>
          <Text style={[styles.des2]}>{selectedItem?.itemDetail?.secondLine}</Text>
          {selectedItem?.itemDetail?.thirdLine !== undefined && selectedItem?.itemDetail?.thirdLine !== TEXT_EMPTY && <Text style={styles.des1}>{selectedItem?.itemDetail?.thirdLine}</Text>}
        </View>
        <TouchableOpacity style={styles.buttonClose} onPress={removeSelection}>
          <Icon name={'closeCircle'} style={styles.closeImages}/>
        </TouchableOpacity>
      </View>}
      <Modal
        isVisible={modalVisible}
        style={{ margin: 0 }}
        onBackdropPress={onHideModal}
        coverScreen
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={onHideModal} style={{ flex: 1 }} />
          <View style={styles.modalContent}>
            <View style={styles.inputContainer}>
              {(searchValue === TEXT_EMPTY || searchValue.length <= 0) && (
                <Icon style={styles.searchIcon} name="searchIcon" />
              )}
              <TextInput
                style={{ flex: 1 }}
                placeholder={TEXT_EMPTY}
                placeholderTextColor="#333"
                underlineColorAndroid="transparent"
                value={searchValue}
                onChangeText={(text) => {
                  handleSearch(currentOffset, text)
                }}
              />
              {(searchValue !== TEXT_EMPTY || searchValue.length > 0) && (
                <TouchableOpacity
                  style={styles.closeIcon}
                  onPress={() => setSearchValue(TEXT_EMPTY)}
                >
                  <Icon name="icClose" />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.dividerContainer} />
            {errorMessage !== TEXT_EMPTY && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            {(searchValue !== TEXT_EMPTY || searchValue.length > 0) && renderList()}
            { loadState === 'loading' &&
              <AppIndicator size={25} style={DetailScreenStyles.loadingView} />
            }
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  textHolder: {
    color: theme.colors.gray
  },
  buttonText: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: getWidth(10),
    textAlign: "center",
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(10),
    fontSize: normalize(14),
    color: theme.colors.black,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: theme.borRadius.borderRadius15,
    borderTopRightRadius: theme.borRadius.borderRadius15,
    elevation: theme.elevation.elevation2,
    flex: 3,
  },
  inputContainer: {
    margin: 15,
    paddingHorizontal: 5,
    backgroundColor: "#F9F9F9",
    borderColor: "#E5E5E5",
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    height: normalize(45),
  },
  searchIcon: {
    marginRight: 15,
  },
  closeIcon: {
    marginLeft: 15,
  },
  dividerContainer: {
    backgroundColor: "#EDEDED",
    height: 10,
  },
  errorMessage: {
    marginTop: 20,
    color: "#FA5151",
    paddingLeft: 15,
  },
  itemWrap: {
    backgroundColor: "#fff",
    paddingHorizontal: getWidth(15),
    paddingTop: getHeight(5),
  },
  des1: {
    fontSize: normalize(12),
    color: "#666666",
    marginTop: getHeight(5),
  },
  des2: {
    fontSize: normalize(14),
    color: "#333333",
    marginTop: getHeight(5),
  },
  closeIconSelected:{
    width: getWidth(12),
    height: getHeight(12),
    resizeMode: "contain",
    tintColor: "#fff"
  },
  selectArea: {
    fontSize: normalize(14),
    width: "100%",
    color: "#333",
  },
  selectedSchedule: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: getWidth(10),
    backgroundColor: "#F9F9F9",
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
  },
  innerSelected: {
    paddingHorizontal: normalize(12),
    paddingVertical: normalize(5),
    marginRight: normalize(5),
    marginBottom: normalize(5),
    alignItems:'center'
  },
  addedInnerSelected:{
    backgroundColor: "#666", 
    flexDirection: 'row', 
    borderRadius: getWidth(50),
  },
  innerText: {
    fontSize: normalize(14),
    color: theme.colors.black,
  },
  buttonClose: {
    marginHorizontal: getWidth(10),
    alignSelf:'center',
    justifyContent:'center',
  },
  closeImages: {
    width: getWidth(18),
    height: getHeight(18),
    resizeMode: "contain",
    tintColor: "#666"
  },
  contentItem: {
    marginLeft: getWidth(25), marginBottom:10
  },
  borderBottom: { 
    borderBottomColor: "#E5E5E5",
    borderBottomWidth: 1
  },
  titleSectionContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: getWidth(15),
    paddingTop: getHeight(10)
  },
  titleIconFormat: {
    width: getWidth(20),
    height: getWidth(20),
    resizeMode: "contain"
  },
  titleTextFormat: {
    fontSize: normalize(14),
    color: "#666666",
    marginLeft: getWidth(5)
  },
  formatItemSelected: {
    marginVertical: getWidth(10),
    flexDirection: 'row'
  },
  formatContentSelected: {
    flex: 1,
    marginLeft: getWidth(12)
  },
  borderList: {
    borderColor: "#E5E5E5",
    borderWidth: 1
  }
})
