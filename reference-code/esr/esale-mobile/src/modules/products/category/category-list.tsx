import React, { useEffect } from "react";
import {
  Text,
  View,
  Image
} from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
import { useDispatch } from "react-redux";
import { messages } from "./category-messages";
import { translate } from "../../../config/i18n";

import { CategoryItem } from "./category-item";
import { Category } from "../products-repository";
import { CategoryItemStyles } from "./category-item-style";
import { theme, appImages } from "../../../config/constants";
import { productActions, ALL_PRODUCT_ID, ALL_PRODUCT } from "../list/product-list-reducer";
import { CommonStyles } from "../../../shared/common-style";
import { getCategoryFormat } from "../../../shared/util/app-utils";

interface CategoryListProps {
  // array category
  data: Array<Category>;
  // level
  level: number;
  // parent title
  parentTitle: string;
  // function handle press title
  handlePresstitle: () => void;
  // function handle press item
  handlePressItem: (index: number) => void;
}

/**
 * Show list category in left drawer
 * @param param0
 */

export const CategoryList: React.FC<CategoryListProps> = ({
  data = [],
  level = 0,
  handlePressItem,
  handlePresstitle,
  parentTitle,
}) => {
  const dispatch = useDispatch();

  /**
   * Handle press category
   * @param index 
   * @param category 
   */
  const onCategoryClick = (index: number, category: Category) => {
    dispatch(productActions.saveCategory(category));
    handlePressItem(index);
  };

  return (
    <>
      {
        level > 0 ?
          <View>
            <Text style={[
              CategoryItemStyles.header,
              CategoryItemStyles.header2
            ]}>{getCategoryFormat(parentTitle)}</Text>
            <TouchableOpacity style={CommonStyles.row} onPress={() => handlePresstitle()}>
              <View style={[CommonStyles.row, CommonStyles.padding4]}>
                <Image style={CategoryItemStyles.iconLeft} source={appImages.iconLeft} />
              </View>
              <Text style={[CategoryItemStyles.categoryItem, CommonStyles.noPaddingLeft]}>{translate(messages.backToTop)}</Text>
            </TouchableOpacity>
          </View>
          : <View />
      }
      <View>
        {data.map((category: Category, index: number) => (
          <CategoryItem
            key={category.productCategoryId}
            name={getCategoryFormat(category.productCategoryName)}
            child={category.productCategoryChild}
            onClick={() => onCategoryClick(index, category)}
          />
        ))}
      </View>
    </>
  );
};
