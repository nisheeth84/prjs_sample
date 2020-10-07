import React, { useState } from "react";
import { Text, View } from "react-native";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SvgCssUri } from "react-native-svg";
import { Icon } from "../../shared/components/icon";
import { translate } from "../../config/i18n";
import { messages } from "./menu-messages";
import { Service } from "./menu-type";
import { MenuFeatureOtherStyles, MenuFeatureStyles } from "./menu-style";
import { authorizationSelector } from "../login/authorization/authorization-selector";
import { apiUrl } from "../../config/constants/api";

interface FeatureOtherProps {
  edit: boolean;
  disable: boolean;
  onSelect: (data: Service) => void;
  featuresOther: Array<Service>;
}

export const MenuFeatureOther: React.FC<FeatureOtherProps> = ({
  edit,
  disable,
  onSelect,
  featuresOther,
}) => {
  const [show, setShow] = useState(false);
  const employees = useSelector(authorizationSelector);

  return (
    <View>
      <View style={MenuFeatureOtherStyles.wrapHeader}>
        <Text style={MenuFeatureOtherStyles.txtFeatureOther}>
          {translate(messages.featureOther)}
        </Text>
        <TouchableOpacity
          onPress={() => setShow(!show)}
          hitSlop={MenuFeatureOtherStyles.scopeSelect}
        >
          <Icon
            name={show ? "arrowUp" : "arrowDown"}
            style={MenuFeatureOtherStyles.iconArrowStyle}
          />
        </TouchableOpacity>
      </View>

      {show && (
        <View style={MenuFeatureOtherStyles.wrapMenuItem}>
          {disable && edit && (
            <View style={MenuFeatureOtherStyles.wrapMenuItemDisable} />
          )}

          {featuresOther.map((item: Service) => {
            return (
              <TouchableOpacity
                onPress={() => onSelect(item)}
                style={MenuFeatureOtherStyles.itemMenu}
                key={item.serviceId}
              >
                {!disable && edit && (
                  <Icon name="add" style={MenuFeatureOtherStyles.iconStyle} />
                )}
                {item.iconPath ? (
                  <View style={MenuFeatureOtherStyles.iconDescriptionStyle}>
                    <SvgCssUri
                      uri={`${apiUrl}${item.iconPath}`}
                      width="100%"
                      height="100%"
                    />
                  </View>
                ) : (
                  <View style={MenuFeatureStyles.iconStyle} />
                )}
                <Text style={MenuFeatureOtherStyles.titleStyle}>
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
