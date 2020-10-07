import { StyleSheet } from 'react-native';
import { ScreenWidth, getHeight, getWidth, normalize } from './helper';
import { theme } from "../../../config/constants";

export const Colors = {
  c1: '#ADE4C9',
  c2: '#333333',
  c3: '#E3E3E3',
  c4: '#0F6DB3',
};

export const globalText = {
  style: {
    fontSize: normalize(12),
    color: Colors.c2,
  },
};

export const globalView = {
  style: {
    backgroundColor: '#fff',
  },
};

export const globalTouchableOpacity = {
  activeOpacity: 0.7,
};

export const Style = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  flexCenter: {
    alignItems: 'center',
  },

  borderHead: {
    borderBottomColor: '#BEBEBE',
    borderBottomWidth: 0.5,
  },
  label: {
    marginBottom: 5,
  },
  boxShadow: {
    shadowColor: '#707070',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 1,
  },
  // modal
  modal: {
    width: ScreenWidth - 30,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  modal_2: {
    overflow: 'hidden',
  },
  title_modal: {
    alignSelf: 'center',
    paddingVertical: getHeight(20),
    fontSize: normalize(16),
  },
  text_modal_item: {
    position: 'relative',
  },
  check_text: {
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#0F6DB5',
    width: normalize(26),
    height: normalize(26),
    position: 'absolute',
    borderRadius: 100,
    top: '25%',
    right: normalize(20),
  }
,  modal_text: {
    fontSize: normalize(14),
    padding: normalize(20),
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
    
  },
  button_modal: {
    fontSize: normalize(12),
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    width: getWidth(150),
    textAlign: 'center',
    borderRadius: 10,
  },
  footer_modal:{
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
    padding: getHeight(20),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  text_modal: {
    fontSize: normalize(14),
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: normalize(45),
  },
  width_button: { width: normalize(150) },
  button_border: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  button_red: {
    borderWidth: 1,
    borderColor: "#F92525",
    backgroundColor: "#F92525",
    color: theme.colors.white,
  },
  item_modal: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  item_modal_act: {
    backgroundColor: theme.colors.gray100,
  },
  color_blue: {
    color: theme.colors.blue200,
  },
  button_modal_search: {
    flexDirection: "row",
    alignItems: "center",
  },
  button_modal_add: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
    overflow: "hidden",
    alignItems: "center",
  },

  btn_search_text: {
    paddingLeft: normalize(10),
    fontSize: normalize(14),
    width: getWidth(180),
    overflow: "hidden",
  },
  btn_add_text: {
    paddingLeft: normalize(10),
    fontSize: normalize(12),
  },
  plus: {
    fontSize: normalize(20),
    color: "#999999",
  },
  contents_modal: {
    paddingVertical: normalize(10),
  },
  // style modal from schedule

  footerModal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: normalize(20),
  },
  modalButtonDelete: {
    borderWidth: 1,
    borderColor:
    '#F92525',
    backgroundColor:
    '#F92525',
    color: '#FFF'
  },
  borderModal: {
    borderWidth: 1,
    borderColor: '#E5E5E5'
  }
});
