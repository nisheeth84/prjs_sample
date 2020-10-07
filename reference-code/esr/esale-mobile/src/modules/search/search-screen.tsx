import React, { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { styles } from './search-styles';
import { translate } from '../../config/i18n';
import { messages } from './search-messages';
import { messages as responseMessage } from '../../shared/messages/response-messages';
// import { Icon } from "../../shared/components/icon";
import { LocalSearch } from '../../shared/components/local-search/local-search';
import { CallSearchAll, CallSearchToScreen } from './search-handle';
import { ItemSearch } from './search-component-item';
import {
  Activities,
  BusinessCardSuggestionsGlobal,
  // CustomerSuggestionsGlobal,
  // EmployeeSuggestionsGlobal,
  // ProductSuggestionsGlobal,
  ReportSuggestionsGlobal,
  ScheduleSuggestionsGlobal,
  TaskSuggestionsGlobal,
  TimelineSuggestionsGlobal,
  searchConditionsSelector,
  // GetEmployees,
} from './search-selector';
import { TEXT_EMPTY } from '../../config/constants/constants';
// import { ListEmptyComponent } from "../../shared/components/list-empty/list-empty";
import { SearchActions } from './search-reducer';
import { EmployeeItem } from '../employees/list/employee-list-item';
import { ProductItem } from '../products/list/product-list-item';
import { ActivityIndicatorLoading } from '../../shared/components/indicator-loading/activity-indicator-loading';
import { isEmpty, filter, findIndex } from 'lodash';
import {
  ServiceInfoSelector,
  ServiceFavoriteSelector,
} from '../menu/menu-feature-selector';
import { SvgCssUri } from 'react-native-svg';
import { apiUrl } from '../../config/constants/api';
import { authorizationSelector } from '../login/authorization/authorization-selector';
import StringUtils from '../../shared/util/string-utils';
import { CustomerItem } from '../customer/list/customer-list-item';
import { ProductTradingItem } from '../../shared/components/product-trading-item';

export function SearchGlobal() {
  const route: any = useRoute();
  const [keyWord, setKeyWord] = React.useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [nameService] = useState(route?.params?.nameService);
  const [result, setResult] = useState<any[]>([]);
  const [resultSearchAll, setResultSearchAll] = useState<any>();
  const [isPressSearch, setIsPressSearch] = useState(false);
  const [offSet, setOffSet] = useState(0);
  const [isNoData, setIsNoData] = useState(false);
  const [footerIndicator, setFooterIndicator] = useState(true);
  const [refreshData, setRefreshData] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const employees = useSelector(authorizationSelector);
  const searchConditions = useSelector(searchConditionsSelector);
  const resultCalendar = useSelector(ScheduleSuggestionsGlobal);
  const resultTimeline = useSelector(TimelineSuggestionsGlobal);
  const resultBusiness = useSelector(BusinessCardSuggestionsGlobal);
  // const resultCustomer = useSelector(CustomerSuggestionsGlobal);
  const resultActivities = useSelector(Activities);
  // const resultEmployees = useSelector(EmployeeSuggestionsGlobal);
  const resultAnalysis = useSelector(ReportSuggestionsGlobal);
  // const resultProducts = useSelector(ProductSuggestionsGlobal);
  const resultTask = useSelector(TaskSuggestionsGlobal);
  const serviceInfo = useSelector(ServiceInfoSelector);
  const NAME_SERVICER = route?.params?.nameService;
  const [keyOptions, setKeyOptions] = React.useState(
    NAME_SERVICER === 'menu' ? 2 : 1
  );
  const [isLoading, setIsLoading] = useState(false);
  const [fistOnScreen, setFistOnScreen] = useState(-1);
  const serviceFavorite = useSelector(ServiceFavoriteSelector);
  const LIMIT = 5;
  const LIMIT_LOCAL = 30;
  // const products: Array<any> = useSelector(productsSelector);
  // const employees = useSelector(GetEmployees);

  const onOptions = async (key: number) => {
    setKeyOptions(key);
    onSearchNavigation(NAME_SERVICER, 0, key);
    setIsLoading(true);
  };

  /**
   * Call search when use stop typing 2s
   */
  useEffect(() => {
    const timeout = setTimeout(async () => {
      onSearchNavigation(NAME_SERVICER, 0, keyOptions);
      setFistOnScreen(Number(fistOnScreen) + 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [keyWord]);

  /**
   * setNameService get key name for service
   */

  useEffect(() => {
    return () => {
      setResult([]);
      setKeyOptions(1);
      setKeyWord('');
      dispatch(SearchActions.getSearchConditions(null));
    };
  }, []);

  // const handleError = (response: any) => {
  //   // switch (response.status) {
  //   //   case 201: {
  //   //     break;
  //   //   }
  //   //   default: {
  //   //     break;
  //   //   }
  //   // }
  //   if (response) {
  //     dispatch(SearchActions.getDataSearch(response));
  //   }
  // };

  function checkParams(navigationLocal: string, offset: number) {
    const params = {
      searchLocal: keyWord,
      limit: 5,
      isOnlyData: true,
    };
    const paramProducts = {
      searchConditions: searchConditions || [],
      searchLocal: keyWord,
      orderBy: [],
      offset,
      isOnlyData: true,
      filterConditions: [],
      limit: LIMIT_LOCAL,
    };
    const paramEmployees = {
      orderBy: [],
      limit: LIMIT_LOCAL,
      selectedTargetId: 0,
      selectedTargetType: 0,
      offset,
      filterConditions: [],
      searchConditions: searchConditions || [],
      localSearchKeyword: keyWord,
    };
    if (navigationLocal === 'employees') {
      return paramEmployees;
    }
    if (navigationLocal === 'products') {
      return paramProducts;
    }
    if (navigationLocal === 'customers') {
      return {
        filterConditions: [],
        isUpdateListView: false,
        limit: 30,
        localSearchKeyword: keyWord,
        offset: 0,
        orderBy: [],
        searchConditions: searchConditions || [],
        selectedTargetId: 0,
        selectedTargetType: 0,
      };
    }
    if (navigationLocal === 'productTrading') {
      return {
        filterConditions: [],
        isFirstLoad: false,
        isOnlyData: true,
        limit: 30,
        offset: 0,
        orders: [],
        searchConditions: searchConditions || [],
        searchLocal: keyWord,
        selectedTargetId: 0,
        selectedTargetType: 0,
      };
    }
    return params;
  }

  useEffect(() => {
    if (searchConditions !== null) {
      onSearchNavigation(NAME_SERVICER, 0, keyOptions);
      setIsLoading(true);
      setFistOnScreen(Number(fistOnScreen) + 1);
    }
  }, [searchConditions]);

  function concatData(resultSearch: any, resultState: any[], value: string) {
    const dataSearch = filter(
      resultState.concat(resultSearch),
      (item: any, index: any, self: any) => {
        return (
          findIndex(self, (data: any) => data[value] === item[value]) === index
        );
      }
    );
    return dataSearch;
  }

  async function onSearchNavigation(name: string, offset: number, key: number) {
    setOffSet(offset);
    setIsPressSearch(true);
    let resultState = result;
    if (offset === 0) {
      setIsLoading(true);
      resultState = [];
    }
    if (key === 1) {
      let resultSearch = await CallSearchToScreen(
        name,
        checkParams(name, offset),
        dispatch
      );
      if (!isEmpty(resultSearch)) {
        setIsNoData(false);
      }
      if (name === 'calendar') {
        setResult(resultCalendar);
      }
      if (name === 'timeline') {
        setResult(resultTimeline);
      }
      if (name === 'businessCard') {
        setResult(resultBusiness);
      }
      if (name === 'customers') {
        // setResult(resultCustomer);
        if (resultSearch.totalRecords >= resultState?.length) {
          setResult(
            concatData(resultSearch?.customers, resultState, 'customerId')
          );
        }
      }
      if (name === 'activities') {
        setResult(resultActivities);
      }
      if (name === "employees") {
        if (resultSearch && resultSearch.totalRecords >= resultState?.length) {
          setResult(concatData(resultSearch?.employees, resultState, 'employeeId'));
        } else {
          setResult(resultState);
        }
        setTotalCount(resultSearch.totalRecords);
      }
      if (name === 'analysis') {
        setResult(resultAnalysis);
      }
      if (name === 'products') {
        if (resultSearch.totalCount >= resultState?.length) {
          setResult(
            concatData(
              resultSearch?.dataInfo?.products,
              resultState,
              'productId'
            )
          );
        }
        setTotalCount(resultSearch?.totalCount);
      }
      if (name === 'task') {
        setResult(resultTask);
      }
      if (name === 'productTrading') {
        if (resultSearch.total >= resultState?.length) {
          setResult(
            concatData(
              resultSearch?.productTradings,
              resultState,
              'productTradingId'
            )
          );
        }
        setTotalCount(resultSearch?.total);
      }
    }
    setResultSearchAll({});
    if (key === 2 && keyWord != TEXT_EMPTY) {
      const params = {
        searchValue: keyWord,
        limit: LIMIT,
        offset: 0,
      };
      setIsLoading(true);
      const resultAll = await CallSearchAll(params, dispatch);
      setResultSearchAll(resultAll);
      // setIsLoading(false);
      // setResult([]);
    }
    setIsLoading(false);
    setFooterIndicator(false);
    setRefreshData(false);
  }

  /**
   * render search bar
   */
  function renderBoxSearch() {
    return (
      <View style={styles.boxSearch}>
        <View style={styles.search}>
          <LocalSearch
            placeholder={translate(messages.searchHolder)}
            onChangeText={(txt) => {
              setKeyWord(txt);
            }}
            value={keyWord}
            isOptions={keyOptions === 1}
            onSearch={() => onSearchNavigation(NAME_SERVICER, 0, keyOptions)}
            onDetailPress={() => {
              navigation.navigate('detail-search', {
                nameService: nameService || TEXT_EMPTY,
              });
            }}
            autoFocus={true}
          />
        </View>
        <View style={styles.cancel}>
          <TouchableOpacity onPress={handlePressBack}>
            <Text style={styles.txtCancel}>{translate(messages.cancel)}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  /**
   * handle back screen
   */
  const handlePressBack = () => {
    dispatch(SearchActions.getSearchConditions([]));
    setResult([]);
    setKeyOptions(1);
    setKeyWord('');
    navigation.goBack();
  };

  function handleNameBtn() {
    switch (NAME_SERVICER) {
      case 'calendar': {
        return `${translate(messages.searchCalendar)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'timeline': {
        return `${translate(messages.searchTimeline)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'businessCard': {
        return `${translate(messages.searchBusinessCard)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'customers': {
        return `${translate(messages.searchCustomers)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'activities': {
        return `${translate(messages.searchActivities)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'employees': {
        return `${translate(messages.searchEmployees)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'analysis': {
        return `${translate(messages.searchAnalysis)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'products': {
        return `${translate(messages.searchProducts)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'task': {
        return `${translate(messages.searchTask)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      case 'productTrading': {
        return `${translate(messages.searchProductTrading)}${translate(
          messages.searchTitleSearchFor
        )}`;
      }
      default:
        return translate(messages.searchWithinCustomer);
    }
  }

  /**
   * render options search [custom, all]
   */
  function renderOptions() {
    const key = [1, 2];
    return (
      <View style={styles.options}>
        {NAME_SERVICER !== 'menu' && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onOptions(key[0])}
            style={[
              styles.btnOptionsLeft,
              keyOptions === 1
                ? styles.btnOptionsChoose
                : styles.btnOptionsNotChoose,
            ]}
          >
            <Text
              style={[
                keyOptions === 1
                  ? styles.btnTxtNormalBlue
                  : styles.btnTxtNormal,
              ]}
            >
              {handleNameBtn()}
            </Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => onOptions(key[1])}
          style={[
            styles.btnOptionsRight,
            keyOptions === 2
              ? styles.btnOptionsChoose
              : styles.btnOptionsNotChoose,
            NAME_SERVICER === 'menu' && styles.btnOptionsMenu,
          ]}
        >
          <Text
            style={
              keyOptions === 1 ? styles.btnTxtNormal : styles.btnTxtNormalBlue
            }
          >
            {translate(messages.searchAll)}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  function renderListSearchAll() {
    return (
      <ScrollView style={styles.listResultAll}>
        {resultSearchAll?.employeeSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.employeeId} type="employees" data={i} />
        ))}
        {resultSearchAll?.productSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.productId} type="products" data={i} />
        ))}
        {resultSearchAll?.scheduleSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.scheduleId} type="calendar" data={i} />
        ))}
        {resultSearchAll?.timelineSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.timelineId} type="timeline" data={i} />
        ))}
        {resultSearchAll?.businessCardSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.businessCardId} type="businessCard" data={i} />
        ))}
        {resultSearchAll?.customerSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.customerId} type="customers" data={i} />
        ))}
        {resultSearchAll?.activities?.map((i: any) => (
          <ItemSearch key={i.activityId} type="activities" data={i} />
        ))}
        {resultSearchAll?.reportSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.reportId} type="analysis" data={i} />
        ))}
        {resultSearchAll?.taskSuggestionsGlobal?.map((i: any) => (
          <ItemSearch key={i.taskId} type="task" data={i} />
        ))}
        {resultSearchAll?.productTradingSuggestionsGlobal?.map((i: any) => (
          <ItemSearch
            key={i.productsTradingsId}
            type="productTrading"
            data={i}
          />
        ))}
      </ScrollView>
    );
  }

  function renderFormItem(i: any) {
    switch (NAME_SERVICER) {
      case 'employees':
        return (
          <EmployeeItem
            employeeId={i.item.employeeId}
            avatarUrl={i.item.employeeIcon?.fileUrl}
            dataDisplay={{ employee: i.item }}
            onItemClick={(employeeId) =>
              navigation.navigate('detail-employee', {
                id: employeeId,
                title: `${i.item.employeeSurname} ${i.item.employeeName || ''}`,
              })
            }
          />
        );

      case 'products':
        return (
          <ProductItem
            productId={i.item.productId}
            key={i?.item?.productId?.toString()}
            productName={i.item.productName}
            unitPrice={i.item.unitPrice}
            productImagePath={i.item.productImagePath}
            productCategoryName={i.item.productCategoryName}
            isSet={i.item.isSet}
          />
        );
      case 'customers':
        return (
          <CustomerItem
            key={i?.item?.customerId}
            data={i?.item}
            index={i?.index}
          />
        );
      case 'productTrading': 
      const tradingItem = i.item;
      return(
        <ProductTradingItem
          item={tradingItem}
          index={i.index}
        />
      )
      default:
        return <ItemSearch type={nameService} data={i.item} />;
    }
  }

  /**
   * Render ActivityIndicator
   * @param animating
   */
  const renderActivityIndicator = (animating: boolean) => {
    if (!animating) return null;
    return (
      <ActivityIndicator
        style={{ padding: 5, marginTop: '15%' }}
        animating={animating}
        size="large"
      />
    );
  };
  function renderResultEmpty() {
    let serviceId = 0;
    switch (NAME_SERVICER) {
      case 'employees':
        serviceId = 8;
        break;
      case 'products':
        serviceId = 14;
        break;
      default:
        break;
    }
    let service = serviceFavorite.find(
      (item: any) => item.serviceId.toString() === serviceId.toString()
    );
    !service &&
      (service = serviceInfo.find(
        (item: any) => item.serviceId.toString() === serviceId.toString()
      ));
    return (
      service && (
        <View style={styles.viewEmpty}>
          {service.iconPath ? (
            <View style={styles.viewIcon}>
              <SvgCssUri
                uri={`${apiUrl}${service.iconPath}`}
                width="100%"
                height="100%"
              />
            </View>
          ) : (
            <View />
          )}
          <Text style={styles.textEmpty}>
            {translate(responseMessage.INF_COM_0019).replace(
              '{0}',
              StringUtils.getFieldLabel(
                service,
                'serviceName',
                employees.languageCode
              )
            )}
          </Text>
        </View>
      )
    );
  }
  /**
   * render result search
   */
  function renderListSearch() {
    return (
      <View style={styles.searchContainer}>
        <View style={styles.line} />
        {keyOptions === 1 ? (
          result?.length > 0 && !isLoading ? (
            <FlatList
              data={result}
              renderItem={(i) => (
                <View style={styles.itemContent}>{renderFormItem(i)}</View>
              )}
              onEndReached={() => {
                if (!isNoData && offSet <= totalCount) {
                  setFooterIndicator(true);
                  setIsNoData(true);
                  onSearchNavigation(
                    NAME_SERVICER,
                    offSet + LIMIT_LOCAL,
                    keyOptions
                  );
                }
              }}
              initialNumToRender={30}
              onEndReachedThreshold={0.1}
              refreshControl={
                <RefreshControl
                  refreshing={refreshData}
                  onRefresh={() => {
                    setRefreshData(true);
                    onSearchNavigation(NAME_SERVICER, 0, keyOptions);
                  }}
                />
              }
              ListFooterComponent={renderActivityIndicator(footerIndicator)}
              style={styles.listResult}
              extraData={result}
              contentContainerStyle={styles.contentContainerStyle}
              // keyExtractor={}
            />
          ) : (
            <View>
              {isLoading
                ? ActivityIndicatorLoading(isLoading)
                : renderResultEmpty()}
            </View>
          )
        ) : isLoading ? (
          <View style={{ flex: 1, paddingTop: '5%' }}>
            {ActivityIndicatorLoading(isLoading)}
          </View>
        ) : (
          renderListSearchAll()
        )}
      </View>
    );
  }

  function renderFistScreen() {
    return (
      <View style={styles.fistScreen}>
        <Text>{translate(messages.searchNotData)}</Text>
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <SafeAreaView style={styles.container}>
        {renderBoxSearch()}
        {renderOptions()}
        {fistOnScreen > 0
          ? isPressSearch && renderListSearch()
          : renderFistScreen()}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
