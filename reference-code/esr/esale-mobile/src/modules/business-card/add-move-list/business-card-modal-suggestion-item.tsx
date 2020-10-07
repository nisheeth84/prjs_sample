import React, { useState } from "react";
import {
  // Alert as ShowError,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createAddParticipantsStyles } from "./business-card-creation-style";
import { translate } from "../../../config/i18n";
import { messages as messages2 } from "./business-card-add-move-list-messages";
import { Icon } from "../../../shared/components/icon";

const styles = createAddParticipantsStyles;
export interface BusinessItem {
  displayOrder: number | undefined;
  displayOrderFavoriteList: number | undefined;
  employeeName: string | undefined;
  employeeSurname: string | undefined;
  listId: number | undefined;
  listName: string | undefined;
  listType: number | undefined;
}
interface Props {
  item: BusinessItem;
  title: string;
  onToggle: (item: BusinessItem) => void;
  selectedListItem: Array<BusinessItem>;
}
const BusinessCardModalSuggestionItem = (props: Props) => {
  // const authState = useSelector(authorizationSelector);
  const { item, title, onToggle, selectedListItem } = props;
  const findItem = selectedListItem?.some(
    (elm: BusinessItem) => elm.listId === item.listId
  );
  const [checked, setChecked] = useState<boolean>(findItem);
  const toggleCheckItem = () => {
    onToggle(item);
    setChecked(!checked);
  };
  
  return (
    <View key={item.listId} style={styles.cardWrap}>
      <TouchableOpacity style={styles.asCenter} onPress={toggleCheckItem}>
        {checked ? (
          <Icon name="checkActive" style={styles.iconCheck} />
        ) : (
          <View style={styles.circleView} />
        )}
      </TouchableOpacity>
      <View style={styles.nameWrap}>
        <Text>{item.listName}</Text>
        {title === translate(messages2.favoriteList) && (
          <Text key={item.listId}>
            {`${item.employeeSurname} ${item.employeeName}`}
          </Text>
        )}
      </View>
    </View>
  );
};
export default BusinessCardModalSuggestionItem;
