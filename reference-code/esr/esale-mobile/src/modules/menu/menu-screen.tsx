/* eslint-disable react/jsx-curly-newline */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect, useState } from 'react';
// import { Alert as ShowError } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import _ from 'lodash';
import { BackHandler } from 'react-native';
import { MenuInfo } from './menu-info';
import { MenuFeaturePopular } from './menu-feature-popular';
import { MenuFeatureOther } from './menu-feature-other';
import { MenuFeature } from './menu-feature';
import { MenuScreenStyles } from './menu-style';
import { menuActions } from './menu-feature-reducer';
import { Service } from './menu-type';
import {
  GetServiceOrderDataResponse,
  createServiceFavorite,
  createServiceOrder,
  deleteServiceFavorite,
  getCompanyName,
  getEmployee,
  getServiceFavorite,
  getServiceInfo,
  getServiceOrder,
} from './menu-feature-repository';

import {
  CompanyNameSelector,
  ServiceFavoriteSelector,
  ServiceInfoSelector,
  ServiceOrderSelector,
} from './menu-feature-selector';
import { AppBarMenu } from '../../shared/components/appbar/appbar-menu';
import { authorizationSelector } from '../login/authorization/authorization-selector';
import { menuSettingActions } from './menu-personal-settings/menu-settings-reducer';
import { ScreenName } from '../../config/constants/screen-name';

export function MenuScreen() {
  const [edit, changeStatusButton] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const serviceFavorite = useSelector(ServiceFavoriteSelector);
  const serviceInfo = useSelector(ServiceInfoSelector);
  const serviceOrder = useSelector(ServiceOrderSelector);
  const companyInfo = useSelector(CompanyNameSelector);
  const userInfo = useSelector(authorizationSelector);

  /**
   * handle back button
   */
  const handleBackButtonClick = () => {
    return navigation.isFocused();
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
    };
  }, []);

  /** show and hide edit feature */
  const onChangeMenu = () => {
    changeStatusButton(!edit);
  };
  /**
   * handle sort list
   * @param array
   * @param order
   * @param key
   */
  function mapOrder(array: Array<any>, order: Array<any>, key: string) {
    return order
      .map((c) => array.find((d) => d[key] === c[key]))
      .filter((c) => c);
    // array.sort((a, b) => {
    //   const A = order.findIndex((item) => item[key] == a[key]);
    //   const B = order.findIndex((item) => item[key] == b[key]);

    //   if (A - B) {
    //     return 1;
    //   }
    //   return -1;
    // });

    // return array;
  }
  /**
   * handle call api get service favorite
   * @param data
   */
  async function getDataServiceFavorite(
    data: Service[],
    dataOrder: Array<any>
  ) {
    const serviceFavoriteResponse = await getServiceFavorite(
      { employeeId: userInfo.employeeId },
      {}
    );

    if (serviceFavoriteResponse) {
      switch (serviceFavoriteResponse.status) {
        case 400: {
          alert('Bad request!');
          break;
        }
        case 500: {
          alert('Server error!');
          break;
        }
        case 403: {
          alert('You have not permission get Field Info Personals!');
          break;
        }
        case 200: {
          const listFavorite = [];
          const listOtherService = [];
          for (let i = 0; i < data.length; i++) {
            if (
              serviceFavoriteResponse.data.data.findIndex(
                (elm: any) => data[i].serviceId === elm.serviceId
              ) !== -1
            ) {
              listFavorite.push(data[i]);
            } else {
              listOtherService.push(data[i]);
            }
          }
          const listServiceFavorite = mapOrder(
            listFavorite,
            _.orderBy(dataOrder, 'serviceOrder', 'asc'),
            'serviceId'
          );
          dispatch(
            menuActions.getServiceFavorite({
              listServiceFavorite,
            })
          );
          dispatch(
            menuActions.getServiceInfo({
              listServiceInfo: mapOrder(
                listOtherService,
                _.orderBy(dataOrder, 'serviceOrder', 'asc'),
                'serviceId'
              ),
            })
          );
          if (listServiceFavorite && listServiceFavorite.length > 0) {
            onNavigateFeature(listServiceFavorite[0].serviceId);
          }
          break;
        }
        default: {
          alert('Error!');
        }
      }
    }
  }

  /**
   * call api  and handle data response createServiceOrder */

  async function callApiCreateServiceOrder(
    serviceInfo: Array<Service>,
    listServiceOrder: Array<any>
  ) {
    const dataCreateServiceOrder = serviceInfo.map((elm, index) => {
      return {
        serviceId: elm.serviceId,
        serviceName: elm.serviceName,
        serviceOrder: listServiceOrder.length + index + 1,
      };
    });

    const createServiceOrderResponse = await createServiceOrder(
      { employeeId: userInfo.employeeId, data: dataCreateServiceOrder },
      {}
    );

    if (createServiceOrderResponse) {
      switch (createServiceOrderResponse.status) {
        case 400: {
          alert('Bad request!');
          break;
        }
        case 500: {
          alert('Server error!');
          break;
        }
        case 403: {
          alert('You have not permission get Field Info Personals!');
          break;
        }
        case 200: {
          dispatch(menuActions.getServiceOrder(dataCreateServiceOrder));
          getDataServiceFavorite(
            serviceInfo,
            _.orderBy(listServiceOrder, 'serviceOrder', 'asc')
          );
          break;
        }
        default: {
          alert('Error!');
        }
      }
    }
  }

  /**
   * handle response api get service order */
  const handleErrorGetServiceOrder = (
    response: GetServiceOrderDataResponse,
    dataServiceInfo: Array<Service>
  ) => {
    switch (response.status) {
      case 400: {
        alert('Bad request!');
        break;
      }
      case 500: {
        alert('Server error!');
        break;
      }
      case 403: {
        alert('You have not permission get Field Info Personals!');
        break;
      }
      case 200: {
        if (response.data.data.length > 0) {
          dispatch(
            menuActions.getServiceOrder(
              _.orderBy(response.data.data, 'serviceOrder', 'asc')
            )
          );

          if (dataServiceInfo.length > response.data.data.length) {
            const newDataCreateServiceOrder: Service[] = [];
            dataServiceInfo.forEach((elm) => {
              if (
                response.data.data.findIndex((item) => {
                  return elm.serviceId === item.serviceId;
                }) === -1
              ) {
                newDataCreateServiceOrder.push(elm);
              }
            });
            callApiCreateServiceOrder(
              newDataCreateServiceOrder,
              response.data.data
            );
          }
          getDataServiceFavorite(
            dataServiceInfo,
            _.orderBy(response.data.data, 'serviceOrder', 'asc')
          );
        } else {
          callApiCreateServiceOrder(dataServiceInfo, response.data.data);
        }
        break;
      }
      default: {
        alert('Error!');
      }
    }
  };
  /**
   * call api getServiceOrder
   * @param data
   */
  async function getDataServiceOrder(data: Array<Service>) {
    const newArrayParams = data.map((elm) => {
      return { serviceId: elm.serviceId };
    });
    const params = {
      employeeId: userInfo.employeeId,
      data: newArrayParams,
    };
    const serviceOrderResponse = await getServiceOrder(params, {});
    if (serviceOrderResponse) {
      handleErrorGetServiceOrder(serviceOrderResponse, data);
    }
  }

  /**
   * handle navigate screen
   * @param serviceId
   */
  const handleScreen = (serviceId: number) => {
    switch (serviceId) {
      case 1:
        return 'menu';
      case 2:
        return ScreenName.CALENDAR;
      case 3:
        return ScreenName.TIMELINE_SCREEN;
      case 4:
        return ScreenName.BUSINESS_CARD;
      case 5:
        return ScreenName.CUSTOMER;
      case 6:
        return ScreenName.ACTIVITY_LIST;
      case 8:
        return ScreenName.EMPLOYEE;
      case 14:
        return ScreenName.PRODUCT;
      case 15:
        return ScreenName.LIST_TASK;
      case 16:
        return ScreenName.PRODUCT_MANAGE;
      case 17:
        return ScreenName.FEEDBACK_SCREEN;
      case 31:
        return 'menu';
      default:
        return 'menu';
    }
  };
  /**
   * call api to get company name, employee icon, service favorite, service info
   */
  useEffect(() => {
    Promise.all([
      getCompanyName({ tenantName: userInfo.tenantId }, {}),
      getEmployee({ employeeId: userInfo.employeeId }, {}),
      getServiceFavorite({ employeeId: userInfo.employeeId }, {}),
      getServiceInfo({ serviceType: null }),
    ])
      .then((values) => {
        if (
          values.findIndex((elm) => {
            return elm.status !== 200;
          }) !== -1
        ) {
          alert('error');
        }

        dispatch(menuSettingActions.getEmployee({ data: values[1].data.data }));
        dispatch(
          menuActions.getCompanyName({
            companyName: values[0].data,
          })
        );
        getDataServiceOrder(values[3].data.servicesInfo);
      })
      .catch();
  }, []);

  /**
   * navigate feature
   * @param data ;
   */
  const onNavigateFeature = (serviceId: number) => {
    navigation.navigate(handleScreen(serviceId));
  };
  /**
   * add feature favorite
   * @param data ;
   */
  const onAddServiceFavorite = async (data: Service) => {
    const createServiceFavoriteResponse = await createServiceFavorite(
      {
        employeeId: userInfo.employeeId,
        serviceId: data.serviceId,
        serviceName: data.serviceName,
      },
      {}
    );
    if (createServiceFavoriteResponse) {
      switch (createServiceFavoriteResponse.status) {
        case 400: {
          alert('Bad request!');
          break;
        }
        case 500: {
          alert('Server error!');
          break;
        }
        case 403: {
          alert('You have not permission get Field Info Personals!');
          break;
        }
        case 200: {
          const newListServiceFavorite = [...serviceFavorite, data];
          const newListServiceOther = serviceInfo.filter((item) => {
            return item.serviceName !== data.serviceName;
          });

          dispatch(
            menuActions.getServiceFavorite({
              listServiceFavorite: mapOrder(
                newListServiceFavorite,
                serviceOrder,
                'serviceId'
              ),
            })
          );

          dispatch(
            menuActions.getServiceInfo({
              listServiceInfo: mapOrder(
                newListServiceOther,
                serviceOrder,
                'serviceId'
              ),
            })
          );

          break;
        }
        default: {
          alert('Error!');
        }
      }
    }
  };

  /**
   * remove feature
   * @param data ;
   */
  const onRemoveFeature = async (data: Service) => {
    const deleteServiceFavoriteResponse = await deleteServiceFavorite(
      {
        employeeId: userInfo.employeeId,
        serviceId: data.serviceId,
      },
      {}
    );
    if (deleteServiceFavoriteResponse) {
      switch (deleteServiceFavoriteResponse.status) {
        case 400: {
          alert('Bad request!');
          break;
        }
        case 500: {
          alert('Server error!');
          break;
        }
        case 403: {
          alert('You have not permission get Field Info Personals!');
          break;
        }
        case 200: {
          const newListServiceFavorite = serviceFavorite.filter((item) => {
            return item.serviceName !== data.serviceName;
          });
          const newListServiceOther = [...serviceInfo, data];
          dispatch(
            menuActions.getServiceFavorite({
              listServiceFavorite: mapOrder(
                newListServiceFavorite,
                serviceOrder,
                'serviceId'
              ),
            })
          );
          dispatch(
            menuActions.getServiceInfo({
              listServiceInfo: mapOrder(
                newListServiceOther,
                serviceOrder,
                'serviceId'
              ),
            })
          );
          break;
        }
        default: {
          alert('Error!');
        }
      }
    }
  };

  return (
    <>
      <AppBarMenu isMenu name="menu" />
      <ScrollView style={MenuScreenStyles.container}>
        <MenuInfo
          onEmployees={() =>
            navigation.navigate('detail-employee', {
              id: userInfo.employeeId,
              title: userInfo.employeeName,
            })
          }
          companyName={companyInfo.companyName}
        />

        <MenuFeaturePopular
          featuresPopular={serviceFavorite}
          onChangeMenu={onChangeMenu}
          onSelectFeature={(data) =>
            edit
              ? onRemoveFeature(data)
              : onNavigateFeature(data.serviceId || 0)
          }
        />
        <MenuFeatureOther
          disable={serviceFavorite.length >= 4}
          featuresOther={serviceInfo}
          edit={edit}
          onSelect={(data) =>
            edit
              ? onAddServiceFavorite(data)
              : onNavigateFeature(data.serviceId || 0)
          }
        />
        <MenuFeature />
      </ScrollView>
    </>
  );
}
