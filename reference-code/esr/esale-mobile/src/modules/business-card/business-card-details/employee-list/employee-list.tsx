import React, { useState } from "react";
import { SafeAreaView, View, Image, Text, FlatList } from "react-native";
import { messages } from "./employee-list-messages";
import { translate } from "../../../../config/i18n";
import { useNavigation, useRoute } from "@react-navigation/native";
import { EmployeeListStyles as styles } from "./employee-list-style";
import { CommonStyles } from "../../../../shared/common-style";
import { Header } from "../../../../shared/components/header";
import { theme, appImages } from "../../../../config/constants";
import { Line } from "../../../../shared/components/line";
import { checkEmptyString } from "../../../../shared/util/app-utils";
import { EmployeeListRouteProp } from "../../../../config/constants/root-stack-param-list";
import { ListEmptyComponent } from "../../../../shared/components/list-empty/list-empty";
import { AppIndicator } from "../../../../shared/components/app-indicator/app-indicator";
import { ON_END_REACHED_THRESHOLD } from "../../../../config/constants/constants";

/**
 * Component show group chanel color screen
 */

export const EmployeeListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<EmployeeListRouteProp>();
  const [load, setLoad] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const ItemEmployee = (item: any) => {
    return (
      <View style={styles.itemContainer} key={item.employeeId}>
        <View style={styles.itemList}>
          <View style={CommonStyles.imageTitle}>
            <Image
              style={styles.iconEmployee}
              resizeMode="contain"
              source={
                !checkEmptyString(item?.employeePhoto?.filePath)
                  ? { uri: item.employeePhoto?.filePath }
                  : appImages.icUser
              }
            />
            <Text
              style={styles.itemName}
            >{`${item.employeeSurname} ${item.employeeName} `}</Text>
          </View>
        </View>
        <Line />
      </View>
    );
  };

  /**
   * pull to refresh
   */
  const onRefresh = () => {
    setRefreshing(true);
  };

  const onEndReached = () => {
    if (!load) {
        setLoad(false);
    }
  };
  const renderListEmptyComponent = () => {
    return <ListEmptyComponent />;
  };

  return (
    <SafeAreaView style={CommonStyles.flex1}>
      <Header
        title={translate(messages.title)}
        titleSize={theme.fontSizes[4]}
        onLeftPress={() => {
          navigation.goBack();
        }}
        leftIconName="arrowLeft"
      />
      <View style={CommonStyles.flex1}>
        <FlatList
          data={route?.params?.data}
          keyExtractor={(item) => item.activityId.toString()}
          renderItem={({ item }) => ItemEmployee(item)}
          ListEmptyComponent={renderListEmptyComponent}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={ON_END_REACHED_THRESHOLD}
          ListFooterComponent={
            <AppIndicator style={CommonStyles.backgroundTransparent} />
          }
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
      </View>
    </SafeAreaView>
  );
};
