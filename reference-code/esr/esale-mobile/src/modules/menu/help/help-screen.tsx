import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  SafeAreaView,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import images from '../../../../assets/icons';
import styles from './help-style';
import { FlatList } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';
import { translate } from '../../../config/i18n';
import { messages } from './help-messages';
import { category } from '../../../config/constants/enum';
import { getListPost, searchHelp } from './help-api';
import { TEXT_EMPTY } from '../../../config/constants/constants';
import { AppBarModal } from "../../../shared/components/appbar/appbar-modal";
import { useNavigation } from '@react-navigation/native';
import HTML from 'react-native-render-html';
import { AppIndicator } from '../../../shared/components/app-indicator/app-indicator';
import { baseUrlHelp } from './help-api';
import { HELP } from '../../../config/constants/enum';

/**
 * screen help
 */
export default function Help() {
  const { goBack } = useNavigation();
  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [isValue, setIsValue] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [htmlContent, setHtmlContent] = useState(TEXT_EMPTY);
  const [offset, setOffset] = useState(0);
  const [offsetSearch, setOffsetSearch] = useState(0);
  const [loadMoreStatus, setLoadMoreStatus] = useState(false);
  const [loadMoreStatusSearch, setLoadMoreStatusSearch] = useState(false);
  const [text, setText] = useState(TEXT_EMPTY);
  const [loading, setLoading] = useState(false);

  /**
   * call api get list help
   */
  const callApiGetListHelp = async () => {
    const response = await getListPost(HELP.LIMIT, offset);
    if( response.status === 200 ) {
      setData(response?.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    callApiGetListHelp();
    setOffset(0);
  }, []);

  /**
   * handle search whe user done enter value
   * @param searchValue
   */
  const handleSearch = async (searchValue: any) => {
   
      const response: any = await searchHelp(searchValue, HELP.LIMIT_SEARCH, offset);
      if (response?.status === 200) {
        setData(response?.data);
        setIsValue(false);
      } else {
        /**
         * display messages error
         */
      }
  
  };

  /**
   * 
   * @param searchValue 
   */
  const onChangeTextSearch = async (searchValue: any) => {
    if (searchValue) {
      setSearchValue(searchValue);
      const response: any = await searchHelp(searchValue, HELP.LIMIT_SEARCH, offset);
      if (response?.status === 200) {
        setDataSearch(response?.data);
        setIsValue(true);
        setLoadMoreStatus(false);
      } else {
        /**
         * display messages error
         */
      }
    } else {
      setSearchValue('');
      callApiGetListHelp();
    }
  }

  /**
   * Perform a search when the user is finished entering the value
   * @param event
   */
  const onEndEditing = (event: any) => {
    const searchValue = event?.nativeEvent?.text || TEXT_EMPTY;
    if (searchValue) {
      onChangeTextSearch(searchValue);
      setIsValue(false);
    } else {
      setIsValue(false);
      setOffset(0);
      callApiGetListHelp();
    }
  };
  /**
   * return image with categori
   * @param categories
   */
  const renderIcon = (categories: any) => {
    switch (categories) {
      case category.CALENDAR:
        return images.ic_calender;
      case category.TASK:
        return images.ic_task;
      case category.BUNSINESS:
        return images.ic_business_card;
      case category.PRODUCT:
        return images.ic_product;
    }
  };

  /**
   * object of a list, to show item
   * @param param0
   */
  const ItemList = ({ item }: any) => {
    return (
      <TouchableOpacity
        style={styles.containerItemButton}
        onPress={() => {
          setHtmlContent(item.content.rendered);
          setIsVisible(!isVisible);
          setText(item.title.rendered);
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Image
            source={renderIcon(item.categories[0])}
            style={{ marginRight: 10 }}
          />
          <Text>{item.title.rendered}</Text>
        </View>
        <Image source={images.ic_arrow_right} />
      </TouchableOpacity>
    );
  };
  /**
   * handle load more whe load data
   */
  async function handleLoadMore(){
    
    if(data.length < 10){
      setLoadMoreStatus(false);
    }else{
      setLoadMoreStatus(true);
    }

    if(loadMoreStatus){
      setOffset(offset + HELP.LIMIT);
      const response = await getListPost(HELP.LIMIT, offset + HELP.LIMIT) ;
      if(response.status === 200){ 
        if(response.data.length > 0){
          setData(data.concat(response.data))
        }
      }
        setLoadMoreStatus(false);
    }
  }

   /**
    * handle load more whe load data
    */
   async function handleLoadMoreSuggest(){
    if(dataSearch.length < 2) {
      setLoadMoreStatusSearch(false);
    }else{
      setLoadMoreStatusSearch(true);
    }
    setLoadMoreStatusSearch(true);
    if(loadMoreStatusSearch){
      setOffsetSearch(offsetSearch + HELP.LIMIT_SEARCH);
      const response = await searchHelp(searchValue, HELP.LIMIT_SEARCH, offset + HELP.LIMIT_SEARCH) ;
      if(response.status === 200){ 
        if(response.data.length > 0){
          setData(data.concat(response.data))
        }
      }
      setLoadMoreStatusSearch(false);
    }
  }

  const handleCloseModal = () => {
    setIsVisible(false);
     setText(TEXT_EMPTY);
  }

  const handleClickItem = (item: any) => {
      setHtmlContent(item.content.rendered);
      setIsVisible(!isVisible);
      setText(item.title.rendered);
  }
  /**
   * list suggest search
   */
  const SuggestList = () => {
    return (
          <View>
            {
              dataSearch.length > 0 ? (<FlatList
                data={dataSearch}
                style={styles.contaierSuggest}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={styles.containerItemSearchSugget}
                      onPress={() => handleClickItem(item)}
                    >
                      <View style={{ flexDirection: 'row' }}>
                        <Image
                          source={renderIcon(item.categories[0])}
                          style={{ marginRight: 10 }}
                        />
                        <Text>{item.title.rendered}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                }}
                keyExtractor={(item: any) => item.id.toString()}
                onEndReached={handleLoadMoreSuggest}
                 onEndReachedThreshold={0.1}
                 ListFooterComponent={loadMoreStatusSearch ? <ActivityIndicator /> : null}
              />) : (
                <View style={styles.containerSearcgContentNull}>
                  <Text>{translate(messages.dataBlank)}</Text>
                </View>
              )
            }
          </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <AppBarModal
          title={translate(messages.titleHeader)}
          onClose={() => goBack()}
        />
        <View style={styles.containerSearch}>
          <TouchableOpacity onPress={() => handleSearch(searchValue)}>
              <Image source={images.ic_search} style={{ marginHorizontal: 10 }} />
          </TouchableOpacity>
          <TextInput
            defaultValue={text ? text : searchValue}
            placeholder={translate(messages.placeholderSearchHelp)}
            style={styles.inputSearch}
            onChangeText={text => {onChangeTextSearch(text)}}
            onEndEditing={text => onEndEditing(text)}
          />
        </View>
        <View style={styles.containerContent}>
          {
            loading ? (<View style={styles.loading}>
              <AppIndicator />
            </View>) : null
          }
          {isValue && dataSearch.length > 0 ? <SuggestList /> : null}
          {data?.length > 0 ? (
              <FlatList
              data={data}
              renderItem={({ item }) => <ItemList item={item} />}
              keyExtractor={(item: any) => item.id.toString()}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.1}
              ListFooterComponent={loadMoreStatus ? <AppIndicator /> : null}
            />
          ) : (
            <View style={styles.containerContentNull}>
              {
                loading ? null : <Text>{translate(messages.dataBlank)}</Text>
              }
            </View>
          )}
          <TouchableOpacity
            style={styles.containerFooter}
            onPress={() => Linking.openURL(baseUrlHelp)}
          >
            <Text style={styles.textFooter}>
              {translate(messages.supportSite)}
            </Text>
            <Image source={images.ic_share} />
          </TouchableOpacity>
        </View>
        <Modal
          isVisible={isVisible}
          onBackdropPress={handleCloseModal}
          onBackButtonPress={handleCloseModal}
          style={styles.modal}
          backdropOpacity={0}
        >
          <ScrollView>
            <View style={styles.boxModal}>
              <HTML html={htmlContent}/>
            </View>
          </ScrollView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
