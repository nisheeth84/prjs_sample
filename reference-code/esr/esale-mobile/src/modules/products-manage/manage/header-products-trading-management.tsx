import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Icon } from "../../../shared/components/icon";
import { headerStyles } from "../styles";
import { messages } from "../products-manage-messages";
import { translate } from "../../../config/i18n";
import { SortType, LIST_MODE } from "../../../config/constants/enum";
import { TEXT_EMPTY } from "../../../config/constants/constants";
import { drawerListSelectedSelector } from "../product-manage-selector";
import { useSelector } from "react-redux";
import { CommonStyles } from "../../../shared/common-style";

interface HeaderProductsProp {
  /**
   * change status edit
   */
  onEdit: () => void;
  /**
   * call api sort and change status sort
   */
  onSort: () => void;
  /**
   * open local tool modal
   */
  onOpenLocalTool: () => void;
  /**
   * check change icon edit
   */
  edit: boolean;
  /**
   * show amount products
   */
  count: number;
  /**
   * check change icon sort
   */
  sort: string;
  /**
   * last update date
   */
  date: any;
  /**
   * name of list
   */
  listName?: string;
  /**
   * is show icon other
   */
  isShowIconOther?: boolean;
}
/**
 * component product trading manage top
 * @param param0
 */
export const HeaderProductsManagement: React.FC<HeaderProductsProp> = ({
  onEdit,
  onSort,
  onOpenLocalTool,
  edit,
  count,
  sort,
  date,
  listName = TEXT_EMPTY,
  isShowIconOther = true,

}) => {

  const drawerListSelected = useSelector(drawerListSelectedSelector);

  return (
    <View style={headerStyles.containerHeader}>
      <View style={headerStyles.containerTitle}>
        <Text style={headerStyles.title}>
          {`${!!listName ? listName : translate(
            messages.productsManageAllTradingProducts
          )}(${count}${translate(messages.case)})`}
        </Text>
      </View>
      <View style={CommonStyles.rowSpaceBetween}>
        {
          drawerListSelected.listMode === LIST_MODE.auto ?
            < Text style={[headerStyles.txtTime]}>
              {`${translate(messages.productsManageLastUpdate)}: ${date}`}
            </Text>
            : <View />
        }
        <View style={CommonStyles.rowInline}>
          <TouchableOpacity
            style={!edit && headerStyles.iconStyle}
            onPress={onEdit}
          >
            <Icon name={edit ? "editActive" : "edit"} />
          </TouchableOpacity>
          <TouchableOpacity style={headerStyles.iconStyle} onPress={onSort}>
            <Icon name={sort === SortType.DESC ? "descending" : "ascending"} />
          </TouchableOpacity>
          {isShowIconOther && <TouchableOpacity style={headerStyles.iconStyle} onPress={onOpenLocalTool}>
            <Icon name="other" />
          </TouchableOpacity>
          }
        </View>

      </View>
    </View >
  );
};
