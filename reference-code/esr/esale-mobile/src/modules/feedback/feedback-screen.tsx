import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  // Alert as ShowError,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { translate } from '../../config/i18n';
import { FeedbackStyles } from './feedback-style';
import { messages } from './feedback-messages';
import { Icon } from '../../shared/components/icon';
import { Header } from '../../shared/components/header';
import {
  CreateFeedbackResponse,
  FeedbackStatusResponse,
  GetCompanyNameResponse,
  GetStatusOpenFeedbackResponse,
  createFeedback,
  createFeedbackStatus,
  getCompanyName,
  getStatusOpenFeedback,
} from './feedback-repository';
import { theme } from '../../config/constants';
import {
  BUTTON,
  EnumButtonStatus,
  EnumButtonType,
  FeedbackDisplayType,
  FeedbackTerminalType,
  STATUSBUTTON,
  TypeButton,
} from '../../config/constants/enum';
import { ButtonColorHighlight } from '../../shared/components/button/button-color-highlight';
import { CommonButton } from '../../shared/components/button-input/button';
import { authorizationSelector } from '../login/authorization/authorization-selector';
// import { FeedbackRouteProp } from "../../config/constants/root-stack-param-list";
import { AuthorizationState } from '../login/authorization/authorization-reducer';
import { TEXT_EMPTY } from '../../config/constants/constants';
import { ScreenName } from '../../config/constants/screen-name';

const NOT_YET_PROCESSED = 'not yet processed';

interface FeedbackScreenParams {
  onClose: (custom?: () => void) => void
}
/**
 * Component show feedback screen
 */
export function FeedbackScreen({
  onClose
}: FeedbackScreenParams) {
  const [buttonActive, setButtonActive] = useState(BUTTON.NONE);
  const [feedbackContent, setFeedbackContent] = useState(TEXT_EMPTY);
  const navigation = useNavigation();
  const authSelector: AuthorizationState = useSelector(authorizationSelector);
  // const route = useRoute<FeedbackRouteProp>();
  const route = useRoute<any>();

  /**
   * handle response create feedback
   */
  const handleResponseCreateFeedback = (response: CreateFeedbackResponse) => {
    switch (response.status) {
      case 400: {
        // ShowError.alert('Notify', 'Bad request!');
        break;
      }
      case 500: {
        // ShowError.alert('Notify', 'Server error!');
        break;
      }
      case 403: {
        // ShowError.alert('Notify', 'You have not permission create Feedback');
        break;
      }
      case 200: {
        setFeedbackContent(TEXT_EMPTY);
        setButtonActive(BUTTON.NONE);
        navigation.navigate(ScreenName.FEEDBACK_COMPLETION_SCREEN, {
          onClose: onClose
        });
        break;
      }
      default: {
        // ShowError.alert('Notify', 'Error!');
      }
    }
  };

  /**
   * call api to create feedback
   */
  const callApiCreateFeedback = async (companyName: string) => {
    const params = {
      createFeedBack: {
        tenantName: authSelector?.tenantId,
        companyName,
        feedbackType: `${buttonActive}`,
        feedbackContent,
        displayType: `${
          route?.params?.autoOpen
            ? FeedbackDisplayType.AUTO_OPEN
            : FeedbackDisplayType.PERSON_OPEN
          }`,
        terminalType: `${FeedbackTerminalType.MOBILE}`,
        content: NOT_YET_PROCESSED,
      },
    };
    const response = await createFeedback(params, {});
    if (response) {
      handleResponseCreateFeedback(response);
    }
  };

  /**
   * handle response get company name
   */
  const handleResponseGetCompanyName = (response: GetCompanyNameResponse) => {
    switch (response.status) {
      case 400: {
        // ShowError.alert('Notify', 'Bad request!');
        break;
      }
      case 500: {
        // ShowError.alert('Notify', 'Server error!');
        break;
      }
      case 403: {
        // ShowError.alert('Notify', 'You have not permission get company name!');
        break;
      }
      case 200: {
        callApiCreateFeedback(response.data.companyName);
        break;
      }
      default: {
        // ShowError.alert('Notify', 'Error!');
      }
    }
  };

  /**
   * call api to get company's name
   */
  const callApiGetCompanyName = async () => {
    const params = {
      tenantName: authSelector?.tenantId || TEXT_EMPTY,
    };
    const response = await getCompanyName(params, {});
    if (response) {
      handleResponseGetCompanyName(response);
    }
  };

  /**
   * handle response get feedback status
   */
  const handleResponseCreateFeedbackStatus = (
    response: FeedbackStatusResponse
  ) => {
    switch (response.status) {
      case 400: {
        // ShowError.alert('Notify', 'Bad request!');
        break;
      }
      case 500: {
        // ShowError.alert('Notify', 'Server error!');
        break;
      }
      case 200:
        break;
      case 403: {
        // ShowError.alert(
        //   'Notify',
        //   'You have not permission create feedback status'
        // );
        break;
      }
      default: {
        // ShowError.alert('Notify', 'Error!');
      }
    }
  };

  /**
   * call api create feedback status
   */
  const callApiCreateFeedbackStatusFunction = async () => {
    const response = await createFeedbackStatus({}, {});
    if (response) {
      handleResponseCreateFeedbackStatus(response);
    }
  };

  /**
   * handle response get status open feedback
   */
  const handleResponseGetStatusOpenFeedback = (
    response: GetStatusOpenFeedbackResponse
  ) => {
    switch (response.status) {
      case 400: {
        // ShowError.alert('Notify', 'Bad request!');
        break;
      }
      case 500: {
        // ShowError.alert('Notify', 'Server error!');
        break;
      }
      case 200: {
        if (response.data?.employeeId) {
          callApiCreateFeedbackStatusFunction();
        }
        break;
      }
      case 403: {
        // ShowError.alert(
        //   'Notify',
        //   'You have not permission get feedback status open'
        // );
        break;
      }
      default: {
        // ShowError.alert('Notify', 'Error!');
      }
    }
  };

  /**
   * call api create feedback status
   */
  const callApiGetStatusOpenFeedback = async () => {
    const response = await getStatusOpenFeedback({}, {});
    if (response) {
      handleResponseGetStatusOpenFeedback(response);
    }
  };

  useEffect(() => {
    setButtonActive(BUTTON.NONE);
    setFeedbackContent(TEXT_EMPTY);
    callApiGetStatusOpenFeedback();
  }, []);

  return (
    <SafeAreaView style={FeedbackStyles.container}>
      <Header
        title={`${translate(messages.title)}`}
        onLeftPress={onClose}
        titleSize={theme.fontSizes[4]}
      />
      <ScrollView>
        <View style={FeedbackStyles.body}>
          <Icon name="responsePencil" style={FeedbackStyles.iconRespPen} />
          <Text style={FeedbackStyles.textQues}>
            {`${translate(messages.question)}`}
          </Text>
          <Text style={FeedbackStyles.textContent}>
            {`${translate(messages.content)}`}
            <Text
              style={[FeedbackStyles.textLike, FeedbackStyles.textActive]}
              onPress={() => alert('Pressed!')}
            >
              {translate(messages.here)}
            </Text>
            {translate(messages.please)}
          </Text>
          <View style={FeedbackStyles.viewBtn}>
            <CommonButton
              onPress={() => setButtonActive(BUTTON.HAPPY)}
              status={STATUSBUTTON.ENABLE}
              icon="favourite"
              textButton={`${translate(messages.favorite)}`}
              typeButton={TypeButton.BUTTON_FAVOURITE}
              highlightOnPress={buttonActive === BUTTON.HAPPY}
            />
            <View style={FeedbackStyles.line} />
            <CommonButton
              onPress={() => setButtonActive(BUTTON.ANGRY)}
              status={STATUSBUTTON.ENABLE}
              icon="favourite_false"
              textButton={`${translate(messages.dislike)}`}
              typeButton={TypeButton.BUTTON_FAVOURITE}
              highlightOnPress={buttonActive === BUTTON.ANGRY}
            />
          </View>
          <View style={FeedbackStyles.containerBtn}>
            <Text style={FeedbackStyles.textContent}>
              {`${translate(messages.feedback)}`}
            </Text>
            {buttonActive === BUTTON.ANGRY ? (
              <View style={FeedbackStyles.viewRequired}>
                <Text style={FeedbackStyles.textRequired}>
                  {`${translate(messages.required)}`}
                </Text>
              </View>
            ) : null}
          </View>
          <TextInput
            style={FeedbackStyles.textInput}
            multiline
            onChangeText={(text) => setFeedbackContent(text)}
            placeholder={`${translate(messages.placeholder)}`}
            placeholderTextColor={theme.colors.gray}
          />
          <View style={FeedbackStyles.buttonSend}>
            <ButtonColorHighlight
              isShadow={false}
              status={
                buttonActive === BUTTON.HAPPY ||
                  (buttonActive === BUTTON.ANGRY && feedbackContent)
                  ? EnumButtonStatus.normal
                  : EnumButtonStatus.disable
              }
              onPress={() => {
                callApiGetCompanyName();
              }}
              title={`${translate(messages.send)}`}
              type={EnumButtonType.miniModal}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
