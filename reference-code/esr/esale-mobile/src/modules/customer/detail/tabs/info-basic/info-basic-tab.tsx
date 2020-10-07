import React, { FC, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { CustomerDetailScreenStyles } from "../../customer-detail-style";
import { Icon } from "../../../../../shared/components/icon";
import { ScheduleItem } from "../../shared/components/schedule-item";
import { useSelector, useDispatch } from 'react-redux';
import {
  taskSelector,
  scheduleSelector,
  activityHistorySelector,
  extendScheduleSelector,
  tradingProductsSelector,
  CustomerDetailSelector,
  scenariosSelector
} from '../../customer-detail-selector';
import { customerDetailActions } from "../../customer-detail-reducer";
import { translate } from "../../../../../config/i18n";
import { messages } from "../../customer-detail-messages";
import { DynamicControlField } from "../../../../../shared/components/dynamic-form/control-field/dynamic-control-field";
import { ControlType, STATUSBUTTON, TypeButton, MODE, DefineFieldType, RelationDisplay } from "../../../../../config/constants/enum";
import { TradingProductItem } from "../../shared/components/trading-product-item";
import { DynamicData } from "../../customer-detail-repository";
import StringUtils from "../../../../../shared/util/string-utils";
import { TEXT_EMPTY, FIELD_LABLE } from "../../../../../config/constants/constants";
import { FieldName } from "../../enum";
import { StackActions } from "@react-navigation/native";
import { authorizationSelector } from "../../../../login/authorization/authorization-selector";
import { ActivityHistoryInformationItem } from "../../shared/components/activity-history-information-item";
import { CommonButton } from "../../../../../shared/components/button-input/button";
import { MilestoneItem } from "./scenario/milestone-item";
import _ from "lodash";
import { EmployeesListModal } from "../../shared/components/employees-list-modal";
import { TaskList } from "./tasks/task-list";

export interface InfoBasicTabProp {
  //screen navigation
  navigation: any,
}

/**
 * Component for show basic tab info
 * @param InfoBasicTabProp 
 */
export const InfoBasicTab: FC<InfoBasicTabProp> = ({
  navigation,
}) => {
  const taskList = useSelector(taskSelector);
  const schedules = useSelector(scheduleSelector);
  const tradingProducts = useSelector(tradingProductsSelector);
  const extendSchedules = useSelector(extendScheduleSelector);
  const activityHistoryList = useSelector(activityHistorySelector);
  const customerDetail = useSelector(CustomerDetailSelector);
  const scenarios = useSelector(scenariosSelector);
  
  const dispatch = useDispatch();
  const authState = useSelector(authorizationSelector);
  const [visibleModal, setVisibleModal] = useState(false);
  const [dataEmployees, setDataEmployees] = useState([]);

  const languageCode = authState?.languageCode ? authState?.languageCode : TEXT_EMPTY;
  const dataCustomerDetail: any = customerDetail;

  const lastIndex =
  scenarios.milestones.length -
  1 -
  _.cloneDeep(scenarios.milestones)
    .reverse()
    .findIndex((el: any) => el.mode !== MODE.DELETE);

  /**
   * Handle extend schedule when click item
   * @param index 
   */
  const handleScheduleExtend = (index: number) => () => {
    dispatch(
      customerDetailActions.handleScheduleExtend({
        position: index,
      })
    );
  }

  const showValueLinkType = (dynamicField: DynamicData, navigateToDetail: any, value: string) => {
    const title = StringUtils.getFieldLabel(dynamicField, FIELD_LABLE, languageCode);

    return <View style={[
      CustomerDetailScreenStyles.defaultRow,
      CustomerDetailScreenStyles.borderBottom,
    ]}
      key={dynamicField.fieldId}
    >
      <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{title}</Text>
      <TouchableOpacity onPress={navigateToDetail}>
        <Text style={CustomerDetailScreenStyles.textLink}>{value}</Text>
      </TouchableOpacity>
    </View>
  }

  const displayEmployeeField = (personInCharge: any) => {
    if (!personInCharge) {
      return null;
    }

    return <View style={{ flexDirection: "row", alignItems: "center" }}>
      {personInCharge.fileUrl &&
        personInCharge.fileUrl !== "" ?
        <Image
          source={{ uri: personInCharge.fileUrl }}
          style={CustomerDetailScreenStyles.avatar}
        />
        :
        <View style={CustomerDetailScreenStyles.wrapAvatar}>
          <Text style={CustomerDetailScreenStyles.bossAvatarText}>
            {personInCharge.employeeName ? personInCharge.employeeName.charAt(0)
              : ""}
          </Text>
        </View>
      }

      <Text style={{ paddingLeft: 5 }}>{personInCharge.employeeName && `${personInCharge.employeeName}`}</Text>
    </View>
  }

  return (
    <ScrollView style={[CustomerDetailScreenStyles.contentBasicTab]}>
      <View style={[
        CustomerDetailScreenStyles.marginBottom10,
        CustomerDetailScreenStyles.backgroundWhite
      ]}>
        {customerDetail.fields && customerDetail.fields.map((dynamicField) => {
          if (dynamicField.availableFlag === 0 || dynamicField.fieldName === FieldName.scenario) {
            return null;
          }

          let data = { ...dynamicField };
          data.fieldLabel = dynamicField.fieldLabel;
          const customerData = dataCustomerDetail?.customer?.customerData || [];
          const valueObject = customerData?.find((item: any) => item.key === data.fieldName);
          let showValue = valueObject?.value ?? "";
          if (data.isDefault) {
            showValue = dataCustomerDetail?.customer[StringUtils.snakeCaseToCamelCase(data.fieldName)] ?? TEXT_EMPTY;
          }
          const title = StringUtils.getFieldLabel(data, FIELD_LABLE, languageCode);

          // check condition field name
          switch (data.fieldName) {
            case FieldName.parentId:
              return showValueLinkType(
                data,
                () => {
                  dispatch(customerDetailActions.addCustomerIdNavigation(customerDetail.customer.parentId));
                  let navigationCustomerDetail = StackActions.push('customer-detail',
                    { customerId: customerDetail.customer.parentId, customerName: customerDetail.customer.parentName });
                  return (
                    navigation.dispatch(navigationCustomerDetail)
                  );
                },
                customerDetail.customer.parentName
              );
            case FieldName.business:
              return <View style={[
                CustomerDetailScreenStyles.defaultRow,
                CustomerDetailScreenStyles.borderBottom,
              ]}
                key={data.fieldId}
              >
                <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{title}</Text>
                <Text>{`${customerDetail.customer.businessMainName}．${customerDetail.customer.businessSubName}`}</Text>
              </View>
            case FieldName.personInCharge:
              return <View style={[
                CustomerDetailScreenStyles.defaultRow,
                CustomerDetailScreenStyles.borderBottom,
              ]}
                key={data.fieldId}
              >
                <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{title}</Text>

                {displayEmployeeField(customerDetail.customer.personInCharge)}
              </View>
            case FieldName.createdUser:
              return <View style={[
                CustomerDetailScreenStyles.defaultRow,
                CustomerDetailScreenStyles.borderBottom,
              ]}
                key={data.fieldId}
              >
                <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{title}</Text>

                {displayEmployeeField(customerDetail.customer.createdUser)}
              </View>
            case FieldName.updatedUser:
              return <View style={[
                CustomerDetailScreenStyles.defaultRow,
                CustomerDetailScreenStyles.borderBottom,
              ]}
                key={data.fieldId}
              >
                <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{title}</Text>

                {displayEmployeeField(customerDetail.customer.updatedUser)}
              </View>
            case FieldName.nextScheduleId:
              return <View style={[
                CustomerDetailScreenStyles.defaultRow,
                CustomerDetailScreenStyles.borderBottom,
              ]}
                key={data.fieldId}
              >
                <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{title}</Text>
                <Text>{(customerDetail.customer.nextSchedules.map(schedule => schedule.schedulesName)).join("、")}
                </Text>
              </View>
            case FieldName.nextActionId:
              return <View style={[
                CustomerDetailScreenStyles.defaultRow,
                CustomerDetailScreenStyles.borderBottom,
              ]}
                key={data.fieldId}
              >
                <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{title}</Text>
                <Text>{(customerDetail.customer.nextActions.map(task => task.taskName)).join("、")}</Text>
              </View>
            default:
              if (data?.fieldType?.toString() === DefineFieldType.LOOKUP) {
                return <></>;
              } else if (data?.fieldType?.toString() === DefineFieldType.RELATION && (data as any)?.relationData.displayTab === RelationDisplay.TAB) {
                return <></>;
              } else {
                return <View style={[
                  CustomerDetailScreenStyles.defaultRow,
                  CustomerDetailScreenStyles.borderBottom,
                ]}
                  key={data.fieldId}
                >
                  <DynamicControlField
                    controlType={ControlType.DETAIL}
                    fieldInfo={data}
                    elementStatus={{ fieldValue: showValue }}
                    extensionData={customerData}
                    fields={customerDetail?.customer}
                  />
                </View>
              }
          }
        })}
      </View>
      {/* content activity history info */}
      {activityHistoryList && activityHistoryList.length > 0 && activityHistoryList.map((item) => {
        return <ActivityHistoryInformationItem
          key={item.activityId}
          activity={item}
          styleActivityItem={CustomerDetailScreenStyles.marginBottom10}
        ></ActivityHistoryInformationItem>
      })}
      {/* content trading product */}
      {tradingProducts && <View style={[CustomerDetailScreenStyles.marginBottom10, CustomerDetailScreenStyles.backgroundWhite]}>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{translate(messages.tradingProductTitle)}</Text>
        </View>
        {tradingProducts.map((item) => {
          return <TradingProductItem
            key={item.productId}
            data={item}
            navigation={navigation}
          ></TradingProductItem>
        })}
      </View>}
      {/* content Schedule */}
      {schedules && schedules.length > 0 && <View style={[CustomerDetailScreenStyles.marginBottom10, CustomerDetailScreenStyles.backgroundWhite]}>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{translate(messages.titleSchedule)}</Text>
        </View>
        {schedules.map((schedule, index) => {
          return <TouchableOpacity key={schedule.scheduleId} onPress={handleScheduleExtend(index)}>
            <View style={[CustomerDetailScreenStyles.defaultRow,
            CustomerDetailScreenStyles.borderBottom,
            CustomerDetailScreenStyles.titleSchedule,
            CustomerDetailScreenStyles.rowIcon]}>
              <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{schedule.date}</Text>
              <View style={CustomerDetailScreenStyles.iconArrowBlock}>
                <Icon name={extendSchedules[index].extend ? "arrowUp" : "arrowDown"} style={CustomerDetailScreenStyles.iconArrowUpAndDown} />
              </View>
            </View>
            {extendSchedules[index].extend && <View style={CustomerDetailScreenStyles.scheduleRow}>
              {schedule.itemsList.map((item, indexExtend) => {
                return <ScheduleItem
                  key={indexExtend}
                  data={item}
                ></ScheduleItem>
              })}
            </View>}
          </TouchableOpacity>
        })}

      </View>}

      {scenarios.milestones && scenarios.milestones.length > 0 && <View style={[CustomerDetailScreenStyles.marginBottom10, CustomerDetailScreenStyles.backgroundWhite]}>
        <View style={[CustomerDetailScreenStyles.defaultRow, CustomerDetailScreenStyles.borderBottom, CustomerDetailScreenStyles.titleScenario]}>
          <Text style={[CustomerDetailScreenStyles.boildLabel, CustomerDetailScreenStyles.textBlack]}>{translate(messages.scenarioBlock)}</Text>
          <CommonButton onPress= {() => navigation.navigate("customer-scenario")} 
            status={STATUSBUTTON.ENABLE} icon="" textButton={translate(messages.btnRegisterMilestone)} typeButton={TypeButton.MINI_BUTTON}></CommonButton>
        </View>
        <View style={{marginTop: 20}}>
          {scenarios.milestones && scenarios.milestones.map((scenario, index) => {
            return <MilestoneItem
            itemMilestone={scenario}
            lastItem={index === lastIndex}
            onPressEmployees={(employees) => {
              setDataEmployees(employees);
              setVisibleModal(true);
            }}
          />
          })}
          
        </View>
      </View>}
      {/* content task */}
      {taskList && taskList.length > 0 && <TaskList />}
      <EmployeesListModal
        visible={visibleModal}
        data={dataEmployees}
        onClose={() => setVisibleModal(false)}
      />
  </ScrollView>
    );
}
