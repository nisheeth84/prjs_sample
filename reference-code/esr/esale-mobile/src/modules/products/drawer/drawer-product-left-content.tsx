import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Keyboard,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { messages } from "./drawer-left-messages";
import { translate } from "../../../config/i18n";
import { Icon } from "../../../shared/components/icon";
import { theme } from "../../../config/constants";
import { Input } from "../../../shared/components/input";
import {
  categorySelector,
  isContainCategoryChildSelector,
  productCategoryIdSelector,
} from "../list/product-list-selector";
import { CategoryList } from "../category/category-list";
import { Category } from "../products-repository";
import { DrawerProductStyles } from "./drawer-product-style";
import { CommonStyles } from "../../../shared/common-style";
import { ALL_PRODUCT_ID, productActions } from "../list/product-list-reducer";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { ScreenName } from "../../../config/constants/screen-name";
import { useIsDrawerOpen } from "@react-navigation/drawer";
import { getCategoryFormat } from "../../../shared/util/app-utils";

const { width } = Dimensions.get("window");

interface Search {
  text: string;
  data: Array<Category>;
}

const xTranslate = width - 50;

let txtSearch = TEXT_EMPTY;

/**
 * Left Drawer in product screen
 */
export const DrawerProductLeftContent = () => {
  const categories = useSelector(categorySelector);
  const [search, setSearch] = useState<Search>({
    text: TEXT_EMPTY,
    data: categories,
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [level, setLevel] = useState(0);
  const [title, setTitle] = useState(TEXT_EMPTY);
  const [previousLevels, setPreviousLevel] = useState<any>([]);
  const [parrentX] = useState(new Animated.Value(0));
  const [subX] = useState(new Animated.Value(xTranslate));
  const [previousTitles, setPreviousTitles] = useState<Array<string>>([
    TEXT_EMPTY,
  ]);
  const isContainCategoryChild = useSelector(isContainCategoryChildSelector);
  const productCategoryId = useSelector(productCategoryIdSelector);

  const isDrawerOpen = useIsDrawerOpen();

  useEffect(() => {
    Keyboard.dismiss();
  }, [isDrawerOpen]);

  useEffect(() => {
    setSearch({ text: TEXT_EMPTY, data: categories });
  }, [categories]);

  /**
   * Seach category
   * @param child
   * @param inputSearch
   */
  const searchInChild = (child: Array<Category>, inputSearch: string) => {
    let search: Category[] = [];
    child.forEach((value) => {
      if (
        getCategoryFormat(value.productCategoryName).indexOf(inputSearch) !== -1
      ) {
        search.push(value);
      }
      if ((value.productCategoryChild || []).length > 0) {
        search = search.concat(
          searchInChild(value.productCategoryChild, inputSearch)
        );
      }
    });
    return search;
  };

  /**
   * handle change search text input
   * @param text
   */
  const handleChangeSearch = (text: string) => {
    const search: Category[] =
      text?.trim() === TEXT_EMPTY
        ? categories
        : searchInChild(categories, text);
    setSearch({ text, data: search });
  };

  /**
   * run slide animation when press categoty
   *
   */
  const animationSlide = () => {
    Animated.parallel([
      Animated.timing(parrentX, {
        toValue: -xTranslate,
        duration: 500,
      }),
      Animated.timing(subX, {
        toValue: 0,
        duration: 500,
      }),
    ]).start(() => {
      parrentX.setValue(0);
      subX.setValue(xTranslate);
    });
  };

  /**
   * press item on current list categories
   * @param index
   */

  const onPressItem = (index: number) => {
    const { data = [] } = search;
    const {
      productCategoryChild = [],
      productCategoryName = TEXT_EMPTY,
    } = data[index];
    if (productCategoryChild?.length > 0) {
      setSearch({ text: TEXT_EMPTY, data: productCategoryChild });
      const nextLevel = level + 1;
      const newPrevious = previousLevels;
      const newPreviousTitles = previousTitles;
      newPreviousTitles.push(productCategoryName);
      newPrevious.push(JSON.stringify(data));
      setLevel(nextLevel);
      setTitle(productCategoryName);
      setPreviousLevel(newPrevious);
      setPreviousTitles(newPreviousTitles);
      animationSlide();
    } else {
      navigation.dispatch(DrawerActions.jumpTo(ScreenName.PRODUCT));
    }
  };

  /**
   * press parrent title on sub categories
   */

  const onPressCategoryTitle = () => {
    if (level > 0) {
      const previousLevel = level - 1;
      const previousCategory = JSON.parse(previousLevels[previousLevel]);
      const newPreviousTitles = previousTitles;
      const newPrevious = [...previousLevels];
      newPrevious.pop();
      newPreviousTitles.pop();
      setLevel(previousLevel);
      setSearch({ text: TEXT_EMPTY, data: previousCategory });
      setTitle(previousTitles[previousLevel]);
      setPreviousLevel(newPrevious);
      animationSlide();
      if (previousLevel === 0) {
        dispatch(productActions.saveAllProductCategory({}));
      }
    }
  };

  return (
    <SafeAreaView style={DrawerProductStyles.container}>
      <ScrollView keyboardShouldPersistTaps="never">
        <View style={DrawerProductStyles.header}>
          <Text style={DrawerProductStyles.titleHeader}>
            {translate(messages.productMenu)}
          </Text>
        </View>
        <View style={DrawerProductStyles.divide} />
        <TouchableOpacity
          onPress={() => {
            dispatch(productActions.saveAllProductCategory({}));
            navigation.dispatch(DrawerActions.jumpTo(ScreenName.PRODUCT));
          }}
          style={DrawerProductStyles.header}
        >
          <Text style={DrawerProductStyles.titleList}>
            {translate(messages.allProducts)}
          </Text>
        </TouchableOpacity>
        <View style={DrawerProductStyles.divide2} />
        <View style={DrawerProductStyles.list}>
          <Text style={DrawerProductStyles.titleList}>
            {translate(messages.category)}
          </Text>
          <View style={DrawerProductStyles.search}>
            <TouchableOpacity
              hitSlop={CommonStyles.hitSlop}
              onPress={() => handleChangeSearch(txtSearch)}
            >
              <Icon name="search" />
            </TouchableOpacity>
            <Input
              placeholder={translate(messages.searchCategory)}
              placeholderColor={theme.colors.gray}
              style={[
                DrawerProductStyles.inputStyle,
                DrawerProductStyles.inputSearch,
              ]}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              onChangeText={(text) => {
                txtSearch = text;
                handleChangeSearch(txtSearch);
              }}
            />
          </View>
        </View>
        <View style={DrawerProductStyles.divide} />

        <View>
          <Animated.View
            style={[
              { position: "absolute", width: xTranslate },
              {
                transform: [
                  {
                    translateX: parrentX,
                  },
                ],
              },
            ]}
          >
            <CategoryList
              data={search.data}
              level={level}
              handlePressItem={(i) => onPressItem(i)}
              parentTitle={title}
              handlePresstitle={() => onPressCategoryTitle()}
            />
          </Animated.View>
          <Animated.View
            style={[
              { width: xTranslate },
              {
                transform: [
                  {
                    translateX: subX,
                  },
                ],
              },
            ]}
          >
            <CategoryList
              data={search.data}
              level={level}
              handlePressItem={(i) => onPressItem(i)}
              parentTitle={title}
              handlePresstitle={() => onPressCategoryTitle()}
            />
          </Animated.View>
        </View>
        <View style={DrawerProductStyles.divide} />
        {productCategoryId !== ALL_PRODUCT_ID && (
          <View>
            <View style={[DrawerProductStyles.checkboxCategoryChild]}>
              <Text style={[CommonStyles.flex1, CommonStyles.textBold]}>
                {translate(messages.isShowCategoryChild)}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  dispatch(
                    productActions.saveOptionContainCategoryChild(
                      !isContainCategoryChild
                    )
                  );
                  setTimeout(() => {
                    navigation.dispatch(
                      DrawerActions.jumpTo(ScreenName.PRODUCT)
                    );
                  }, 50);
                }}
              >
                {isContainCategoryChild ? (
                  <Icon
                    name="checkActive"
                    style={DrawerProductStyles.checkActiveIcon}
                  />
                ) : (
                    <Icon
                      name="unChecked"
                      style={DrawerProductStyles.checkActiveIcon}
                    />
                  )}
              </TouchableOpacity>
            </View>
            <View style={DrawerProductStyles.divide} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};
