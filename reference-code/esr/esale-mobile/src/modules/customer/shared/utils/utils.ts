import { LanguageCode } from "../../../../config/constants/enum";
import { useSelector } from "react-redux";
import { authorizationSelector } from "../../../login/authorization/authorization-selector";
import { TEXT_EMPTY } from "../../../../config/constants/constants";

export const getLabelFormatByUserLanguage = (input: string, language: string = "ja_jp") => {
  let label = "";
  if (!language) {
    const authorizationState = useSelector(authorizationSelector);
    const languageCodeAuthor = authorizationState?.languageCode ?? TEXT_EMPTY;
    language = languageCodeAuthor;
  }
  
  try {
    const inputObject = JSON.parse(input);
    switch (language) {
      case LanguageCode.JA_JP:
        label = inputObject.ja_jp;
        break;
      case LanguageCode.EN_US:
        label = inputObject.en_us;
        break;
      case LanguageCode.ZH_CN:
        label = inputObject.zh_cn;
        break;
      default:
        label = inputObject.ja_jp;
        break;
    }
  } catch (error) {
    label = input;
  }

  return label;
}