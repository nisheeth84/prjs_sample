import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { translate } from "../../../../config/i18n";
import { messages } from "../task-detail-messages";
import {
  theme
} from "../../../../config/constants";
import { TaskGeneralInfoItem } from "./task-general-info-item";
import {
  taskDetailSelector,
  taskDetailTotalEmployeeSelector,
  taskDetailCustomersSelector,
  taskDetailFilesSelector,
  taskDetailSubtasksSelector,
  taskDetailProductTradingSelector,
  taskDetailFieldInfoSelector
} from "../task-detail-selector";
import { TaskDetailStyles } from "../task-detail-style";
import {
  getFirstItem
} from "../../utils";
import { TaskGeneralInfoEmployeeList } from "./task-general-info-employee-list";
import { TaskGeneralInfoFileList } from "./task-general-info-file-list";
import { TaskGeneralInfoSubtaskList } from "./task-general-info-subtask-list";
import { TouchableWithoutFeedback, ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { DynamicControlField } from "../../../../shared/components/dynamic-form/control-field/dynamic-control-field";
import { ControlType, DefineFieldType, AvailableFlag } from "../../../../config/constants/enum";
import { FieldInfoItem } from "../../../../config/constants/field-info-interface";
import { CustomerProductTrading } from "./customer-product-trading";
import { ScreenName } from "../../../../config/constants/screen-name";
import StringUtils from "../../../../shared/util/string-utils";
import _ from 'lodash';


/**
 * Component show task general information tab
 * @param props 
 */
export function TaskGeneralInforTabScreen() {

  const taskDetail = getFirstItem(useSelector(taskDetailSelector));
  const employeeList = useSelector(taskDetailTotalEmployeeSelector);
  const customer = getFirstItem(useSelector(taskDetailCustomersSelector));
  const files = useSelector(taskDetailFilesSelector);
  const subtasks = useSelector(taskDetailSubtasksSelector);
  const productTradings = useSelector(taskDetailProductTradingSelector);
  const navigation = useNavigation();
  const taskFieldInfo = useSelector(taskDetailFieldInfoSelector);

  console.log("taskFieldInfo", taskDetail);

  const openMilestoneDetail = (milestoneId: number) => {
    navigation.navigate(ScreenName.MILESTONE_DETAIL, { milestoneId });
  }
  const findExtensionItem = (fieldName: any, extensionData: any) => {
    if ((extensionData || []).length === 0) {
      return null;
    }
    const item = extensionData.find((el: any) => {
      return el.key === fieldName;
    });
    return item?.value || null;
  };
  const convertData = (data: any, fieldItem: any) => {


    switch (fieldItem.fieldName) {
      case "status":
        return data["statusTaskId"];
      case "file_name":
        const dataConvertFile = data["files"]?.map((elm: any) => {
          return {
            file_name: elm["fileName"],
            file_url: elm["fileUrl"]
          }
        }
        );
        return dataConvertFile;
      case "operator_id":
        const convertOperator: any = [];
        data["operators"][0].employees.map((elm: any) => {
          return convertOperator.push({ department_id: null, group_id: null, employee_id: elm.employeeId })
        });
        return JSON.stringify(convertOperator);
      case "is_public":
        console.log("bbbbbbbbbbbb", fieldItem);
        const dataPublic: any = [];
        fieldItem.fieldItems.map((elm: any) => elm.isDefault === true && dataPublic.push(elm.itemId))
        return dataPublic;
      default:
        return data[StringUtils.snakeCaseToCamelCase(fieldItem.fieldName)]
    }
  }

  const getElementStatus = (fieldItem: any) => {
    const data: any = _.cloneDeep(taskDetail);
    console.log("xxxxxxxxx",
      StringUtils.snakeCaseToCamelCase(fieldItem.fieldName)
    );
    console.log("yyyyyyyyyyy", fieldItem);
    console.log("aaaaaaaaaa", data);

    return {
      fieldValue: fieldItem.isDefault
        ? convertData(data, fieldItem)
        : findExtensionItem(fieldItem.fieldName, data.taskData || []),
    };
  };

  const renderFieldInfo = (fieldItem: FieldInfoItem) => {
    if (
      fieldItem.availableFlag === AvailableFlag.NOT_AVAILABLE) {
      return;
    }

    if (fieldItem?.fieldType === Number(DefineFieldType.OTHER)) {
      switch (fieldItem.fieldName) {
        case "employee_name":
          return (
            <TaskGeneralInfoEmployeeList
              label={translate(messages.personInCharge)}
              colorValue={theme.colors.blue200}
              data={employeeList}
              countEmployee={taskDetail.countEmployee}
            />
          );
        case "customer_name":
          return customer && (
            <CustomerProductTrading
              label={translate(messages.taskCustomerName)}
              customerId={customer.customerId}
              customerName={customer.customerName}
              colorValue={theme.colors.blue200}
              productTradings={productTradings}
            />
          );
        case "milestone_name":
          return (
            <TouchableWithoutFeedback onPress={() => {
              openMilestoneDetail(taskDetail.milestoneId);
            }}>
              <TaskGeneralInfoItem label={translate(messages.taskMilestone)}
                value={taskDetail.milestoneName}
                colorValue={theme.colors.blue200} />
            </TouchableWithoutFeedback>
          );
        case "file_name":
          return (
            <TaskGeneralInfoFileList
              label={translate(messages.fileInclude)}
              colorValue={theme.colors.blue200}
              data={files}
            />
          );
        case "parent_id":
          return (
            <TaskGeneralInfoSubtaskList
              label={translate(messages.taskSubtask)}
              colorValue={theme.colors.blue200}
              data={subtasks}
            />
          );
        case "created_user":
          return (
            <TaskGeneralInfoItem label={translate(messages.registeredPerson)}
              value={taskDetail.registPersonName}
              colorValue={theme.colors.gray1} />);
        case "updated_user":
          return (
            <TaskGeneralInfoItem label={translate(messages.lastUpdatedBy)}
              value={taskDetail.refixPersonName}
              colorValue={theme.colors.gray1} />
          );
        default:
          return;
      }
    }

    return (
      <View style={[TaskDetailStyles.generalInfoItem, { backgroundColor: theme.colors.white }]}>
        <DynamicControlField
          controlType={ControlType.DETAIL}
          fieldInfo={fieldItem}
          elementStatus={getElementStatus(fieldItem)}
          listFieldInfo={taskFieldInfo}
        />
      </View>
    );
  }

  return (
    <ScrollView style={[TaskDetailStyles.container]}>
      {
        taskDetail &&
        <View>
          {[...taskFieldInfo]
            ?.sort((a: any, b: any) => a.fieldOrder - b.fieldOrder)
            .map((fieldInfo) => {
              return renderFieldInfo(fieldInfo);
            })}
        </View>
      }
    </ScrollView>

  );
}
