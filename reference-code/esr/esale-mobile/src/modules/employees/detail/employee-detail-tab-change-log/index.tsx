import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import StringUtils from '../../../../shared/util/string-utils';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../config/constants/constants';
import { getEmployeeHistory, getEmployeeLayout } from '../../employees-repository';
import { Icon } from '../../../../shared/components/icon';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../../login/authorization/authorization-selector';
import { employeeIdSelector, employeeDataSelector } from '../detail-screen-selector';
import { useNavigation } from '@react-navigation/native';
import { translate } from '../../../../config/i18n'
import { messages } from "../detail-messages";

const LIMIT = 30
interface Navigation {
  [navigation: string]: any;
}
/**
 * Component for show tab timeline
 */
export const ChangeLogTabScreen: React.FC = () => {

  const [offset, setOffset] = useState(0)
  const [employeeLayout, setEmployeeLayout] = useState<any[]>([])
  const [employeeHistoryList, setEmployeeHistoryList] = useState<any[]>([])
  const employeeId = useSelector(employeeIdSelector);
  async function handleLoadMore() {
    setOffset(offset + LIMIT)
    const getEmployeeHistoryResult = await getEmployeeHistory({ employeeId: employeeId, currentPage: offset + LIMIT, limit: LIMIT })
    if (getEmployeeHistoryResult?.status === 200) {
      const data = _.cloneDeep(employeeHistoryList)
      data.push(...getEmployeeHistoryResult.data.employeeHistory)
      setEmployeeHistoryList(data)
    }
  }

  const initHistoryList = async () => {
    const getEmployeeLayoutResult = await getEmployeeLayout();
    if (getEmployeeLayoutResult?.status === 200) {
      setEmployeeLayout(getEmployeeLayoutResult.data.employeeLayout);
      const getEmployeeHistoryResult = await getEmployeeHistory({ employeeId: employeeId, currentPage: 0, limit: LIMIT })
      if (getEmployeeHistoryResult?.status === 200) {
        setEmployeeHistoryList(getEmployeeHistoryResult.data.employeeHistory)
      }
    }
  }

  useEffect(() => {
    initHistoryList();
  }, [])

  return (
    <SafeAreaView style={[ChangeHistoryStyles.container]}>
      <FlatList
        data={employeeHistoryList}
        renderItem={({ item, index }) => (
          <ChangeHistoryItem
            fieldInfos={employeeLayout}
            data={item}
            isLast={employeeHistoryList.length - 1 === index}
          />
        )}
        keyExtractor={(item, index) => "key" + item.id + index}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
      >
      </FlatList>
    </SafeAreaView >
  )
};

export interface ChangeHistory {
  createUser: number;
  contentChange: string;
  createdDate: string;
  createdUserName: string;
  createdUserImage: string;
}

interface ChangeHistoryItemProps {
  fieldInfos: any[];
  // data of contact history item
  data: ChangeHistory;
  // value is true if item is lastest contact history list
  isLast: boolean;
}
// interface FieldItems {
//   itemId?: number;
//   isAvailable?: boolean;
//   itemOrder?: number;
//   isDefault?: boolean;
//   itemLabel?: string;
//   itemParentId?: number;
//   updatedDate?: string;
// }


export const ChangeHistoryItem: React.FC<ChangeHistoryItemProps> = (
  {
    fieldInfos,
    data,
    isLast
  }
) => {
  // const listTypeNormal = [5, 6, 7, 8, 9, 13, 14, 15];
  // const listTypeConvertData = [1, 2, 3, 4];
  const navigationScreen: Navigation = useNavigation();
  const screenWidth = Math.round(Dimensions.get('window').width);
  // value 15 is padding horizontal and  30 is width of icon employee  
  const contentWidth = screenWidth - (15 * 2) - 30;
  const [lineHeight, setLineHeight] = useState(0);
  const authorizationState = useSelector(authorizationSelector)
  const employeeData = useSelector(employeeDataSelector);
  const createDate = employeeData.data?.createDate;
  /**
   * render header information
   * @param date 
   * @param avatar 
   * @param id 
   * @param name 
   */
  const renderTitleItem = (date: string, avatar: string, id: number, name: string) => {
    return <View style={ChangeHistoryStyles.titleBlock}>
      <View style={ChangeHistoryStyles.avatarBlock}>
        {avatar && avatar.length > 0 ?
          (<Image
            source={{ uri: avatar }}
            style={ChangeHistoryStyles.employeeImage}
          />) : (
            <View style={ChangeHistoryStyles.wrapAvatar}>
              <Text style={ChangeHistoryStyles.bossAvatarText}>
                {name ? name.charAt(0) : ""}
              </Text>
            </View>
          )
        }
        <TouchableOpacity
          style={{ maxWidth: Dimensions.get("window").width * 45 / 100 }}
          onPress={() => {
            navigationScreen.push('detail-employee', {
              id: id,
              title: name
            });
          }}>
          <Text style={ChangeHistoryStyles.employeeText} numberOfLines={1}>
            {name}
          </Text>
        </TouchableOpacity>
        <Text style={ChangeHistoryStyles.dateLabel} numberOfLines={1}>{date}</Text>
      </View>
    </View>
  }
  /**
   * Show icon file
   * @param 
   */
  // const renderChangeFile = (labelName: string, contentChagne: any) => {
  //   //Todo
  //   //Check data là mảng luôn hay là string cách nhau bởi dấu ,
  //   //TH ảnh đã bị xóa khỏi DB thì hiển thị ở đây
  //   const fileType = contentChagne.file_name.old.substr(contentChagne.file_name.old.lastIndexOf(".") + 1);
  //   if (FileType.JPG.includes(fileType)) {
  //     return <View style={ChangeHistoryStyles.blockChange}>
  //       <Image
  //         style={ChangeHistoryStyles.employeeImage}
  //         source={{ uri: contentChagne.file_path.old }} />
  //       <Text> → </Text>
  //       <Image
  //         style={ChangeHistoryStyles.employeeImage}
  //         source={{ uri: contentChagne.file_path.new }} />
  //     </View>
  //   } else {
  //     return renderLineChange(labelName, contentChagne.file_name.old, contentChagne.file_name.new)
  //   }
  // }
  // /**
  //  * get value from list field
  //  * @param listId 
  //  * @param listFieldItems 
  //  */
  // const getValueFromFieldItem = (listId: number[], listFieldItems: FieldItems[]) => {
  //   let textDisplay = "";
  //   listId && listId.forEach((itemId: number) => {
  //     const value = listFieldItems.find((field: FieldItems) => field.itemId === itemId);
  //     if (value) {
  //       textDisplay = textDisplay.length > 0 ? (textDisplay + ", " + value.itemLabel || "") : (value.itemLabel || "");
  //     }
  //   })
  //   return textDisplay;
  // }

  /**
   * render line change in block contentchange
   * @param labelName 
   * @param valueOld 
   * @param valueNew 
   */
  const renderLineChange = (labelName: string, valueOld: string, valueNew: string) => {
    return <View style={ChangeHistoryStyles.blockChange}>
      {/* <Text style={{ fontWeight: 'bold' }}>{labelName + " : "}</Text> */}
      <Text > <Text style={{ fontWeight: 'bold' }}>{labelName + " : "}</Text>{valueOld}  <Text style={{ fontWeight: "bold" }}> →  </Text>{valueNew} </Text>
    </View>
  }

  /**
   * render cotent change
   * @param contentChange 
   */
  const renderContentChagne = (contentChange: string) => {
    const content = JSON.parse(contentChange);
    return <View style={[ChangeHistoryStyles.contentBlock, { width: contentWidth }]}>
      <View style={{ flexDirection: "row" }}>
        <Text>
          {data.createdUserName}
          {createDate === data.createdDate ? translate(messages.messageHistoryCreate) : translate(messages.messageHistoryUpdate)}
        </Text>
      </View>

      {content && Object.keys(content).map((item: string) => {
        const field = fieldInfos.find(field => field.fieldName === item);
        if (item !== "old" && item !== "new") {
          const labelName = field ? StringUtils.getFieldLabel(field, FIELD_LABLE, authorizationState.languageCode) || item : item;
          return renderLineChange(labelName, content[item].old, content[item].new);
        } else {
          return renderLineChange(TEXT_EMPTY, content.old, content.new);
        }
      })}

    </View>
  }

  /**
   * render item change log
   */
  const renderItem = () => {
    return (data.contentChange && (data.contentChange.length > 2) ? <View style={ChangeHistoryStyles.item} onLayout={(event) => { setLineHeight(event.nativeEvent.layout.height); }}>
      <View style={ChangeHistoryStyles.imageLeftBlock}>
        <Icon name="ellipseBlue" style={ChangeHistoryStyles.ellipseBlueIcon} />
        {!isLast && <Icon name="verticalLine" style={[ChangeHistoryStyles.imageVerticalLine, { height: lineHeight }]} />}
      </View>
      <View>
        {renderTitleItem(data.createdDate, data.createdUserImage, data.createUser, data.createdUserName)}
        {renderContentChagne(data.contentChange)}
      </View>
    </View> : <></>)
  }

  return renderItem()
}

// const fieldInfo = [
//   {
//     fieldName: "employee_name",
//     fieldLabel: "{\"ja_jp\": \"チェックボッcheckbox\"}",
//   },
//   {

//     fieldName: "memo",
//     fieldLabel: "{\"ja_jp\": \"管理権限\"}",
//   },
//   {

//     fieldName: "employee_name_kana",
//     fieldLabel: "{\"ja_jp\": \"kana\"}",
//   }, {

//     fieldName: "employee_status",
//     fieldLabel: "{\"ja_jp\": \"status\"}",
//   }
// ]

// const employeeHistory = [
//   {
//     createdDate: "2019/10/10 15:50",
//     createdUser: 123,
//     createdUserName: "山田",
//     createdUserImage: "",
//     contentChange: '{\"employee_name\":{\"old\":\"Nguyen Van A\",\"new\":\"Nguyen Van B\"},\"memo\":{\"old\":\"memoA\",\"new\":\"memoB\"}}'
//   },
//   {
//     createdDate: "2019/10/11 16:50",
//     createdUser: 123,
//     createdUserName: "山田",
//     createdUserImage: "",
//     contentChange: '{\"employee_name_kana\":{\"old\":\"シャインエ\",\"new\":\"シャインビー\"},\"employee_status\":{\"old\":1,\"new\":2}}'
//   },
//   {
//     createdDate: "2019/10/11 16:50",
//     createdUser: 123,
//     createdUserName: "山田",
//     createdUserImage: "",
//     contentChange: '{\"employee_name_kana\":{\"old\":\"シャインエ\",\"new\":\"シャインビー\"},\"employee_status\":{\"old\":1,\"new\":2}}'
//   }
// ]


export const ChangeHistoryStyles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    paddingVertical: 15
  },
  item: {
    flexDirection: "row",
    color: "#333333",
    fontSize: 12,
    paddingBottom: 20,
    paddingHorizontal: 15
  },
  imageLeftBlock: {
    paddingRight: 15,
    paddingTop: 8,
    width: 30
  },
  ellipseBlueIcon: {
    marginTop: 3,
    zIndex: 2
  },
  employeeImage: {
    width: 26,
    height: 26,
  },
  imageVerticalLine: {
    position: "absolute",
    top: 16,
    left: 0,
    zIndex: 1,
    marginLeft: 7
  },
  titleBlock: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateLabel: {
    marginLeft: 80
  },
  avatarBlock: {
    flexDirection: "row",
    paddingVertical: 5,
    alignItems: "center",
  },
  employeeText: {
    color: "#0F6DB5",
    paddingLeft: 5
  },
  contentBlock: {
    padding: 15,
    backgroundColor: "#F9F9F9",
    borderRadius: 12,
    marginVertical: 10
  },
  blockChange: {
    flexDirection: "row",
    margin: 5,
    marginLeft: 10
  },
  textContent: {
    flexDirection: "row",
    flex: 10,
  },
  contentChange: {
    paddingLeft: 10
  },
  arrowLabel: {
    fontSize: 30
  },
  wrapAvatar: {
    width: 32,
    height: 32,
    borderRadius: 32 / 2,
    backgroundColor: "#37A16D",
    justifyContent: 'center',
    alignItems: 'center',
  },
  bossAvatarText: {
    fontWeight: "bold",
    color: "#FFFFFF"
  }
})
