import React from 'react';
import { AppBar } from './connection-appbar';
import { authorizationActions } from '../authorization/authorization-reducer';
import { Button } from '../../../shared/components/button';
import { connectionActions } from './connection-reducer';
import { ConnectionMessages } from './connection-messages';
import { ConnectionPickStyles } from './connection-style';
import { connectionsSelector } from './connection-selector';
import { Text, TouchableOpacity, View, Linking, Platform, ScrollView, SafeAreaView } from 'react-native';
import { translate } from '../../../config/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, StackActions } from '@react-navigation/native';
import { verifyBeforeLogin } from '../authorization/authorization-repository';

/**
 * Select one companyName and tenant to login
 */
export function PickConnectionScreen() {
  const navigation = useNavigation();
  const connectionState = useSelector(connectionsSelector);
  const dispatch = useDispatch();

  /**
   *  select one companyName and tenant
   * @param position
   */
  const handleSelectConnection = (position: number) => {
    const tenant = connectionState.connections[position].tenantId;
    dispatch(connectionActions.setSelectedConnectionIndex({ position }));
    dispatch(
      authorizationActions.setTenant(tenant)
    );
    handleVerify(tenant)
  };

  /**
   * handle verify
   */
  const handleVerify = async (tenant: string) => {
    // TODO: check backend esms
    const verifyResult = await verifyBeforeLogin({ site: "", tenantId: tenant, userAgent: Platform.OS })
    if (verifyResult && verifyResult.status === 200) {
      const verifyData = verifyResult.data
      // check ip address
      if (verifyData.isAccept === false) {
        navigation.navigate("forbidden", { errorType: "403" })
        return
      }
      // TODO: control in next phase
      if (verifyData.isMissingLicense) {
        return;
      }
      if (verifyData.authenticated) {
        dispatch(StackActions.replace("menu"));
        return;
      }
      if (verifyData.signInUrl) {
        Linking.openURL(verifyData.signInUrl)
        return
      }
      navigation.navigate("login");
    }
  }

  return (
    <SafeAreaView style={ConnectionPickStyles.container}>
      <AppBar
        title={translate(ConnectionMessages.selectConnection)}
        buttonText={translate(ConnectionMessages.add)}
        buttonType="incomplete"
        onPress={() => navigation.navigate("add-connection")}
      />
      <ScrollView>
        {connectionState.connections.map((item, index) => {
          return (
            <TouchableOpacity
              key={index.toString()}
              onPress={() => handleSelectConnection(index)}
              style={ConnectionPickStyles.containerButton}
            >
              <View style={ConnectionPickStyles.wrapContent}>
                <Text style={ConnectionPickStyles.companeyNameStyle}>
                  {item.companyName}
                </Text>
                <Text style={ConnectionPickStyles.tenantStyle}>{item.tenantId}</Text>
              </View>
              <View style={ConnectionPickStyles.buttonWrapper}>
                <Button
                  onPress={() => {
                    navigation.navigate("edit-connection", {
                      title: item.companyName,
                      value: item.tenantId,
                      position: index,
                      isDisable: item.isDisable,
                    });
                  }}
                  variant="incomplete"
                  block
                  style={ConnectionPickStyles.buttonStyle}
                >
                  {translate(ConnectionMessages.edit)}
                </Button>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
