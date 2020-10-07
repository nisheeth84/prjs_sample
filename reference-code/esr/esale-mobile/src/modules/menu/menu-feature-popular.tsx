import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgCssUri } from "react-native-svg";
import { messages } from "./menu-messages";
import { Icon } from "../../shared/components/icon";
import { translate } from "../../config/i18n";
import { Service } from "./menu-type";
import { MenuFeaturePopularStyles, MenuFeatureStyles } from "./menu-style";
import { ButtonColorHighlight } from "../../shared/components/button/button-color-highlight";
import { EnumButtonStatus, EnumButtonType } from "../../config/constants/enum";
import { authorizationSelector } from "../login/authorization/authorization-selector";
import { apiUrl } from "../../config/constants/api";

interface FeaturePopularProps {
  onChangeMenu: (edit: boolean) => void;
  onSelectFeature: (data: Service) => void;
  featuresPopular: Array<Service>;
}

export const MenuFeaturePopular: React.FC<FeaturePopularProps> = ({
  onChangeMenu,
  onSelectFeature,
  featuresPopular,
}) => {
  const [edit, changeStatusButton] = useState(false);
  const employees = useSelector(authorizationSelector);
  const onHandleChangeMenu = () => {
    changeStatusButton(!edit);
    onChangeMenu(!edit);
  };

  return (
    <View>
      <View style={MenuFeaturePopularStyles.wrapHeader}>
        <View style={MenuFeaturePopularStyles.wrapTitle}>
          <Text>{translate(messages.featurePopular)}</Text>
        </View>
        <Text style={MenuFeaturePopularStyles.limitTitleText}>
          {edit ? translate(messages.limitRegister) : ""}
        </Text>
        <ButtonColorHighlight
          onPress={onHandleChangeMenu}
          type={EnumButtonType.complete}
          title={edit ? translate(messages.finished) : translate(messages.edit)}
          status={!edit ? EnumButtonStatus.inactive : EnumButtonStatus.normal}
        />
      </View>
      {featuresPopular.length > 0 && (
        <View style={MenuFeaturePopularStyles.wrapMenuItem}>
          {featuresPopular.map((item: Service) => {
            return (
              <TouchableOpacity
                onPress={() => onSelectFeature(item)}
                style={MenuFeaturePopularStyles.itemMenu}
                key={item.serviceId}
              >
                {edit && (
                  <Icon
                    name="remove"
                    style={MenuFeaturePopularStyles.iconStyle}
                  />
                )}
                {item.iconPath ? (
                  <View style={MenuFeaturePopularStyles.iconDescriptionStyle}>
                    <SvgCssUri
                      uri={`${apiUrl}${item.iconPath}`}
                      width="100%"
                      height="100%"
                    />
                  </View>
                ) : (
                  <View style={MenuFeatureStyles.iconStyle} />
                )}

                <Text style={MenuFeaturePopularStyles.titleFeatureStyle}>
                  {
                    JSON.parse(item.serviceName)[
                      employees.languageCode || "ja_jp"
                    ]
                  }
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};
