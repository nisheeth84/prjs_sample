import AddStyles from './connection-style';
import Input from './input';
import React, { useState } from 'react';
import Toast from 'react-native-tiny-toast';
import { AppBar } from './connection-appbar';
import { connectionActions } from './connection-reducer';
import { ConnectionMessages } from './connection-messages';
import { format } from 'react-string-format';
import { getCompanyName } from './connection-reponsitory';
import { responseMessages } from '../../../shared/messages/response-messages';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { translate } from '../../../config/i18n';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native';

/**
 * add companyName and tenant
 */
export function AddConnectionScreen() {
  // initialization navigate
  const { navigate } = useNavigation();
  // Declare dispatch action hooks
  const dispatch = useDispatch();
  // initialization state companyName and tenant
  const [value, setValue] = useState({
    companyName: TEXT_EMPTY,
    tenant: TEXT_EMPTY,
    isDisable: true,
  });
  // initialization state buttonDisable and assign value defautl true button add disbale
  const [buttonDisabled, setbuttonDisabled] = useState(true);

  /**
   * save companyName and tenant to local
   */
  const handleAddConnection = () => {
    const connection = {
      companyName: value.companyName,
      tenantId: value.tenant,
      isDisable: value.isDisable,
    };

    dispatch(connectionActions.add({ connection }));
    navigate("pick-connection");
  };

  /**
   * change company name
   * @param text
   */
  const onChangeCompanyname = (text: any) => {
    setValue({ ...value, companyName: text });
    if ((!text && !value.tenant) || text === "") {
      setbuttonDisabled(true);
    }
    if (text.trim() && value.tenant && value.isDisable === false) {
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
        //TODO: show message as rule
        alert('no response');
      }
    }
  };

  return (
    <SafeAreaView style={AddStyles.container}>
      <AppBar
        title={translate(ConnectionMessages.addConnection)}
        buttonText={translate(ConnectionMessages.addNew)}
        onPress={handleAddConnection}
        buttonDisabled={buttonDisabled}
      />
      <Input
        inputStyle={AddStyles.input}
        label={translate(ConnectionMessages.labelCompanyName)}
        placeholder={translate(ConnectionMessages.placeholderCompanyName)}
        value={value.companyName}
        onChangeText={(text) => onChangeCompanyname(text)}
      />
      <Input
        inputStyle={AddStyles.input}
        label={translate(ConnectionMessages.labelTenant)}
        placeholder={translate(ConnectionMessages.placeholderTenant)}
        value={value.tenant}
        onChangeText={(text) => onChangeTenant(text)}
        onEndEditing={handleChangeTenant}
      />
    </SafeAreaView>
  );
}
