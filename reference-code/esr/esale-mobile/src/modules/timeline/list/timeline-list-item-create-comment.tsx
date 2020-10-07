import React, { useRef, useState, useEffect } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { TimelineListStyle } from "./timeline-list-styles";
import { theme } from "../../../config/constants";
import { messages } from "../timeline-messages";
import { translate } from "../../../config/i18n";
import { Input } from "../../../shared/components/input";
import { Icon } from "../../../shared/components/icon";
import { ButtonColorHighlight } from "../../../shared/components/button/button-color-highlight";
import {
  EnumButtonStatus,
  EnumButtonType,
  EnumFormatText,
} from "../../../config/constants/enum";
import { getSuggestionTimeline,
   suggestTimelineGroupName } from "../timeline-repository";
import { TimelineStyles } from "../../employees/detail/detail-style";
import { array } from "yup";

interface ItemCreateCommentProps {
  content: string;
  setContent: (text: string) => void;
  onFormatText?: (item: any) => void;
  onCreateTimeline: () => void;
  onChooseFile?: (res: any) => void;
  onChooseAddress?: (res: any) => void;
  quote?: string;
}
const { height } = Dimensions.get("window");
const HEIGHT_CONTENT = height - 126;

const DUMMY_SUGGESTION_TIMELINE = [
  {
    employeeName: "name1",
    photoFilePath: "",
    employeeId: 1,
  },
  {
    employeeName: "name2",
    photoFilePath: "",
    employeeId: 2,
  },
  {
    employeeName: "name3",
    photoFilePath: "",
    employeeId: 3,
  },
];
const DUMMY_GROUP_NAME = [
  {
    employeeName: "name1",
    photoFilePath: "",
    employeeId: 1,
  },
  {
    employeeName: "name2",
    photoFilePath: "",
    employeeId: 2,
  },
  {
    employeeName: "name3",
    photoFilePath: "",
    employeeId: 3,
  },
];

export const ItemCreateComment: React.FC<ItemCreateCommentProps> = ({
  content,
  setContent,
  onFormatText,
  onCreateTimeline,
  onChooseFile = () => {},
  onChooseAddress = () => {},
  quote,
}) => {
  const fadeAnim = useRef(new Animated.Value(43)).current;
  const [showModal, setShowModal] = useState(false);
  const [styleFormat, setStyleFormat] = useState<any>({});
  const [isShowDiaLog, setIsShowDiaLog] = useState({ is: false, status: "" });
  const [nameAddress, setNameAddress] = useState<any>([]);
  const [resultSuggestionTimeline, setResultSuggestionTimeline] = useState<any>();
  const [resultSuggestionGroupName, setResultSuggestionGroupName] = useState<any>();
  const [searchName, setSearchName] = useState("");
  const [isLoadDialog, setIsLoadDiaLog] = useState(false);
  const [ file, setFile ] = useState({name: ""});

  useEffect(() => {
    if(isShowDiaLog.status == "group") {
      callTimelineGroupName();
    }
    if(isShowDiaLog.status == "address") {
      callSuggestionTimeline();
    }
  }, [searchName])


  useEffect(() => {
    onChooseAddress(nameAddress)
  }, [nameAddress])

  async function callSuggestionTimeline() {
    const params = {
      keyWords: searchName,
      listItemChoice: [],
      offset: 0,
      // TODO: web local auto call 11
      timelineGroupId: 11
    }
    setIsLoadDiaLog(true)
    const response = await getSuggestionTimeline(params);
    if(response.status === 200){
      setResultSuggestionTimeline(response?.data?.employees || [])
    }
    setIsLoadDiaLog(false)
  }

  async function callTimelineGroupName(){
    const params = {
      searchType: 2,
      timelineGroupName: searchName
    }
    setIsLoadDiaLog(true)
    const res = await suggestTimelineGroupName(params);
    if(res.status === 200){
      setResultSuggestionGroupName(res?.data || [])
    }
    setIsLoadDiaLog(false)
  }
  const handleChooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      onChooseFile(res);
      setFile({ name: res.name });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  // TODO: check handle send nameCreateTimeline --> employee #data api 
  const handleAddressSuggest = (item: any) => {
    const arr = [...nameAddress];
    arr.push(item);
    setNameAddress(Array.from(new Set(arr)));
    setIsShowDiaLog({ is: false, status: "" });
  };

  // TODO: after call api get group name ->> call back api AddressSuggest
  const handleChooseGroupName = (item: any) => {
    setIsShowDiaLog({ is: false, status: "" });
  };

  const handleRemoveAddressSuggest = (item: any) => {
    const arr = [...nameAddress];
    setNameAddress(arr.filter((i: any) => i.employeeId != item.employeeId));
  };

  const [isShowFormatText, setShowFormatText] = useState(false);
  const renderIcon = (iconName: string, onPressIcon?: () => void) => {
    return (
      <TouchableOpacity onPress={onPressIcon}>
        <Icon
          style={TimelineListStyle.icon}
          resizeMode="contain"
          name={iconName}
        />
      </TouchableOpacity>
    );
  };

  const renderFormatTextView = () => {
    return (
      <View style={TimelineListStyle.rowView}>
        {onFormatText && (
          <View style={TimelineListStyle.inputCreate}>
            {renderIcon("textIcon", () =>
              onFormatText(EnumFormatText.underLine)
            )}
            {renderIcon("iconFinderBold", () =>
              onFormatText(EnumFormatText.bold)
            )}
            {renderIcon("iconFinderItalic", () =>
              onFormatText(EnumFormatText.italic)
            )}
            {renderIcon("dashWord", () =>
              onFormatText(EnumFormatText.strikeThrough)
            )}
          </View>
        )}

        {renderIcon("close", () => setShowFormatText(!isShowFormatText))}
      </View>
    );
  };

  const onShowModal = () => {
    Animated.timing(fadeAnim, {
      toValue: HEIGHT_CONTENT,
      duration: 1000,
    }).start(() => setShowModal(!showModal));
  };

  const onHideModal = () => {
    setShowModal(!showModal);
    Animated.timing(fadeAnim, {
      toValue: 43,
      duration: 1000,
    }).start();
  };

  const itemAddressName = (item: any) => {
    return (
      <View style={TimelineListStyle.tagName}>
        <Text style={TimelineListStyle.txtNameReply}>{item.employeeName}</Text>
        <TouchableOpacity onPress={() => handleRemoveAddressSuggest(item)}>
          <Icon
            style={TimelineListStyle.iconClose}
            resizeMode="contain"
            name={"close"}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const convertStyle = (format: EnumFormatText) => {
    switch (format) {
      case EnumFormatText.bold:
        setStyleFormat(TimelineListStyle.txtBold);
        break;
      case EnumFormatText.italic:
        setStyleFormat(TimelineListStyle.txtItalic);
        break;
      case EnumFormatText.underLine:
        setStyleFormat(TimelineListStyle.txtUnderLine);
        break;
      case EnumFormatText.strikeThrough:
        setStyleFormat(TimelineListStyle.txtStrikeThrough);
        break;
      default:
        setStyleFormat(TimelineListStyle.txtNormal);
        break;
    }
  };

  const renderHeaderView = () => {
    return (
      <View style={TimelineListStyle.tab}>
        <View style={{ flexDirection: "row", width: "100%" }}>
          {nameAddress.map((i: any) => itemAddressName(i))}
        </View>
        <TouchableOpacity onPress={showModal ? onHideModal : onShowModal}>
          <Icon resizeMode="contain" name={showModal ? "zoomOut" : "detail"} />
        </TouchableOpacity>
      </View>
    );
  };

  const itemResultDiaLog = (i: any) => {
    return(
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => handleChooseGroupName(i)}
          style={TimelineListStyle.itemResultDiaLog}
        >
          <Image
            style={TimelineListStyle.imageDialog}
            source={{ uri: ''}}
          />
          <Text style={TimelineListStyle.txtResultDialog}>{i.timelineGroupName}</Text>
        </TouchableOpacity>
    )
  }

  const itemResultSuggestionTimeline = (i: any) => {
    return(
      <TouchableOpacity 
        activeOpacity={1}
        onPress={() => handleAddressSuggest(i)}
        style={TimelineListStyle.itemResultDiaLog}>
        <View style={TimelineListStyle.imageDialogContainer}>
          <Image
            style={TimelineListStyle.imageDialog}
            source={{ uri: ''}}
          />
        </View>
        <View style={{ flex: 5}}>
        <Text style={TimelineListStyle.txtResultGroup}>{`${i.employeeSurname} ${i.employeeName}`}</Text>
        <Text style={TimelineListStyle.txtResultGroupName}>{`${i.employeeSurname} ${i.employeeSurnameKana}`}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderQuote = () => {
    if (quote) {
      return (
        <View
          style={{
            backgroundColor: "#fff",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 10,
          }}
        >
          <View
            style={{
              width: "95%",
              minHeight: 50,
              backgroundColor: "#fff",
              flexDirection: "row",
              borderWidth: 1,
              padding: 5,
              borderRadius: 15,
              borderColor: "#E5E5E5",
            }}
          >
            <View style={{ flex: 0.5, alignItems: "center" }}>
              <Icon name="quote" style={{ width: 10, height: 10 }} />
              <View
                style={{
                  width: 4,
                  backgroundColor: "#999999",
                  flex: 1,
                  marginTop: 5,
                }}
              />
            </View>
            <View style={{ flex: 7, justifyContent: "center", marginTop: 12 }}>
              <Text numberOfLines={3}>{quote}</Text>
            </View>
          </View>
        </View>
      );
    }
  };

  const renderDialogSuggestion = () => {
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={TimelineListStyle.containerDiaLog}
    > 
      <TouchableOpacity
      onPress={() => setIsShowDiaLog({is: false, status: ''})}
      style={{ width: '100%', height: '60%'}}
      />

      <Animated.View  style={TimelineListStyle.dialog} >
          
       <View style={TimelineListStyle.searchDialog} >
          <TextInput
            placeholder={translate(messages.placeholderCreateTimeline)}
            value={searchName}
            onChangeText={(txt) => setSearchName(txt)}
            style={TimelineListStyle.inputSearch}
          />
       </View>


       <View style={TimelineListStyle.listResultDialLog}>
         {isLoadDialog ? <ActivityIndicator size="large" /> : 
         <View style={{ width: '100%', height: 210}}>
          {
           isShowDiaLog.status === 'group' && 
            <FlatList
            data={resultSuggestionGroupName}
            renderItem={(i) => 
              itemResultDiaLog(i.item)
            }
          />
         }
         {
           isShowDiaLog.status === 'address' && 
            <FlatList
              data={resultSuggestionTimeline}
              renderItem={(i) => 
                itemResultSuggestionTimeline(i.item)
            }
            />
         }
         </View>
         }
        
       </View>


        
      </Animated.View>
      
    </KeyboardAvoidingView>
    )
  }

  const renderFile = () => {
      return(
        !file.name || 
        <View style={TimelineListStyle.file}>
          <Image
            resizeMode="contain"
            style={TimelineListStyle.fileIcon}
            source={require("../../../../assets/icons/pdf.png")}
          />
          <Text style={TimelineListStyle.fileTxt}>{file.name}</Text>
        </View>
        
    )
  }

  return (
    isShowDiaLog.is ? 
      renderDialogSuggestion()
    :
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={
        showModal
          ? TimelineListStyle.createTimelineModal
          : TimelineListStyle.createTimelineContainer
      }
    >
      {showModal && (
        <TouchableOpacity
          style={TimelineListStyle.blackView}
          onPress={() => onHideModal()}
        />
      )}
      {setContent && renderHeaderView()}
        { showModal ||  
            renderQuote()
       }
      {renderFile()}
      <Animated.View style={[TimelineListStyle.create, { height: fadeAnim }]}>
        {showModal ? (
          <View style={{ width: "100%" }}>
            <TextInput
              multiline
              placeholder={translate(messages.placeholderCreateTimeline)}
              value={content}
              onChangeText={(txt) => setContent(txt)}
              style={TimelineListStyle.inputCreate}
              // inputStyle={[TimelineListStyle.inputContent, styleFormat]}
            />

            {renderQuote()}

            {!file.name || (
              <>
                <View style={TimelineListStyle.file}>
                  <Image
                    resizeMode="contain"
                    style={TimelineListStyle.fileIcon}
                    source={require("../../../../assets/icons/pdf.png")}
                  />
                  <Text style={TimelineListStyle.fileTxt}>{file.name}</Text>
                </View>
              </>
            )}

            {isShowFormatText ? (
              renderFormatTextView()
            ) : (
              <View style={TimelineListStyle.rowView}>
                <View style={TimelineListStyle.inputCreate}>
                  {renderIcon("groupIcon", () =>
                    setIsShowDiaLog({ is: true, status: "group" })
                  )}
                  {renderIcon("tagIcon", () =>
                    setIsShowDiaLog({ is: true, status: "address" })
                  )}
                  {renderIcon("attach", () => handleChooseFile())}
                  {renderIcon("textIcon", () =>
                    setShowFormatText(!isShowFormatText)
                  )}
                </View>
                <ButtonColorHighlight
                  onPress={onCreateTimeline}
                  title={translate(messages.buttonCreateTimeline)}
                  type={EnumButtonType.complete}
                  status={
                    content ? EnumButtonStatus.normal : EnumButtonStatus.disable
                  }
                />
              </View>
            )}
          </View>
        ) : (
          <>
            <View style={TimelineListStyle.rowView}>
              {renderIcon("tagIcon", () => setIsShowDiaLog({is: true, status: "address"}))}
              {renderIcon("attach", () => handleChooseFile())}
              {renderIcon("textIcon", () =>
                setShowFormatText(!isShowFormatText)
              )}

              <Input
                placeholder={'投稿内容を入力'}
                placeholderColor={theme.colors.gray}
                value={content}
                onChangeText={(txt) => setContent(txt)}
                style={TimelineListStyle.inputCreate}
              />

              <ButtonColorHighlight
                onPress={onCreateTimeline}
                title={translate(messages.buttonCreateTimeline)}
                type={EnumButtonType.complete}
                status={
                  content ? EnumButtonStatus.normal : EnumButtonStatus.disable
                }
              />
            </View>
          </>
        )}
      </Animated.View>
    </KeyboardAvoidingView>
  );
};
