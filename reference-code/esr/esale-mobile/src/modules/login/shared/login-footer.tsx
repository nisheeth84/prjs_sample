import React, { } from 'react';
import { Text, TouchableOpacity, View, Linking } from 'react-native';
import { translate } from '../../../config/i18n';
import { apiUrl } from '../../../config/constants/api';
import { format } from 'react-string-format';
import { connectionsSelector } from '../connection/connection-selector';
import { useSelector } from 'react-redux';
import { authorizationMessages } from '../authorization/authorization-messages';

export function LoginFooter() {
  const connectionState = useSelector(connectionsSelector);
  const selectedConnections = connectionState.selectedConnectionIndex == -1 ? undefined : connectionState.connections[connectionState.selectedConnectionIndex]

  /**
    * fucntion navigate contract site
    */
  const handleOpenContractSite = () => {
    let url = ""
    if (selectedConnections?.tenantId && selectedConnections?.tenantId.length > 0) {
      url = format("{0}{1}/account/login?site=contract", apiUrl, selectedConnections?.tenantId)
    } else {
      url = format("{0}account/input/tenant", apiUrl)
    }
    Linking.openURL(url)
  }

  return (<View style={{ marginVertical: 15 }}>
    <TouchableOpacity onPress={() => handleOpenContractSite()}>
      <Text style={{ textAlign: 'center', color: "#0F6DB5" }}>{translate(authorizationMessages.login_contract_site)}</Text>
    </TouchableOpacity>
    <Text style={{ textAlign: 'center' }}>©SOFTBRAIN Co.,Ltd.</Text>
  </View>)
}