import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Header } from '../../header';
import { Icon } from '../../icon';
import { translate } from '../../../../config/i18n';
import { AddMoveToListStyles } from './styles';
import { messages } from './add-move-list-messages';
import { theme } from '../../../../config/constants';
import { ModalBusinessCardSearch } from '../modal-business-card-search';
import { CommonMessage } from '../../message/message';
import { TypeMessage } from '../../../../config/constants/enum';
import { ModalOption } from '../../modal-option';
import { responseMessages } from '../../../messages/response-messages';
import { messages as messagesModal } from '../../modal/modal-messages';

const styles = AddMoveToListStyles;

interface AddMoveToListInterface {
  // api url of suggest list
  apiUrl: string;
  // number of records
  record?: number;
  // check is add screen
  isAddScreen?: boolean;
  // handle press header right button
  onRightPress: (item: any[]) => void;
  // content message
  contentMessage?: string;
  // type message
  typeMessage?: string;
  // is show message
  isShowMessage?: boolean;
  // is customer
  isCustomer?: boolean;
}

/**
 * Component show add or move record to list
 */
export const AddMoveToListScreen = ({
  apiUrl = '',
  record = 0,
  onRightPress = () => {},
  isAddScreen = true,
  contentMessage = '',
  typeMessage = TypeMessage.INFO,
  isShowMessage = false,
  isCustomer = false,
}: AddMoveToListInterface) => {
  const [modalBusinessCardSearch, setModalBusinessCardSearch] = useState(false);
  const [isVisibleDirtyCheck, setIsVisibleDirtyCheck] = useState(false);
  const navigation = useNavigation();
  const [listSelected, setListSelected] = useState<any>([]);
  // const [validate, setValidate] = useState(false);

  /**
   * toggle ModalBusinessCardSearch
   */
  const toggleModalBusinessCardSearch = () => {
    setModalBusinessCardSearch(!modalBusinessCardSearch);
  };

  /**
   *
   * @param data
   */
  const onConfirmData = (data: any) => {
    if (data) {
      setListSelected(data);
    }
    toggleModalBusinessCardSearch();
  };

  /**
   * remove listSelected
   * @param item
   */
  const removeListSelected = () => {
    setListSelected([]);
  };

  /**
   * handle back
   */
  const handleBack = () => {
    if (listSelected.length > 0) {
      setIsVisibleDirtyCheck(true);
    } else {
      navigation.goBack();
    }
  };

  /**
   * handle list
   */
  const handleList = () => {
    // if (listSelected.length === 0) {
    //   setValidate(true);
    // } else {
    //   setValidate(false);
    onRightPress(listSelected);
    // }
  };

  return (
    <View style={styles.container}>
      <Header
        title={
          isAddScreen
            ? translate(messages.titleAdd)
            : translate(messages.titleMove)
        }
        nameButton={translate(messages.btnHeader)}
        onLeftPress={handleBack}
        onRightPress={handleList}
        rightContainerStyle={{
          backgroundColor: theme.colors.blue200,
        }}
        textBold={true}
        leftIconStyle={styles.leftIcon}
      />
      {(record > 0 || isShowMessage) && (
        <View style={styles.warning}>
          {record > 0 && (
            <CommonMessage
              content={translate(messages.warningList).replace("{0}", record.toString())}
              type={TypeMessage.INFO}
            />
          )}
          {isShowMessage && (
            <>
              <View style={{ height: 4 }} />
              <CommonMessage content={contentMessage} type={typeMessage} />
            </>
          )}
        </View>
      )}
      <View style={[styles.viewFragment]}>
        <View style={styles.paddingTxtInput}>
          <View style={styles.directionRow}>
            <Text style={[styles.txt, styles.bold]}>
              {translate(messages[isAddScreen ? 'listToAdd' : 'listToMove'])}{' '}
            </Text>
          </View>
          <View style={styles.padding} />
          <TouchableOpacity
            onPress={toggleModalBusinessCardSearch}
            style={[styles.paddingBtn]}
          >
            <Text style={styles.txtPlaceholder}>
              {translate(
                messages[
                  isAddScreen ? 'placeholderListToAdd' : 'placeholderListToMove'
                ]
              )}
            </Text>
          </TouchableOpacity>
          {/* {validate && (
            <Text style={{ color: 'red' }}>{translate(messages.validate)}</Text>
          )} */}
        </View>
        <FlatList
          data={listSelected}
          extraData={listSelected}
          renderItem={({ item }: any) => {
            return (
              <View style={styles.viewItemSelected}>
                <Text style={styles.txt}>
                  {isCustomer ? item.customerListName : item.listName}
                </Text>
                <TouchableOpacity
                  style={styles.viewIcon}
                  onPress={() => removeListSelected()}
                >
                  <Icon name="close" />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={(_, index) => index.toString()}
        />
      </View>
      <ModalBusinessCardSearch
        visible={modalBusinessCardSearch}
        onConfirm={onConfirmData}
        apiUrl={apiUrl}
        isCustomer={isCustomer}
        list={listSelected}
        placeholder={translate(
          messages[
            isAddScreen ? 'placeholderListToAdd' : 'placeholderListToMove'
          ]
        )}
      />
      <ModalOption
        visible={isVisibleDirtyCheck}
        titleModal={translate(messagesModal.titleButtonBack)}
        contentModal={translate(responseMessages.WAR_COM_0007)}
        contentBtnFirst={translate(messagesModal.buttonStayOnThisPage)}
        contentBtnSecond={translate(messagesModal.buttonLeaveThisPage)}
        closeModal={() => setIsVisibleDirtyCheck(false)}
        onPressFirst={() => setIsVisibleDirtyCheck(false)}
        onPressSecond={() => navigation.goBack()}
        contentStyle={styles.modalOption}
      />
    </View>
  );
};
