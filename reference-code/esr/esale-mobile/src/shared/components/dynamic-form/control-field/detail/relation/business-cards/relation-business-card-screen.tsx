import { StackActions, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  FlatList,

  Text,
  TouchableOpacity, View
} from "react-native";
import { useSelector } from "react-redux";
import { FIELD_LABLE, TEXT_EMPTY } from "../../../../../../../config/constants/constants";
import { DefineFieldType, FIELD_BELONG, RelationDisplay, TypeRelationSuggest } from "../../../../../../../config/constants/enum";
import { authorizationSelector } from "../../../../../../../modules/login/authorization/authorization-selector";
import StringUtils from "../../../../../../util/string-utils";
import { extensionDataSelector } from "../../../../../common-tab/common-tab-selector";
import { getBusinessCards } from "../../../dynamic-control-repository";
import { BusinessCardItem } from "./business-card-item";
import { BusinessCardStyles } from "./business-card-style";
import { BusinessCardState, RelationBusinessCardProps } from "./business-card-type";

/** 
 * Render field components in case of detail
 * @param props see IDynamicFieldProps
 */
export function RelationBusinessCardScreen(props: RelationBusinessCardProps) {
  const [responseApiBusinessCard, setResponseApiBusinessCard] = useState<BusinessCardState>();
  const { fieldInfo, belong } = props;
  const displayTab = fieldInfo.relationData ? fieldInfo.relationData.displayTab : 0;
  const typeSuggest = fieldInfo.relationData ? fieldInfo.relationData.format : 0;
  const authorizationState = useSelector(authorizationSelector);
  const languageCode = authorizationState?.languageCode ? authorizationState?.languageCode : TEXT_EMPTY;
  const title = StringUtils.getFieldLabel(props?.fieldInfo, FIELD_LABLE, languageCode);
  const extensionData = props?.extensionData ? props?.extensionData : useSelector(extensionDataSelector);
  const [relationDataIds, setRelationDataIds] = useState<any>();
  const navigation = useNavigation();

    /**
   * Handling after first render
   */
  useEffect(() => {
    if (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) {
      handleGetRelationBusinessCardList();
    } else if (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) {
      handleGetRelationBusinessCardTab();
    }
  }, []);


  /**
 * Detail Business Card
 * @param businessCardId
 */
  const detailBusinessCard = (businessCardId: number) => {
    if(belong === FIELD_BELONG.BUSINESS_CARD) {
      navigation.dispatch(
        StackActions.push('business-card-detail', { id: businessCardId })
      );
    } else {
      navigation.navigate("business-card-detail", { id: businessCardId })
    }
  };


  /**
 * Call api get relation product list
 */
const handleGetRelationBusinessCardList = async () => {
  const businessCardData: any = extensionData.find((item: any) => (item.key === fieldInfo.fieldName && item.fieldType === DefineFieldType.RELATION));
  const businessCardIds: number[] = businessCardData?.value ? JSON.parse(businessCardData.value): [];
  if(businessCardIds) {
    setRelationDataIds(businessCardIds);
  }
}

/**
* Call api get relation employee
*/
const handleGetRelationBusinessCardTab = async () => {
  const businessCardData: any = extensionData.find((item: any) => (item.fieldType === DefineFieldType.RELATION));
  const businessCardIds: number[] = JSON.parse(businessCardData.value);
  const businessCardRessponse = await getBusinessCards({
    searchConditions: [],
    orderBy: [],
    offset: 0,
    searchLocal: "",
    filterConditions: [],
    isFirstLoad: true
  });
  if (businessCardRessponse.data) {
    businessCardRessponse.data.businessCards = businessCardRessponse.data.businessCards.filter((item:any) => businessCardIds.includes(item.businessCardId))
    setResponseApiBusinessCard((businessCardRessponse.data));
  }
}
  /**
   * reader business cards tab
   */
  const renderBusinessCardTab = () => {
    return (
      <View>
        <FlatList
          data={responseApiBusinessCard?.businessCards}
          keyExtractor={(item, index) => "key" + item.businessCardId + index}
          renderItem={({ item, index }) => (
            <BusinessCardItem
              key={index}
              businessCardId={item.businessCardId}
              businessImage={item.businessCardImagePath}
              customerName={item?.customerName + "/" + item?.departmentName}
              businessCardName={item?.firstName + " " + item?.lastName}
              belong={belong}
            />
          )}
        />
      </View>
    );
  };

  /**
   * reader business cards list
   */
  const renderBusinessCardList = () => {
    return (
      <View>
        <Text style={BusinessCardStyles.labelHeader}>{title}</Text>
        <View style={BusinessCardStyles.mainContainer}>
          {
            relationDataIds &&
            relationDataIds?.map((businessCardId:any,index:number) =>
              <View style={BusinessCardStyles.employeeContainer}>
                <TouchableOpacity onPress={() => detailBusinessCard(businessCardId)} >
                <Text style={BusinessCardStyles.link}>{businessCardId}</Text>
                </TouchableOpacity>
                {
                  ++index !== relationDataIds.length
                  && relationDataIds.length > 1 
                  &&<Text style={BusinessCardStyles.link}>,</Text>
                }
              </View>
            )
          }
        </View>
      </View>
    );
  };

  return (
    <View>
      {
        (displayTab === RelationDisplay.TAB && typeSuggest === TypeRelationSuggest.MULTI) && renderBusinessCardTab()
      }
      {
        (displayTab === RelationDisplay.LIST || typeSuggest === TypeRelationSuggest.SINGLE) && renderBusinessCardList()
      }
    </View>
  );
}
