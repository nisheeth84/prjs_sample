import React from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {
  FieldAddEditPulldownSingleStyles,
} from '../../../shared/components/dynamic-form/control-field/add-edit/field-add-edit-styles';
import StringUtils from '../../../shared/util/string-utils';
import { useSelector } from 'react-redux';
import { authorizationSelector } from '../../login/authorization/authorization-selector';
import { translate } from '../../../config/i18n';
import { fieldAddEditMessages } from '../../../shared/components/dynamic-form/control-field/add-edit/field-add-edit-messages';
import { ModifyFlag } from '../../../config/constants/enum';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { CommonStyles } from '../../../shared/common-style';
import { theme } from '../../../config/constants';
import { FieldDetailPulldownSingleStyles } from '../../../shared/components/dynamic-form/control-field/detail/field-detail-styles';

interface CustomerRegistrationEditItemProps {
  field: any;
  params: any;
  onPress: () => void;
  onChangeText: (text: string) => void;
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray250,
  },
});

export const CustomerRegistrationEditItem = ({
  field,
  params,
  onPress = () => {},
}: CustomerRegistrationEditItemProps) => {
  const authState = useSelector(authorizationSelector);
  const {
    fieldLabel,
    modifyFlag,
    fieldName,
    listFieldsItem = [],
    isDefault,
  } = field;

  if (!fieldName) return null;

  const title = StringUtils.getFieldLabel(
    { fieldLabel },
    'fieldLabel',
    authState.languageCode
  );

  if (listFieldsItem && listFieldsItem.length > 0) {
    let itemId = params[StringUtils.snakeCaseToCamelCase(fieldName)];
    if (!isDefault) {
      const elm = params.customerData.find((el: any) => el.key === fieldName);
      itemId = elm && elm.value;
    }
    const element = listFieldsItem.find((el: any) => el.itemId === itemId);
    const value = element ? element.itemLabel : TEXT_EMPTY;

    return (
      <View
        style={[
          FieldAddEditPulldownSingleStyles.container,
          CommonStyles.padding4,
          styles.container,
        ]}
      >
        <View style={FieldAddEditPulldownSingleStyles.titleContainer}>
          <Text style={FieldDetailPulldownSingleStyles.title}>{title}</Text>
          {modifyFlag >= ModifyFlag.REQUIRED_INPUT && (
            <View style={FieldAddEditPulldownSingleStyles.requiredContainer}>
              <Text style={FieldAddEditPulldownSingleStyles.requiredText}>
                {translate(fieldAddEditMessages.common_119908_03_inputRequired)}
              </Text>
            </View>
          )}
        </View>
        <View style={CommonStyles.padding2} />
        <View style={FieldAddEditPulldownSingleStyles.titleContainer}>
          <TouchableOpacity onPress={onPress}>
            {value === TEXT_EMPTY ? (
              <Text
                style={FieldAddEditPulldownSingleStyles.placeholder}
              >{`${title}${translate(
                fieldAddEditMessages.pulldownSinglePlaceholder
              )}`}</Text>
            ) : (
                <Text>{value}</Text>
              )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <></>
  );
};
