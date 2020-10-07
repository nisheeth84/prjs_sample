import React from "react";
import { View, Text, TextInput } from "react-native";
import PropTypes from "prop-types";
import { InputStyles } from "./input-styles";

/**
 * Input component
 * @param props
 */
function Input(props: any) {
  const {
    label,
    placeholder,
    value,
    onChangeText,
    inputStyle,
    onEndEditing,
  } = props;

  return (
    <View style={[InputStyles.container, inputStyle]}>
      <Text style={InputStyles.label}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onEndEditing={onEndEditing}
      />
    </View>
  );
}

Input.propTypes = {
  label: PropTypes.string, // label of input
  placeholder: PropTypes.string, // placeholder input
  value: PropTypes.string, // value input
  onChangeText: PropTypes.func, // function change input
  inputStyle: PropTypes.object, // style container input
  onEndEditing: PropTypes.func, // function finish importing input
};

export default Input;
