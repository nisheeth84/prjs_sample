import { TypeMessage } from "../../config/constants/enum"
import { translate } from "../../config/i18n"
import { messages } from "../../shared/messages/response-messages"

export const getApiErrorMessage = (response: any) => {
  let errors = response?.data?.parameters?.extensions?.errors || [];
  if (response?.status === 500 && errors.length > 0) {
    let errorsCode = errors[0]?.errorCode;
    return {
      content: translate(messages[errorsCode] || messages.ERR_COM_0001),
      type: TypeMessage.ERROR,
    }
  }
  return {
    content: translate(messages.ERR_COM_0001),
    type: TypeMessage.ERROR,
  }
}