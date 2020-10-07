import { StyleSheet } from 'react-native';
import { theme } from '../../config/constants/theme';

export const FeedbackStyles = StyleSheet.create({
  containerBg: { height: '100%' },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.white,
  },
  header: {
    height: 70,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    backgroundColor: theme.colors.white100,
    marginTop: 20,
  },
  textTitle: {
    fontWeight: '700',
    fontSize: theme.fontSizes[4],
  },
  body: {
    flex: 1,
    // backgroundColor: theme.colors.white,
    alignItems: 'center',
    justifyContent: 'flex-start',
    // backgroundColor: "red",
    width: '100%',
    paddingHorizontal: 15,
  },
  iconRespPen: {
    marginTop: 50,
    marginBottom: 20,
  },
  textQues: {
    fontSize: theme.fontSizes[3],
    color: theme.colors.black,
    textAlign: 'justify',
    marginBottom: 20,
  },
  textContent: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray1,
    textAlign: 'justify',
    minHeight: theme.space[6],
  },
  viewBtn: {
    width: '100%',
    flexDirection: 'row',
    marginTop: 50,
  },
  btnLike: {
    flex: 1,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  textLike: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.gray300,
  },
  iconEmoji: {
    marginRight: 5,
  },
  viewFeedback: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 12,
    backgroundColor: theme.colors.white200,
    padding: 15,
  },
  viewRequired: {
    backgroundColor: 'red',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 7,
    marginLeft: 10,
    height: theme.space[6],
  },
  textRequired: {
    fontSize: theme.fontSizes[2],
    color: theme.colors.white,
  },
  btnSend: {
    marginTop: 50,
    marginBottom: 30,
    width: '40%',
    borderRadius: 12,
    backgroundColor: theme.colors.gray200,
    paddingVertical: 10,
    alignItems: 'center',
  },
  buttonSend: {
    marginTop: 50,
    marginBottom: 30,
  },
  textBtn: {
    fontWeight: '700',
    fontSize: theme.fontSizes[4],
    color: theme.colors.gray300,
  },
  textInput: {
    marginTop: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 12,
    backgroundColor: theme.colors.white200,
    padding: 15,
    minHeight: 200,
    fontSize: theme.fontSizes[2],
    textAlignVertical: 'top',
    color: theme.colors.black,
  },
  borderActive: {
    borderColor: theme.colors.blue200,
  },
  backgroundActive: {
    backgroundColor: theme.colors.blue200,
  },
  textActive: {
    color: theme.colors.blue200,
  },
  textSendActive: {
    color: theme.colors.white,
  },
  containerBtn: {
    width: '100%',
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: { width: 10 },
});

export const FeedbackCompletionStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.space[6],
  },
  icon: {
    marginBottom: 10,
  },
  text: {
    fontSize: theme.fontSizes[4],
    color: theme.colors.gray1,
    textAlign: 'center',
  },
  textWait: {
    marginTop: 20,
    fontSize: theme.fontSizes[4],
    color: theme.colors.gray1,
    textAlign: 'center',
  },
  btn: {
    width: '40%',
    borderWidth: 1,
    borderColor: theme.colors.gray100,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 40,
    fontSize: theme.fontSizes[3],
  },

  buttonClose: {
    marginTop: 40,
  },
});
