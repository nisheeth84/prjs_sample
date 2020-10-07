import React, { useState, useEffect } from 'react'
import { IBusinessCardSuggestProps, BusinessCardSuggestionsPayload, BusinessCardSuggest, activityCreateEditActions } from "../activity-create-edit-reducer"
import { View, Text, Modal as RNModal, TouchableOpacity, TextInput, FlatList } from "react-native"
import ProductSuggestStyles from "../product/product-suggest-styles"
import { messages } from './business-card-messages'
import { translate } from '../../../../config/i18n'
import { ActivityCreateEditStyle } from '../activity-create-edit-style'
import { SuggetionModalVisible, StatusButton, TypeButton } from '../../../../config/constants/enum'
import { Icon } from '../../../../shared/components/icon'
import { getBusinessCardSuggestions } from './business-card-repository'
import { useDispatch, useSelector } from 'react-redux'
import { businessCardSuggestSelector } from '../activity-create-edit-selector'
import { TEXT_EMPTY, SPACE_HALF_SIZE } from '../../../../config/constants/constants'
import { CommonButton } from '../../../../shared/components/button-input/button'
import { useDebounce } from '../../../../config/utils/debounce'
import { getHeight } from '../../../calendar/common'
import { LoadState } from '../../../../types'
import { AppIndicator } from '../../../../shared/components/app-indicator/app-indicator'
import { DetailScreenStyles } from '../../../employees/detail/detail-style'

export function BusinessCardSuggestView(props: IBusinessCardSuggestProps) {
  const dispatch = useDispatch()

  /**
   * The visible of modal
   */
  const [modalVisible, setModalVisible] = useState(SuggetionModalVisible.INVISIBLE)

  /**
   * the searchValue
   */
  const [searchValue, setSearchValue] = useState(TEXT_EMPTY)

  /**
   * error message if call API error
   */
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY)

  /**
   * list product response
   */
  const [responseApiBusinessCard, setResponseApiBusinessCard] = useState<BusinessCardSuggest[]>([])

  /**
   * list product chosen view
   */
  const [dataViewSelected, setDataViewSelected] = useState<BusinessCardSuggest[]>([])

  /** 
   * Map status check has been selected businessCardId
   */
  const [stateCheck, setStateCheck] = useState(new Map())

  /** 
   * Map status check has been selected String businessCard
   */
  const [stateStringCheck, setStateStringCheck] = useState(new Map())

  /**
   * status updateStateCheck
   */
  const [isUpdateStateCheck, setUpdateStateCheck] = useState(false)
  /**
   * businessCards
   */
  const businessCards = useSelector(businessCardSuggestSelector)

  /**
   * status change data
   */
  const [isChangeDataView, setChangeDataView] = useState(false)

  /**
   * customer chosen
   */
  const customerId = props.customerId
  /** 
   * When searchValue changed
   */
  const debouncedSearchValue = useDebounce(searchValue, 200)

  /**
   * Status of action call API
   */
  const [loadState, setLoadState] = useState<LoadState>('initial')


  useEffect(() => {
    setLoadState('loading')
    if (debouncedSearchValue && debouncedSearchValue.length > 0) {
      handleCallAPI(debouncedSearchValue, 0)
    } else {
      setLoadState('initial')
    }
  }, [debouncedSearchValue])

  /** 
   * reload when remove item businessCard
   */
  useEffect(() => {
    setChangeDataView(false)
  }, [isChangeDataView])

  /**
   * render item after search
   * @param item 
   * @param index 
   */
  const renderItemSearch = (item: BusinessCardSuggest) => {
    let keyBusinessCard = item?.businessCardId
    return (
      <TouchableOpacity style={ActivityCreateEditStyle.businessCardItemFormat} onPress={() => updateStateCheck(item?.businessCardId)}>
        <View style={ActivityCreateEditStyle.businessCardItemInfo}>
          <Text> {item.customerName} {item.departmentName}</Text>
          <Text> {item.businessCardName} {item.position}</Text>
        </View>
        <View style={ProductSuggestStyles.iconCheckView}>
          {stateCheck.get(keyBusinessCard) &&
            <Icon style={ProductSuggestStyles.iconCheck} name="checkedIcon" />
          }
          {!stateCheck.get(keyBusinessCard) &&
            <Icon style={ProductSuggestStyles.iconCheck} name="unCheckedIcon" />
          }
        </View>
      </TouchableOpacity>
    )
  }

  /** 
   * Update stateCheck when touchable a item
   */
  const updateStateCheck = (id: number) => {
    if (id) {
      let map = new Map(stateCheck)
      map.set(id, !stateCheck.get(id))
      setStateCheck(map)
      setUpdateStateCheck(true)
    }
  }

  /** 
   * Reload when isUpdateStateCheck has been changed
   */
  useEffect(() => {
    setUpdateStateCheck(false)
  }, [isUpdateStateCheck])

  /** 
   * merge data into dataViewSelected
   */
  const mergeToDataViewSelected = (dataView: BusinessCardSuggest[], dataViewString: string[]) => {
    // let dataView = dataViewSelected
    dataViewString.forEach(item => {
      dataView.push({
        businessCardId: 0,
        departmentName: '',
        businessCardName: '',
        position: 0,
        customerName: item.toString()
      })
    })
    setDataViewSelected(dataView)
  }

  /**
   * Prepare data has been selected
   * @param item 
   */
  const prepareDataViewSelected = () => {
    // prepareDataViewSelected
    let dataView = responseApiBusinessCard?.filter(item => stateCheck.get(item.businessCardId) === true)
    setDataViewSelected(dataView)
    // prepareDataViewStringSelected
    let dataViewString = []
    let dataEntries = stateStringCheck.entries()
    let iter
    while ((iter = dataEntries?.next()?.value)) {
      if (iter[1] === true) {
        dataViewString.push(iter[0].toString())
      }
    }
    // setDataViewStringSelected(dataViewString)

    // merge dataViewStringSelected to dataViewSelected
    mergeToDataViewSelected(dataView, dataViewString)
    // hide modal
    setModalVisible(SuggetionModalVisible.INVISIBLE_SAVE)
  }

  /** 
   * getData when Call API getDataBusinessCards
   */
  async function getDataBusinessCards(payload: BusinessCardSuggestionsPayload) {
    try {
      const getBusinessCardsResponse = await getBusinessCardSuggestions(payload)
      if (getBusinessCardsResponse?.status === 200) {
        dispatch(activityCreateEditActions.getBusinessCardSuggestions(getBusinessCardsResponse?.data))
      }
    }
    catch (error) {
      setErrorMessage(error.message)
    }
  }

  /** 
   * Update ResponseApiBusinessCard when searchValue has been changed
   */
  useEffect(() => {
    // call API get Data for businessCardList
    let listIdChoice: Array<number> = []
    dataViewSelected?.forEach(item => {
      listIdChoice.push(item.businessCardId)
    })
    if (customerId && customerId > 0) {
      getDataBusinessCards({
        offset: 0,
        searchValue: searchValue,
        listIdChoice: listIdChoice,
        customerIds: [customerId]
      })
      setResponseApiBusinessCard(businessCards)
    }
  }, [customerId])

  /** 
   * upDate dataRemoveDataViewSelected
   */
  const upDateRemoveDataViewSelected = (item: BusinessCardSuggest) => {
    // update status dataVieSelected
    if (item.businessCardId > 0) {
      let stateCheckCur = stateCheck
      stateCheckCur.set(item.businessCardId, !stateCheck.get(item.businessCardId))
      setStateCheck(stateCheck)
    } else {
      let stateCheckCur = stateStringCheck
      stateCheckCur.set(item.customerName, !stateStringCheck.get(item.customerName))
      setStateStringCheck(stateCheckCur)
    }
    // update dataViewSelected
    setChangeDataView(true)
    let data = dataViewSelected
    data.splice(dataViewSelected.indexOf(item), 1)
    setDataViewSelected(data)
    props.updateStateElement(data)
  }

  /** 
   * When modalVisible changed so update dataViewSelected
   */
  useEffect(() => {
    setSearchValue(TEXT_EMPTY)
    if (modalVisible === SuggetionModalVisible.INVISIBLE_SAVE) {
      props.updateStateElement(dataViewSelected)
    }
  }, [modalVisible])

  /**
   * Show BusinessCards has been selected
   * @param item 
   */
  const showBusinessCardSelected = () => {
    return (
      <View>
        {dataViewSelected?.map((item: BusinessCardSuggest, index: number) => {
          return (
            <View
              key={index}
              style={ActivityCreateEditStyle.businessCardContent}>
              <View style={ActivityCreateEditStyle.width90}>
                <Text style={{}}>{translate(messages.labelCustomerName)}</Text>
                <Text style={{}}>{item.customerName}</Text>
              </View>
              <View style={{ padding: 10 }}>
                <TouchableOpacity style={ActivityCreateEditStyle.buttonClose}
                  onPress={() => { upDateRemoveDataViewSelected(item) }}>
                  <Icon
                    style={ActivityCreateEditStyle.CloseImages}
                    name="close"
                  />
                </TouchableOpacity>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  /** 
   * Action update status DataView BusinessCard selected
   */
  const updateStateStringCheck = () => {
    let newMap = stateStringCheck
    if (newMap?.has(searchValue)) {
      newMap.set(searchValue, !newMap.get(searchValue))
    }
    else {
      newMap.set(searchValue, true)
    }
    setUpdateStateCheck(true)
  }
  /**
   * start offset search API
   */
  const [currentOffset, setCurrentOffset] = useState(0)

  /**
   * Handle text search
   * @param offset 
   * @param text 
   */
  const handleSearch = (text: string) => {
    setSearchValue(text)
    setCurrentOffset(0)
    // handleCallAPI(text, 0)
  }
  /**
   * load more
   * @param _offset 
   */
  const handleCallAPI = async (_searchValue: string, _offset: number) => {
    setCurrentOffset(_offset)
    let listIdChoice: Array<number> = []
    dataViewSelected?.forEach(item => {
      listIdChoice.push(item.businessCardId)
    })
    let getBusinessCardsResponse = await getBusinessCardSuggestions({
      offset: _offset,
      searchValue: _searchValue,
      listIdChoice: listIdChoice,
      customerIds: [customerId]
    })
    if (getBusinessCardsResponse) {
      if (getBusinessCardsResponse.status === 200) {
        if (getBusinessCardsResponse?.data?.businessCards !== null && getBusinessCardsResponse?.data?.businessCards?.length > 0) {
          setLoadState('succeeded')
          let businessCardList = []
          businessCardList = responseApiBusinessCard.concat(getBusinessCardsResponse.data.businessCards)
          setResponseApiBusinessCard(businessCardList)
        }
      }
    }
    setLoadState('failed')
  }

  /** 
   * check scroll bottom
   */
  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}: any) => {
    return layoutMeasurement?.height + contentOffset?.y >= contentSize?.height - 20;
  }
  return (
    <View>
      <Text
        style={[
          ProductSuggestStyles.marginB5,
          ActivityCreateEditStyle.ActivityTitle,
          ActivityCreateEditStyle.FontWeight]}>
        {props.fieldLabel}
      </Text>
      <Text style={[ProductSuggestStyles.textHolder]}
        onPress={() => {
          setModalVisible(SuggetionModalVisible.VISIBLE)
        }}
      >
        {translate(messages.addInterviewerOnTheDay)}
      </Text>
      {showBusinessCardSelected()}
      <RNModal
        animationType="slide"
        transparent={true}
        visible={modalVisible === SuggetionModalVisible.VISIBLE}
      >
        <View style={ProductSuggestStyles.modalContainer}>
          <TouchableOpacity
            style={ActivityCreateEditStyle.flex1}
            onPress={() => {
              setModalVisible(SuggetionModalVisible.INVISIBLE)
            }} />
          <View style={[ProductSuggestStyles.modalContent, ActivityCreateEditStyle.flex3]}>
            <View style={ProductSuggestStyles.inputContainer}>
              {
                searchValue.length <= 0 &&
                <View style={ProductSuggestStyles.iconCheckView}>
                  <Icon style={ProductSuggestStyles.iconCheck} name="searchIcon" />
                </View>
              }
              <TextInput
                style={[searchValue.length > 0 ? ProductSuggestStyles.inputSearchTextData : ProductSuggestStyles.inputSearchText]}
                placeholder={translate(messages.addInterviewerOnTheDay)}
                value={searchValue}
                onChangeText={(text) => handleSearch(text)}
              />
              <View style={ProductSuggestStyles.textSearchContainer}>
                {searchValue.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchValue(TEXT_EMPTY)}>
                    <Icon name="icClose" />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <View style={ProductSuggestStyles.dividerContainer} />
            { errorMessage !== TEXT_EMPTY && (
                <Text style={ProductSuggestStyles.errorMessage}>{errorMessage}</Text>
              )
            }
            { loadState === 'loading' &&
              <AppIndicator size={25} style={DetailScreenStyles.loadingView} />
            }
            { searchValue.length > 0 && (
                <View style={[responseApiBusinessCard?.length > 0 ? ActivityCreateEditStyle.suggestionContainerData
                  : ProductSuggestStyles.suggestionContainerNoData]}>
                  <FlatList
                    style={{height: getHeight(200)}}
                    data={responseApiBusinessCard}
                    keyExtractor={item => item.businessCardId.toString()}
                    renderItem={({ item }) => renderItemSearch(item)}
                    
                    onScroll={({nativeEvent}) => {
                      if (isCloseToBottom(nativeEvent)) {
                        // TODO get data continue
                        setTimeout(() => {
                          setLoadState('loading')
                          handleCallAPI(searchValue, currentOffset + 10)
                        }, 200);
                      }
                    }}
                  />
                  {searchValue?.length > 0 && (
                    <TouchableOpacity style={ActivityCreateEditStyle.businessCardItem} onPress={() => { updateStateStringCheck() }}>
                      <View style={ActivityCreateEditStyle.businessCardItemFormat}>
                        <View style={ActivityCreateEditStyle.itemText}>
                          <Text>{searchValue}{SPACE_HALF_SIZE}{translate(messages.extendInterviewer)}</Text>
                        </View>
                        <View style={ActivityCreateEditStyle.itemAction}>
                          {stateStringCheck.get(searchValue) &&
                            <Icon style={ProductSuggestStyles.iconCheck} name="checkedIcon" />
                          }
                          {!stateStringCheck.get(searchValue) &&
                            <Icon style={ProductSuggestStyles.iconCheck} name="unCheckedIcon" />
                          }
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              )
            }
            <View style={ProductSuggestStyles.modalButton}>
              <CommonButton onPress={() => { prepareDataViewSelected() }} status={StatusButton.ENABLE} icon="" textButton={translate(messages.confirmOfBusinessCard)} typeButton={TypeButton.BUTTON_MINI_MODAL_SUCCESS}></CommonButton>
            </View>
          </View>
        </View>
      </RNModal>
    </View>
  )
}