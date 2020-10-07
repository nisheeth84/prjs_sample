import _ from 'lodash';
import ImageViewer from 'react-native-image-zoom-viewer';
import React, { useRef, useState } from 'react';
import RNBackgroundDownloader from 'react-native-background-downloader';
import RNFetchBlob from 'rn-fetch-blob';
import StringUtils from '../../../../util/string-utils';
import { FIELD_LABLE, TEXT_EMPTY } from '../../../../../config/constants/constants';
import { FieldDetailFileStyles } from './field-detail-styles';
import { FileType, PlatformOS } from '../../../../../config/constants/enum';
import { IDynamicFieldProps } from '../interface/dynamic-field-props';
import {
  Animated,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
  Alert,
  Modal,
} from "react-native";

// Define value props of FielrrrdDetailFile component
type IFieldDetailFileProps = IDynamicFieldProps;

/**
 * Component for show file fields
 * @param props see IDynamicFieldProps
 */
export function FieldDetailFile(props: IFieldDetailFileProps) {
  const { fieldInfo, languageCode } = props;
  const title = StringUtils.getFieldLabel(
    fieldInfo,
    FIELD_LABLE,
    languageCode ?? TEXT_EMPTY
  );
  const [previewImage, setPreviewImage] = useState(false);
  const closeIcon = require("../../../../../../assets/icons/close_white.png");

  const heightPreview = useRef(new Animated.Value(0)).current;
  const widthPreview = useRef(new Animated.Value(0)).current;
  const files =
    props?.elementStatus?.fieldValue &&
    _.isString(props?.elementStatus?.fieldValue)
      ? JSON.parse(props?.elementStatus?.fieldValue)
      : props?.elementStatus?.fieldValue;
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  /**
   * handle download file for 2 OS
   */
  const handleDownload = async (fileUrl: string, fileName: string) => {
    if (Platform.OS === PlatformOS.IOS) {
      downloadFileIos(fileUrl, fileName);
    } else {
      try {
        // TODO: check grant access (still ok but should grant or not ???)
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Once user grant the permission start downloading
          downloadFileAndroid(fileUrl, fileName);
        } else {
          // If permission denied then show alert
          Alert.alert("", "Storage Permission Not Granted");
        }
      } catch (err) {
        // DO NOTHING
      }
    }
  };

  /**
   * download file on android
   */
  const downloadFileAndroid = (fileUrl: string, fileName: string) => {
    // // rn-fetch-blob
    const { config, fs } = RNFetchBlob;
    const downloadDir = fs.dirs.DownloadDir;
    // URL which we want to download
    const url = fileUrl;
    //Get config and fs from RNFetchBlob
    //config: To pass the downloading related options
    //fs: To get the directory path in which we want our image to download
    const options = {
      fileCache: true,
      addAndroidDownloads: {
        // Related to the Android only
        useDownloadManager: true,
        notification: true,
        path: `${downloadDir}/${fileName}`,
      },
    };
    config(options).fetch("GET", url);
  };

  /**
   * download file on ios
   */
  const downloadFileIos = (fileUrl: string, fileName: string) => {
    // background-downloader
    const taskDownload = RNBackgroundDownloader.download({
      id: "downloadFile",
      url: fileUrl,
      destination: `${RNBackgroundDownloader.directories.documents}/${fileName}`,
    }).begin(() => {});
    taskDownload.resume();
  };

  /**
   * handle preview image
   */
  const handlePreview = (fileUrl: string) => {
    setSelectedImageUrl(fileUrl);
    setPreviewImage(true);
    Animated.timing(heightPreview, {
      toValue: Dimensions.get("screen").height,
      duration: 700,
    }).start();
    Animated.timing(widthPreview, {
      toValue: Dimensions.get("screen").width,
      duration: 700,
    }).start();
  };

  /**
   * handle close preview image
   */
  const closePreview = () => {
    setPreviewImage(false);
    widthPreview.setValue(0);
    heightPreview.setValue(0);
  };
  /**
   * Render the file component
   */
  const renderComponent = () => {
    return (
      <View>
        <Text style={FieldDetailFileStyles.title}>{title}</Text>
        {!!files &&
          Array.isArray(files) &&
          files.map((item: any) => {
            const fileName = item["file_name"];
            const fileType = fileName?.substr(fileName.lastIndexOf(".") + 1);
            const fileUrl = item["file_url"];

            return (
              <View>
                <View style={FieldDetailFileStyles.content}>
                  {FileType.JPG.includes(fileType) && (
                    <TouchableOpacity onPress={() => handlePreview(fileUrl)}>
                      <Image
                        style={FieldDetailFileStyles.thumbnail}
                        source={{ uri: fileUrl }}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => handleDownload(fileUrl, fileName)}
                  >
                    <Text style={FieldDetailFileStyles.fileName}>
                      {fileName}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        {!!files && !Array.isArray(files) && (
          <View>
            <View style={FieldDetailFileStyles.content}>
              {FileType.JPG.includes(
                files.fileName?.substr(files.fileName.lastIndexOf(".") + 1)
              ) && (
                <TouchableOpacity onPress={() => handlePreview(files.fileUrl)}>
                  <Image
                    style={FieldDetailFileStyles.thumbnail}
                    source={{ uri: files.fileUrl }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleDownload(files.fileUrl, files.fileName)}
              >
                <Text style={FieldDetailFileStyles.fileName}>
                  {files.fileName}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {files.length == 0 && (<View><Text> </Text></View>)}
        <Modal
          transparent={true}
          visible={previewImage}>
          <View style={FieldDetailFileStyles.thumbnailView}>
            <TouchableOpacity
              style={FieldDetailFileStyles.closeIcon}
              onPress={closePreview}
            >
              <Image source={closeIcon} />
            </TouchableOpacity>
            <Animated.View
              style={{ height: heightPreview, width: widthPreview, zIndex: 1 }}
            >
              <ImageViewer
                renderIndicator={() => <></>}
                style={FieldDetailFileStyles.thumbnailAnimated}
                imageUrls={[{ url: selectedImageUrl }]}
              />
            </Animated.View>
          </View>
        </Modal>
      </View>
    );
  };

  return renderComponent();
}
