import React from "react";
import { Text, View } from "react-native";
import { Switch } from "react-native-paper";
import { Button } from "../button";
import { Input } from "../input";
import { FormInputStyles } from "./form-input-styles";
import { theme } from "../../../config/constants";

import { messages } from "./form-input-messages";
import { translate } from "../../../config/i18n";

const styles = FormInputStyles;

interface FormInput {
  title: string;
  value?: string;
  placeholder?: string;
  buttonText?: string;
  onButtonPress?: () => void;
  onChangeText?: (text: string) => void;
  inputEditable?: boolean;
  textInputStyle?: any;
  parentTextInputStyle?: any;
  hasLineBottom?: boolean;
  inputDisable?: boolean;
  inputClickEvent?: Function;
  containerStyle?: object;
  required?: boolean;
  enableSwitch?: boolean;
  toggleSwitch?: (value: boolean) => void;
  switchBox?: boolean;
  customUrlStyle?: object;
  multiline?: boolean;
  selectFile?: boolean;
  clearFile?: Function;
  secureTextEntry?: boolean;
  error?: boolean;
  formInputStyle?: any;
  _onChangeText?: (value: string) => void;
}

/**
 * Form input common component
 * @param title
 * @param value
 * @param buttonText
 * @param positionDrilldown
 * @param inputEditable
 * @param placeholder
 * @function onButtonPress
 * @function onChangeText
 */
export function FormInput({
  title,
  value,
  buttonText,
  onButtonPress,
  inputEditable,
  placeholder,
  _onChangeText,
  containerStyle,
  required,
  enableSwitch,
  toggleSwitch,
  switchBox,
  customUrlStyle,
  multiline,
  textInputStyle,
  hasLineBottom = true,
  formInputStyle,
  secureTextEntry,
  error,
}: FormInput) {
  return (
    <View
      style={[
        hasLineBottom ? styles.container : styles.containerNoLine,
        containerStyle,
      ]}
    >
      <View style={styles.wrapContent}>
        <View style={styles.titleWrapper}>
          <Text style={styles.titleText}>{title}</Text>
          {required && (
            <View style={styles.viewRequired}>
              <Text style={styles.txtRequired}>
                {translate(messages.required)}
              </Text>
            </View>
          )}
        </View>
        <View>
          {inputEditable && (
            <Input
              error={error}
              secureTextEntry={secureTextEntry}
              onChangeText={_onChangeText}
              value={value}
              placeholder={placeholder}
              placeholderColor={theme.colors.gray}
              style={[FormInputStyles.inputStyle, textInputStyle]}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              multiline={multiline}
              inputStyle={formInputStyle}
            />
          )}
          {!inputEditable && (
            <Text style={[styles.urlStyle, customUrlStyle]}>{value}</Text>
          )}
        </View>
      </View>
      {buttonText && (
        <View style={FormInputStyles.buttonWrapper}>
          <Button
            onPress={onButtonPress}
            variant="incomplete"
            block
            style={FormInputStyles.buttonStyle}
          >
            {buttonText}
          </Button>
        </View>
      )}
      {switchBox && (
        <Switch
          trackColor={{
            false: theme.colors.gray100,
            true: theme.colors.blue200,
          }}
          thumbColor={theme.colors.white}
          onValueChange={toggleSwitch}
          value={enableSwitch}
          style={styles.styleSwitchBox}
        />
      )}
    </View>
  );
}

FormInput.defaultProps = {
  inputEditable: true,
};
