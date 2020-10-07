import { StyleSheet } from 'react-native';
import { theme } from '../../../config/constants';

export const InputWithIconStyle = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 0.5,
    borderTopWidth: 0.5,
    borderColor: '#E3E3E3',
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingVertical: theme.space[4],
  },
  iconContainer: {
    paddingHorizontal: 5,
    marginRight: theme.space[3],
    borderWidth: 1,
  },
  inputContainer: {
    borderRadius: 10,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    borderWidth: 0.5,
    borderColor: '#E5E5E5',
    paddingRight: theme.space[1],
    height: 50,
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginLeft: theme.space[2],
  },
  searchInput: {
    backgroundColor: theme.colors.white200,
    borderWidth: 0,
    height: 35,
    width: '80%',
    justifyContent: 'center',
    paddingLeft: '5%',
  },
  containerInput: {
    flex: 7,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.space[2],
  },
  containerIcon: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  btnIcon: {},
});
