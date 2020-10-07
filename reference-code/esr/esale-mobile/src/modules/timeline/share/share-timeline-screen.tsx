import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Icon } from "../../../shared/components/icon";
import { translate } from "../../../config/i18n";
import { messages } from "./share-timeline-messages";
import { shareStyles } from "./share-timeline-styles";
import { CreateTimelineView } from "./share-timeline-create-timeline-view";
import { SharedTimeline } from "./share-timeline-shared-timeline-view";
import { ItemUploadFile } from "./share-timeline-item-upload-file";
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { CreateTimelineRouteProp } from "../../../config/constants/root-stack-param-list";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { createShareTimeline } from "../timeline-repository";

interface DummyEmployee {
  id: number;
  employeeIcon?: string;
  employeeName?: string;
  groupIcon?: string;
  groupName?: string;
}

export interface ShareTimelineProps {
  // close modal share
  onClose: () => void;
  // timeline share
  dataShare: any;
}

/**
 * Component share timeline
 * @param payload
 */
export const ShareTimeline = () => {
  const [contentShare, setContentShare] = useState(TEXT_EMPTY);
  const [isShowSuggest, setShowSuggest] = useState(false);
  const [listShare, setListShare] = useState([] as any);
  const [isShowDropDownGroup, setShowDropDownGroup] = useState(false);
  const [groupShare, setGroupShare] = useState({
    groupId: 0,
    groupName: translate(messages.doNotSelectChannel),
  });
  const [titleCreate, setTitleCreate] = useState(TEXT_EMPTY);
  const [isComment, setIsComment] = useState(false);

  const [listFileShare, setListFileShare] = useState([] as any);
  const navigation = useNavigation();
  const route = useRoute();
  const { data = {} }: any = route.params;
  const param = useRoute<CreateTimelineRouteProp>();
  useEffect(() => {
    if (param.params) {
      setTitleCreate(param.params.title);
      setIsComment(param.params.comment);
    }
  }, [param]);

  const isShare = contentShare.length > 0;
  const DummyLocalNavigation = {
    localNavigation: {
      allTimeline: 3,
      myTimeline: 2,
      favoriteTimeline: 2,
      groupTimeline: {
        joinedGroup: [
          {
            groupId: 1000,
            groupName: "Group1",
            newItem: 1,
            imagePath:
              "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
          },
          {
            groupId: 1001,
            groupName: "Group2",
            typeGroup: 2,
            imagePath:
              "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
          },
          {
            groupId: 1003,
            groupName: "Group3",
            newItem: 1,
            imagePath:
              "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
          },
          {
            groupId: 1004,
            groupName: "Group4",
            typeGroup: 2,
            imagePath:
              "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
          },
          {
            groupId: 1005,
            groupName: "Group5",
            newItem: 1,
            imagePath:
              "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
          },
          {
            groupId: 1006,
            groupName: "Group6",
            typeGroup: 2,
            imagePath:
              "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
          },
        ],
        favoriteGroup: [
          {
            groupId: 1000,
            groupName: "Group1",
            newItem: 1,
          },
          {
            groupId: 1000,
            groupName: "Group1",
            newItem: 1,
          },
        ],
        requestToJoinGroup: [
          {
            groupId: 1000,
            groupName: "Group1",
            newItem: 1,
          },
          {
            groupId: 1000,
            groupName: "Group1",
            newItem: 1,
          },
        ],
      },
      departmentTimeline: [
        {
          departmentId: 1000,
          departmentName: "Group1",
          newItem: 1,
        },
      ],
      customerTimeline: [
        {
          listId: 1000,
          listName: "Group1",
          newItem: 1,
        },
      ],
      businessCardTimeline: [
        {
          listId: 1000,
          listName: "Group1",
          newItem: 1,
        },
      ],
    },
  };

  const DummyData = [
    {
      id: 1,
      employeeIcon:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsuX8DpuDiUuFAMWfXKVW6P9X6VOvIGjPzuzXy0QTTmfBiAmfn&usqp=CAU",
      employeeName: "社員BWSSS 部長",
    },
    {
      id: 2,

      employeeIcon:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsuX8DpuDiUuFAMWfXKVW6P9X6VOvIGjPzuzXy0QTTmfBiAmfn&usqp=CAU",
      employeeName: "社員Q 部長",
    },
    {
      id: 3,

      employeeIcon:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsuX8DpuDiUuFAMWfXKVW6P9X6VOvIGjPzuzXy0QTTmfBiAmfn&usqp=CAU",
      employeeName: "社員A  部長",
    },
    {
      id: 4,

      employeeIcon:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsuX8DpuDiUuFAMWfXKVW6P9X6VOvIGjPzuzXy0QTTmfBiAmfn&usqp=CAU",
      employeeName: "社員K  部長",
    },
    {
      id: 5,
      employeeIcon:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsuX8DpuDiUuFAMWfXKVW6P9X6VOvIGjPzuzXy0QTTmfBiAmfn&usqp=CAU",
      employeeName: "社員J  部長",
    },
    {
      id: 6,

      employeeIcon:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRsuX8DpuDiUuFAMWfXKVW6P9X6VOvIGjPzuzXy0QTTmfBiAmfn&usqp=CAU",
      employeeName: "社員Y  部長",
    },
    {
      id: 7,

      groupIcon:
        "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
      groupName: "社員H  部長",
    },
    {
      id: 8,

      groupIcon:
        "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
      groupName: "社員F  部長",
    },
    {
      id: 9,

      groupIcon:
        "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
      groupName: "社員E  部長",
    },
    {
      id: 10,

      groupIcon:
        "https://www.applozic.com/resources/sidebox/css/app/images/mck-icon-group.png",
      groupName: "社員G  部長",
    },
  ];

  /**
   * add employeeName is selected
   * @param item
   */
  const addItemListShare = (item: DummyEmployee) => {
    let check = 0;
    listShare.forEach((elm: DummyEmployee) => {
      if (elm.id === item.id) {
        check += 1;
      }
    });
    if (check === 0) {
      const newListShare = [...listShare, item];
      setListShare(newListShare);
      setShowSuggest(false);
    }
  };
  /**
   * remove employeeName is selected
   * @param item
   */
  const removeItemListShare = (item: DummyEmployee) => {
    const newListShare = listShare.filter((elm: never) => {
      return elm !== item;
    });
    setListShare(newListShare);
  };
  /**
   * choose file from AVD
   */
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true });
    if (result.type === "success") {
      const newListFileShare = [...listFileShare, result];
      setListFileShare(newListFileShare);
    }
  };
  /**
   * remove file is selected
   * @param document
   */
  const removeDocument = (document: any) => {
    const newListFileShare = listFileShare.filter((elm: never) => {
      return elm !== document;
    });
    setListFileShare(newListFileShare);
  };
  /**
   * handel data to call api
   */
  const onShare = async () => {
    // create data request
    // const params = {
    //   sharedTimelineId: data.timelineId,
    //   targetDelivers: [],
    //   textComment: contentShare,
    //   sharedContent: DummyDataShare.comment,
    //   attachedFiles: [],
    // };
    const formData = new FormData();
    formData.append("sharedTimelineId", '');
    formData.append("targetDelivers", '');
    formData.append("textComment", '');
    // Timeline 
    formData.append("sharedContent", '');

    // TODO: file 
    formData.append("attachedFiles", '');

    const res = await createShareTimeline(formData, {});
    console.log("res", res);
    if (res.status == 200) {
      navigation.goBack();
    }
  };
  /**
   * render Employee name is selected
   * @param elm
   * @param index
   */
  const itemName = (elm: any, index: number) => {
    return (
      <View key={index} style={shareStyles.boxSendName}>
        <Text style={shareStyles.txtWhite}>
          {elm.employeeName ? elm.employeeName : elm.groupName}
        </Text>
        <TouchableOpacity
          hitSlop={shareStyles.hitSlop}
          onPress={() => removeItemListShare(elm)}
        >
          <Icon style={shareStyles.smallIcon} name="closeWhite" />
        </TouchableOpacity>
      </View>
    );
  };
  /**
   * select group share when selected joined group
   * @param groupInfo
   */
  const selectGroup = (groupInfo: any) => {
    setGroupShare(groupInfo);
    setShowDropDownGroup(false);
  };
  /**
   * render suggest employee
   * @param eml
   */
  const suggestView = (eml: any) => {
    return (
      <TouchableOpacity
        onPress={() => addItemListShare(eml)}
        style={shareStyles.itemSuggestView}
      >
        <Image
          style={shareStyles.avatar}
          source={{
            uri: eml.employeeIcon ? eml.employeeIcon : eml.groupIcon,
          }}
        />
        <Text style={shareStyles.txtBlack12}>
          {eml.employeeName ? eml.employeeName : eml.groupName}
        </Text>
      </TouchableOpacity>
    );
  };
  /**
   * render joined group
   */
  const itemGroup = (eml: any) => {
    const checkGroupSelected = eml.groupId === groupShare.groupId;
    return (
      <TouchableOpacity
        key={eml.groupId}
        onPress={() => selectGroup(eml)}
        style={
          checkGroupSelected
            ? shareStyles.groupSelectedView
            : shareStyles.boxEmployeeInfo
        }
      >
        <Image
          source={{ uri: eml.imagePath }}
          style={shareStyles.circleGroupName}
        />
        <Text style={checkGroupSelected && shareStyles.txtBlue}>
          {eml.groupName}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={shareStyles.safe}
    >
      <AppBarModal
        title={titleCreate || translate(messages.share)}
        onClose={() => navigation.goBack()}
      />
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        style={shareStyles.spaceBottom}
      >
        {isShowDropDownGroup && (
          <TouchableOpacity style={shareStyles.boxListGroup}>
            <FlatList
              nestedScrollEnabled
              data={
                DummyLocalNavigation.localNavigation.groupTimeline.joinedGroup
              }
              renderItem={({ item }) => itemGroup(item)}
            />
          </TouchableOpacity>
        )}
        {isComment || (
          <View>
            <TouchableOpacity
              onPress={() => setShowDropDownGroup(!isShowDropDownGroup)}
              style={shareStyles.boxGroup}
            >
              <Text style={shareStyles.txtGroup}>{groupShare.groupName}</Text>
              <Icon style={shareStyles.iconRight} name="drop" />
            </TouchableOpacity>
          </View>
        )}
        <View style={shareStyles.boxListShare}>
          <TouchableOpacity
            hitSlop={shareStyles.hitSlop}
            onPress={() => setShowSuggest(!isShowSuggest)}
          >
            <Text style={shareStyles.txtBlack12}>
              {translate(messages.destination)}
            </Text>
          </TouchableOpacity>
          <ScrollView
            nestedScrollEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {listShare.map((eml: any, index: number) => itemName(eml, index))}
          </ScrollView>
        </View>
        {isShowSuggest ? (
          <ScrollView nestedScrollEnabled style={shareStyles.suggestView}>
            {DummyData.map((eml: any) => suggestView(eml))}
          </ScrollView>
        ) : (
          <>
            <TextInput
              multiline
              editable={!isShowDropDownGroup}
              value={contentShare}
              onChangeText={(text) => setContentShare(text)}
              style={shareStyles.textInput}
              placeholder={translate(messages.placeholder)}
            />
          </>
        )}
        {isShowDropDownGroup && <View style={shareStyles.spaceView} />}
      </ScrollView>
      <View style={shareStyles.bottomView}>
        {!param && <SharedTimeline dataShare={data} />}
        <ScrollView
          nestedScrollEnabled
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          style={shareStyles.suggestView}
        >
          {listFileShare.map((eml: any) => (
            <ItemUploadFile
              key={eml.name}
              itemFile={eml}
              onRemoveDocument={() => removeDocument(eml)}
            />
          ))}
        </ScrollView>
        <CreateTimelineView
          isDisableButtonCreate={isShare}
          onPickDocument={() => pickDocument()}
          titleButtonCreate={
            titleCreate ? translate(messages.post) : translate(messages.share)
          }
          onCreate={() => onShare()}
        />
      </View>
    </KeyboardAvoidingView>
  );
};
