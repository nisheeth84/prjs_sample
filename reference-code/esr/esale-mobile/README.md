## Using i18n

In case you need to use i18n, create a message file, the naming convention should be: **<module_name>-messages.ts** with the recommended content as bellow:

```
import { I18nMessages } from "../../types";

export const messages: I18nMessages = {
  userId: {
    id: "module_name_userId",
    defaultMessage: "ユーザーID",
  },
};

```

then in the component,

```
import { translate } from "../../i18n";
import { messages } from "./<module_name>-messages";
```

To use the translation string:

```translate(messages.userId)```

Notice: Everytime you add new translation to the messages file, you should run ```yarn gen-translations```, this script will generate the translation files to **i18n/translations/{en,ja}.json**