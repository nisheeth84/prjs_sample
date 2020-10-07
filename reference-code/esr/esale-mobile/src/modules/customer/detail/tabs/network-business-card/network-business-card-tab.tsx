import React, { FC, useState, useEffect } from "react";
import { 
  Alert, View, Text, TouchableOpacity, SafeAreaView
 } from "react-native";

import { NetworkBusinessCardStyle } from "./network-business-card-style";
import { Icon } from "../../../../../shared/components/icon";
import { CustomerDetailScreenStyles } from "../../customer-detail-style";
import { NetworkBusinessCardItem } from "./network-business-card-item";
import { getNetworkMap, NetworkBusinessCardResponse, DepartmentData } from "./network-business-card-repository";
import { useSelector, useDispatch } from "react-redux";
import { getCustomerIdSelector } from "../../customer-detail-selector";
import { networkBusinessCardActions } from "./network-business-card-reducer";
import { departmentsSelector, extendDepartmentsSelector } from "./network-business-card-selector";
import { ScrollView } from "react-native-gesture-handler";
import { CommonMessages, 
  // CommonFilterMessage
 } from "../../../../../shared/components/message/message";
import { MessageType } from "../../enum";
import { AppIndicator } from "../../../../../shared/components/app-indicator/app-indicator";
import { CustomerListEmpty } from "../../../shared/components/customer-list-empty";

export interface NetworkBusinessCardTabProp {
  // screen navigation
  navigation: any,

  // screen route
  route: any
}

/**
 * Component for show network business card tab
 * 
 * @param NetworkBusinessCardTabProp 
 */
export const NetworkBusinessCardTab: FC<NetworkBusinessCardTabProp> = () => {
  const customerId = useSelector(getCustomerIdSelector);
  const dispatch = useDispatch();
  const extendDepartments = useSelector(extendDepartmentsSelector);
  
  const departments = useSelector(departmentsSelector);
  const [responseCustomerDetail, setResponseCustomerDetail] = useState<any>("");
  const [isShowMessageError, setIsShowMessageError] = useState(MessageType.DEFAULT);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * get network business data function
   */
  async function getNetworkBusinessData() {
    setIsLoading(true);
    dispatch(networkBusinessCardActions.setDepartments({departments: []}));
    dispatch(networkBusinessCardActions.setExtendDepartments({departments: []}));

    // call API network map
    const networkBusinessResponse = await getNetworkMap({customerId: customerId});

    if (networkBusinessResponse) {
      handleNetworkBusinessResponse(networkBusinessResponse);
    }
  }
  
  /**
   * handle department extended function
   * 
   * @param index: index value is extended position
   */
  const handleDepartmentExtended = (index: number) => () => {
    dispatch(
      networkBusinessCardActions.handleDepartmentExtend({
        position: index,
      })
    );
  }

  /**
   * use useEffect hook to get network business data
   */
  useEffect(() => {
    setIsShowMessageError(MessageType.DEFAULT);
    getNetworkBusinessData();
  }, [])

  /**
   * Handle network business response function
   * 
   * @param response NetworkBusinessCardResponse
   */
  const handleNetworkBusinessResponse = (response: NetworkBusinessCardResponse) => {
    setIsShowMessageError(MessageType.DEFAULT);
    if(response.status === 200){
      const responseData = response.data;

      if (responseData.departments) {
        if(responseData.departments.length === 0) {
          setIsShowMessageError(MessageType.NO_DATA);
        }

        const departmentsConvert = convertDepartmentsWithFirstHighestElement(responseData.departments);
        let departmentsList = orderDepartments(departmentsConvert);
        dispatch(networkBusinessCardActions.setDepartments({departments: departmentsList}));
        dispatch(networkBusinessCardActions.setExtendDepartments({departments: departmentsList}));
      }

      if (responseData.companyId) {
        dispatch(networkBusinessCardActions.setCompanyId(responseData.companyId));
      }

      if (responseData.businessCardDatas) {
        dispatch(networkBusinessCardActions.setBusinessCarDatas({businessCarDatas: responseData.businessCardDatas}));
      }

      if (responseData.employeeDatas) {
        dispatch(networkBusinessCardActions.setEmployeeDatas({employeeDatas: responseData.employeeDatas}));
      }

      if (responseData.standDatas) {
        dispatch(networkBusinessCardActions.setStandDatas({standDatas: responseData.standDatas}));
      }

      if (responseData.motivationDatas) {
        dispatch(networkBusinessCardActions.setMotivationDatas({motivationDatas: responseData.motivationDatas}));
      }

      if (responseData.tradingProductDatas) {
        dispatch(networkBusinessCardActions.setTradingProductDatas({tradingProductDatas: responseData.tradingProductDatas}));
      }

      setIsLoading(false);
    } else {
      setIsLoading(false);
      setIsShowMessageError(MessageType.ERROR);
      setResponseCustomerDetail(response);
    }
  };

  /**
   * Order departments follow parent function
   * 
   * @param departmentsList is departments array of API get network business response 
   */
  const orderDepartments = (departmentsList: Array<DepartmentData>) => {
    if (!departmentsList) {
      return [];
    }

    let tempDepartments: Array<DepartmentData> = [];
    departmentsList.forEach((department) => {
      const parentDepartment = departmentsList.filter(item => department.parentId === item.departmentId);
      if (!department.parentId || parentDepartment.length === 0 || department.parentId === department.departmentId) {
        tempDepartments.push(department);
        const childList = getChildsDepartment(department.departmentId, departmentsList);
        tempDepartments = [...tempDepartments, ...childList]
      }
    });

    return tempDepartments;
  }

  const convertDepartmentsWithFirstHighestElement = (departmentsList: Array<DepartmentData>) => {
    if (!departmentsList) {
      return [];
    }
    let resultDepartments:Array<DepartmentData> = [];
    departmentsList.forEach((department) => {
      const parentDepartment = departmentsList.filter(item => department.parentId === item.departmentId);

      if (department.departmentId === department.parentId || parentDepartment.length === 0) {
        resultDepartments = departmentsList.filter(item => department.departmentId !== item.departmentId);
        resultDepartments.unshift(department);
      }
    })
    return resultDepartments;
  }

  /**
   * Use recursive to get childs department
   * 
   * @param parentId is parent id of department
   * @param departmentsList  is departments array had ordered
   */
  const getChildsDepartment = (departmentId: number, departmentsList: Array<DepartmentData>) => {
    let childsDepartmentList: Array<DepartmentData> = [];
    const childDepartment = departmentsList.filter((department) => {
      return departmentId === department.parentId && department.departmentId !== department.parentId;
    });

    if (childDepartment.length > 0) {
      childDepartment.forEach((child) => {
        childsDepartmentList.push(child);
        const childList = getChildsDepartment(child.departmentId, departmentsList);
        childsDepartmentList = [...childsDepartmentList, ...childList];
      })
    }

    return childsDepartmentList;
  }

  /**
   * Use recursive to get parents department
   * 
   * @param departmentId is value of department
   * @param departmentList is departments array had ordered
   * @param titleList is list which contain department name
   */
  const getParents = (departmentId: any, departmentList: Array<DepartmentData>, titleList: Array<string>) => {
    let list = departmentList.filter((department) => {
      return departmentId === department.departmentId;
    })

    if (list.length > 0) {
      titleList.push(list[0].departmentName);

      const parentDepartment = departmentList.filter(item => list[0].parentId === item.departmentId);
      if (parentDepartment.length === 0) {
        return titleList;
      }

      if(list[0].parentId !== null && list[0].parentId !== undefined && list[0].parentId !== list[0].departmentId) {
        getParents(list[0].parentId, departmentList, titleList);
      }
    }

    return titleList;
    
  }

  /**
   * Get department name function
   * 
   * @param departmentId is departmentId value of department 
   * @param countBusinessCards number
   */
  const getDepartmentName = (departmentId: number, countBusinessCards: number) => {
    const arrTitles = getParents(departmentId, departments, []);
    let departmentName = "";
    
    if (arrTitles.length === 1) {
      departmentName = `${arrTitles[0]} (${countBusinessCards})`;
    } else if (arrTitles.length > 1) {
      const currentDepartmentName = arrTitles.shift();
      const parentDepartmentName = [...arrTitles].reverse().join(", ");
      departmentName=  `${currentDepartmentName} (${countBusinessCards}) (${parentDepartmentName})` 
    }

    return departmentName;
  }
  
  return(
    <SafeAreaView style={NetworkBusinessCardStyle.container}>
      {
        isShowMessageError === MessageType.ERROR && responseCustomerDetail !== "" &&
        <View style={NetworkBusinessCardStyle.messageStyle}>
          <CommonMessages response={responseCustomerDetail} />
        </View>
      }
      {
        isShowMessageError === MessageType.NO_DATA &&
        <CustomerListEmpty />
      }
      {isLoading && <AppIndicator size={40} />}
      <ScrollView>
        {departments.map((department, index) => {
          return (
            <View key={department.departmentId}>
              <View style={[NetworkBusinessCardStyle.partRow,
                CustomerDetailScreenStyles.borderBottom,
                CustomerDetailScreenStyles.rowIcon]}>
                <View style={NetworkBusinessCardStyle.partBlock}>
                  <TouchableOpacity style={CustomerDetailScreenStyles.iconArrowBlock} onPress={handleDepartmentExtended(index)}>
                      <Icon name={extendDepartments.length > 0 && extendDepartments[index].extended ? "arrowUp" : "arrowDown"}  
                      style={CustomerDetailScreenStyles.iconArrowUpAndDown}/>
                  </TouchableOpacity>
                  <Text style={NetworkBusinessCardStyle.partText} numberOfLines={1}>{getDepartmentName(department.departmentId, 
                    department.networkStands.filter(item => item.businessCardId !== null).length)}</Text>
                </View>
                {/** todo navigate to create business card screen */}
                <TouchableOpacity style={CustomerDetailScreenStyles.iconArrowBlock} onPress={() => {Alert.alert("navigate to create business card screen")}}>
                    <Icon name={"add"} style={NetworkBusinessCardStyle.addIcon}/>
                </TouchableOpacity>
              </View>
              {extendDepartments && extendDepartments.length > 0 && extendDepartments[index].extended && department.networkStands.map((networkStand) => {
                return <NetworkBusinessCardItem 
                department={department}
                networkStand={networkStand}
                key={networkStand.businessCardId}
                />
              })}
            </View>
          )
          })}
      </ScrollView>
    </SafeAreaView>
    
  );
}

