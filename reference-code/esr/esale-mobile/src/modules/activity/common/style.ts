import { StyleSheet } from 'react-native'
import { ScreenWidth, getHeight, getWidth, normalize } from './helper'
import { theme } from "../../../config/constants"

export const Colors = {
  c1: '#ADE4C9',
  c2: '#333333',
  c3: '#E3E3E3',
  c4: '#0F6DB3',
}

export const globalText = {
  style: {
    fontSize: normalize(12),
    color: Colors.c2,
  },
}

export const globalView = {
  style: {
    backgroundColor: '#fff',
  },
}

export const globalTouchableOpacity = {
  activeOpacity: 0.7,
}

export const Style = StyleSheet.create({
  body: {
    backgroundColor: '#fff',
    flex: 1,
  },
  container: {
    flex: 1,
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
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
  },
  // modal
  modal: {
    width: ScreenWidth - 30,
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  modal2: {
    overflow: 'hidden',
  },
  titleModal: {
    alignSelf: 'center',
    paddingVertical: getHeight(20),
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  textModalItem: {
    position: 'relative',
  },
  checkText: {
    alignItems:'center',
    justifyContent: 'center',
    backgroundColor: '#0F6DB5',
    width: normalize(26),
    height: normalize(26),
    position: 'absolute',
    borderRadius: 100,
    top: '25%',
    right: normalize(20),
  },
  modalText: {
    fontSize: normalize(14),
    padding: normalize(20),
    borderTopColor: '#E5E5E5',
    borderTopWidth: 1,
    
  },
  buttonModal: {
    fontSize: normalize(12),
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    width: getWidth(150),
    textAlign: 'center',
    borderRadius: 10,
  },
  smallButtonModal: {
    fontSize: normalize(12),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
    textAlign: 'center',
    borderRadius: 10,
  },
  modalContent: {
    width: getWidth(250),
    alignSelf: "center",
    alignItems: "center",
    paddingBottom: normalize(15),
  },
  textAlignCenter: {
    textAlign: 'center',
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: theme.colors.black,
  },
  footerModal: {
    padding: getHeight(20),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  textModal: {
    fontSize: normalize(14),
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: normalize(45),
  },
  widthButton: { width: normalize(150) },
  buttonBorder: {
    borderWidth: 1,
    borderColor: theme.colors.gray100,
  },
  buttonRed: {
    borderWidth: 1,
    borderColor: "#F92525",
    backgroundColor: "#F92525",
    color: theme.colors.white,
  },
  itemModal: {
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(20),
  },
  itemModalAct: {
    backgroundColor: theme.colors.gray100,
  },
  colorBlue: {
    color: theme.colors.blue200,
  },
  buttonModalSearch: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonModalAdd: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    paddingHorizontal: normalize(10),
    borderRadius: normalize(10),
    overflow: "hidden",
    alignItems: "center",
  },
  btnSearchText: {
    paddingLeft: normalize(10),
    fontSize: normalize(14),
    width: getWidth(180),
    overflow: "hidden",
  },
  btnAddText: {
    paddingLeft: normalize(10),
    fontSize: normalize(12),
  },
  plus: {
    fontSize: normalize(20),
    color: "#999999",
  },
  contentsModal: {
    paddingVertical: normalize(10),
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
})
