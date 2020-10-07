import React, { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import { messages } from './register-group-chanel-messages';
import { translate } from '../../../config/i18n';
import { CommonStyles } from '../../../shared/common-style';
// import {
//   queryCreateGroupList,
//   queryUpdateGroupList,
// } from "./register-group-chanel-query";
import {
  // TimelineGroup,
  createGroupList,
} from './register-group-chanel-repository';
import { Header } from '../../../shared/components/header';
import { theme } from '../../../config/constants';
import { RegisterGroupChanelStyles as styles } from './register-group-chanel-style';
import { FormInput } from '../../../shared/components/form-input';
import { RadioGroup } from '../../../shared/components/radio';
import {
  dataGetTimelineGroupsSelector,
  groupColorSelector,
  // listColorSelector,
} from '../timeline-selector';
// import { Authority } from '../../../shared/components/authority';
// import { MultipleSelectWithSearchBox } from "../../../shared/components/multiple-select-with-search-box/multiple-select-search-box";
import {
  // AuthorityEnum,
  // AuthorityItemType,
  // GroupInviteType,
  KeySearch,
  ModeScreen,
  TypeSelectSuggest,
} from '../../../config/constants/enum';
import { timelineActions } from '../timeline-reducer';
import { dataGetTimelineGroupsDummy } from '../page-group/timeline-page-group-data-dummy';
import { getTimelineGroups, updateTimelineGroup } from '../timeline-repository';
// import { queryGetTimelineGroups } from "../timeline-query";
import { CreateTimelineGroupRouteProp } from '../../../config/constants/root-stack-param-list';
import { formatColor } from '../../../shared/util/color-utils';
// import { contentType } from "../../../config/constants/api";
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { EmployeeSuggestView } from '../../../shared/components/suggestions/employee/employee-suggest-view';
import { TYPE_MEMBER } from '../../../config/constants/query';

const EMPTY_DATA = {
  timelineGroupName: null,
  isPublic: false,
  isApproval: false,
  color: null,
  comment: null,
  imageData: null,
  imageName: '',
  width: 0,
  height: 0,
};

/**
 * Component show group chanel register screen
 */

export const RegisterGroupChanelScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const route = useRoute<CreateTimelineGroupRouteProp>();
  const groupColor = useSelector(groupColorSelector);
  const timelineGroups = useSelector(dataGetTimelineGroupsSelector);
  const [mode, setMode] = useState(ModeScreen.CREATE);
  const [paramsTimelineGroup, setParamsTimelineGroup] = useState<any>(
    EMPTY_DATA
  );
  const [paramsTimelineGroupInvites, setParamsTimelineGroupInvites] = useState<
    Array<any>
  >([]);
  // Todo register
  // const colorList = useSelector(listColorSelector);
  // const [selectModalOpen, setSelectModalOpen] = useState(false);
  // const [hasChangeImage, setHasChangeImage] = useState(false);
  // const [hasChangeInvite, setHasChangeInvite] = useState(false);
  const LoginInfor = useSelector(authorizationSelector);
  const [suggestionsChoice, setSuggestionsChoice] = useState({
    departments: [],
    employees: [
      {
        employeeId: LoginInfor.employeeId,
        participantType: TYPE_MEMBER.OWNER,
      },
    ],
    groups: [],
  });

  console.log('route', route);

  /**
   * if the color of the api result is a new color, add it to the array color
   * @param newColor
   */
  // const addColor = (newColor: string) => {
  //   let hasColor = false;
  //   let tmpColor;
  //   colorList.forEach((color) => {
  //     if (formatColor(newColor) === formatColor(color.hexColor)) {
  //       tmpColor = color;
  //       hasColor = true;
  //     }
  //   });
  //   if (!hasColor && !!formatColor(newColor)) {
  //     tmpColor = {
  //       id: colorList.length,
  //       name: formatColor(newColor),
  //       hexColor: formatColor(newColor),
  //     };

  //     const colors = colorList.concat([tmpColor]);

  //     dispatch(timelineActions.saveListColor(colors));
  //   }
  //   return tmpColor;
  // };

  // const getFirstItem = (arr: Array<any>) => {
  //   return (arr || []).length > 0 ? arr[0] : [];
  // };

  useEffect(() => {
    // const timelineGroup: TimelineGroup = getFirstItem(timelineGroups);
    // const paramsTimelineGroupData =
    //   timelineGroup !== undefined
    //     ? {
    //         timelineGroupName: timelineGroup.timelineGroupName,
    //         isPublic: timelineGroup.isPublic,
    //         isApproval: true,
    //         color: timelineGroup.color,
    //         comment: timelineGroup.comment,
    //         imageData: timelineGroup.imagePath,
    //         imageName: timelineGroup.imageName,
    //         width: timelineGroup.width,
    //         height: timelineGroup.height,
    //       }
    //     : EMPTY_DATA;
    // const tmpColor = addColor(
    //   timelineGroup !== undefined ? timelineGroup.color : ""
    // );
    // console.log("tmpColor", tmpColor);
    // if (tmpColor !== undefined) {
    //   dispatch(timelineActions.saveCurrentColor(tmpColor));
    // }
    // console.log("paramsTimelineGroupData===>", paramsTimelineGroupData);
    // setParamsTimelineGroup(paramsTimelineGroupData);
    // const invites =
    //   timelineGroup?.invites !== undefined ? timelineGroup.invites : [];
    // const paramsTimelineGroupInvitesData: Array<any> = [];
    // invites.forEach((invite) => {
    //   const tmpData = {
    //     inviteId: invite.inviteId,
    //     inviteType: invite.inviteType,
    //     status: invite.status,
    //     authority: invite.authority,
    //   };
    //   if (invite.inviteType === GroupInviteType.DEPARTMENT) {
    //     paramsTimelineGroupInvitesData.push({
    //       ...tmpData,
    //       departmentName: invite.inviteName,
    //       departmentParentName: invite?.department?.parentName,
    //       authorityItemType: AuthorityItemType.DEPARTMENT,
    //     });
    //   } else {
    //     paramsTimelineGroupInvitesData.push({
    //       ...tmpData,
    //       employeeName: invite.inviteName,
    //       employeeImage: invite.inviteImagePath,
    //       departmentName: getFirstItem(invite.employee).departmentName,
    //       positionName: getFirstItem(invite.employee).positionName,
    //       authorityItemType: AuthorityItemType.EMPLOYEE,
    //     });
    //   }
    // });
    // setParamsTimelineGroupInvites(paramsTimelineGroupInvitesData);
  }, [timelineGroups]);

  /**
   * create group list
   */
  const createGroupListF = () => {
    paramsTimelineGroup.color = groupColor.hexColor;
    const timelineGroupInvites: Array<any> = [];
    paramsTimelineGroupInvites.forEach((value) => {
      const tmpData = {
        inviteType: value.inviteType,
        status: value.status,
        authority: value.authority,
      };
      [value.inviteId].flat().forEach((id: number) => {
        timelineGroupInvites.push({
          inviteId: id,
          ...tmpData,
        });
      });
    });
    const formDataInvites = paramsTimelineGroupInvites.map((el) => {
      return {
        inviteId: el.itemId,
        inviteType: 2,
        status: 1,
        authority: el.participantType === undefined ? 2 : el.participantType,
      };
    });
    const formData = new FormData();
    formData.append(
      'timelineGroup.timelineGroupName',
      paramsTimelineGroup.timelineGroupName
    );
    // TODO: timelineGroup.isPublic bug "null"
    formData.append('timelineGroup.isPublic', paramsTimelineGroup.isPublic);
    formData.append('timelineGroup.isApproval', paramsTimelineGroup.isApproval);
    formData.append('timelineGroup.color', paramsTimelineGroup.color);
    formData.append('timelineGroup.comment', paramsTimelineGroup.comment);
    {
      !paramsTimelineGroup.width ||
        formData.append('timelineGroup.width', paramsTimelineGroup.width);
    }
    {
      !paramsTimelineGroup.height ||
        formData.append('timelineGroup.height', paramsTimelineGroup.height);
    }
    {
      !paramsTimelineGroup.imageData ||
        formData.append('attachedFile', paramsTimelineGroup.imageData);
    }

    formDataInvites.forEach((elm, index) => {
      formData.append(`timelineGroupInvite[${index}].inviteId`, elm.inviteId);
      formData.append(
        `timelineGroupInvite[${index}].inviteType`,
        elm.inviteType.toString()
      );
      formData.append(`timelineGroupInvite[${index}].status`, elm.status.toString());
      formData.append(
        `timelineGroupInvite[${index}].authority`,
        elm.authority
      );
    });
    {
      !paramsTimelineGroup.timelineGroupId ||
        formData.append(
          'timelineGroup.timelineGroupId',
          paramsTimelineGroup.timelineGroupId
        );
    }

    async function callApi() {
      if (paramsTimelineGroup.timelineGroupId) {
        // update group
        const response = await updateTimelineGroup(formData);
        console.log('============>>>form data ', formData);
        if (response.status === 200) {
          navigation.goBack();
        }
      } else {
        // create group
        const response = await createGroupList(formData);
        if (response) {
          if (response.status === 200 && response?.data !== undefined) {
            navigation.navigate('timeline-page-group', {
              data: { timelineGroupId: response.data },
            });
          }
        }
      }
    }
    callApi();
  };

  /**
   * edit group list
   */
  // const editGroupListF = () => {
  //   paramsTimelineGroup.color = groupColor.hexColor;
  //   const timelineGroupInvites: Array<any> = [];
  //   if (hasChangeInvite) {
  //     paramsTimelineGroupInvites.forEach((value) => {
  //       const tmpData = {
  //         inviteType: value.inviteType,
  //         status: value.status,
  //         authority: value.authority,
  //       };
  //       [value.inviteId].flat().forEach((id: number) => {
  //         timelineGroupInvites.push({
  //           inviteId: id,
  //           ...tmpData,
  //         });
  //       });
  //     });
  //   }
  //   let timelineGroup: any = {
  //     timelineGroupId: paramsTimelineGroup.timelineGroupId,
  //     timelineGroupName: paramsTimelineGroup.timelineGroupName,
  //     isPublic: paramsTimelineGroup.isPublic,
  //     isApproval: paramsTimelineGroup.isApproval,
  //     color: paramsTimelineGroup.color,
  //     comment: paramsTimelineGroup.comment,
  //   };
  //   if (hasChangeImage) {
  //     timelineGroup = {
  //       ...timelineGroup,
  //       imageData: paramsTimelineGroup.imageData,
  //       imageName: paramsTimelineGroup.imageName,
  //       width: paramsTimelineGroup.width,
  //       height: paramsTimelineGroup.height,
  //     };
  //   }

  //   // async function callApi() {
  //   //   const response = await createGroupList(queryUpdateGroupList(timelineGroup, timelineGroupInvites, hasChangeInvite), {});
  //   //   if (response) {
  //   //     if (response.status == 200 && response?.data != undefined) {
  //   //       //navigation.navigate("timeline-page-group", { timelineGroupId: response.data.timelineGroupId });
  //   //       navigation.goBack();
  //   //     }
  //   //   }
  //   // }
  //   // callApi();
  // };

  useEffect(() => {
    console.log('DATAT GROUP ID -->', route?.params?.timelineGroupId);
    async function getData() {
      const params = {
        timelineGroupIds: [route?.params?.timelineGroupId],
        sortType: 1,
      };
      const response = await getTimelineGroups(params);
      console.log('DATAT GROUP DETAIL', response);
      if (response && response.status === 200) {
        setParamsTimelineGroup(response?.data?.timelineGroup[0]);
        setParamsTimelineGroupInvites(response?.data?.timelineGroup[0].invites);
      }
    }
    if (route?.params?.timelineGroupId !== undefined) {
      setMode(ModeScreen.EDIT);
      dispatch(timelineActions.getTimelineGroups(dataGetTimelineGroupsDummy));
      getData();
      console.log('DATAT GROUP ID');
    }
  }, [route.params?.timelineGroupId]);

  /**
   * handle change property
   * @param fieldName
   * @param newValue
   */

  const handleChangeProperty = (fieldName: string, newValue: any) => {
    const newParams: any = { ...paramsTimelineGroup };
    newParams[fieldName] = newValue;
    setParamsTimelineGroup(newParams);
  };

  /**
   * pick image
   */
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestCameraRollPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        base64: true,
      });
      console.log('result', result);

      if (!result.cancelled) {
        const params = { ...paramsTimelineGroup };
        // params.imageData = result ? `data:image/jpg;base64,${result.base64}` : null;
        params.imageData = result.uri;
        params.imageName = result.uri.split('/')[
          result.uri.split('/').length - 1
        ];
        params.width = result ? result.width : 0;
        params.height = result ? result.height : 0;
        setParamsTimelineGroup(params);
        // setHasChangeImage(true);
      }
    } catch (E) {
      // do smt
    }
  };

  /**
   * Clear Image
   */
  const clearImage = () => {
    const params = { ...paramsTimelineGroup };
    params.imageData = '';
    params.imageName = '';
    params.width = 0;
    params.height = 0;
    setParamsTimelineGroup(params);
    // setHasChangeImage(true);
  };

  /**
   * handle show authority
   * @param itemSelected
   * @param index
   */
  // const handleShowAuthority = (itemSelected: any, index: number) => {
  //   let icon = '';
  //   let content = '';
  //   let content2 = '';
  //   let title = '';
  //   const title2 = '';
  //   switch (itemSelected.authorityItemType) {
  //     case AuthorityItemType.EMPLOYEE:
  //       icon = itemSelected.employeeImage;
  //       title = itemSelected.departmentName;
  //       content = itemSelected.employeeName;
  //       content2 = itemSelected.positionName;
  //       break;
  //     case AuthorityItemType.DEPARTMENT:
  //       title = itemSelected.departmentParentName;
  //       content = itemSelected.departmentName;
  //       break;
  //     case AuthorityItemType.GROUP:
  //       title = itemSelected.groupName;
  //       break;
  //   }

  //   return (
  //     <Authority
  //       title={title}
  //       title2={title2}
  //       icon={icon}
  //       content={content}
  //       content2={content2}
  //       handleDeletePress={() => {
  //         const data = paramsTimelineGroupInvites
  //           .slice(0, index)
  //           .concat(
  //             paramsTimelineGroupInvites.slice(
  //               index + 1,
  //               paramsTimelineGroupInvites.length
  //             )
  //           );
  //         setParamsTimelineGroupInvites(data);
  //         setHasChangeInvite(true);
  //       }}
  //       authority={itemSelected.authority}
  //       authorityItemType={itemSelected.authorityItemType}
  //       handleAuthoritySelected={(value: number) => {
  //         const data = paramsTimelineGroupInvites;
  //         data[index].authority = value;
  //         setParamsTimelineGroupInvites(data);
  //       }}
  //     />
  //   );
  // };

  const setValueSelected = (value: any) => {
    setParamsTimelineGroupInvites(value);
    console.log('vlalasldlasdlasldasldasldasldl', value);
  };
  return (
    <SafeAreaView style={[CommonStyles.containerWhite, CommonStyles.flex1]}>
      <View style={CommonStyles.flex1}>
        <Header
          title={translate(messages.channelRegistration)}
          titleSize={theme.fontSizes[4]}
          nameButton={
            mode === ModeScreen.CREATE
              ? translate(messages.register)
              : translate(messages.edit)
          }
          onLeftPress={() => {
            navigation.goBack();
          }}
          onRightPress={() => {
            createGroupListF();
            // route?.params?.timelineGroupId !== undefined
            //   ? editGroupListF()
            //   : createGroupListF();
            // mode == ModeScreen.CREATE ? createGroupListF() : editGroupListF();
          }}
        />
        <ScrollView style={styles.main}>
          <FormInput
            required
            title={translate(messages.channelName)}
            placeholder={translate(messages.enterGroupName)}
            _onChangeText={(text) => {
              handleChangeProperty('timelineGroupName', text);
            }}
            value={paramsTimelineGroup.timelineGroupName}
            textInputStyle={styles.textInput}
            parentTextInputStyle={styles.parentTextInputStyle}
            hasLineBottom={false}
          />
          <FormInput
            title={translate(messages.channelImage)}
            placeholder={translate(messages.selectChanelImage)}
            inputDisable
            value={paramsTimelineGroup.imageName}
            textInputStyle={styles.textInput}
            parentTextInputStyle={styles.parentTextInputStyle}
            hasLineBottom={false}
            selectFile
            inputClickEvent={() => {
              pickImage();
            }}
            clearFile={() => {
              clearImage();
            }}
          />
          <FormInput
            title={translate(messages.comment)}
            placeholder={translate(messages.enterAComment)}
            _onChangeText={(text) => {
              handleChangeProperty('comment', text);
            }}
            value={paramsTimelineGroup.comment}
            textInputStyle={styles.textInput}
            parentTextInputStyle={styles.parentTextInputStyle}
            hasLineBottom={false}
          />
          <View style={styles.wrapContent}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>
                {translate(messages.groupColor)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('register-group-chanel-color', {
                  hexColor: groupColor.hexColor,
                });
              }}
              style={[
                styles.groupColor,
                { backgroundColor: formatColor(groupColor.hexColor) },
              ]}
            />
          </View>
          <View style={styles.wrapContent}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>{translate(messages.public)}</Text>
            </View>
            <View style={[styles.groupRadio]}>
              <RadioGroup
                data={[
                  {
                    title: translate(messages.public),
                    value: 0,
                  },
                  {
                    title: translate(messages.private),
                    value: 1,
                  },
                ]}
                onSelectedChange={(value: number) => {
                  handleChangeProperty('isPublic', value == 0);
                }}
                defaultSelect={paramsTimelineGroup.isPublic ? 0 : 1}
                radioStyle={styles.radio}
              />
            </View>
          </View>
          <View style={styles.wrapContent}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>
                {translate(messages.approvalRequired)}
              </Text>
            </View>
            <View style={[styles.groupRadio]}>
              <RadioGroup
                data={[
                  {
                    title: translate(messages.necessary),
                    value: 0,
                  },
                  {
                    title: translate(messages.notNeeded),
                    value: 1,
                  },
                ]}
                onSelectedChange={(value: number) => {
                  handleChangeProperty(
                    'isApproval',
                    value == 0
                  );
                }}
                defaultSelect={1}
                radioStyle={styles.radio}
              />
            </View>
          </View>
          <View style={styles.wrapContent}>
            <View style={styles.titleWrapper}>
              <Text style={styles.titleText}>
                {translate(messages.memberOfChannel)}
              </Text>
            </View>
            <View style={styles.add}>
              <EmployeeSuggestView
                suggestionsChoice={suggestionsChoice}
                typeSearch={TypeSelectSuggest.MULTI}
                groupSearch={KeySearch.EMPLOYEE}
                withAuthorization
                updateStateElement={(value) => setValueSelected(value)}
                invisibleLabel
                fieldLabel={translate(
                  messages.searchForDepartmentGroupEmployee
                )}
              />
            </View>
            {/* <View style={[styles.parentTextInputStyle]}>
              <TouchableOpacity
                onPress={() => {
                  setSelectModalOpen(true);
                }}
              >
                <Input
                  placeholder={translate(
                    messages.searchForDepartmentGroupEmployee
                  )}
                  placeholderColor={theme.colors.gray}
                  style={[styles.textInput]}
                  editable={false}
                />
              </TouchableOpacity>
            </View> */}
          </View>
          {/* <View style={[styles.wrapContent, styles.prGroupAuthority]}>
            {paramsTimelineGroupInvites.map((itemSelected, index) => {
              return (
                <View style={[styles.groupAuthority]} key={index.toString()}>
                  {handleShowAuthority(itemSelected, index)}
                </View>
              );
            })}
          </View> */}
          {/* <MultipleSelectWithSearchBox
            modalVisible={selectModalOpen}
            isOnlyPickItem
            onSubmitModal={(result: Array<any>) => {
              const data: Array<any> = result.map((value) => {
                return {
                  inviteId:
                    value.authorityItemType === AuthorityItemType.DEPARTMENT
                      ? value.departmentId
                      : value.employeeId,
                  inviteType:
                    value.authorityItemType === AuthorityItemType.DEPARTMENT
                      ? GroupInviteType.DEPARTMENT
                      : GroupInviteType.GROUP_OR_EMPLOYEE,
                  status: 1,
                  authority: AuthorityEnum.OWNER,
                  employeeImage: value.employeeImage,
                  departmentName: value.departmentName,
                  departmentParentName: value.departmentParentName,
                  employeeName: value.employeeName,
                  positionName: value.positionName,
                  groupName: value.groupName,
                  authorityItemType: value.authorityItemType,
                };
              });
              setParamsTimelineGroupInvites(data);
              setSelectModalOpen(false);
              setHasChangeInvite(true);
            }}
            itemInfoProperties={["employeeName", "employeeDescription"]}
            idProperty="employeeId"
          /> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
