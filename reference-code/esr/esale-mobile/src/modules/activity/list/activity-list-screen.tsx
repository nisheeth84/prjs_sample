import * as React from "react"
import { View, ScrollView, Alert as ShowError, TouchableOpacity, Text, TextInput, RefreshControl, FlatList, Platform} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { ActivityListStyle } from "./activity-list-style"
import { normalize, Style } from "../../activity/common"
import { ActivityItem } from "./activity-item"
import { useState } from "react"
import {deleteActivities, getActivities, deleteActivityDraft, getActivityDrafts} from "../activity-repository"
import Toast from "react-native-toast-message"
import { TypeMessage, DefineFieldType, PlatformOS } from "../../../config/constants/enum"
import { Icon } from "../../../shared/components/icon"
import { messages } from "./activity-list-messages"
import { translate } from "../../../config/i18n"

import {StackScreen, TypeConfirm} from "../constants"
import {ActivityRegisterEditMode} from "../api/get-activities-type"
import { ModalConfirm } from "../modal-confirm"
import { TEXT_EMPTY, ON_END_REACHED_THRESHOLD } from "../../../config/constants/constants"
import { LoadState } from "../../../types"
import { CommonMessage } from "../../../shared/components/message/message"
import { messagesComon } from "../../../shared/utils/common-messages"
import { AppIndicator } from "../../../shared/components/app-indicator/app-indicator"
import { responseMessages } from "../../../shared/messages/response-messages"
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu"
import { AddButton } from "../components/addButton"
import { theme } from "../../../config/constants"
import { activitySelector } from "./activity-list-selector"
import { useSelector, useDispatch } from "react-redux"
import { activityActions } from "./activity-list-reducer"

/**
 * Activity screen
 * @param route
 */
export const ActivityListScreen = (route?: any) => {
  const [showModalConfirmDelete, setShowModalConfirmDelete] = useState(false)
  const [activityId, setActivityId] = useState(0)
  const [isShowFilter, setShowFilter] = useState(false)
  const [filterString, setFilterString] = useState(TEXT_EMPTY)
  const navigation = useNavigation()
  const routeParams = route.route.params
  const [loadState, setLoadState] = useState<LoadState>('initial')
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const activityData  = useSelector(activitySelector)
  const dispatch = useDispatch()

  /**
   * is Draft
   */
  const [isDraft, setIsDraft] = useState(route.params?.filterListParams?.isDraft)

  /**
   * activitiesData
   */
  const [activitiesData, setActivitiesData] = useState<any>()

  /**
   * offset of api activities
   */
  const [currentOffset, setCurrentOffset] = useState(0)

  /**
   * Status of action refresh list data
   */
  const [refreshData, setRefreshData] = useState(false)
  /**
   * Call api getActivities
   * @param params 
   */
  const callAPIGetActivities = async (params: any) => {
    const filterParams = (routeParams || routeParams !== undefined) ? routeParams?.filterListParams : {}
    try {
      const response = await getActivities({ ...params, ...filterParams })
      if (loading) {
        setLoading(false);
      }
      if (response.status === 200) {
        dispatch(activityActions.getActivities(response?.data))
        setActivitiesData(response?.data?.activities)
        if(response?.data?.activities?.length > 0) {
          setLoadState('succeeded')
        } else {
          setLoadState('noData')
        }
        setRefreshing(false)
      } else {
        setLoadState('failed')
      }
    } catch (e) {
      ShowError.alert("Message", e.message)
    }
  }

  /**
   * Call api getActivities
   * @param params 
   */
  const callAPIGetActivityDrafts = async (params: any) => {
    let filterParams = (routeParams || routeParams !== undefined) ? routeParams?.filterListParams : {}
    if (filterParams.isDraft) {
      delete filterParams.isDraft
    }
    try {
      const response = await getActivityDrafts({ ...params, ...filterParams })
      if (response.status === 200){
        dispatch(activityActions.getActivities(response?.data))
        setActivitiesData(response?.data?.activities)
        if(response?.data?.activities?.length > 0) {
          setLoadState('succeeded')
        } else {
          setLoadState('noDataOnDraft')
        }
        setRefreshing(false)
      } else {
        setLoadState('failed')
      }
    } catch (e) {
      setLoadState('failed');
      ShowError.alert("Message", e.message)
    }
  }

  /** 
   * Call back
   */
  React.useEffect(() => {
    setLoadState('loading')
    const paramsOnFilter = {
      filterConditions: [
        {
          fieldType: 9,
          fieldName: "product_name",
          fieldValue: filterString
        }
      ],
    }
    const paramAllActivities = {
      selectedTargetType: 0, 
      selectedTargetId: 0, 
      limit:30
    }
    const params = filterString ? paramsOnFilter : paramAllActivities
    const paramsIsDraft = filterString ? paramsOnFilter : {}
    if (routeParams?.filterListParams?.isDraft) {
      setIsDraft(routeParams?.filterListParams?.isDraft)
      callAPIGetActivityDrafts(paramsIsDraft)
    } else {
      callAPIGetActivities(params)
    }
  }, [routeParams])

  /**
   * Call API deleteActivities
   * @param activityIds
   */
  async function deleteActivitiesApi() {
    const responseData = await deleteActivities(
      { activityIds: [activityId] }
    )
    if (responseData?.status === 200) {
      getActivities({})
      Toast.show({
        position: 'bottom',
        visibilityTime: 2000,
        text2: TypeMessage.SUCCESS,
        text1: 'SUCCESS',
        autoHide: true
      })
    } else {
      ShowError.alert("Notify", "Error!")
    }
  }

  /**
   * Call API deleteActivitiesDraft
   * @param activitiesDraftId
   * 
   */
  async function deleteActivityDraftApi() {
    const responseData = await deleteActivityDraft( 
      { activityDraftId: routeParams?.filterListParams?.activityDraftId }
      )
      if (responseData?.status === 200) {
          Toast.show({
            position: 'bottom',
            visibilityTime: 2000,
            text2: TypeMessage.SUCCESS,
            text1: 'SUCCESS',
            autoHide: true
          })
          callAPIGetActivityDrafts({})
      } else {
        ShowError.alert("Notify", "Error!")
      }
  }
  /**
   * Process delete activity
   */
  const processDeleteActivity = () => {
    setShowModalConfirmDelete(false)
    if(route.params?.filterListParams?.isDraft) {
      deleteActivityDraftApi()
    } else {
      deleteActivitiesApi()
    }
  }

  /**
   * Show modal confirm for delete action
   */
  const showModalConfirmDeleteAction = () => {
    return (
      <ModalConfirm
        key={activityId}
        isVisible={showModalConfirmDelete}
        setIsVisible={(isVisible: boolean) => setShowModalConfirmDelete(isVisible)}
        titleModal={translate(messages.recurringAppointment)}
        processActionCallBack={() => processDeleteActivity()}
        typeModal={TypeConfirm.DELETE}
      >
      </ModalConfirm>
    )
  }

  /**
   * Hide filter box
   */
  const onHideFilterBox = () => {
    setShowFilter(false)
    setFilterString(TEXT_EMPTY)
  }

  /**
   * Clear filter
   */
  const cleanFilter = () => {
    setLoadState('loading')
    setShowFilter(false)
    setFilterString(TEXT_EMPTY)
    const paramAllActivities = {
      selectedTargetType: 0, 
      selectedTargetId: 0, 
      limit:30
    }
    const paramIsDraft = {
      isDraft: true, 
      limit: 30, 
      offset: 0
    }
    if (isDraft) {
      callAPIGetActivityDrafts(paramIsDraft)
    } else {
      callAPIGetActivities(paramAllActivities)
      renderTitle(paramAllActivities?.selectedTargetType)
    }
  }

  /**
   * Execute filter
   */
  const onFilter = () => {
    setLoadState('loading')
    setShowFilter(false)
    let params, paramsIsDraft
    const paramsOnFilter = {
      filterConditions: [
        {
          fieldName: "product_name",
          fieldValue: filterString,
          fieldType: Number(DefineFieldType.TEXT)
        }
      ],
    }
    const paramAllActivities = {
      selectedTargetType: 0, 
      selectedTargetId: 0, 
      limit:30
    }
    const paramIsDraft = {
      isDraft: true, 
      limit: 30, 
      offset: 0
    }
    params = filterString ? paramsOnFilter : paramAllActivities
    paramsIsDraft =  filterString ? paramsOnFilter : paramIsDraft
    if (isDraft) {
      callAPIGetActivityDrafts(paramsIsDraft)
    } else {
      callAPIGetActivities(params)
    }
  }

  /**
   * Filter box
   */
  const filterBox = () => {
    return <TouchableOpacity
      onPress={onHideFilterBox}
      style={ActivityListStyle.modalWrap}>
      <TouchableOpacity style={ActivityListStyle.filterBoxWrap}>
        <View style={{ margin: normalize(20) }}>
          <TextInput
            style={ActivityListStyle.filterInput}
            placeholder={translate(messages.textFilterPlaceholder)}
            placeholderTextColor={theme.colors.gray}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
            value={filterString}
            onChangeText={(text) => setFilterString(text)}
          />
          <View style={ActivityListStyle.buttonArea}>
            <TouchableOpacity
              onPress={cleanFilter}
              style={[ActivityListStyle.filterBoxButton, { marginRight: normalize(8) }]}>
              <Text>{translate(messages.removeButtonLabel)}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onFilter}
              style={ActivityListStyle.filterBoxButton}>
              <Text>{translate(messages.filterButtonLabel)}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity></TouchableOpacity>
  }

  /**
   * move to create screen
   */
  const goToCreateScreen = () => {
    navigation.navigate(StackScreen.ACTIVITY_CREATE_EDIT, { 
      mode: ActivityRegisterEditMode.REGISTER })
  }

  const onOpenStyle = isShowFilter ? { borderColor: "#0F6DB5" } : {},
    textFilterStyle = isShowFilter ? { color: "#0F6DB5" } : { color: '#666' },
    iconFilterStyle = isShowFilter ? { tintColor: "#0F6DB5" } : { tintColor: "#666" }
  
  /** 
   * check scroll bottom
   */
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    return layoutMeasurement?.height + contentOffset?.y >= contentSize?.height - 20;
  }
  /**
   * Handle scroll load more activities
   */
  async function handleScrollLoadMore  (_offset: number) {
    setCurrentOffset(_offset)
    let filterParams = (routeParams || routeParams !== undefined) ? routeParams.filterListParams : {}
    const paramsOnFilter = {
      filterConditions: [
        {
          fieldName: "product_name",
          fieldValue: filterString,
          fieldType: Number(DefineFieldType.TEXT)
        }
      ],
      offset: _offset
    }
     filterParams = filterString ? {... filterParams, ... paramsOnFilter}  : {... filterParams, ... {offset: _offset}}
    try {
      let response
      if (isDraft) {
        response = await callAPIGetActivityDrafts(filterParams)
      } else {
        response = await getActivities(filterParams)
      }
      if (response.status === 200 && response?.data?.activities?.length > 0) {
        let _activitiesData = []
        _activitiesData = activitiesData.concat(response.data.activities)
        setActivitiesData(_activitiesData)
      } else if (_offset > 0) {
        setCurrentOffset(_offset - 10)
      }
    } catch (e) {
      setLoadState('failed');
      ShowError.alert("Message", e.message)
    }
  }

  /**
   * Handle action refreshList
   */
  const handleRefreshData = () => {
    const paramsOnFilter = {
      filterConditions: [
        { 
          fieldName: "product_name",
          fieldValue: filterString,
          fieldType: Number(DefineFieldType.TEXT)
        }
      ],
    }
     const params = filterString ? paramsOnFilter : {}
    if (isDraft) {
      callAPIGetActivityDrafts(params)
    } else {
      callAPIGetActivities(params)
    }
    setRefreshData(false)
    setRefreshing(false)
  }

  /**
   * Render title of list activities screen
   */
  const renderTitle = (filterListParams: any ) => {
    if (filterListParams) {
      if (routeParams?.filterListParams?.selectedTargetType === 1) {
        return translate(messages.myActivity)
      } else if ( routeParams?.filterListParams?.selectedTargetType === 3 || 
                  routeParams?.filterListParams?.selectedTargetType === 4 ||
                  routeParams?.filterListParams?.selectedTargetType === 5 ) 
        {
        return translate(messages.allActivity)
      } else if (routeParams?.filterListParams?.selectedTargetType === 0) {
        return translate(messages.allActivity)
      } else {
        return translate(messages.draftActivity)
      }
    }
    return translate(messages.allActivity)
   }
    
  /**
   * loading footer
   */
  const loadingFooter = () => {
    return (
      <AppIndicator
        visible={activitiesData.length > 0 && activitiesData.length < activityData.total}
      />
    )
  }
  return (
    <View style={Style.body}>
      {/* Header activityList */}
      <AppBarMenu
        name={renderTitle(routeParams?.filterListParams)}
        nameService={"activities"}
        hasBackButton={false}
      />
      <View style={ActivityListStyle.topArea}>
        <TouchableOpacity
          onPress={() => setShowFilter(true)}
          style={[ActivityListStyle.openFilterButton, onOpenStyle]}>
          <Text style={textFilterStyle}>{translate(messages.filterLabel)}</Text>
          <Icon name='arrowDown' style={[{ marginLeft: normalize(12) }, iconFilterStyle]} />
        </TouchableOpacity>
      </View>
      {isShowFilter && filterBox()}
      <ScrollView style={ActivityListStyle.scrollView} onScroll={({nativeEvent}) => {
          if (isCloseToBottom(nativeEvent)) {
            // TODO get data continue
            setTimeout(() => {
              handleScrollLoadMore(currentOffset + 30)
            }, 200);
          }
        }}
        scrollEventThrottle={400}
        refreshControl={
          <RefreshControl
            refreshing={refreshData}
            onRefresh={() => {
              handleRefreshData()
              setRefreshing(true)
            }}
          />
        }>
        {loadState === 'failed' &&
          <View style={ActivityListStyle.alignItems}>
            <TouchableOpacity>
              <CommonMessage content={translate(messagesComon.ERR_COM_0001)} type={TypeMessage.ERROR}></CommonMessage>
            </TouchableOpacity>
          </View>
        }
        {loadState === 'noData' &&
          <View style={ActivityListStyle.noDataMessage}>
            <Icon style={ActivityListStyle.functionIcon} name="activities"></Icon>
            <Text style={ActivityListStyle.textNoData}>{translate(responseMessages.INF_COM_0019).replace('{0}', translate(messages.functionText))}</Text>
          </View>
        }
        {loadState === 'noDataOnDraft' &&
          <View style={ActivityListStyle.noDataMessage}>
            <Icon style={ActivityListStyle.functionIcon} name="activities"></Icon>
            <Text style={ActivityListStyle.textNoData}>{translate(responseMessages.INF_COM_0019).replace('{0}', translate(messages.functionText))}</Text>
          </View> 
        }
        {loadState === 'loading' &&
          <AppIndicator  visible={loadState === 'loading'} /> 
        }
        {loadState === 'succeeded' &&
          <View>
            {/* Content */}
            <View style={Style.container}>
              <View style={ActivityListStyle.content}>
                <FlatList
                  data={activitiesData}
                  renderItem={({ item }: any) => {
                    return (
                      <View style={ ActivityListStyle.mrBottom}>
                        <ActivityItem
                          activity = {item}
                          styleActivityItem = {{paddingHorizontal: 16}}
                          onclickDeleteActivityItem = {(click: boolean) => {setShowModalConfirmDelete(click); setActivityId(item?.activityId)}}
                          isDraft= {isDraft}
                        />
                      </View>
                    );
                  }}
                  ListHeaderComponent={
                    <AppIndicator
                      visible={Platform.OS === PlatformOS.ANDROID && refreshing}
                    />
                  }
                  showsVerticalScrollIndicator={false}
                  onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
                  ListFooterComponent={
                    loadingFooter()
                  }
                />
                {showModalConfirmDelete && showModalConfirmDeleteAction()}
              </View>
            </View>
          </View>
        }
      </ScrollView>
      <AddButton onNavigate={goToCreateScreen} />
    </View>
  )
}