import React, { useState, useEffect } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View, Clipboard } from "react-native";
import styles from "./calendar-details/style";
import { Images } from "../config/images";
import { ChangeHistory } from './calendar-details/change-history';
// import { HistoryComment } from './calendar-details/history-comment';
import { BasicInformationDetail } from './calendar-details/basic-information-detail';
import { BasicInformation } from './calendar-details/basic-information';
import BaseModal from "../common/modal";
import { useSelector, useDispatch } from "react-redux";
import { calendarDetailSelector } from "../calendar-selector";
import {
  getSchedule, updateScheduleStatus, deleteSchedule
} from "../calendar-repository";
import { calendarActions } from "../calendar-reducer";
import { CONVERT_DATE } from "../../../config/constants/constants";
import { useNavigation } from "@react-navigation/native";
import { Calendar } from '../api/get-schedule-type';
import { SWITCH_TAB_TYPE, DEL_FLAG, TYPE_CRUD, SCHEDULE_STATUS } from '../constants';
import { messages } from "../calendar-list-messages";
import { translate } from "../../../config/i18n";
import { TypeMessage } from '../../../config/constants/enum';
import { checkResponse } from '../common/helper';
import { AppBarEmployee } from '../../../shared/components/appbar/appbar-employee'
import { CommonMessage } from '../../../shared/components/message/message'


/**
 * component calendar detail
 * @param route data from route 
 */
export const CalendarDetailScreen = ({ route }: any) => {

  const navigation = useNavigation();
  const [itemId, setItemId] = useState(route.params?.id)
  const [status, setStatus] = useState('')
  const [statusModal, setStatusModal] = useState<any>({
    isVisible: false,
  });
  const [deleteFlag, setDeleteFlag] = useState(DEL_FLAG.ONE);
  const [tab, setTab] = useState(SWITCH_TAB_TYPE.INFO);

  /* 
  * Switch tab type: 1: 基本情報, 2: 変更履歴
   */
  const switchTab = (type: number) => {
    setTab(type);
  }

  // getCalendar
  const dispatch = useDispatch();

  let calendar: any = useSelector(calendarDetailSelector);

  const [ContentMessage, setContentMessage] = useState('');
  const [TypeOfMessage, setTypeOfMessage] = useState('');


  /**
   * get schedule
   */
  const getScheduleApi = () => {
    getSchedule(itemId).then((data) => {

      const calendarResponse: Calendar = data.data
      if (!calendarResponse) {
        setContentMessage('SCHEDULE HAS BEEN DELETED')
        setTypeOfMessage(TypeMessage.ERROR)
        setTimeout(() => {
          setContentMessage('')
          setTypeOfMessage('')
          navigation.goBack();
        }, 800);
      }
      else {
        const dataCheck = checkResponse(data);
        if (dataCheck.result) {
          if (data) {
            // Check exist data 
            // Check Permission
            // if (!calendarResponse.isPublic && !calendarResponse.participants?.employees?.find(item => item.employeeId == calendarResponse.employeeLoginId)) {
            //   navigation.goBack();
            //   dispatch(calendarActions.setMessages({
            //     type: TypeMessage.INFO,
            //     content: "Schedule has been deleted",
            //     isShow: true
            //   }))
            // }

            //check call success

            dispatch(
              calendarActions.getCalendar({
                calendar: calendarResponse,
              })
            );
            setContentMessage('GET SCHEDULE DETAIL SUCCESS')
            setTypeOfMessage(TypeMessage.SUCCESS)
            setTimeout(() => {
              setContentMessage('')
              setTypeOfMessage('')
            }, 1500);
            console.log('DATASTATUS', status)


            // const listDivisionEmployees = data.data.participants?.employees;
            // const result = listDivisionEmployees?.filter(listEmployees => listEmployees.employeeId == data.data.employeeLoginId)
            // if (result) {
            //   const attendanceDivision = result[0]?.attendanceDivision;
              if (data.data?.attendanceDivision == 1) {
                setStatus('JOIN')
              }
              else if (data.data?.attendanceDivision == 2) {
                setStatus('ABSENT')
              }

            // }

            // const listShareEmployees = data.data.sharers?.employees;
            // const result_share = listShareEmployees?.filter(listEmployees => listEmployees.employeeId == data.data.employeeLoginId)
            // if (result_share?.length >= 1) {
            //   const attendanceDivisionShare = result_share[0]?.attendanceDivision;
              if (data.data?.attendanceDivision == null) {
                setStatus('SHARE')

              }
            // }
          }
        } else {
          dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
        }
      }
    })
      .catch(
        (error) => {
          setContentMessage(`${error}`)
          setTypeOfMessage(TypeMessage.ERROR)
          setTimeout(() => {
            setContentMessage('')
            setTypeOfMessage('')
          }, 1500);
        }
      )
  }
  useEffect(() => {
    dispatch(calendarActions.setMessages({}))
    getScheduleApi()
  }, [itemId]);
  useEffect(() => {
    setItemId(itemId)
  }, [itemId])

  // useEffect(() => {
  //   if(calendar.scheduleId !== undefined){
  //     showToastMessage({
  //       type: TypeMessage.SUCCESS,
  //       content: "GET SCHEDULE DETAIL SUCCESS"
  //     })
  //   }
  // })
  // getSchedule

  /* 
  * Update schedule
  */
  function setUpdateScheduleStatus(scheduleId: number, status_: string) {
    updateScheduleStatus(scheduleId, status_, calendar.updatedDate).then((scheduleData) => {
      const dataCheck = checkResponse(scheduleData);
      if (dataCheck.result) {
        if (scheduleData) {
          // showToastMessage({
          //   type: TypeMessage.SUCCESS,
          //   content: translate(messages.success)
          // })

          setContentMessage(translate(messages.success))
          setTypeOfMessage(TypeMessage.SUCCESS)
          setTimeout(() => {
            setContentMessage('')
            setTypeOfMessage('')
          }, 1500);


          getScheduleApi()
        }
      } else {
        dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
      }
    });
  }
  /* 
  ShowModalDelete
  */
  const showDeletePopup = () => {
    setStatusModal({
      isVisible: true,
    });
  }
  /* 
  *  edit Calendar
  */
  const editCalendar = () => {
    goToCreateScreen(TYPE_CRUD.EDIT);
  }

  /* 
  *  copyCalendar
  */
  const copyCalendar = () => {
    goToCreateScreen(TYPE_CRUD.COPY);
  }
  /* 
  * Go to Create Screen 
  * type: 4 copy, 5 edit
  */
  const goToCreateScreen = (type: number) => {
    navigation.navigate(
      "create-screen",
      {
        calendar: { ...calendar, scheduleId: type == TYPE_CRUD.COPY ? null : calendar.scheduleId },
        typeScreen: 1
      }
    );
  };

  const timeOutError = () => {
    setContentMessage('')
    setTypeOfMessage('')
  }
  const errorCatch = (error: any) => {
    setContentMessage(`${error}`)
    setTypeOfMessage(TypeMessage.ERROR);
    setTimeout(timeOutError, 1500);

  }
  /* 
  * Hide Modal
  */
  const hideModal = () => {
    setStatusModal({ isVisible: false });
  }
  /* 
  * Delete Calendar
  */
  function deleteCalendarApi(scheduleId: number, deleteFlg: number) {
    hideModal()
    deleteSchedule(scheduleId, deleteFlg).then((scheduleData) => {
      const dataCheck = checkResponse(scheduleData);
      if (dataCheck.result) {
        if (scheduleData) {
          const errors = scheduleData.data.errors;
          if (errors && errors.length > 0) {
            dispatch(calendarActions.setMessages({
              messages: {
                type: TypeMessage.ERROR,
                content: errors[0].message,
              }
            }))
          } else {
            // showToastMessage({
            //   type: TypeMessage.SUCCESS,
            //   content: translate(messages.success)
            // })
            setContentMessage('DELETE SCHEDULE SUCCESS')
            setTypeOfMessage(TypeMessage.SUCCESS)
            setTimeout(() => {
              navigation.goBack();
              setContentMessage('')
              setTypeOfMessage('')
            }, 800);
          }
        }
      } else {
        dispatch(calendarActions.setMessages({ messages: dataCheck.messages }))
      }
    })
      .catch(
        errorCatch
      )
  }

  return (
    <View style={styles.bg_main}>
      <View style={styles.container}>
        <AppBarEmployee name={translate(messages.calendar)} />
        {ContentMessage == '' && TypeOfMessage == '' ?
          null
          :
          <View>
            <CommonMessage content={ContentMessage} type={TypeOfMessage} />
          </View>

        }
        <View style={styles.top_contents}>
          <View style={styles.dot} />
          <View style={styles.top_title}>
            <View style={styles.top_Text}>
              <Text>
                {calendar?.scheduleName}
              </Text>
              <Text style={styles.time}>
                {CONVERT_DATE(calendar?.startDate, calendar?.finishDate)}
              </Text>

              {/* touch chuyển đến màn timeline (chưa có icon, chưa có màn time line) */}
              <TouchableOpacity style={styles.icon_timeline}
                onPress={() => {
                  alert('GO TO TIMELINE SCREEN')
                }} >
                <Image
                  style={[styles.icon_save]}
                  source={Images.schedule_details.icon_timeline}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.icon_share} onPress={() => Clipboard.setString(calendar?.scheduleName)}>
                <Image
                  style={[styles.icon_save]}
                  source={Images.schedule_details.icon_share}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.edit_button}>
              <View style={styles.tool}>
                {
                  status == 'JOIN' 
                  // || !calendar?.isParticipant 
                  ?
                    <View>
                      <View
                        //  style={[styles.tool_button, calendar.isParticipant && styles.buttonDisabled]}
                        style={[styles.tool_button, calendar.isParticipant && styles.buttonDisabled]}
                      >
                        <Image
                          style={ !calendar?.isParticipant ? [styles.icon_check] : [styles.icon_checked]}
                          source={Images.schedule_details.icon_check}
                        />
                        <Text style={ !calendar?.isParticipant ? styles.text_button : styles.textEnable}>{translate(messages.isAttended)}</Text>
                      </View>
                    </View>
                    :
                    <TouchableOpacity
                      onPress={() => {
                        // calendar.isParticipant &&
                          setUpdateScheduleStatus(calendar?.scheduleId, SCHEDULE_STATUS.JOIN);
                      }}>
                      <View
                        //  style={[styles.tool_button, calendar.isParticipant && styles.buttonDisabled]}
                        style={[styles.tool_button, styles.buttonEnable]}

                      >
                        <Image
                          style={[styles.icon_check]}
                          source={Images.schedule_details.icon_check}
                        />
                        <Text style={styles.text_button}>{translate(messages.isAttended)}</Text>
                      </View>
                    </TouchableOpacity>
                }
                {
                  status == 'ABSENT'  
                  // || !calendar?.isParticipant 
                  ?
                    <View>
                      <View style={[styles.tool_button, calendar.isParticipant && styles.buttonDisabled]}
                      >
                        <Image
                          style={ !calendar?.isParticipant ? [styles.icon_check] : [styles.icon_checked]}
                          source={Images.schedule_details.icon_close}
                        />
                        <Text style={ !calendar?.isParticipant ? styles.text_button : styles.textEnable}>{translate(messages.isAbsence)}</Text>
                      </View>
                    </View>
                    :
                    <TouchableOpacity
                      onPress={() => {
                        // calendar.isParticipant &&
                          setUpdateScheduleStatus(calendar?.scheduleId, SCHEDULE_STATUS.ABSENT);
                      }}>
                      <View style={[styles.tool_button, calendar.isParticipant && styles.buttonEnable]}
                      >
                        <Image
                          style={[styles.icon_close]}
                          source={Images.schedule_details.icon_close}
                        />
                        <Text style={styles.text_button}>{translate(messages.isAbsence)}</Text>
                      </View>
                    </TouchableOpacity>
                }
                {
                  status == 'SHARE' 
                  // || !calendar?.isParticipant 
                  ?
                    <View>
                      <View style={[styles.tool_button, styles.buttonDisabled]}>
                        <Image
                          style={ [styles.icon_checked]}
                          source={Images.schedule_details.icon_share}
                        />
                        <Text style={ styles.textEnable}>{translate(messages.isShared)}</Text>
                      </View>
                    </View>
                    :
                    <TouchableOpacity
                      onPress={() => {
                        calendar.isParticipant &&
                          setUpdateScheduleStatus(calendar?.scheduleId, SCHEDULE_STATUS.SHARE);
                      }}
                    >
                      <View style={[styles.tool_button]}>
                        <Image
                          style={[styles.icon_shared]}
                          source={Images.schedule_details.icon_share}
                        />
                        <Text style={styles.text_button}>{translate(messages.isShared)}</Text>
                      </View>
                    </TouchableOpacity>

                }
              </View>
              <View style={styles.tool_right}>
                <TouchableOpacity onPress={() => copyCalendar()}>
                  <Image
                    style={styles.icon_save}
                    source={Images.schedule_details.icon_save}
                  />
                </TouchableOpacity>
                {calendar?.canModify &&
                  <TouchableOpacity onPress={() => editCalendar()}>
                    <Image
                      style={styles.icon_pencil}
                      source={Images.schedule_details.icon_pencil}
                    />
                  </TouchableOpacity>
                }
                {
                  calendar?.canModify &&
                  <TouchableOpacity onPress={() => showDeletePopup()}>
                    <Image
                      style={styles.icon_recycle_bin}
                      source={Images.schedule_details.icon_recycle_bin}
                    />
                  </TouchableOpacity>
                }
              </View>
            </View>
          </View>
        </View>
      </View>
      <View>
        <View>
          <View style={styles.tab_view}>
            <TouchableOpacity onPress={() => switchTab(SWITCH_TAB_TYPE.INFO)} style={[styles.tab_view_item, tab == SWITCH_TAB_TYPE.INFO && styles.tab_act]}><Text style={[styles.tab_title, tab == SWITCH_TAB_TYPE.INFO && styles.text_act]}>{translate(messages.information)}</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => switchTab(SWITCH_TAB_TYPE.HISTORY)} style={[styles.tab_view_item, tab == SWITCH_TAB_TYPE.HISTORY && styles.tab_act]}><Text style={[styles.tab_title, tab == SWITCH_TAB_TYPE.HISTORY && styles.text_act]}>{translate(messages.history)}</Text></TouchableOpacity>
          </View>
          <View>
            {calendar &&
              <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
                {tab == SWITCH_TAB_TYPE.INFO && (
                  <>
                    <BasicInformation key={'Basic_information'} schedule={calendar} />
                    <BasicInformationDetail key={'Basic_Information_detail'} schedule={calendar} />
                  </>
                )}
                {tab == SWITCH_TAB_TYPE.HISTORY &&
                  (
                    <>
                      <ChangeHistory key={'Change_history'} scheduleHistories={calendar.scheduleHistories} scheduleId={calendar.scheduleId} />
                      {/* <HistoryComment key={'History_comment'}/> */}
                    </>
                  )}
              </ScrollView>
            }
          </View>
        </View>
      </View>
      <BaseModal
        isVisible={statusModal.isVisible}
        onBackdropPress={() => hideModal()}
      >
        <View style={styles.modal}>
          {statusModal.isVisible &&
            <Text style={styles.title_modal}>{translate(messages.deleteScheduleTitle)}</Text>
          }
          <View>
            {
              calendar?.isRepeated &&
              <View>
                <TouchableOpacity style={styles.text_modal_item} onPress={() => setDeleteFlag(DEL_FLAG.ONE)}>
                  <Text style={styles.modal_text}>
                    {translate(messages.deleteScheduleCurrent)}
                  </Text>
                  {
                    deleteFlag == DEL_FLAG.ONE &&
                    <View style={styles.check_text}>
                      <Image source={Images.schedule_details.icon_check_short} />
                    </View>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setDeleteFlag(DEL_FLAG.AFTER)}>
                  <Text style={styles.modal_text}>
                    {translate(messages.deleteScheduleCurrentAndRepeat)}
                  </Text>
                  {
                    deleteFlag == DEL_FLAG.AFTER &&
                    <View style={styles.check_text}>
                      <Image source={Images.schedule_details.icon_check_short} />
                    </View>
                  }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setDeleteFlag(DEL_FLAG.ALL)}>
                  <Text style={styles.modal_text}>
                    {translate(messages.deleteAllSchedule)}
                  </Text>
                  {
                    deleteFlag == DEL_FLAG.ALL &&
                    <View style={styles.check_text}>
                      <Image source={Images.schedule_details.icon_check_short} />
                    </View>
                  }
                </TouchableOpacity>
              </View>
            }
            <View style={styles.footer_modal}>
              <TouchableOpacity onPress={() => hideModal()}><Text style={[styles.button_modal, { borderWidth: 1, borderColor: '#E5E5E5', }]}>{translate(messages.cancel)}</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCalendarApi(calendar?.scheduleId, deleteFlag)}><Text style={[styles.button_modal, { borderWidth: 1, borderColor: '#F92525', backgroundColor: '#F92525', color: '#FFF' }]}>{translate(messages.delete)}</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </BaseModal>
    </View>
  );
}
