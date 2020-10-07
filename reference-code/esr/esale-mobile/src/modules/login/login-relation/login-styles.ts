import { StatusBar, StyleSheet } from 'react-native';

export const LoginChangePassStyles = StyleSheet.create({
  container: {
    backgroundColor: '#E9F0F7',
    flex: 1,
    paddingTop: StatusBar.currentHeight
  },
  topContainer: {
    flex: 1,
    marginBottom: 40
  },
  logoWrapper: {
    alignItems: 'center',
    paddingTop: 28
  },
  logo: {
    width: 100,
    height: 100,
  },
  textBlack: {
    color: '#333333',
    fontSize: 20,
    textAlign: 'center',
  },
  textResetWrapper: {
    paddingVertical: 20
  },
  messageWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12
  },
  infoWrapper: {
    backgroundColor: '#FFF1DA',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: 'row'
  },
  infoMessageWrap: {
    paddingHorizontal: 10
  },
  textMessage: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 16
  },
  textConditionMessage: {
    color: '#333333',
    fontSize: 14,
    paddingBottom: 8
  },
  textCondition: {
    color: '#333333',
    fontSize: 14,
  },
  inputPassWrapper: {
    backgroundColor: '#FFFFFF'
  },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
  },
  inputPass: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    color: '#333333'
  },
  submitTouchable: {
    backgroundColor: '#0F6DB5',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitDisableTouchable: {
    backgroundColor: '#EDEDED',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textSubmitTouchable: {
    color: '#FFFFFF',
    fontSize: 14
  },
  textSubmitDisableTouchable: {
    color: '#999999',
    fontSize: 14
  },
  copyright: {
    color: '#333333',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 20
  },
  errorWrapper: {
    backgroundColor: '#FED3D3',
    paddingVertical: 16,
    marginHorizontal: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 12
  }
});

export const LoginSendMailStyles = StyleSheet.create({
  container: {
    backgroundColor: '#E9F0F7',
    flex: 1,
  },
  topContainer: {
    flex: 1,
  },
  logoWrapper: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textBlack: {
    color: '#333333',
    fontSize: 20,
    textAlign: 'center',
  },
  textResetWrapper: {
    paddingBottom: 20,
  },
  messageWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderRadius: 12
  },
  textMessage: {
    color: '#333333',
    fontSize: 14,
  },
  returnTouchable: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textReturnTouchable: {
    fontSize: 14
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20
  },
  copyright: {
    color: '#333333',
  },
});

export const ChangePasswordSuccessStyles = StyleSheet.create(
  {
    button: {
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
      padding: 15,
      marginTop: 50,
      width: '93%',
      borderWidth: 1,
      borderColor: '#E5E5E5'
    },
    backGround: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#E9F0F7',
      alignItems: 'center'
    },
    logo: {
      width: 120,
      height: 120,
      marginTop: 25
    },
    footer: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: 20,
    },
    messageBox: {
      width: '93%',
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      borderRadius: 10,
      padding: 15,
      marginTop: 20,
      fontSize: 14

    },
    labelReset: {
      fontSize: 18,
      paddingTop: 30,
      color: '#333333'
    },
    viewButton: {
      flexDirection: 'row'
    },
    textColor: {
      color: '#333333'
    },
    footerText: {
      color: '#333333',
      fontSize: 10
    }
  }
);

export const ForgotPassStyles = StyleSheet.create({
  container: {
    backgroundColor: '#E9F0F7',
    flex: 1,
    flexDirection: 'column',
    paddingTop: StatusBar.currentHeight
  },
  topContainer: {
   
  },
  logoWrapper: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 8
  },
  logo: {
    width: 100,
    height: 100,
  },
  textBlack: {
    color: '#333333',
    fontSize: 20,
    textAlign: 'center',
  },
  alertWrapper: {
    paddingVertical: 20
  },
  messageWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    alignItems: 'center',
    borderRadius: 12
  },
  errorWrapper: {
    backgroundColor: '#FED3D3',
    paddingVertical: 16,
    marginHorizontal: 12,
    marginBottom: 20,
    alignItems: 'center',
    borderRadius: 12
  },
  textMessage: {
    color: '#333333',
    fontSize: 14,
  },
  inputUser: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingLeft: 28
  },
  inputUserError: {
    backgroundColor: '#FED3D3',
    paddingVertical: 16,
    paddingLeft: 28
  },
  sendTouchable: {
    backgroundColor: '#0F6DB5',
    marginTop: 28,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  returnTouchable: {
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  textSendTouchable: {
    color: '#FFFFFF',
    fontWeight: "bold",
    fontSize: 14
  },
  textReturnTouchable: {
    fontWeight: "bold",
    fontSize: 14
  },
  footer: {
    alignItems: "center",
    marginBottom: 20,    
  },
  copyright: {
    color: '#333333',
  },
});

export const LoginUrlExpiredStyles = StyleSheet.create({
  container: {
    backgroundColor: '#E9F0F7',
    flex: 1,
  },
  topContainer: {
    flex: 1,
  },
  logoWrapper: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logo: {
    width: 100,
    height: 100,
  },
  textBlack: {
    color: '#333333',
    fontSize: 20,
    textAlign: 'center',
  },
  textResetWrapper: {
    paddingBottom: 20,
  },
  messageWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderRadius: 12
  },
  textMessage: {
    color: '#333333',
    fontSize: 14,
    textAlign: 'center'
  },
  returnTouchable: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textReturnTouchable: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20
  },
  copyright: {
    color: '#333333',
  },
});