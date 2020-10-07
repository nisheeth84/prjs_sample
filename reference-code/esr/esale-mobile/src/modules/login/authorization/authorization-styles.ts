import { Dimensions, StyleSheet, Platform } from 'react-native';

export const LoginScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E9F0F7'
  },
  logoContainner: {
    alignItems: 'center',
    marginVertical: 20
  },
  logo: {
    width: Dimensions.get('window').width / 4,
    height: Dimensions.get('window').width / 4
  },
  inputRegionContainer: {
    marginVertical: 20
  },
  inputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 0
  },
  inputConnection: {
    borderColor: '#E5E5E5',
    borderWidth: 1,
    paddingVertical: 12
  },
  viewPassword: {
    borderColor: '#E5E5E5',
    borderWidth: 1
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    color: '#333333'
  },
  inputPlaceholder: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 5,
    color: '#999999'
  },
  viewLink: {
    alignItems: 'center'
  },
  link: {
    color: '#0F6DB5'
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },

})

export const ContractExpiredStyles = StyleSheet.create({
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

export const TrialExpiredStyles = StyleSheet.create({
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
    alignItems:'center'
  },
  messageWrapper: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12
  },
  textMessage: {
    color: '#333333',
    fontSize: 14,
    textAlign:'center'
  },
  returnTouchable: {
    backgroundColor: '#0f6db5',
    marginTop: 24,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  textReturnTouchable: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white'
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20
  },
  copyright: {
    color: '#333333',
  },
});

export const ForbiddenScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    justifyContent: 'center'
  },
  forbiddenContainer: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingBottom: 50
  },
  textForbidden: {
    color: '#999999',
    textAlign: 'center',
    fontSize: 18
  }
});