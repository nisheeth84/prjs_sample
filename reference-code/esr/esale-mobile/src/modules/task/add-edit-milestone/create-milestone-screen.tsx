import React, { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import RNDatePicker from "react-native-modal-datetime-picker";
import moment from "moment";
import { FormInput } from "../../../shared/components/form-input";
import { messages } from "../add-edit-task/create-task-messages";
import { translate } from "../../../config/i18n";
import { styles } from "./milestone-style";
import { createMilestone, updateMilestone } from "./milestone-reponsitory";
import { messages as m } from "./create-milestone-messages";
import { CreateMilestoneScreenRouteProp } from "../../../config/constants/root-stack-param-list";
import { ControlType, TypeMessage } from "../../../config/constants/enum";
import { getMilestoneDetail } from "../task-repository";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { CommonStyles } from "../../../shared/common-style";
import { CommonMessage } from "../../../shared/components/message/message";
import { responseMessages } from "../../../shared/messages/response-messages";
import { ModalCancel } from "../../../shared/components/modal-cancel";
import _ from "lodash";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../login/authorization/authorization-selector";




export const CreateMilestone = () => {
  let params = {
    milestoneName: TEXT_EMPTY,
    memo: null,
    endDate: translate(messages.addEndDate),
    isDone: 0,
    isPublic: 0,
    createdDate: translate(messages.regisAutomatic),
    createdUserName: translate(messages.regisAutomatic),
    updatedDate: translate(messages.regisAutomatic),
    updatedUserName: translate(messages.regisAutomatic),
  };
  const navigation = useNavigation();
  const [isVisibleStartDate, setVisibleStartDate] = React.useState(false);
  const [paramsMilestone, setParamMilestone] = React.useState<any>(params);
  const [type, setType] = React.useState(ControlType.ADD);
  const [isShowDirtyCheck, setShowDirtyCheck] = React.useState(false);
  const [isChange, setChange] = React.useState(false);
  const [paramsCurrentMilestone, setParamsCurrentMilestone] = React.useState<any>(params);
  const userInfo = useSelector(authorizationSelector);
  const route = useRoute<CreateMilestoneScreenRouteProp>();
  /**
    * message success
    */
  const messageEmpty = {
    content: TEXT_EMPTY,
    type: TEXT_EMPTY,
  };
  const [message, setMessage] = React.useState([messageEmpty]);

  useEffect(() => {
    if (route?.params?.milestoneId) {
      setType(route?.params?.type);
      callApi();
    }
    async function callApi() {
      const params = {
        milestoneId: route.params?.milestoneId,
      };
      const response = await getMilestoneDetail(params);
      if (response && response.status === 200) {
        const newParams: any = response.data;
        newParams.isDone = response.data.isDone == 1;
        setParamMilestone(response.data);
        setParamsCurrentMilestone(response.data)
      }
    }
    const getDataAdd = () => {
      setType(ControlType.ADD);
    };

    const getDataEdit = () => {
      callApi();
      setType(ControlType.EDIT);
    };

    const getDataCopy = () => {
      callApi();
      setType(ControlType.COPY);
    };

    switch (route?.params?.type) {
      case ControlType.EDIT:
        getDataEdit();
        break;
      case ControlType.ADD:
        getDataAdd();
        break;
      case ControlType.COPY:
        getDataCopy();
        break;
      default:
        if (route?.params?.milestoneId) {
          getDataEdit();
        } else {
          getDataAdd();
        }
    }
  }, [route?.params?.milestoneId, route?.params?.type]);

  const handleChange = (dataCurrent: any, newData: any) => {
    if (_.intersectionWith([dataCurrent], [newData], _.isEqual).length > 0) {
      return false
    }
    return true
  }

  useEffect(() => {
    if (type === ControlType.ADD) {
      setChange(handleChange(params, paramsMilestone))
      return
    }
    setChange(handleChange(paramsCurrentMilestone, paramsMilestone))
  }, [paramsMilestone])

  async function callApiCreateMilestone() {
    const newParams = {
      milestoneName: paramsMilestone.milestoneName.trim(),
      memo: paramsMilestone.memo.trim(),
      endDate: paramsMilestone.endDate == translate(messages.addEndDate) ? null : paramsMilestone.endDate,
      isDone: paramsMilestone.isDone === true ? 1 : 0,
      isPublic: paramsMilestone.isPublic === true ? 1 : 0,
      customerId: null,
    };
    const response = await createMilestone(newParams, {});
    if (response.status === 200) {
      setMessage([
        {
          content: translate(responseMessages.INF_COM_0004),
          type: TypeMessage.SUCCESS,
        },
      ]);
      setTimeout(() => {
        setMessage([messageEmpty]);
        navigation.goBack();
      }, 2000);
      return;
    }
    setMessage(response.data.parameters.extensions.errors.map((elm: any) => { return { content: translate(responseMessages[elm.errorCode]), type: elm.errorCode.slice(0, 3) } }))
  }

  async function callApiUpdateMilestone() {
    const newParams = {
      milestoneName: paramsMilestone.milestoneName.trim(),
      memo: paramsMilestone.memo.trim(),
      endDate: paramsMilestone.endDate == translate(messages.addEndDate) ? null : paramsMilestone.endDate,
      isDone: paramsMilestone.isDone === true ? 1 : 0,
      isPublic: paramsMilestone.isPublic === true ? 1 : 0,
      updatedDate: paramsMilestone.updatedDate,
      milestoneId: paramsMilestone.milestoneId,
      customerId: null,
    };

    const callApi = await updateMilestone(newParams);

    if (callApi.status === 200) {
      setMessage([
        {
          content: translate(responseMessages.INF_COM_0004),
          type: TypeMessage.SUCCESS,
        },
      ]);
      setTimeout(() => {
        setMessage([messageEmpty]);
        navigation.goBack();
      }, 2000);
      return;

    }
    setMessage(callApi.data.parameters.extensions.errors.map((elm: any) => { return { content: translate(responseMessages[elm.errorCode]), type: elm.errorCode.slice(0, 3) } }))

  }


  const handleChangeProperty = (fieldName: string, newValue: any) => {
    const newParams: any = { ...paramsMilestone };
    newParams[fieldName] = newValue;
    setParamMilestone(newParams);
  };

  const handleConfirmEndDate = (date: any) => {
    setVisibleStartDate(false);
    const dateString = `${moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS")}Z`;

    handleChangeProperty("endDate", dateString);
  };
  return (
    <View style={styles.container}>
      <AppBarModal
        title={type === ControlType.EDIT
          ? translate(m.milestoneEdit)
          : translate(m.milestoneRegistration)}
        titleButtonCreate={type === ControlType.EDIT
          ? translate(m.save)
          : translate(messages.registration)}
        isEnableButtonCreate={true}
        onCreate={() =>
          type === ControlType.EDIT
            ? callApiUpdateMilestone()
            : callApiCreateMilestone()}
        onClose={() => isChange ? setShowDirtyCheck(true) : navigation.goBack()}
      />
      <ScrollView style={[styles.container]}>
        {message[0].type != TypeMessage.SUCCESS && message[0].type != TEXT_EMPTY && (
          <View style={styles.boxMessage}>
            {message.map((elm) => <CommonMessage content={elm.content} type={elm.type} />
            )}
          </View>
        )}
        <FormInput
          required
          title={translate(m.milestoneName)}
          placeholder={translate(m.milestoneEnterName)}
          _onChangeText={(text) => handleChangeProperty("milestoneName", text)}
          value={paramsMilestone.milestoneName}
          textInputStyle={styles.paddingHoz}
          formInputStyle={styles.paddingView}
        />

        <View style={styles.viewItemContent}>
          <Text style={CommonStyles.black14}>{translate(m.completionDate)}</Text>
          <TouchableOpacity onPress={() => setVisibleStartDate(true)}>
            <Text style={styles.txtTime}>{paramsMilestone.endDate == translate(messages.addEndDate) ? paramsMilestone.endDate : moment(paramsMilestone.endDate).format(userInfo.formatDate)}</Text>
          </TouchableOpacity>
          <RNDatePicker
            isVisible={isVisibleStartDate}
            mode="date"
            onCancel={() => setVisibleStartDate(false)}
            onConfirm={handleConfirmEndDate}
          />
        </View>

        <FormInput
          switchBox
          toggleSwitch={(isDone) =>
            handleChangeProperty("isDone", isDone)
          }
          enableSwitch={paramsMilestone.isDone}
          title={translate(m.scheduled)}
          value={translate(m.complete)}
          inputEditable={false}

        />

        <FormInput
          switchBox
          toggleSwitch={(isPublic) =>
            handleChangeProperty(
              "isPublic",
              isPublic
            )
          }
          enableSwitch={paramsMilestone.isPublic}
          title={translate(m.publishing)}
          value={translate(m.milestonePublic)}
          inputEditable={false}
        />
        <FormInput
          title={translate(m.note)}
          placeholder={translate(m.noteHolder)}
          multiline
          _onChangeText={(text) => handleChangeProperty("memo", text)}
          value={paramsMilestone.memo}
          textInputStyle={styles.paddingHoz}
          formInputStyle={styles.paddingView}
        />

        <View style={styles.viewItemContent}>
          <Text style={CommonStyles.black14}>{translate(m.customer)}</Text>
          <TouchableOpacity>
            <Text style={styles.txtTime}>{translate(m.selectCustomer)}</Text>
          </TouchableOpacity>
        </View>

        {route?.params.type !== ControlType.ADD && (
          <View>
            <FormInput
              title={translate(m.registrationDate)}
              inputEditable={false}
              value={moment(paramsMilestone.createdDate).format(userInfo.formatDate)}
              customUrlStyle={styles.inputLabel}
            />
            <FormInput
              title={translate(m.person)}
              inputEditable={false}
              value={paramsMilestone.createdUserName}
              customUrlStyle={styles.inputLabel}
            />
            <FormInput
              title={translate(m.lastUpdate)}
              inputEditable={false}
              value={moment(paramsMilestone.updatedDate).format(userInfo.formatDate)}
              customUrlStyle={styles.inputLabel}
            />
            <FormInput
              title={translate(m.updateBy)}
              inputEditable={false}
              value={paramsMilestone.updatedUserName}
              customUrlStyle={styles.inputLabel}
            />
          </View>
        )}
        <ModalCancel
          visible={isShowDirtyCheck}
          titleModal={TEXT_EMPTY}
          textBtnRight={translate(messages.ok)}
          textBtnLeft={translate(messages.cancel)}
          btnBlue
          onPress={() => navigation.goBack()}
          closeModal={() => setShowDirtyCheck(!isShowDirtyCheck)}
          contentModal={translate(responseMessages.WAR_COM_0007)}
          containerStyle={styles.boxConfirm}
          textStyle={styles.txtContent}
        />
      </ScrollView>
      {message[0].type == TypeMessage.SUCCESS && (
        <View style={styles.boxMessageSuccess}>
          <CommonMessage content={message[0].content} type={message[0].type} />
        </View>
      )}
    </View>
  );
};
