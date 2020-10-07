import i18n, { TranslateOptions } from 'i18n-js';
import { createContext, useCallback, useEffect, useState } from 'react';
import { AsyncStorage } from 'react-native';
import * as Localization from 'expo-localization';
import { I18nMessage } from '../../types';
import en from './translations/en.json';
import ja from './translations/ja.json';
import zh from './translations/zh.json';

interface I18NContextType {
  locale: string;
  changeLocale: (locale: string) => void;
}

/**
 * Create context to store i18n
 */
const I18NContext = createContext<I18NContextType>({
  locale: "ja-jp",
  changeLocale: () => { },
});

const LOCALE_KEY = 'locale';

/**
 * Setting config
 */
const useI18N = () => {
  const [locale, setLocale] = useState("ja-jp");

  const changeLocale = useCallback((locale: string) => {
    i18n.locale = locale;
    setLocale(locale);
  }, []);

  useEffect(() => {
    changeLocale(Localization.locale);
  }, [changeLocale]);
  i18n.translations = {
    en,
    ja,
    zh
  };
  i18n.fallbacks = true;

  return { locale, changeLocale };
};

export function translate(
  scope: I18nMessage,
  options?: TranslateOptions
): string {
  return i18n.translate(scope.id, options);
}
export { I18NContext, useI18N, i18n };
