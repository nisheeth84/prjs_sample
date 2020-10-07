import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../config/constants';

const { width: screenWidth } = Dimensions.get('window');

export const DetailScreenStyle = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  modalContainer: {
    flex: 5,
    backgroundColor: 'white',
    borderTopLeftRadius: theme.borderRadius,
    borderTopRightRadius: theme.borderRadius,
  },
  settingContainer: {
    width: screenWidth,
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingButton: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: theme.space[3],
    borderRadius: theme.borderRadius,
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  settingText: {
    color: 'black',
    fontWeight: 'bold'
  },
  itemDynamic: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[3],
    borderBottomWidth: 0.5,
    borderColor: theme.colors.gray100,
  },
  itemDynamicReLation: {

  },

});

export const ModalSettingStyle = StyleSheet.create({
  modalContent: {
    flex: 5,
    backgroundColor: 'white',
    borderTopLeftRadius: theme.borderRadius,
    borderTopRightRadius: theme.borderRadius,
  },
  spaceView: {
    width: screenWidth,
    height: theme.space[4],
    backgroundColor: theme.colors.gray200,
  },
  topButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.space[4],
    paddingHorizontal: theme.space[6],
    borderBottomWidth: 0.5,
    borderColor: theme.colors.gray100,
  },
  fieldChooseItem: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: theme.colors.gray100,
  },
  fieldChooseItemRelation: {
    paddingHorizontal: theme.space[4],
    paddingVertical: theme.space[4],
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: theme.colors.gray100,
    flex:1
  },
  itemIconRelation: {
    flex:1/2,
  },
  itemIconRelationSize: {
    width: 20,
    height:20,
  },
  itemIconName: {
    fontSize: theme.fontSizes[3], fontWeight: 'bold',
    flex:6,
    marginLeft:5
  },
  itemIconCheck: {
    flex:1/2
  },
  itemLabel: { fontSize: theme.fontSizes[3], fontWeight: 'bold' },
  bottomButton: {
    backgroundColor: 'transparent',
    paddingVertical: theme.space[1],
    position: 'relative',
    bottom: 0,
    flexDirection: 'row',
    marginHorizontal: theme.space[6],
  },
  space: {
    marginBottom: 60
  },
  fieldChooseRelation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: theme.colors.gray100,
  },
  viewIconCheckBox: {
    flex: 1,
    alignItems: "flex-end"
  },
  viewText: {
    flex: 9
  }
});
