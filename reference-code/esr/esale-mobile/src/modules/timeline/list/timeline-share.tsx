import React, { useState, useEffect } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { TimelineListStyle } from "./timeline-list-styles";
import { messages } from "../timeline-messages";
import { translate } from "../../../config/i18n";
import { Icon } from "../../../shared/components/icon";
import { ButtonColorHighlight } from "../../../shared/components/button/button-color-highlight";
import {
  EnumButtonStatus,
  EnumButtonType,
  EnumFormatText,
} from "../../../config/constants/enum";
import { TimelineItem } from "../../../shared/components/timeline/timeline-item-styles";
import { authorizationSelector } from "../../login/authorization/authorization-selector";
import { useSelector } from "react-redux";
import { getSuggestionTimeline,
  suggestTimelineGroupName, createShareTimeline, createTimeline } from "../timeline-repository";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'



interface ModalShareTimelineProps {
  content: string;
  setContent: (text: string) => void;
  onFormatText?: (item: any) => void;
  onChooseFile?: (res: any) => void;
  quote?: string;
  dataShare?: any;
  onClose?: any;
}
// const { height } = Dimensions.get("window");



export const ModalShareTimeline: React.FC<ModalShareTimelineProps> = ({
  content,
  setContent,
  onFormatText,
  onChooseFile = () => { },
  dataShare,
  onClose
}) => {
  // const fadeAnim = useRef(new Animated.Value(43)).current;
  // const [showModal, setShowModal] = useState(true);
  // const [styleFormat, setStyleFormat] = useState<any>({});
  const [isShowDiaLog, setIsShowDiaLog] = useState({ is: false, status: ''});
  const [nameAddress, setNameAddress] = useState<any>([]);
  const [ file, setFile ] = useState<any>({name: ""});
  const employeeId = useSelector(authorizationSelector).employeeId || -1;
  const [searchName, setSearchName] = useState("");
  const [resultSuggestionGroupName, setResultSuggestionGroupName] = useState<any>();
  const [resultSuggestionTimeline, setResultSuggestionTimeline] = useState<any>();
  const [isLoadDialog, setIsLoadDiaLog] = useState(false);
  const [isShowKeyBoart, setIsShowKeyBoart] = useState(false);





  console.log("isShare", dataShare);

  const handleChooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      onChooseFile(res);
      setFile(res)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picke r, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  useEffect(() => {
    console.log("isShowDiaLog", isShowDiaLog);
    if(isShowDiaLog.status == "group") {
      callTimelineGroupName();
    }
    if(isShowDiaLog.status == "address") {
      callSuggestionTimeline();
    }
  }, [searchName])

  async function callSuggestionTimeline() {
    const params = {
      keyWords: searchName,
      listItemChoice: [],
      offset: 0,
      timelineGroupId: null
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
    console.log("res---->", res, params);
    if(res.status === 200){
      setResultSuggestionGroupName(res?.data || [])
    }
    setIsLoadDiaLog(false)
  }

  useEffect(() => {
    setFile({});
  }, [])

  async function onShareTimeline() {
    
    const formData = new FormData();
    // Id của timeline được chia sẻ
    formData.append("sharedTimelineId", dataShare?.timelineId?.toString());
    // Mảng chứa thông tin địa chỉ gửi đến
    formData.append("targetDelivers[0].targetType", "1");
    formData.append("targetDelivers[0].targetId[0]", employeeId.toString());
    // Noi dung timline line
    formData.append("textComment", content);
    // Timeline 
    formData.append("sharedContent", dataShare?.comment?.content);

    // TODO: file send
    // !file || formData.append("attachedFiles", JSON.stringify(fileChoosen));
    onClose()
    const res = await createShareTimeline(formData, {});
    console.log("onShareTimeline", res);
    if (res.status===200) {
    //   switch (res.status) {
    //     case 200: {
          
    //       break;
    //     }
    //     default:
          
    //       break;
    //   }
    // }
  }
}

  // TODO: check handle send nameCreateTimeline --> employee #data api 
  const handleAddressSuggest = (item: any) => {
    const arr = [...nameAddress];
    arr.push(item)
    setNameAddress(Array.from(new Set(arr)));
    setIsShowDiaLog({is: false, status: ''});
  }

  // TODO: after call api get group name ->> call back api AddressSuggest
  const handleChooseGroupName = () => {
    setIsShowDiaLog({is: false, status: ''});
  }

  const handleRemoveAddressSuggest = (item: any) => {
    const arr = [...nameAddress];
    setNameAddress(arr.filter((i: any) => i.employeeId != item.employeeId));
  } 

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
      <View style={TimelineListStyle.optionShare}>
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

  // const onShowModal = () => {
  //   Animated.timing(fadeAnim, {
  //     toValue: HEIGHT_CONTENT,
  //     duration: 1000,
  //   }).start(() => setShowModal(!showModal));
  // };

  // const onHideModal = () => {
  //   setShowModal(!showModal);
  //   Animated.timing(fadeAnim, {
  //     toValue: 43,
  //     duration: 1000,
  //   }).start();
  // };

  const itemAddressName = (item: any) => {
    return(
      <View
        style={TimelineListStyle.tagName}
      >
      <Text style={TimelineListStyle.txtNameReply}>
        {item.employeeName}
      </Text>
      <TouchableOpacity
      onPress={() => handleRemoveAddressSuggest(item)}
      >
          <Icon style={TimelineListStyle.iconClose} resizeMode="contain" name={"close"} />
      </TouchableOpacity>
      </View>
     )
  }
  // const convertStyle = (format: EnumFormatText) => {
  //   switch (format) {
  //     case EnumFormatText.bold:
  //       setStyleFormat(TimelineListStyle.txtBold);
  //       break;
  //     case EnumFormatText.italic:
  //       setStyleFormat(TimelineListStyle.txtItalic);
  //       break;
  //     case EnumFormatText.underLine:
  //       setStyleFormat(TimelineListStyle.txtUnderLine);
  //       break;
  //     case EnumFormatText.strikeThrough:
  //       setStyleFormat(TimelineListStyle.txtStrikeThrough);
  //       break;
  //     default:
  //       setStyleFormat(TimelineListStyle.txtNormal);
  //       break;
  //   }
  // };

  function renderContentShare() {
    return (
      <View style={TimelineItem.containerShare}>
        <View style={TimelineItem.containerShareLeft}>
          <Image
            style={TimelineItem.shareLeftIcon}
            source={require("../../../../assets/icons/share.png")}
            resizeMode="contain"
          />
          <View style={TimelineItem.shareLine} />
        </View>


        <View style={TimelineItem.containerShareRight}>
          <View style={TimelineItem.shareInfo}>
            <Image
              style={TimelineItem.shareInfoAvt}
              source={{
                uri:  dataShare?.imagePath || "https://reactnative.dev/img/tiny_logo.png",
              }}
              resizeMethod="resize"
            />
            <Text 
            numberOfLines={1}
            style={TimelineItem.shareInfoName}>
                {dataShare?.createdUserName}
            </Text>
          </View>

          <Text 
          numberOfLines={3}
          style={TimelineItem.shareContent}>
            {dataShare?.comment?.content}
          </Text>
        </View>


      </View>
    );
  }

  const renderHeaderView = () => {
    return (
      <View style={TimelineListStyle.tab}>
        <View style={{flexDirection: 'row', width: '100%'}}>
            {nameAddress.map((i: any) => 
             itemAddressName(i)
            )}
        </View>
      </View>
    );
  };

  const itemResultDiaLog = (i: any) => {
    return(
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => handleChooseGroupName()}
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

  // const renderQuote = () => {
  //  if(quote){
  //   return(
  //     <View style={{backgroundColor: "#fff", width: '100%', alignItems: 'center', justifyContent: 'center', paddingBottom: 10}}>
  //       <View style={{ width: '95%', minHeight: 50,
  //       backgroundColor: '#fff', flexDirection: 'row', borderWidth: 1, padding: 5, borderRadius: 15,  borderColor: '#E5E5E5',
  //       }}>
        
  //         <View style={{ flex: 0.5, alignItems: 'center'}}>
  //         <Icon name="quote" style={{ width: 10, height: 10 }} />
  //             <View style={{ 
  //               width: 4,
  //               backgroundColor: "#999999",
  //               flex: 1,
  //               marginTop: 5,
  //               }}/>

  //         </View>
  //         <View style={{ flex: 7, justifyContent: 'center', marginTop: 12}}>
  //         <Text numberOfLines={3}>{quote}</Text>
  //         </View>
  //     </View>
  //   </View>
  //   )
  //  }
  // }

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

   /**
   * function create timeline
   */
  async function onCreateTimeline() {
    setContent("");
    const params = {
      createPosition: 1,
      targetDelivers: [],
      targetType: 1,
      targetId: [1],
      textComment: content,
      attachedFiles: [],
    };
    Keyboard.dismiss();
    const formData = new FormData();
    formData.append("createPosition", params.createPosition.toString());
    // formData.append("targetType", params.targetType.toString());
    // formData.append("targetId", params.targetId.toString());
    formData.append("textComment", `${content}`);
    formData.append("targetDelivers[0].targetType", "1");
    formData.append("targetDelivers[0].targetId[0]", employeeId.toString());
    // formData.append("attachedFiles", fileChoosen);
    // TODO: timeline
    // {
    //   !fileChoosen || formData.append("attachedFiles", JSON.stringify(fileChoosen));
    // }

    // console.log('ssssssssssssssss', fileChoosen)

    // formData.append("attachedFiles[0].file", "c");
    // formData.append("attachedFiles[0].fileName", "24_05_2020_01_01_08_96.jpg");
    const response = await createTimeline(formData, {});
    console.log("response--> createTimeline", response);
    if (response) {
      switch (response.status) {
        case 200: {
          break;
        }
        default:
          break;
      }
    }
    onClose()
  }


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

  Keyboard.addListener('keyboardDidShow', () => setIsShowKeyBoart(true))
  Keyboard.addListener('keyboardDidHide', () => setIsShowKeyBoart(false))

  return (
    isShowDiaLog.is ? 
      renderDialogSuggestion()
    :
    <View
      // behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={1}
      style={{ 
        position: "absolute",
        width: "100%",
        height: '100%',
        backgroundColor: "#fff",
      }}
    >

      <View style={TimelineListStyle.headerShare}>
        <View style={{ flex: 1, width: '100%', position: 'absolute', alignItems: 'center' }}>
          <Text style={{color: '#333', fontSize: 18}}>共有</Text>
        </View>
        <TouchableOpacity
          onPress={() => onClose()}
          style={{ flex: 1 }}
        >
          <Icon
              style={{ width: 18, height: 18, marginLeft: '3%' }}
              resizeMode="contain"
              name={"close"}
            />
        </TouchableOpacity>
      </View>

      {setContent && renderHeaderView()}

      <View style={{ width: '100%', height: '85%' }}>
            <TextInput
              multiline
              placeholder={translate(messages.placeholderCreateTimeline)}
              value={content || ""}
              onChangeText={(txt) => setContent(txt)}
              style={{ minHeight: 40 }}
            // inputStyle={[TimelineListStyle.inputContent, styleFormat]}
            />

            {/* {renderQuote()} */}
            
            {isShowKeyBoart && <KeyboardAwareScrollView style={{ width: '100%', height: '100%'}}/>}

            {!file.name || <>
            <View style={TimelineListStyle.file}>
              <Image
                resizeMode="contain"
                style={TimelineListStyle.fileIcon}
                source={require("../../../../assets/icons/pdf.png")}
              />
              <Text style={TimelineListStyle.fileTxt}>{file.name}</Text>
            </View>
            </>}

            <View style={{ width: '100%', alignItems: 'center', position: 'absolute', bottom: 50 }}>
            {dataShare?.timelineId == null || renderContentShare()}
            </View>
            
            {isShowFormatText ? (
              renderFormatTextView()
            ) : (
                <View style={TimelineListStyle.optionShare}>
                  <View style={TimelineListStyle.inputCreate}>
                    {renderIcon("groupIcon",  () => setIsShowDiaLog({is: true, status: "group"}))}
                    {renderIcon("tagIcon", () => setIsShowDiaLog({is: true, status: "address"}))}
                    {renderIcon("attach", () => handleChooseFile())}
                    {renderIcon("textIcon", () =>
                      setShowFormatText(!isShowFormatText)
                    )}
                  </View>
                  <ButtonColorHighlight
                    onPress={() => dataShare.timelineId == null ? onCreateTimeline()
                     : onShareTimeline()}
                    title={translate(messages.buttonCreateTimeline)}
                    type={EnumButtonType.complete}
                    status={
                      content ? EnumButtonStatus.normal : EnumButtonStatus.disable
                    }
                  />
                </View>
              )}
          </View>
    </View>
  );
}
