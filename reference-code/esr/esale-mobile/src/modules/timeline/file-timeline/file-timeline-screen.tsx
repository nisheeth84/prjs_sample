import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { messages } from "./file-timeline-message";
import { translate } from "../../../config/i18n";
import { FileTimelineStyles } from "./file-timeline-styles";
import { Icon } from "../../../shared/components/icon";
import { AppBarMenu } from "../../../shared/components/appbar/appbar-menu";
import { getAttachedFiles } from "../timeline-repository";
import { timelineActions } from "../timeline-reducer";
import {
  dataGetAttachedFilesSelector,
  updateFilterOptionsSelector,
} from "../timeline-selector";

export interface EmojiProps {
  emoji?: any;
  emojiPopular?: any;
}

export function FileTimeline() {
  const data = useSelector(dataGetAttachedFilesSelector);
  const [modalVisible, setModalVisible] = useState(false);
  const [listFileConvert, setListFileConvert] = useState<any>([]);
  const [preview, setPreview] = useState(false);
  const dispatch = useDispatch();
  const filterOptions = useSelector(updateFilterOptionsSelector);

  /**
   * convert data api => list file
   */
  useEffect(() => {
    const arr = [];
    for (let i = 0; i < data.length; i += 1) {
      for (let n = 0; n < data[i].attachedFiles.length; n += 1) {
        const value = {
          fileName: data[i].attachedFiles[n].fileName,
          filePath: data[i].attachedFiles[n].filePath,
          createdDate: data[i].createdDate,
          createdUserName: data[i].createdUserName,
          timelineId: data[i].timelineId,
        };
        arr.push(value);
      }
    }
    setListFileConvert(arr);
  }, [data]);

  /**
   * call api gte file timeline
   */
  useEffect(() => {
    async function getFileTimeline() {
      const params = {
        listType: 1,
        listId: null,
        limit: 5, // timeline_offset
        offset: 0,
        filters: {
          filterOptions,
          isOnlyUnreadTimeline: true,
        },
      };
      const response = await getAttachedFiles(params, {});
      if (response.status == 200){
        dispatch(timelineActions.getUserTimelines(response.data));
      }
    }
    getFileTimeline();
  }, []);

  /**
   * open dialog when on click one row item
   */
  function openDialog(item: any) {
    const fileFormat = item.fileName.split(".").pop();
    setPreview(fileFormat == "png");
    setModalVisible(!modalVisible);
  }

  /**
   *
   * @param item render Item time line
   */
  function renderItemFiles(item: any) {
    const fileFormat = item.fileName.split(".").pop();
    return (
      <TouchableOpacity
        onPress={() => openDialog(item)}
        style={FileTimelineStyles.item}
      >
        <View style={FileTimelineStyles.itemIcon}>
          {fileFormat === "png" ? (
            <Image
              style={FileTimelineStyles.img}
              resizeMode="contain"
              source={{
                uri: "https://i.ya-webdesign.com/images/image-icon-png-8.png",
              }}
              // source={{
              //   uri: `API ${item.filePath}`,
              // }}
            />
          ) : (
            <Icon
              style={FileTimelineStyles.icon}
              name={fileFormat}
              resizeMode="contain"
            />
          )}
        </View>

        <View style={FileTimelineStyles.itemInfo}>
          <Text style={FileTimelineStyles.itemName}>{item.fileName}</Text>
          <Text style={FileTimelineStyles.txtItem}>{item.createdUserName}</Text>
          <Text style={FileTimelineStyles.txtItem}>{item.createdDate}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  /**
   * render dialog when use click 1 row file
   */
  function renderDialog() {
    return (
      <Modal animationType="fade" transparent visible={modalVisible}>
        <View style={FileTimelineStyles.centeredView}>
          <View style={FileTimelineStyles.modalView}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={FileTimelineStyles.btnDialog}
            >
              <Text style={FileTimelineStyles.txtDialog}>
                {translate(messages.timelineFileDownload)}
              </Text>
            </TouchableOpacity>
            {preview ? (
              <>
                <View style={FileTimelineStyles.line} />
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={FileTimelineStyles.btnDialog}
                >
                  <Text style={FileTimelineStyles.txtDialog}>
                    {translate(messages.timelineFilePreview)}
                  </Text>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <SafeAreaView style={FileTimelineStyles.safe}>
      <AppBarMenu name={translate(messages.timelineFileTitle)} hasBackButton />
      <FlatList
        style={FileTimelineStyles.container}
        data={listFileConvert}
        renderItem={(i) => renderItemFiles(i.item)}
      />
      {renderDialog()}
    </SafeAreaView>
  );
}
