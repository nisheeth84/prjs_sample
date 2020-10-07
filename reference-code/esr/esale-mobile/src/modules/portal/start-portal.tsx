import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AppbarCommon } from "../../shared/components/appbar/appbar-common";
import { useSelector, useDispatch } from "react-redux";
import { CheckBox } from "../../shared/components/checkbox";
import { stylesStart as styles, styles as style1 } from "./portal-style";
import { messages } from "./portal-messages";
import { translate } from "../../config/i18n";
import { ButtonColorHighlight } from "../../shared/components/button/button-color-highlight";
import { EnumButtonType, EnumButtonStatus } from "../../config/constants/enum";
import { updateDisplayFirstScreen } from '../menu/menu-feature-repository';
import { authorizationSelector } from '../login/authorization/authorization-selector'
import { EmployeeSelector } from '../menu/menu-personal-settings/menu-settings-selector'
interface Navigation {
  [navigation: string]: any;
}

export const StartPortal = () => {
  const [isCheck, setIsCheck] = React.useState(false);
  const dispatch = useDispatch();
  const navigation: Navigation = useNavigation();
  const authorization = useSelector(authorizationSelector);
  const employee = useSelector(EmployeeSelector);

  const onStart = () => {
    updateDisplayFirstScreen({
      employeeId: authorization.employeeId.toString(),
      isDisplayFirstScreen: !isCheck,
      updatedDate: employee.updatedDate
    })
    navigation.navigate("modal-portal");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <AppbarCommon
        title={translate(messages.modalTitle)}
        styleTitle={styles.appBar}
        containerStyle={style1.appbarCommonStyle}
        leftIcon="backArrow"
      />

      <View style={styles.container}>
        <Text style={styles.title}>{translate(messages.portalStartTitle)}</Text>
        <Text style={styles.content}>
          {translate(messages.portalStartContent)}
        </Text>
        <ButtonColorHighlight
          title={translate(messages.portalStartBtn)}
          status={EnumButtonStatus.normal}
          type={EnumButtonType.large}
          onPress={onStart}
          containerStyle={styles.btn}
        />
        <CheckBox
          onChange={() => {
            return setIsCheck(!isCheck);
          }}
          checked={isCheck}
          styleContainer={styles.checkBox}
          styleIndicator={styles.box}
        >
          {translate(messages.portalStartCheckbox)}
        </CheckBox>
      </View>
    </SafeAreaView>
  );
};
