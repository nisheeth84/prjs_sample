import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BusinessCardShareItemStyles } from "./business-card-creation-style";
import { Icon } from "../../../shared/components/icon";
import { messages } from "./business-card-creation-messages";
import { translate } from "../../../config/i18n";

const styles = BusinessCardShareItemStyles;

interface BusinessItemProps {
  // position of card
  position: string;
  // department of card
  department: string;
  // species of card
  species: string;
  // to show/hide modal
  showModal: () => void;
  // id of card
  id: number;
  // to show/hide index

  onPress: () => void;
    // delete item press
    onDeletePress: () => void;
}

/**
 * Component show business card item
 * @param param0
 */
export const BusinessCardItem: React.FC<BusinessItemProps> = ({
  position,
  department,
  species,
  showModal = () => {},
  id,
  onPress = () => {},
  onDeletePress = () => {},
}) => {
  const modalShow = () => {
    showModal();
    onPress();
  };
  return (
    <View style={styles.viewInfo}>
      <View style={styles.viewAva}>
        <View style={id % 2 === 0 ? styles.avatav1 : styles.avatav2}>
          <Text>{translate(messages.company)}</Text>
        </View>
      </View>
      <View style={styles.viewBtn}>
        <View style={styles.viewTxt}>
          <Text style={styles.txtDepartment}>{department}</Text>
          <Text style={styles.txtPosition}>{position}</Text>
        </View>
        <View style={styles.species}>
          <TouchableOpacity style={styles.btn} onPress={modalShow}>
            <Text style={styles.txtSpecies}>{species}</Text>
            <Icon name="arrowDown" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.icon} onPress={onDeletePress}>
        <Icon name="delete" />
      </TouchableOpacity>
    </View>
  );
};
