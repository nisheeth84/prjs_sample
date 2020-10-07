import EditStyles from './connection-style';
import Input from './input';
import React, { useEffect, useState } from 'react';
import Toast from 'react-native-tiny-toast';
import { AppBar } from './connection-appbar';
import { authorizationActions } from '../authorization/authorization-reducer';
import { authorizationSelector } from '../authorization/authorization-selector';
import { Button } from '../../../shared/components/button';
import { connectionActions } from './connection-reducer';
import { ConnectionMessages } from './connection-messages';
import { format } from 'react-string-format';
import { getCompanyName } from './connection-reponsitory';
import { responseMessages } from '../../../shared/messages/response-messages';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { translate } from '../../../config/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View } from 'react-native';

/**
 * Define milestone router
 */
interface Route {
  [route: string]: any;
}
/**
 * screen edit tenant and companyName
 */
export function EditConnectionScreen() {
  // initialization route use hooks
  const route: Route = useRoute();
  // initialization navigate use hooks
  const { navigate } = useNavigation();
  // Declare dispatch action use hooks
  const dispatch = useDispatch();
  // initialization state companyName, tenant and assign values from the route
  const [value, setValue] = useState({
    companyName: route?.params?.title,
    tenant: route?.params?.value,
    isDisable: route?.params?.isDisable,
  });
  // initialization state buttonDisable and assign value defautl true button disable
  const [buttonDisabled, setbuttonDisabled] = useState(true);
  const authState = useSelector(authorizationSelector);

  /**
   * check companyName and tenant whe open screen edit
   */
  useEffect(() => {
    if (value.tenant || value.companyName) {
      setbuttonDisabled(false);
    } else {
      setbuttonDisabled(true);
    }
  }, []);

  /**
   * save companyName and tenant to local
   */
  const handleEditConnection = () => {
    if (
      route?.params?.title !== value.companyName ||
      route?.params?.value !== value.tenant
    ) {
      const connection = {
        companyName: value.companyName,
        tenantId: value.tenant,
      };
      dispatch(
        connectionActions.update({
          connection,
          position: route?.params?.position,
        })
      );
    }
    navigate("pick-connection");
  };

  /**
   * delete connection
   */
  const handleDeleteConnection = () => {
    if (route?.params?.value === authState.tenantId) {
      dispatch(authorizationActions.deleteTenantSelect(""));
    }
    dispatch(
      connectionActions.delete({
        position: route?.params?.position,
      })
    );
    navigate("pick-connection");
  };

  /**
   * change company name
   * @param text
   */
  const onChangeCompanyname = (text: any) => {
    setValue({ ...value, companyName: text });
    if (text.trim() === "") {
      setbuttonDisabled(true);
    } else {
      setbuttonDisabled(false);
    }
  };

  /**
   * change tenant ID
   * @param text
   */
  const onChangeTenant = (text: any) => {
    setValue({ ...value, tenant: text, isDisable: true });
    setbuttonDisabled(true);
  };

  /**
   * call api get companyName and set value companyName
   * @param event
   */
  const handleChangeTenant = async (event: any) => {
    let value = event?.nativeEvent?.text;
    if (value !== TEXT_EMPTY) {
      const resultCompanyName = await getCompanyName(
        { tenantName: value }
      );
      handleCompanyNameResponse(resultCompanyName, value);
      console.log(resultCompanyName)
    }
  };
  /**
   * Resolve response get company name
   * @param resultCompanyName 
   */
  const handleCompanyNameResponse = (resultCompanyName: any, value: string) => {
    if (resultCompanyName) {
      if (resultCompanyName.status === 200) {
        setValue({
          tenant: value,
          companyName: resultCompanyName.data?.companyName,
          isDisable: false,
        });
        setbuttonDisabled(false);
      } else {
        setbuttonDisabled(true);
        const errorMessage = format(translate(responseMessages.ERR_COM_0035), value)
        let toast = Toast.show(errorMessage, {
          position: Toast.position.TOP,
          containerStyle: { backgroundColor: '#666666' },
          textStyle: { color: 'white' },
          imgStyle: {},
          mask: true,
          maskStyle: {},
        })
        setTimeout(function () {
          Toast.hide(toast);
        }, 3000);
      }
    } else {
      setbuttonDisabled(true);
      //TODO show message as rule
      alert('no response');
    }
  }
  return (
    <View style={EditStyles.container}>
      <AppBar
        title={translate(ConnectionMessages.editConnection)}
        buttonText={translate(ConnectionMessages.done)}
        onPress={handleEditConnection}
        buttonDisabled={buttonDisabled}
      />
      <Input
        inputStyle={EditStyles.input}
        label={translate(ConnectionMessages.labelCompanyName)}
        placeholder={translate(ConnectionMessages.placeholderCompanyName)}
        value={value.companyName}
        onChangeText={(text) => onChangeCompanyname(text)}
      />
      <Input
        inputStyle={EditStyles.input}
        label={translate(ConnectionMessages.labelTenant)}
        placeholder={translate(ConnectionMessages.placeholderTenant)}
        value={value.tenant}
        onChangeText={(text) => onChangeTenant(text)}
        onEndEditing={handleChangeTenant}
      />
      <View style={EditStyles.wrapButton}>
        <Button onPress={handleDeleteConnection} variant="incomplete" block>
          {translate(ConnectionMessages.deleteConnection)}
        </Button>
      </View>
    </View>
  );
}
