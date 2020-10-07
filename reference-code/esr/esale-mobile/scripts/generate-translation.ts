import { I18nMessage, I18nMessages } from '../src/types';

import en = require('../src/config/i18n/translations/en.json');
import ja = require('../src/config/i18n/translations/ja.json');
import zh = require('../src/config/i18n/translations/zh.json');
import path = require('path');
import glob = require('glob');
import fs = require('fs');

const srcDir = path.resolve(__dirname, '../src');

const messagePaths = glob.sync('**/*-messages.ts', {
  cwd: srcDir,
});

interface MessageResponse {
  messages: I18nMessages;
}

interface Translation {
  [key: string]: string;
}

Promise.all(
  messagePaths.map((messagePath) =>
    import(
      path.join(srcDir, messagePath)
    ).then(({ messages }: MessageResponse) => Promise.resolve(messages))
  )
).then((messagesArray: Array<I18nMessages>) => {
  const output: Translation = {};
  messagesArray.forEach((messages: I18nMessages) => {
    Object.keys(messages).forEach((messageKey: string) => {
      const message: I18nMessage = messages[messageKey];
      output[message.id] = message.defaultMessage;
    });
  });
  const newJa = { ...output, ...ja };
  const newEn = { ...output, ...en };
  const newZh = { ...output, ...zh };

  const translationsDir = path.join(srcDir, "config/i18n/translations");

  fs.writeFileSync(
    `${translationsDir}/ja.json`,
    JSON.stringify(newJa, null, 4)
  );
  fs.writeFileSync(
    `${translationsDir}/en.json`,
    JSON.stringify(newEn, null, 4)
  );
  fs.writeFileSync(
    `${translationsDir}/zh.json`,
    JSON.stringify(newZh, null, 4)
  );
});
