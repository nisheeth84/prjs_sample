import React from 'react';
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { theme } from '../../../config/constants';
import { Icon } from '../icon';

export interface LocalSearch extends TextInputProps {
  label?: string;
  disabled?: boolean;
  styleContainer?: StyleProp<ViewStyle>;
  textColor?: string;
  error?: boolean;
  placeholderColor?: string;
  isOptions?: boolean;
  onSearch?: () => void;
  onDetailPress?: () => void;
}

const styles = StyleSheet.create({
  boxSearch: { flexDirection: 'row', height: 40, width: '100%' },
  search: { width: '100%', alignItems: 'center', justifyContent: 'center' },
  searchInput: {
    borderColor: '#E5E5E5',
    borderRadius: 15,
    borderWidth: 1,
    height: 40,
    width: '100%',
    paddingLeft: 38,
  },
  cancel: { flex: 1, justifyContent: 'center', paddingLeft: 6 },
  txtCancel: { color: '#0F6DB5', fontSize: 13 },
  btnOptionsFilter: {
    position: 'absolute',
    right: 4,
    width: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { position: 'absolute', left: 10 },
  btnLine: { height: 30, width: 1, backgroundColor: '#E5E5E5' },
});

// const errorStyle = {
//   borderColor: theme.colors.red600,
//   backgroundColor: theme.colors.pink,
// };

export const LocalSearch: React.FunctionComponent<LocalSearch> = React.memo(
  ({
    styleContainer,
    isOptions,
    onSearch,
    onDetailPress = () => {},
    ...inputProps
  }) => (
    <View style={[styles.boxSearch, styleContainer]}>
      <View style={styles.search}>
        <TextInput
          {...inputProps}
          style={[styles.searchInput, { paddingRight: isOptions ? 42 : 8 }]}
          placeholderTextColor={theme.colors.gray}
        />
        <TouchableOpacity onPress={onSearch} style={styles.icon}>
          <Icon name="search" />
        </TouchableOpacity>
        {!isOptions || (
          <TouchableOpacity
            onPress={onDetailPress}
            style={styles.btnOptionsFilter}
          >
            <View style={styles.btnLine} />
            <Icon name="options" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
);

// LocalSearch.defaultProps = {
//   placeholderColor: theme.colors.black,
// };
