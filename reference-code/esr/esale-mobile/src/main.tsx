import React from "react";
import { YellowBox, SafeAreaView } from "react-native";
import { Provider as ReduxProvider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Theme } from "@react-navigation/native/lib/typescript/src/types";
import { PersistGate } from "redux-persist/integration/react";
import { MainNavigator } from "./navigators/main-navigator";
import { persistor, store } from "./config-store";
import { I18NContext, useI18N } from "./config/i18n";

const navigationTheme: Theme = {
  colors: {
    background: '#fff',
    border: '#ccc',
    card: '#fff',
    primary: '#09f',
    text: 'black',
  },
  dark: false,
};

export function Main() {
  YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
  ]);
  console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
  console.disableYellowBox = true
  const { locale, changeLocale } = useI18N();
  return (
    <I18NContext.Provider value={{ locale, changeLocale }}>
      <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <NavigationContainer theme={navigationTheme}>
              <MainNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </PersistGate>
      </ReduxProvider>
    </I18NContext.Provider>
  );
}
