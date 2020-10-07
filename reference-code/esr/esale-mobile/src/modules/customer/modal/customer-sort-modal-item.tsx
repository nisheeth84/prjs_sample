import * as React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CustomerSortModalStyles } from "../list/customer-list-style";
import { ItemSortTypeData } from "../list/customer-list-repository";
import { Icon } from "../../../shared/components/icon";
import { customerListActions } from "../list/customer-list-reducer";
import { useDispatch } from "react-redux";

interface CustomerSortModalItemProps {
  // data of Sort Modal
  data: ItemSortTypeData;
  // get index of list sort modal
  index: number;
}

/**
 * Component for show list sort modal
 * @param CustomerSortModalItemProps 
*/

export const CustomerSortModalItem: React.FC<CustomerSortModalItemProps> = ({
  data,
  index,
}) => {
  const dispatch = useDispatch();
  /**
   * action handle set selected type sort 
   * @param indexItemSelectSort get index of item click
  */
  const handleSelectedTypeSort = (indexItemSelectSort: number) => () => {
    dispatch(
      customerListActions.handleSelectedTypeSort({
        position: indexItemSelectSort,
      })
    );
  }

  return (
    <View>
      <TouchableOpacity style={CustomerSortModalStyles.viewContentSortTypeDataButton} onPress={handleSelectedTypeSort(index)}>
        <Text style={[CustomerSortModalStyles.viewContentSortAscAndDescText, CustomerSortModalStyles.viewContentSortTypeDataText]}>{data.name}</Text>
        <Icon style={CustomerSortModalStyles.viewContentSortAscAndDescIcon} name={data.selected ? "selected" : "unchecked"} />
      </TouchableOpacity>
    </View>
  );
}