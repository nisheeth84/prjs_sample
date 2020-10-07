import React, { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { CustomerEditMilestoneStyle } from './customer-registration-edit-styles';
import { messages } from './customer-registration-edit-messages';
import { translate } from '../../../config/i18n';
import { Header } from '../../../shared/components/header';
import { Icon } from '../../../shared/components/icon';
import { CommonStyles } from '../../../shared/common-style';
import { ItemMilestone } from './item-milestone';
import { CustomerModalScenario } from '../modal/customer-modal-scenarios';
import {
  GetMasterScenariosDataDataResponse,
  getMasterScenario,
  getScenario,
  saveScenario,
} from '../customer-repository';
import { CustomerModalConfirm } from '../modal/customer-modal-confirm';
import { CustomerModalListEmployees } from '../modal/customer-modal-list-employees';
import { CustomerActions } from '../customer-reducer';
import {
  getMasterScenarioSelector,
  getScenarioSelector,
} from '../customer-selector';
import { FORMAT_DATE } from '../../../config/constants/constants';
import { MODE } from '../../../config/constants/enum';
// import { deleteMilestones, deleteTasks } from "../../task/task-repository";
// import {
//   queryDeleteMilestone,
//   queryDeleteTask,
// } from "../../../config/constants/query";

const styles = CustomerEditMilestoneStyle;

const TYPE_MODAL = {
  scenarios: 1,
  confirm: 2,
  deleteMilestone: 3,
  deleteTask: 4,
  discard: 5,
  employees: 6,
  dateTimePicker: 7,
};

let templateSelected = { scenarioId: 0, scenarioName: '' };
let dataEmployees: any[] = [];
let indexMilestoneSelected = -1;
let indexTaskSelected = -1;
let dateSelected = '1970/1/1';

export function CustomerEditMilestoneScreen() {
  const route: any = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [visible, setVisible] = useState(0);
  const [template, setTemplate] = useState(translate(messages.selectTemplate));
  const [templateId, setTemplateId] = useState(0);
  const [dataMilestones, setDataMilestones] = useState<any[]>([]);

  const dataGetScenarioSelector = useSelector(getScenarioSelector);
  const dataMilestoneNames = useSelector(getMasterScenarioSelector);

  const lastIndex =
    dataMilestones.length -
    1 -
    _.cloneDeep(dataMilestones)
      .reverse()
      .findIndex((el: any) => el.mode !== MODE.DELETE);

  /**
   * call api getMasterScenario
   */
  const getMasterScenarioFunc = async () => {
    const params = {
      scenarioId: templateId,
    };
    const response = await getMasterScenario(params);
    if (response && response.status === 200) {
      dispatch(CustomerActions.getMasterScenario(response.data));
    }
  };

  useEffect(() => {
    if (templateId > 0) {
      getMasterScenarioFunc();
    }
  }, [templateId]);

  useEffect(() => {
    const data = dataGetScenarioSelector.filter((el: any) => {
      return dataMilestoneNames.some(
        (elm: { milestoneName: string }) =>
          elm.milestoneName === el.milestoneName
      );
    });
    setDataMilestones(data);
  }, [dataMilestoneNames]);

  /**
   * call api getScenarioFunc
   */
  const getScenarioFunc = async () => {
    const params = {
      customerId: route.params?.customerId,
    };
    const response = await getScenario(params);
    if (response && response.status === 200) {
      dispatch(CustomerActions.getScenario(response.data));
    }
  };

  useEffect(() => {
    getScenarioFunc();
  }, []);

  /**
   * todo when go back
   */
  const goBackFunc = () => {
    setDataMilestones([]);
    navigation.goBack();
  };

  /**
   * call api saveScenario
   */
  const saveScenarioFunc = async () => {
    const params = {
      scenarioId: null,
      customerId: route.params?.customerId,
      milestones: dataMilestones,
    };
    const response = await saveScenario(params);
    if (response) {
      switch (response.status) {
        case 200:
          alert('Success');
          goBackFunc();
          break;
        case 400:
          alert('Bad Request');
          break;
        default:
          alert('Error');
          break;
      }
    }
  };

  /**
   * save data
   */
  const onSave = () => {
    saveScenarioFunc();
  };

  /**
   * close all modal in screen
   */
  const closeAllModal = () => {
    setVisible(0);
  };

  /**
   * handle date picked date
   * @param date
   */
  const onPickDate = (date: any) => {
    closeAllModal();
    const data = _.cloneDeep(dataMilestones);
    const newDate = moment(date).format(FORMAT_DATE.DD_MM_YYYY);
    if (indexTaskSelected < 0) {
      data[indexMilestoneSelected].finishDate = newDate;
    } else {
      data[indexMilestoneSelected].tasks[
        indexTaskSelected
      ].finishDate = newDate;
    }
    setDataMilestones(data);
  };

  /**
   * show modal confirm select template
   * @param item
   */
  const onConfirm = (item: GetMasterScenariosDataDataResponse) => {
    if (item.scenarioId === 0) {
      closeAllModal();
      return;
    }
    templateSelected = item;
    setVisible(TYPE_MODAL.confirm);
  };

  /**
   * handle delete milestone
   */
  const onDeleteMilestone = () => {
    const data = _.cloneDeep(dataMilestones);
    data[indexMilestoneSelected].mode = MODE.DELETE;
    setDataMilestones(data);
    closeAllModal();
  };

  /**
   * handle delete task
   */
  const onDeleteTask = () => {
    const data = _.cloneDeep(dataMilestones);
    data[indexMilestoneSelected].tasks[indexTaskSelected].mode = MODE.DELETE;
    setDataMilestones(data);
    closeAllModal();
  };

  /**
   * change status done milestone
   * @param milestoneId
   */
  const onPressDoneItemMilestone = (indexMilestone: number) => {
    const data = _.cloneDeep(dataMilestones);
    data[indexMilestone].statusMilestoneId =
      1 - data[indexMilestone].statusMilestoneId;
    setDataMilestones(data);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={translate(messages.scenario)}
        nameButton={translate(messages.create)}
        onLeftPress={() => setVisible(TYPE_MODAL.discard)}
        onRightPress={onSave}
      />
      <View style={styles.viewTop}>
        <TouchableOpacity
          style={styles.btnRegistration}
          onPress={() => alert('Tính năng đang phát triển')}
        >
          <Text style={styles.txt}>{translate(messages.registration)}</Text>
        </TouchableOpacity>
        <View style={[CommonStyles.rowInlineSpaceBetween]}>
          <Text style={[styles.txtFontSize1, styles.bold]}>
            {translate(messages.reflect)}
          </Text>
          <TouchableOpacity
            style={styles.touchSelect}
            onPress={() => setVisible(TYPE_MODAL.scenarios)}
          >
            <Text style={[styles.txtFontSize1, styles.bold]}>{template}</Text>
            <Icon name="arrowDown" style={styles.iconArrow} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={CommonStyles.padding2} />
      <FlatList
        data={dataMilestones}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => {
          return (
            <ItemMilestone
              itemMilestone={item}
              lastItem={index === lastIndex}
              onPressDone={() => {
                onPressDoneItemMilestone(index);
              }}
              onPressEmployees={(data) => {
                dataEmployees = data;
                setVisible(TYPE_MODAL.employees);
              }}
              onPressDeleteMilestone={() => {
                indexMilestoneSelected = index;
                setVisible(TYPE_MODAL.deleteMilestone);
              }}
              onPressDeleteTask={(indexTask) => {
                indexMilestoneSelected = index;
                indexTaskSelected = indexTask;
                setVisible(TYPE_MODAL.deleteTask);
              }}
              onPressFinishDateOfMilestone={(date) => {
                dateSelected = date;
                indexMilestoneSelected = index;
                indexTaskSelected = -1;
                setVisible(TYPE_MODAL.dateTimePicker);
              }}
              onPressFinishDateOfTask={(indexTask, date) => {
                dateSelected = date;
                indexMilestoneSelected = index;
                indexTaskSelected = indexTask;
                setVisible(TYPE_MODAL.dateTimePicker);
              }}
              onChangeMilestoneName={(text) => {
                const data = _.cloneDeep(dataMilestones);
                data[index].milestoneName = text;
                setDataMilestones(data);
              }}
              onChangeTaskName={(indexTask, text) => {
                const data = _.cloneDeep(dataMilestones);
                data[index].tasks[indexTask].taskName = text;
                setDataMilestones(data);
              }}
            />
          );
        }}
      />
      <CustomerModalScenario
        visible={visible === TYPE_MODAL.scenarios}
        onConfirm={onConfirm}
      />
      <CustomerModalConfirm
        visible={visible === TYPE_MODAL.confirm}
        title={translate(messages.title)}
        content={translate(messages.content)}
        leftBtn={translate(messages.cancel)}
        rightBtn={translate(messages.confirm)}
        onConfirm={() => {
          closeAllModal();
          setTemplate(templateSelected.scenarioName);
          setTemplateId(templateSelected.scenarioId);
        }}
        onCancel={() => {
          templateSelected = { scenarioId: 0, scenarioName: '' };
          closeAllModal();
        }}
      />
      <CustomerModalConfirm
        visible={visible === TYPE_MODAL.discard}
        title={translate(messages.title)}
        content={translate(messages.content)}
        leftBtn={translate(messages.cancel)}
        rightBtn={translate(messages.confirm)}
        onConfirm={goBackFunc}
        onCancel={closeAllModal}
      />
      <CustomerModalConfirm
        visible={visible === TYPE_MODAL.deleteMilestone}
        title={translate(messages.title)}
        content={translate(messages.content)}
        leftBtn={translate(messages.cancel)}
        rightBtn={translate(messages.confirm)}
        onConfirm={onDeleteMilestone}
        onCancel={closeAllModal}
        styleRightBtn={styles.colorRed}
      />
      <CustomerModalConfirm
        visible={visible === TYPE_MODAL.deleteTask}
        title={translate(messages.title)}
        content={translate(messages.content)}
        leftBtn={translate(messages.cancel)}
        rightBtn={translate(messages.confirm)}
        onConfirm={onDeleteTask}
        onCancel={closeAllModal}
        styleRightBtn={styles.colorRed}
      />
      <CustomerModalListEmployees
        visible={visible === TYPE_MODAL.employees}
        data={dataEmployees}
        onClose={closeAllModal}
      />
      <DateTimePickerModal
        isVisible={visible === TYPE_MODAL.dateTimePicker}
        mode="date"
        date={moment(dateSelected || undefined).toDate()}
        onConfirm={onPickDate}
        onCancel={closeAllModal}
      />
    </SafeAreaView>
  );
}
