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
import { CustomerItemMilestoneStyles } from "../../../../registration-edit/customer-registration-edit-styles";
import { PlatformOS, MODE, IS_DONE, StatusTask } from "../../../../../../config/constants/enum";
import { CommonStyles } from "../../../../../../shared/common-style";
import { Icon } from "../../../../../../shared/components/icon";
import { translate } from "../../../../../../config/i18n";
import { messages } from "../../../../registration-edit/customer-registration-edit-messages";
import { FORMAT_DATE } from "../../../../../../config/constants/constants";
import { CustomerDetailScreenStyles } from "../../../customer-detail-style";


const styles = CustomerItemMilestoneStyles;

/**
 * interface for item milestone props
 */
interface MilestoneItemProp {
  // milestone item
  itemMilestone: any;
  // check last item or not
  lastItem: boolean;
  // handle press employees
  onPressEmployees: (dataEmployees: any) => void;
}

/**
 * component for milestone item
 * @param props
 */
export const MilestoneItem = (props: MilestoneItemProp) => {
  const {
    itemMilestone,
    lastItem,
    onPressEmployees
  } = props;

  const {
    milestoneName,
    memo,
    finishDate,
    tasks,
    statusMilestoneId,
  } = itemMilestone;

  let listEmployees: any = [];
  tasks.forEach((el: any) => {
    if(el.operators && el.operators.length > 0) {
      listEmployees = listEmployees.reduce((list: any, employee2: any) => {
        if (el.operators[0].employees.findIndex((employee1: any) => employee1.employeeId == employee2.employeeId)) {
          list.push(employee2)
        }
        return list
      }, [...el.operators[0].employees]);
    }
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

  const showStatusIconMilestone = (status: number, date: string) => {
    if(status === IS_DONE.TRUE) {
      return <View>
      <Icon
        name={"milestoneCalendar"}
        style={styles.iconFlag}
      />
      <Icon name="checkDone" style={styles.iconDone} />
    </View>
    } else if (status === IS_DONE.FALSE && checkDateAfter(date)) {
      return <View>
      <Icon
        name={"milestoneCalendarOvertime"}
        style={styles.iconFlag}
      />
    </View>
    } else {
      return <View>
      <Icon
        name={"milestoneCalendar"}
        style={styles.iconFlag}
      />
    </View>
    }
  }

  const showTaskStatus = (statusTaskId: number) => {
    let label = "";
    switch(statusTaskId) {
      case StatusTask.TO_DO:
        label = translate(messages.notStarted);
        break;
      case StatusTask.DOING:
        label = translate(messages.underway);
      break;
      case StatusTask.DONE:
        label = translate(messages.alreadyCompleted);
      break;
    }
    return (<Text style={CustomerDetailScreenStyles.textLink}> {label}</Text>);
  }

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
    employees: Array<any>
  ) => {
    const { item, index } = propsItemImg;
    const { fileUrl } = item;
    const length = employees.length;
    if (index < 3) {
      return (
        fileUrl ? <Image
          source={{
            uri: fileUrl
          }}
          style={CustomerDetailScreenStyles.imgEmployees}
        />
        : <View style={[CustomerDetailScreenStyles.imageEmployee, CustomerDetailScreenStyles.backgroundAvatar, CustomerDetailScreenStyles.marginRight8]}>
            <Text style={CustomerDetailScreenStyles.imageName}>{item.employeeName.charAt(0)}</Text>
          </View>
      );
    }
    if (index === 3) {
      return (
        <TouchableOpacity style={styles.viewImgEmployees} onPress={() => onPressEmployees(employees)}>
          <Text style={styles.txtImg}>{`+${length - 3}`}</Text>
        </TouchableOpacity>
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
      statusTaskId,
      memo: memoTask,
    } = item;
    const { employees } = operators[0];

    return (
      <View
        style={[
          CustomerDetailScreenStyles.viewItemTask,
          taskSelected === index && styles.itemTaskActive,
        ]}
        onTouchStart={() => setTaskSelected(index)}
      >
        <View style={CustomerDetailScreenStyles.imageTitle}>
          <View>
            <Icon name="task" style={styles.iconFlag} />
            {statusTaskId === StatusTask.DONE && (
              <Icon name="checkDone" style={styles.iconDone} />
            )}
          </View>
          <Text style={CustomerDetailScreenStyles.txtName}>{taskName}</Text>
          <View style={CustomerDetailScreenStyles.btnStatusTask}>
            {showTaskStatus(statusTaskId)}
          </View>
        </View>
        <Text style={styles.txtContent}>
          {`${translate(messages.completionDate)}: `}
          {moment(finishDateTask).format(FORMAT_DATE.MM_DD_YYYY)}
        </Text>
        <Text style={styles.txtContent}>{memoTask}</Text>
        <View style={CommonStyles.padding2} />
        <View style={[CommonStyles.rowInlineEnd]}>
          <View >
            <FlatList
              data={employees}
              horizontal
              keyExtractor={(itemEmployee: any) =>
                itemEmployee.employeeId.toString()
              }
              renderItem={(propsImg) =>
                renderItemImg(propsImg, employees)
              }
            />
          </View>
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
            <FlatList
              data={tasks}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderItemTask}
            />
          </>
        )}
        {tasks.length > 0 && <TouchableOpacity
          style={styles.viewArrow}
          hitSlop={CommonStyles.hitSlop}
          onPress={onToggleArrow}
        >
          <Icon name={collapse ? "arrowUp" : "arrowDown"} />
        </TouchableOpacity>}
      </View>
    );
  };

  return (
    <View style={[styles.container, lastItem && styles.removeBorder]}>
      <View style={styles.viewDot}>
        
        <View>
          {statusMilestoneId === IS_DONE.TRUE ? <Icon name={"checkActive"} style={CustomerDetailScreenStyles.iconActive}/> 
          : <View style={styles.viewIconDot} />}
        
        </View>
      </View>
      <View style={styles.content}>
        <View style={CommonStyles.rowInlineSpaceBetween}>
          <View style={CommonStyles.imageTitle}>
            {showStatusIconMilestone(statusMilestoneId, finishDate)}
            <Text style={styles.txtName}>{milestoneName}</Text>
          </View>
        </View>
        <Text
          style={[
            styles.txtContent,
            !checkDateAfter(finishDate) && finishDate && styles.colorRed,
          ]}
        >
          {`${translate(messages.completionDate)}: `}
          {finishDate ? moment(finishDate).format(FORMAT_DATE.MM_DD_YYYY) : ""}
        </Text>
        {memo && <Text style={styles.txtContent}>{memo}</Text>}
        <View style={CommonStyles.padding2} />
        <View style={[CommonStyles.rowInlineEnd]}>
          <View>
            <FlatList
              data={listEmployees}
              horizontal
              keyExtractor={(item: any) => item.employeeId.toString()}
              renderItem={(propsImg) =>
                renderItemImg(propsImg, listEmployees)
              }
            />
          </View>
        </View>
        <View style={CommonStyles.padding4}>
          <View style={styles.line} />
        </View>
        {renderTasks()}
      </View>
    </View>
  );
};
