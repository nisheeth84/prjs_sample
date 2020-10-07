import React from "react";
import { useSelector } from "react-redux";
import { ServiceFavoriteSelector, ServiceInfoSelector } from "../../../menu/menu-feature-selector";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";
import { CommonFilterMessage } from "../../../../shared/components/message/message";
import { format } from "react-string-format";
import { translate } from "../../../../config/i18n";
import { responseMessages } from "../../../../shared/messages/response-messages";
import { errorCode } from "../../../../shared/components/message/message-constants";
import StringUtils from "../../../../shared/util/string-utils";
import { View } from "react-native";

export function CustomerListEmpty () {
  const serviceFavorite = useSelector(ServiceFavoriteSelector);
  const serviceOther = useSelector(ServiceInfoSelector);
  const customers = useSelector(authorizationSelector);

  function customerListEmpty() {
    let service = serviceFavorite.find(item => item.serviceId === 5);
    !service && (service = serviceOther.find(item => item.serviceId === 5));
    return service && <CommonFilterMessage
      iconName={service.iconPath}
      content={format(translate(responseMessages[errorCode.infoCom0020]), StringUtils.getFieldLabel(service, "serviceName", customers.languageCode))}></CommonFilterMessage>
  }
  return (
    <View>
      {customerListEmpty()}
    </View>
  );
}