import React, { useState } from "react";
import {
  FlatList,
  Image,
  LayoutAnimation,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import moment from "moment";
import { CustomerItemMilestoneStyles } from "./customer-registration-edit-styles";
import { CommonStyles } from "../../../shared/common-style";
import { Icon } from "../../../shared/components/icon";
import { translate } from "../../../config/i18n";
import { messages } from "./customer-registration-edit-messages";
import { MODE, PlatformOS, IS_DONE } from "../../../config/constants/enum";
import { FORMAT_DATE } from "../../../config/constants/constants";

const styles = CustomerItemMilestoneStyles;

/**
 * interface for item milestone props
 */
interface ItemMilestone {
  // milestone item
  itemMilestone: any;
  // check last item or not
  lastItem: boolean;
  // handle press employees
  onPressEmployees: (dataEmployees: any) => void;
  // handle press confirm
  onPressDone: () => void;
  // handle delete mile stone
  onPressDeleteMilestone: () => void;
  // handle delete task
  onPressDeleteTask: (indexTask: number) => void;
  // handle update milestone name
  onChangeMilestoneName: (text: string) => void;
  // handle update task name
  onChangeTaskName: (indexTask: number, text: string) => void;
  // handle choose mile stone end date
  onPressFinishDateOfMilestone: (date: string) => void;
  // handle choose task end date
  onPressFinishDateOfTask: (indexTask: number, date: string) => void;
}

/**
 * component for milestone item
 * @param props
 */
export const ItemMilestone = (props: ItemMilestone) => {
  const {
    itemMilestone,
    lastItem,
    onPressEmployees = () => {},
    onPressDone = () => {},
    onPressDeleteMilestone = () => {},
    onPressDeleteTask = () => {},
    onChangeMilestoneName = () => {},
    onChangeTaskName = () => {},
    onPressFinishDateOfMilestone = () => {},
    onPressFinishDateOfTask = () => {},
  } = props;
  const {
    milestoneName,
    memo,
    finishDate,
    tasks,
    statusMilestoneId,
    mode,
  } = itemMilestone;

  let listEmployees: any = [];
  tasks.forEach((el: any) => {
    listEmployees = [...listEmployees, ...el.operators[0].employees];
  });

  const [collapse, setCollapse] = useState(false);
  const [taskSelected, setTaskSelected] = useState(0);

  if (Platform.OS === PlatformOS.ANDROID) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  /**
   * check finishDate
   * @param date
   */
  const checkDateAfter = (date: string) => {
    return moment(date).isAfter();
  };

  /**
   * handle arrow press
   */
  const onToggleArrow = () => {
    setCollapse(!collapse);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };

  /**
   * render image item
   * @param propsItemImg
   */
  const renderItemImg = (
    propsItemImg: { item: any; index: number },
    length: number
  ) => {
    const { item, index } = propsItemImg;
    const { photoFilePath } = item;
    if (index < 3) {
      return (
        <Image
          source={{
            uri:
              photoFilePath ||
              "https://cdn1.iconfinder.com/data/icons/office-and-internet-3/49/248-512.png",
          }}
          style={styles.imgEmployees}
        />
      );
    }
    if (index === 3) {
      return (
        <View style={styles.viewImgEmployees}>
          <Text style={styles.txtImg}>{`+${length - 3}`}</Text>
        </View>
      );
    }
    return null;
  };

  /**
   * render task item
   * @param propsItemTask
   */
  const renderItemTask = (propsItemTask: { item: any; index: number }) => {
    const { item, index } = propsItemTask;
    const {
      taskName,
      finishDate: finishDateTask,
      operators,
      mode: modeTask,
      statusTaskId,
      memo: memoTask,
    } = item;
    const { employees } = operators[0];
    return modeTask === MODE.DELETE ? null : (
      <View
        style={[
          styles.viewItemTask,
          taskSelected === index && styles.itemTaskActive,
        ]}
        onTouchStart={() => setTaskSelected(index)}
      >
        <View style={CommonStyles.imageTitle}>
          <View>
            <Icon name="task" style={styles.iconFlag} />
            {statusTaskId === IS_DONE.TRUE && (
              <Icon name="checkDone" style={styles.iconDone} />
            )}
          </View>
          <TextInput
            style={styles.txtName}
            value={taskName}
            onChangeText={(text) => {
              onChangeTaskName(index, text);
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => onPressFinishDateOfTask(index, finishDateTask)}
        >
          <Text style={styles.txtContent}>
            {`${translate(messages.completionDate)}: `}
            {moment(finishDateTask).format(FORMAT_DATE.MM_DD_YYYY)}
          </Text>
        </TouchableOpacity>
        <Text style={styles.txtContent}>{memoTask}</Text>
        <View style={CommonStyles.padding2} />
        <View style={[CommonStyles.rowInlineSpaceBetween]}>
          <View>
            {taskSelected === index && (
              <View style={CommonStyles.imageTitle}>
                <TouchableOpacity hitSlop={CommonStyles.hitSlop}>
                  <Icon name="edit" style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>

                <TouchableOpacity
                  hitSlop={CommonStyles.hitSlop}
                  onPress={() => onPressDeleteTask(index)}
                >
                  <Icon name="bin" style={styles.icon} resizeMode="contain" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => onPressEmployees(employees)}>
            <FlatList
              data={employees}
              horizontal
              keyExtractor={(itemEmployee: any) =>
                itemEmployee.employeeId.toString()
              }
              renderItem={(propsImg) =>
                renderItemImg(propsImg, employees.length)
              }
            />
          </TouchableOpacity>
        </View>
        <View style={CommonStyles.padding2} />
        <View style={CommonStyles.rowInlineSpaceBetween}>
          <TouchableOpacity style={styles.btnNotStart}>
            <Text>{translate(messages.notStarted)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnView}>
            <Text>{translate(messages.underway)}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnView}>
            <Text>{translate(messages.alreadyCompleted)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  /**
   * render list task
   */
  const renderTasks = () => {
    return (
      <View style={styles.viewTasks}>
        {collapse && (
          <>
            <TouchableOpacity
              style={styles.btnAddTask}
              onPress={() => alert("Tính năng đang phát triển")}
            >
              <Text style={styles.txt}>{translate(messages.addTask)}</Text>
            </TouchableOpacity>
            <FlatList
              data={tasks}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItemTask}
            />
          </>
        )}
        <TouchableOpacity
          style={styles.viewArrow}
          hitSlop={CommonStyles.hitSlop}
          onPress={onToggleArrow}
        >
          <Icon name={collapse ? "arrowUp" : "arrowDown"} />
        </TouchableOpacity>
      </View>
    );
  };

  return mode === MODE.DELETE ? null : (
    <View style={[styles.container, lastItem && styles.removeBorder]}>
      <View style={styles.viewDot}>
        <View style={styles.viewIconDot} />
      </View>
      <View style={styles.content}>
        <View style={CommonStyles.rowInlineSpaceBetween}>
          <View style={CommonStyles.imageTitle}>
            <View>
              <Icon
                name={
                  checkDateAfter(finishDate)
                    ? "milestoneCalendar"
                    : "milestoneCalendarOvertime"
                }
                style={styles.iconFlag}
              />
              {statusMilestoneId === IS_DONE.TRUE && (
                <Icon name="checkDone" style={styles.iconDone} />
              )}
            </View>
            <TextInput
              style={styles.txtName}
              value={milestoneName}
              onChangeText={(text) => {
                onChangeMilestoneName(text);
              }}
            />
          </View>
          <TouchableOpacity
            style={styles.btnContent}
            onPress={() => onPressDone()}
          >
            <Text style={styles.txt}>
              {translate(
                statusMilestoneId === IS_DONE.TRUE
                  ? messages.returnToIncomplete
                  : messages.complete
              )}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => onPressFinishDateOfMilestone(finishDate)}
        >
          <Text
            style={[
              styles.txtContent,
              !checkDateAfter(finishDate) && styles.colorRed,
            ]}
          >
            {`${translate(messages.completionDate)}: `}
            {moment(finishDate).format(FORMAT_DATE.MM_DD_YYYY)}
          </Text>
        </TouchableOpacity>
        <Text style={styles.txtContent}>{memo}</Text>
        <View style={CommonStyles.padding2} />
        <View style={[CommonStyles.rowInlineSpaceBetween]}>
          <View style={CommonStyles.imageTitle}>
            <TouchableOpacity hitSlop={CommonStyles.hitSlop}>
              <Icon name="edit" style={styles.icon} resizeMode="contain" />
            </TouchableOpacity>
            <TouchableOpacity
              hitSlop={CommonStyles.hitSlop}
              onPress={() => onPressDeleteMilestone()}
            >
              <Icon name="bin" style={styles.icon} resizeMode="contain" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => onPressEmployees(listEmployees)}>
            <FlatList
              data={listEmployees}
              horizontal
              keyExtractor={(item: any) => item.employeeId.toString()}
              renderItem={(propsImg) =>
                renderItemImg(propsImg, listEmployees.length)
              }
            />
          </TouchableOpacity>
        </View>
        <View style={CommonStyles.padding4}>
          <View style={styles.line} />
        </View>
        {renderTasks()}
      </View>
    </View>
  );
};
