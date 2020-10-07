import * as React from "react"
import { Image, Text, View, ScrollView, Alert as ShowError, TouchableOpacity, NativeScrollEvent, RefreshControl} from "react-native"
import { Style } from "../../../calendar/common"
import ChangeHistoryStyles from "./change-history-style"
import { useState, useEffect } from "react"
import { activityDetailActions, ActivityHistories } from "../activity-detail-reducer"
import { useDispatch, useSelector } from "react-redux"
import { getChangeHistories } from "../../activity-repository"
import { activityHistoriesSelector, fieldInfosSelector, activityIdSelector } from "../activity-detail-selector"
import { formatDataHistory, repeatString, ChangeHistory, ParentChangeHistory } from "../../common/common-util"
import { useNavigation } from "@react-navigation/native"
import { appImages } from "../../../../config/constants"
import { LoadState } from "../../../../types"
import { CommonMessage } from "../../../../shared/components/message/message"
import { translate } from "../../../../config/i18n"
import { TypeMessage } from "../../../../config/constants/enum"
import { ActivityDetailStyles } from "../activity-detail-style"
import { messagesComon } from "../../../../shared/utils/common-messages"
import { StackScreen } from "../../constants"
import { TEXT_EMPTY } from "../../../../config/constants/constants"
import { AppIndicator } from "../../../../shared/components/app-indicator/app-indicator"
import { DetailScreenStyles } from "../../../employees/detail/detail-style"

export const ChangeHistoryScreen: React.FC =  () => {
  const [activityHistoryList, setActivityHistoryList] = useState<Array<ActivityHistories>>([])
  const LIMIT = 30
  const [offset, setOffset] = useState(0)
  const dispatch = useDispatch()
  const responseGetActivityHistories = useSelector(activityHistoriesSelector)
  const fieldInfos = useSelector(fieldInfosSelector)
  const activityId = useSelector(activityIdSelector)
  const navigation = useNavigation()
  const [loadState, setLoadState] = useState<LoadState>('initial')
  const [currentOffset, setCurrentOffset] = useState(0)

  /** 
   * Status process refresh data
   */
  const [refreshData, setRefreshData] = useState(false)

  /**
   * Call API getChangeHistories
   */
  async function getDataChangeHistories() {
    setLoadState('loading')
      try {
        const getChangeHistoriesResponse = await getChangeHistories({activityId: activityId, offset: offset, limit: LIMIT})
        if (getChangeHistoriesResponse?.status === 200) {
          setLoadState('succeeded')
          dispatch(activityDetailActions.getActivityHistory(getChangeHistoriesResponse?.data))
          setOffset(offset + LIMIT)
        } else {
          setLoadState('failed')
        }
        setRefreshData(false)
    }
    catch (error) {
      setLoadState('failed')
      ShowError.alert('Message', error.message)
    }
  }

  /** 
   * set Status content when responseGetActivityHistories has been changed
   */
  useEffect(() => {
    if (responseGetActivityHistories.length === 0) {
      setLoadState('noData')
    }
  },[responseGetActivityHistories])

  React.useEffect(() => {
    getDataChangeHistories()
  }, [])

  /**
   * Handle scroll load data
   * @param e
   */
  const handleScroll = async ({ layoutMeasurement, contentOffset, contentSize }: NativeScrollEvent, _offset: number) => {
    setCurrentOffset(_offset)
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 1) {
      try {
        setLoadState('loading')
        const getChangeHistoriesResponse = await getChangeHistories({activityId: activityId, offset: offset, limit: LIMIT})
        if (getChangeHistoriesResponse?.status === 200) {
          let changeHistoriesData = []
          changeHistoriesData = activityHistoryList.concat(getChangeHistoriesResponse?.data?.activityHistories)
          setActivityHistoryList(changeHistoriesData)
        } else {
          setLoadState('failed')
          if (_offset > 0) {
            setCurrentOffset(_offset - 10)
          }
        }
      }
      catch (error) {
        setLoadState('failed')
        ShowError.alert('Message', error.message)
      }
    }
  }

  useEffect(() => {
    if (responseGetActivityHistories?.length > 0) {
      setActivityHistoryList(responseGetActivityHistories)
    }
  }, [responseGetActivityHistories])

  /**
   * navigate to employee detail screen
   * @param id
   */
  const goToEmployeeDetail = (employee: any) => {
    navigation.navigate(StackScreen.EMPLOYEE_DETAIL, {
      id: employee?.employeeId,
      title: `${employee?.employeeSurname} ${employee?.employeeName || TEXT_EMPTY}`,
    });
  }
  /**
   * Render content change of content
   * @param check
   * @param before
   * @param after
   */
  const renderChangedContent = (history: ActivityHistories) => {
    let { changeHistory, maxLength }: ParentChangeHistory = formatDataHistory (
      history?.contentChange,
      fieldInfos
    )
    return (
      <View style={ChangeHistoryStyles.changedContainerParent}>
        <View style={ChangeHistoryStyles.flex1}>
          {changeHistory.map((item: ChangeHistory) => {
            return (
              <View
                style={[ChangeHistoryStyles.changedContainer]}
                key={item.id.toString()}
              >
                <Text style={[ChangeHistoryStyles.changedLabel]}>
                  {`${item.name}${repeatString(
                    " ",
                    maxLength - item.name.length
                  )}`}
                </Text>
                <Text style={[ChangeHistoryStyles.black12]}>{` : `}</Text>
                <View style={[ChangeHistoryStyles.flex1, ChangeHistoryStyles.rowInline]}>
                  <Text
                    style={[
                      ChangeHistoryStyles.black12,
                      ChangeHistoryStyles.changedContent,
                    ]}
                  >
                    {" "}
                    {`${item.change.old} `}
                  </Text>
                  <Image
                    resizeMode="contain"
                    source={appImages.icFowardArrow}
                    style={[ChangeHistoryStyles.arrowIcon]}
                  />
                  <Text
                    style={[
                      ChangeHistoryStyles.black12,
                      ChangeHistoryStyles.changedContent,
                    ]}
                  >
                    {" "}
                    {` ${item.change.new}`}
                  </Text>
                </View>
              </View>
            )
          })}
        </View>
      </View>
    ) 
  }

  const historyItem = (item: ActivityHistories, key: number) => {
    return(
      <View key={key} style={ChangeHistoryStyles.tabHistory}>
        <View style={ChangeHistoryStyles.dotHistory}/>
        <View style={ChangeHistoryStyles.topTitle}>
          <Text style={ChangeHistoryStyles.itemText}>{item.updatedDate}</Text>
            <View style={ChangeHistoryStyles.item}>
              <View style={ChangeHistoryStyles.blockUser}>
                <Image
                  source={{uri: item?.updatedUser?.employeePhoto?.filePath}}
                  style={ChangeHistoryStyles.avatar}
                />
                <Text style={[ChangeHistoryStyles.time, {color: "#0F6DB1"}]}>
                  {`${item?.updatedUser?.employeeSurname} ${item?.updatedUser?.employeeName}`}
                </Text>
                <TouchableOpacity
                      onPress={() => {
                        goToEmployeeDetail(item?.updatedUser)
                      }}
                    >
                      <Text style={[ChangeHistoryStyles.time, {color: "#0F6DB1"}]}>
                      {`${item?.updatedUser?.employeeSurname} ${item?.updatedUser?.employeeName}`}
                      </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={ChangeHistoryStyles.contentsHistory}>
                    {renderChangedContent(item)}
            </View>
        </View>
      </View>
    )
  }

  /** 
   * Handle refresh data
   */
  const handleRefreshData = () => {
    getDataChangeHistories()
  }
  if (loadState === 'loading') return (
    <AppIndicator size={40} style={DetailScreenStyles.loadingView} />
  )
  return (
    <ScrollView
      style={[Style.container, ChangeHistoryStyles.scroll]} 
      showsVerticalScrollIndicator={false} 
      onScroll={({ nativeEvent }) => handleScroll(nativeEvent, currentOffset + 10)}
      nestedScrollEnabled={true}
      scrollEventThrottle={400}
      refreshControl={
        <RefreshControl
            refreshing={refreshData}
            onRefresh={() => {
              handleRefreshData()
            }}
          />
      }>
        {loadState === 'failed' &&
          <View style={ActivityDetailStyles.alignItems}>
            <TouchableOpacity>
              <CommonMessage content={translate(messagesComon.ERR_COM_0012)} type={TypeMessage.ERROR}></CommonMessage>
            </TouchableOpacity>
          </View>
        }
        {loadState === 'noData' &&
          <View style={ActivityDetailStyles.alignItems}>
            <TouchableOpacity>
              <CommonMessage content={translate(messagesComon.INF_COM_0013)} type={TypeMessage.INFO}></CommonMessage>
            </TouchableOpacity>
          </View>
        }
        { loadState === 'succeeded' &&
          <>
            {
              activityHistoryList.map((item: ActivityHistories, index: number) => {
                return (
                  historyItem(item, index)
                )
              })
            }
          </>
        }
    </ScrollView>
  )
}
