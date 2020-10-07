import * as React from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { TaskDetailStyles } from "../task-detail-style";
import { File } from "../../task-repository";
import { theme } from "../../../../config/constants";
import { CommonStyles } from "../../../../shared/common-style";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { TEXT_EMPTY, COMMA_SPACE } from "../../../../config/constants/constants";

interface TaskGeneralInfoFileListProps {
  //Label
  label: string;
  //Color of Value text
  colorValue: string;
  //List file
  data: Array<any>;
}

/**
 * Component show file list
 * @param props
 */

export const TaskGeneralInfoFileList: React.FC<TaskGeneralInfoFileListProps> = ({
  label,
  colorValue,
  data = [],
}) => {
  // const navigation = useNavigation();

  /*
   * Click File Name
   */
  // const onClickItem = (id: number) => {
  //   //Todo Do something when clicking on the file name
  // };

  return (
    <View
      style={[
        TaskDetailStyles.generalInfoItem,
        { backgroundColor: theme.colors.white },
      ]}
    >
      <View style={TaskDetailStyles.rowCenter}>
        <View style={CommonStyles.flex1}>
          <Text style={[TaskDetailStyles.bold]}>
            {checkEmptyString(label) ? TEXT_EMPTY : label}
          </Text>

          <View style={TaskDetailStyles.row}>
            <Text numberOfLines={1} ellipsizeMode="tail">
              {data &&
                data.map((item: File, index: number) => {
                  return (
                    <TouchableWithoutFeedback
                      onPress={() => {
                        // onClickItem(item.fileId);
                      }}
                      key={item?.fileId?.toString()}
                    >
                      <Text
                        style={[TaskDetailStyles.gray, { color: colorValue }]}
                      >
                        {checkEmptyString(item.fileName)
                          ? TEXT_EMPTY
                          : index == data.length - 1
                            ? item.fileName
                            : item.fileName + COMMA_SPACE}
                      </Text>
                    </TouchableWithoutFeedback>
                  );
                })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
