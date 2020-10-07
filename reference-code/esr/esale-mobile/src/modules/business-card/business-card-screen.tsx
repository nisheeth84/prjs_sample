import * as React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Icon } from '../../shared/components/icon';
import { BusinessCardItem } from './business-card-item';
import { businessCardSelector } from './business-card-selector';
import { messages } from './business-card-messages';
import { translate } from '../../config/i18n';
import { BusinessCardStyles } from './business-card-style';

/**
 * Component for show list business card
 */
export function BusinessCardScreen() {
  const cards = useSelector(businessCardSelector);
  return (
    <View style={BusinessCardStyles.container}>
      <ScrollView>
        <View style={BusinessCardStyles.inforBlock}>
          <Text style={BusinessCardStyles.title}>
            {`${translate(messages.allEmployees)}:（100${translate(
              messages.person
            )}）`}
          </Text>
          <View style={BusinessCardStyles.fristRow}>
            <Text style={BusinessCardStyles.date}>
              {`${translate(messages.lastUpdate)}: 2019/07/28`}
            </Text>
            <View style={BusinessCardStyles.iconBlock}>
              <TouchableOpacity style={BusinessCardStyles.iconEditButton}>
                <Icon name="edit" />
              </TouchableOpacity>
              <TouchableOpacity style={BusinessCardStyles.iconFilterButton}>
                <Icon name="filterActive" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon
                  name="descending"
                  style={BusinessCardStyles.iconDescendingButton}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Icon name="other" style={BusinessCardStyles.iconOtherButton} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={BusinessCardStyles.listCard}>
          {cards.map((item: any) => {
            return (
              <BusinessCardItem
                key={item.id.toString()}
                avatarUrl={item.avatarUrl}
                name={item.name}
                role={item.role}
              />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
