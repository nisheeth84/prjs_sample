import * as React from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import _ from 'lodash';
import { Icon } from '../../../shared/components/icon';
import { renderItemGlobalStyles } from './render-item-global-styles';
import { messages } from './recent-misson-messages';
import { translate } from '../../../config/i18n';
import { CommonStyles } from '../../../shared/common-style';
import moment from 'moment';
import { TEXT_SPACE, COMMA_SPACE } from '../../../config/constants/constants';
import { EnumFmDate } from '../../../config/constants/enum-fm-date';
import { apiUrl } from '../../../config/constants/api';

export interface RenderItemGlobal {
  item: any;
  changeStatus?: () => void; // onpress Change status task or milestone
  onDelete?: () => void; // onpress delete
  goDetail?: () => void; // onpress go Task Detail or milestone detail
  onEdit?: () => void; // onpress edit button
  onMemo?: () => void;
  screen: string;
  goEmployeeDetail: (employeeId: any) => void;
}
export function RenderItemGlobal({
  item,
  changeStatus,
  onDelete,
  goDetail,
  onEdit,
  onMemo,
  screen,
  goEmployeeDetail,
}: RenderItemGlobal) {
  const { taskData } = item;
  const { milestoneData } = item;

  function renderTask() {
    return (
      <TouchableOpacity
        style={renderItemGlobalStyles.container}
        activeOpacity={1}
      >
        <View style={renderItemGlobalStyles.viewContent}>
          {!_.isEmpty(taskData.customers) && (
            <View style={CommonStyles.row}>
              <Text style={renderItemGlobalStyles.txtName} numberOfLines={1}>
                {`${taskData.customers.map((elm: any) => elm.customerName)} ${
                  taskData.productTradings.length > 0 ? '/' : ''
                } ${taskData.productTradings.map(
                  (elm: any) => `${elm.productTradingName}`
                )}`.replace(/,/g, COMMA_SPACE)}
              </Text>
            </View>
          )}

          <TouchableOpacity onPress={goDetail}>
            <Text
              style={
                taskData.statusTaskId === 3
                  ? renderItemGlobalStyles.txtMissonComplete
                  : renderItemGlobalStyles.txtMisson
              }
              numberOfLines={1}
            >
              {taskData.taskName}
            </Text>
          </TouchableOpacity>
          {taskData.startDate ? (
            <Text style={renderItemGlobalStyles.txtStyle}>
              {translate(messages.deadline)} :{TEXT_SPACE}
              {moment(taskData.startDate).format(
                EnumFmDate.YEAR_MONTH_DAY_NORMAL
              )}{' '}
              ~{TEXT_SPACE}
              {moment(taskData.finishDate).format(
                EnumFmDate.YEAR_MONTH_DAY_NORMAL
              )}
            </Text>
          ) : (
            <Text style={renderItemGlobalStyles.txtStyle}>
              {translate(messages.deadline)} :{TEXT_SPACE}
              {moment(taskData.finishDate).format(
                EnumFmDate.YEAR_MONTH_DAY_NORMAL
              )}
            </Text>
          )}
          <View style={CommonStyles.rowSpaceBetween}>
            <View style={CommonStyles.rowAlignItemCenter}>
              {taskData.milestoneId && (
                <TouchableOpacity>
                  <Icon name="milestone" style={renderItemGlobalStyles.icon} />
                </TouchableOpacity>
              )}
              {!!taskData.memo && (
                <TouchableOpacity onPress={onMemo}>
                  <Icon name="memo" style={renderItemGlobalStyles.icon} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={onEdit}>
                <Icon name="edit" style={renderItemGlobalStyles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete}>
                <Icon name="erase" />
              </TouchableOpacity>
            </View>

            <View style={CommonStyles.rowAlignItemCenter}>
              {taskData.employees.length > 0 ? (
                taskData.employees.slice(0, 3).map((employee: any) =>
                  employee.photoFilePath ? (
                    <TouchableOpacity
                      key={`${taskData.taskId}_${employee.employeeId}`}
                      style={renderItemGlobalStyles.userAvatarDefault}
                      onPress={() =>
                        goEmployeeDetail(employee?.employeeId)
                      }
                    >
                      <Image
                        source={{ uri: employee.photoFilePath }}
                        style={renderItemGlobalStyles.avatar}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      key={`${taskData.taskId}_${employee.employeeId}`}
                      style={renderItemGlobalStyles.userAvatarDefault}
                      onPress={() =>
                        goEmployeeDetail(employee?.employeeId)
                      }
                    >
                      <Text style={renderItemGlobalStyles.txtUserName}>
                        {employee.employeeSurname
                          ? employee.employeeSurname[0]
                          : employee.employeeName[0]}
                      </Text>
                    </TouchableOpacity>
                  )
                )
              ) : (
                <View />
              )}
              {taskData.countEmployee - 3 > 0 ? (
                <View style={renderItemGlobalStyles.viewMoreAvatar}>
                  <Text style={renderItemGlobalStyles.txtMoreAvatar}>
                    +{taskData.employees.length - 3}
                  </Text>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>
          <TouchableOpacity
            style={
              (screen === 'complete' && taskData.statusTaskId === 1) ||
              (screen === 'incomplete' && taskData.statusTaskId === 3)
                ? renderItemGlobalStyles.btnInComplete
                : renderItemGlobalStyles.btnComplete
            }
            onPress={changeStatus}
            disabled={
              (screen === 'complete' && taskData.statusTaskId === 1) ||
              (screen === 'incomplete' && taskData.statusTaskId === 3)
            }
          >
            {screen === 'complete' ? (
              <Text style={renderItemGlobalStyles.txtStyle}>
                {translate(messages.returnInComplete)}
              </Text>
            ) : (
              <Text style={renderItemGlobalStyles.txtStyle}>
                {translate(messages.toComplete)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  function renderMilestone() {
    return (
      <TouchableOpacity
        style={renderItemGlobalStyles.container}
        activeOpacity={1}
      >
        <View style={renderItemGlobalStyles.viewContent}>
          <View style={CommonStyles.row}>
            <Icon name="milestone" style={renderItemGlobalStyles.icon} />
            <TouchableOpacity onPress={goDetail}>
              <Text
                style={
                  milestoneData.statusMilestoneId === 0
                    ? renderItemGlobalStyles.txtMisson
                    : renderItemGlobalStyles.txtMissonComplete
                }
                numberOfLines={1}
              >
                {milestoneData.milestoneName}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={renderItemGlobalStyles.txtStyle}>
            {translate(messages.deadline)} :{TEXT_SPACE}
            {moment(milestoneData.finishDate).format(
              EnumFmDate.YEAR_MONTH_DAY_NORMAL
            )}
          </Text>

          <View style={renderItemGlobalStyles.viewIconMilestone}>
            {!_.isEmpty(milestoneData.memo) && (
              <TouchableOpacity onPress={onMemo}>
                <Icon name="memo" style={renderItemGlobalStyles.icon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={onEdit}>
              <Icon name="edit" style={renderItemGlobalStyles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={onDelete}>
              <Icon name="erase" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={
              (screen === 'complete' &&
                milestoneData.statusMilestoneId === 0) ||
              (screen === 'incomplete' && milestoneData.statusMilestoneId === 1)
                ? renderItemGlobalStyles.btnInComplete
                : renderItemGlobalStyles.btnComplete
            }
            onPress={changeStatus}
            disabled={
              (screen === 'complete' &&
                milestoneData.statusMilestoneId === 0) ||
              (screen === 'incomplete' && milestoneData.statusMilestoneId === 1)
            }
          >
            {screen === 'incomplete' ? (
              <Text style={renderItemGlobalStyles.txtStyle}>
                {translate(messages.toComplete)}
              </Text>
            ) : (
              <Text style={renderItemGlobalStyles.txtStyle}>
                {translate(messages.returnInComplete)}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  }
  return taskData !== null ? renderTask() : renderMilestone();
}
