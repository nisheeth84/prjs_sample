{
  /* <Drawer.Screen name="detail-search" component={DetailSearch} /> */
}
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DetailSearch } from "./search-detail/search-detail-screen";
import { SearchGlobal } from "./search-screen";
// import { useSelector } from "react-redux";
// import { authSelector } from "../../auth/authentication/auth-selector";
// import { useI18N } from "../../../config/i18n";

const Stack = createStackNavigator();

export function SearchNavigator() {
  // const authState = useSelector(authSelector);
  // const i18n = useI18N();
  // useEffect(() => {
  //   if (authState?.languageCode) {
  //     const languageCode = authState.languageCode.replace('_', '-')
  //     i18n.changeLocale(languageCode)
  //   }
  // }, [authState]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="detail-search" component={DetailSearch} />
      <Stack.Screen name="search" component={SearchGlobal} />
    </Stack.Navigator>
  );
}
