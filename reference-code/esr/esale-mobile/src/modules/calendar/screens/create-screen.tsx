import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity, Modal, SafeAreaView, ActivityIndicator } from "react-native";
import styles from "./calendar-details/style";
import { CalendarRegistration } from './calendar-registration/calendar-addition';
import { Button } from '../../../shared/components/button';
import { createSchedule} from '../calendar-repository';
import { useNavigation } from "@react-navigation/native";
import { GetSchedule, Calendar } from '../api/get-schedule-type';
import BaseModal from '../common/modal';
import { Images } from '../config';
import { messages } from "../calendar-list-messages";
import { translate } from "../../../config/i18n";
import { UPDATE_FLAG, DEFAULT_CRU } from '../constants';
import { calendarActions } from '../calendar-reducer';
import { useDispatch } from 'react-redux';
import { checkResponse, normalize} from '../common/helper';
import { Icon } from '../../../shared/components/icon';
import { CommonMessage } from '../../../shared/components/message/message';




/**
 * create screen
 * @param route data transfer
 */
export const CreateScreen = ({ route }: any) => {
  const { calendar } = route.params ?? { calendar: {} };
  const [dataCRU, setDataCRU] = useState(route.params ?? { calendar: {} });
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const [isServerError, setServerError] = useState(false);
  const [isServerSucess, setServerSuccess] = useState(false);

  useEffect(() => {
    dispatch(calendarActions.setMessages({}))
  }, [])

  /* 
  * create Schedule 
  * @param calendarItem
  */
  const createOrUpdateSchedule = (calendarItem: GetSchedule) => {
    createSchedule(calendarItem, []).then((response) => {
      if (response) {
        const dataCheck = checkResponse(response);
        if (dataCheck.result) {
          setCheckDuplicated(false);
          setServerError(false);
          setServerSuccess(true);
          setTimeout(()=>{navigation.navigate("schedule-detail-screen", { id: response.data.scheduleIds[0] }); setServerSuccess(false);}, 2000);
        } else {
          setCheckDuplicated(false);
          setServerError(true);
          setServerSuccess(false);
          dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
        }
      }
    })
      .catch(
        (error) => {
          console.log(error);
        }
      )
  }
  /**
   * Get Data from child component
   * @param data 
   */
  const callbackFunction = (data: Calendar) => {
    setDataCRU(data);
  }

  const [statusModalEdit, setStatusModalEdit] = useState<any>({
    isVisible: false,
  });
  const [updateFlag, setUpdateFlag] = useState(0);
  /**
   * editCalendar
   * @param updateFlag 
   */
  const editCalendar = (_updateFlag: number) => {
    setStatusModalEdit({ isVisible: false });
    setDataCRU({ ...dataCRU, updateFlag: _updateFlag });
    createOrUpdateSchedule(dataCRU);
  }

  const [isCheckDuplicated, setCheckDuplicated] = useState(false)
  const [isCheckDirty, setCheckDirty] = useState(false);
  const [isCheckScheduleType, setCheckScheduleType] = useState(false);
  const [isCheckScheduleName, setCheckScheduleName] = useState(false);
  const [isCheckScheduleTime, setCheckScheduleTime] = useState(false);

  /**
   * check create or update
   */
  const checkCreateUpdate = () => {

    checkValidate(dataCRU)
    // if (!dataCRU.scheduleId) {
    //   // createOrUpdateSchedule(dataCRU);
    //   checkValidate(dataCRU);
    // } else {

    //   setStatusModalEdit({ isVisible: true });
    // }
  }
 
  const checkValidate = (data: any) => {
    
    var check = 0;
    if (data.scheduleType.scheduleTypeId == 99) {
      setCheckScheduleType(true);
    } else {
      setCheckScheduleType(false);
      check += 1;
    }

      if(data.scheduleName.length === 0){
      setCheckScheduleName(true);
      }
     else {
      setCheckScheduleName(false);
      check += 1
    }


    if (data.startDay.substr(0, 4) > data.endDay.substr(0, 4)) {
      setCheckScheduleTime(true);
    }
    else {
      if (data.startDay.substr(5, 2) > data.endDay.substr(5, 2)) {
        setCheckScheduleTime(true);
      } else {
        if (data.startDay.substr(8, 2) > data.endDay.substr(8, 2)) {
          setCheckScheduleTime(true);
        } else {
          if (data.startTime.substr(0, 2) > data.endTime.substr(0, 2)) {
            setCheckScheduleTime(true);
          } else {
            if (data.startTime.substr(4, 2) > data.endTime.substr(4, 2)) {
              setCheckScheduleTime(true);
            } else {
              setCheckScheduleTime(false);
              check += 1
            }
          }
        }
      }
    }
    if (check == 3) {
      route?.params?.typeScreen === 1 &&  setStatusModalEdit({ isVisible: true });
      createOrUpdateSchedule(dataCRU);
      setCheckDuplicated(true);
    }

  }

  return (

    <SafeAreaView style={styles.bg_main}>
      <Modal
          visible={isCheckDuplicated}
          animationType="fade"
          transparent={true}
        >
          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
          <View style={{ backgroundColor: '#000', opacity: 0.7, width: '100%', height: '100%' }}/>
          <ActivityIndicator style={{position: 'absolute'}} size="large" color="#fff" />
          </View>
        </Modal>
      <View style={{ marginLeft: normalize(10), marginTop: normalize(10) }}>
        {isServerError && <View><CommonMessage content={"Server Error!"} type={"ERR"} /></View>}
        {isCheckScheduleType || isCheckScheduleName && <CommonMessage content={"入力必須項目です。値を入力してください。"} type={"ERR"} />}
        {isCheckScheduleTime && <CommonMessage content={"終了日は開始日より未来日で設定してください。"} type={"ERR"} />}
      </View>
      <View style={{ flexDirection: 'row', marginHorizontal: normalize(15), height: normalize(40), alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={() => { setCheckDirty(true) }}>
            <Icon name={"close"} />
          </TouchableOpacity>
        </View >
        <View style={{ flex: 4 }}>
          <Text style={{ fontWeight: 'bold', textAlign: 'center', fontSize: 16 }}>{route?.params?.typeScreen == 1 ? translate(messages.editSchedule) : translate(messages.createSchedule)}</Text>
        </View>
        <View style={{ flex: 1.2 }}>
          <Button style={{ height: normalize(32), width: normalize(65), marginLeft: normalize(10), paddingVertical: 5 }} onPress={() => checkCreateUpdate()}>
            {route?.params?.typeScreen == 1 ? translate(messages.save) : translate(messages.register)}
          </Button>
        </View>
      </View>
      <ScrollView nestedScrollEnabled={true}>
        <CalendarRegistration calendar={calendar} typeScreen={route?.params?.typeScreen ?? 0} callbackFunction={callbackFunction} isCheckScheduleType={isCheckScheduleType} isCheckScheduleName={isCheckScheduleName} isCheckScheduleTime={isCheckScheduleTime} />
      </ScrollView>

      <BaseModal
        isVisible={statusModalEdit.isVisible}
        onBackdropPress={() => setStatusModalEdit({ isVisible: false })}
      >
        <View style={styles.modal}>
          {statusModalEdit.isVisible &&
            <Text style={styles.title_modal}>{translate(messages.deleteScheduleTitle)}</Text>
          }
          <View>
            {
              calendar?.isRepeated == DEFAULT_CRU.IS_REPEAT_1 &&
              <View>
                <TouchableOpacity style={styles.text_modal_item} onPress={() => setUpdateFlag(1)}>
                  <Text style={styles.modal_text}>
                    {translate(messages.deleteScheduleCurrent)}
                  </Text>
                  {
                    updateFlag == UPDATE_FLAG.ONE &&
                    <View style={styles.check_text}>
                      <Image source={Images.schedule_details.icon_check_short} />
                    </View>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setUpdateFlag(1)}>
                  <Text style={styles.modal_text}>
                    {translate(messages.updateScheduleCurrentAndRepeat)}
                  </Text>
                  {
                    updateFlag == UPDATE_FLAG.AFTER &&
                    <View style={styles.check_text}>
                      <Image source={Images.schedule_details.icon_check_short} />
                    </View>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setUpdateFlag(2)}>
                  <Text style={styles.modal_text}>
                    {translate(messages.allPlan)}
                  </Text>
                  {
                    updateFlag == UPDATE_FLAG.ALL &&
                    <View style={styles.check_text}>
                      <Image source={Images.schedule_details.icon_check_short} />
                    </View>
                  }
                </TouchableOpacity>
              </View>
            }
            <View style={styles.footer_modal}>
              <TouchableOpacity onPress={() => setStatusModalEdit({ isVisible: false })}>
                <Text style={[styles.button_modal, { borderWidth: 1, borderColor: '#E5E5E5', }]}
                >{translate(messages.cancel)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editCalendar(updateFlag)}>
                <Text style={[styles.button_modal, { borderWidth: 1, borderColor: '#F92525', backgroundColor: '#F92525', color: '#FFF' }]}>
                  {translate(messages.delete)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BaseModal>

      {isServerSucess &&
        <View style={{ position: 'absolute', paddingHorizontal:normalize(12), bottom: normalize(20) }}>
          <CommonMessage content={"登録完了しました。"} type={'SUS'} />
        </View>}

      <Modal
        visible={isCheckDirty}
      >
        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000' }}>
          <View style={{ width: normalize(350), height: normalize(180), borderRadius: normalize(20), backgroundColor: '#fff', }}>
            <View style={{ width: '100%', height: normalize(120), borderBottomWidth: 1, borderBottomColor: '#e3e3e3', paddingVertical: normalize(20), paddingHorizontal: normalize(15) }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>編集中のデータを破棄しますか?</Text>
              <Text></Text>
              <Text style={{ fontSize: 15, textAlign: 'center' }}>編集中のデータが破棄されます。よろしいですか？</Text>
            </View>
            <View style={{ flexDirection: 'row', paddingHorizontal: normalize(30), paddingVertical: 10 }}>
              <TouchableOpacity onPress={() => setCheckDirty(false)}>
                <View style={{ width: normalize(130), height: normalize(40), backgroundColor: '#fff', borderRadius: normalize(10), }}>
                  <Text style={{ fontSize: 15, textAlign: 'center', paddingTop: normalize(10) }}>キャンセル</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { navigation.goBack() }}>
                <View style={{ width: normalize(130), height: normalize(40), backgroundColor: 'blue', marginLeft: normalize(30), borderRadius: normalize(10) }}>
                  <Text style={{ fontSize: 15, textAlign: 'center', paddingTop: normalize(10), color: '#fff', fontWeight: 'bold' }}>OK</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
        
    </SafeAreaView>
  );
}
