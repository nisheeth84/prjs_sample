import React from 'react';
import {
  // Alert as ShowError,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { createAddParticipantsStyles } from './styles';
import { Icon } from '../../icon';
import { TEXT_EMPTY } from '../../../../config/constants/constants';
import { LIST_TYPE } from '../../../../config/constants/enum';

const styles = createAddParticipantsStyles;
export interface BusinessItem {
  displayOrder: number | undefined;
  displayOrderFavoriteList: number | undefined;
  employeeName: string | undefined;
  employeeSurname: string | undefined;
  listId: number | undefined;
  customerListId: number | undefined;
  listName: string | undefined;
  customerListName: string | undefined;
  listType: number | undefined;
}
interface Props {
  item: any;
  onToggle: (item: BusinessItem) => void;
  selectedListItem: Array<BusinessItem>;
  isCustomer?: boolean;
}
export const ModalSuggestionItem = (props: Props) => {
  const { item, onToggle, selectedListItem, isCustomer = false } = props;
  const findItem = selectedListItem.some((elm: BusinessItem) =>
    isCustomer
      ? elm.customerListId === item.customerListId
      : elm.listId === item.listId
  );
  // const [checked, setChecked] = useState<boolean>(findItem);
  const toggleCheckItem = () => {
    onToggle(item);
    // setChecked(!checked);
  };

  return (
    <TouchableOpacity
      key={isCustomer ? item.customerListId : item.listId}
      style={styles.cardWrap}
      onPress={toggleCheckItem}
    >
      <View style={styles.asCenter}>
        {findItem ? (
          <Icon name="checkActive" style={styles.iconCheck} />
        ) : (
          <View style={styles.circleView} />
        )}
      </View>
      <View style={styles.nameWrap}>
        <Text numberOfLines={1}>
          {isCustomer ? item.customerListName : item.listName}
        </Text>
        {item.listType === LIST_TYPE.sharedList && (
          <Text numberOfLines={1} style={styles.txtEmployee}>
            {`${item.employeeSurname || TEXT_EMPTY} ${item.employeeName}`}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};
