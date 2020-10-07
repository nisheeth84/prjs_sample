import React from "react";
import { Text, TouchableOpacity, View, Image } from "react-native";
import { Icon } from "../../shared/components/icon";
import { business, calendarStyles } from "./search-styles";
import { appImages } from "../../config/constants";
import { authorizationSelector } from '../login/authorization/authorization-selector';
import { useSelector } from 'react-redux';
import { LanguageCode, FIELD_NAME } from "../../config/constants/enum";
import { customFieldsInfoSelector } from "../products/list/product-list-selector";
import { formatJaPrice } from "../products/utils";



export interface ItemSearchProps {
  type?: string;
  data?: any;
  handleOnPress?: () => void;
  key?: number;
}

export function ItemSearch({
  type = "search",
  data,
  handleOnPress = () => { },
  key = 0,
}: ItemSearchProps) {
  const customFieldsInfo = useSelector(customFieldsInfoSelector);
  const fieldInfo = customFieldsInfo.find(
    (el: any) => el.fieldName === FIELD_NAME.unitPrice
  );
  let currencyUnit = fieldInfo?.currencyUnit || "";
  let typeUnit = fieldInfo?.typeUnit || 0;

  const authState = useSelector(authorizationSelector);
  const languageCode = authState?.languageCode ? authState?.languageCode : LanguageCode.JA_JP;

  /**
   * tap Calender
   */
  const renderCalender = () => {
    return (
      <>
        <TouchableOpacity
          key={key}
          style={calendarStyles.container}
          onPress={handleOnPress}
        >
          <View style={calendarStyles.leftContent}>
            <Text style={calendarStyles.txt}>{data.scheduleName}</Text>
            <Text style={calendarStyles.txt}>
              {`${data.startDate} ~ ${data.endDate}`}
            </Text>
          </View>
          <View style={calendarStyles.rightContent}>
            <Icon name="arrowRight" />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  /**
   * tap timeline
   */
  const renderTimeline = () => {
    return (
      <TouchableOpacity
        style={calendarStyles.container}
        onPress={handleOnPress}
      >
        <View style={calendarStyles.leftContent}>
          <Text style={calendarStyles.txt}>{data.createdDate}</Text>
          <Text style={calendarStyles.txt}>{data.comment}</Text>
        </View>
        <View style={calendarStyles.rightContent}>
          <Icon name="arrowRight" />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * tap business cards
   */
  const renderBusiness = () => {
    return (
      <TouchableOpacity style={business.container} onPress={handleOnPress}>
        <View style={business.icon}>
          <Icon
            name="iconItemSearch"
            style={business.iconItem}
            resizeMode="contain"
          // src={data.businessCardImagePath}
          />
        </View>
        <View style={business.content}>
          <Text style={business.txt}>
            {`${data.customerName} ${data.departmentName}`}
          </Text>
          <Text style={business.txt}>
            {`${data.businessCardName} ${data.position}`}
          </Text>
        </View>
        <View style={business.rightContent}>
          <Icon name="arrowRight" />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * tap customers
   */
  const renderCustomers = () => {
    return (
      <TouchableOpacity style={business.container} onPress={handleOnPress}>
        <View style={business.icon}>
          <Icon
            name="iconItemSearch"
            style={business.iconItem}
            resizeMode="contain"
          />
        </View>
        <View style={business.content}>
          <Text style={business.txt}>{data?.customerParent?.customerName}</Text>
          <Text style={business.txt}>{data?.customerName}</Text>
          <Text style={business.txt}>{data?.address}</Text>
        </View>
        <View style={business.rightContent}>
          <Icon name="arrowRight" />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * tap works
   */
  const renderWorks = () => {
    return (
      <TouchableOpacity style={business.container} onPress={handleOnPress}>
        <View style={business.content}>
          <Text style={business.txt}>{data.customer.customerName}</Text>
          <Text style={business.txt}>{data.employee.employeeName}</Text>
          <Text style={business.txt}>{data.contactDate}</Text>
          <Text style={business.txt}>{data.productTradingProgressName}</Text>
        </View>
        <View style={business.rightContent}>
          <Icon name="arrowRight" />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * tap staff
   * note: employeeDepartments is Array ?
   * employeeDepartments.departmentName									
      employeeName [Row 83 84]		
   */
  /* TODO: add rwo 178   {`${data.employeeName} `}
    check data?.employeeDepartments[0]?.positionName is string
      ${ 
      data?.employeeDepartments[0]?.positionName
        ? JSON.parse(data?.employeeDepartments[0]?.positionName)[languageCode]
        : null
    } */
  const renderStaff = () => {
    return (
      <TouchableOpacity style={business.container} onPress={handleOnPress}>
        <View style={business.avatar}>
          {data.employeePhoto.fileUrl && data.employeePhoto.fileUrl !== "" ? (
            <Image
              source={{ uri: data.employeePhoto.fileUrl }}
              style={business.avatarEmployee}
            />
          ) : (
              <View style={business.avatarDefault}>
                <Text style={business.txtAvatarDefault}>
                  {data?.employeeSurname?.charAt(0)}
                </Text>
              </View>
            )
          }
        </View>
        <View style={business.content}>
          <Text style={business.txt}>
            {data?.employeeDepartments[0]?.departmentName}
          </Text>

          <Text
            numberOfLines={1}
            style={business.txt}
          >
            {`${data?.employeeSurname} ${data?.employeeName || ""} ${data?.employeeDepartments[0]?.positionName || ""}`}
          </Text>
        </View>
        <View style={business.rightContent}>
          <Icon name="arrowRight" />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * tap analysis
   */
  const renderAnalysis = () => {
    return (
      <>
        <TouchableOpacity
          style={calendarStyles.container}
          onPress={handleOnPress}
        >
          <View style={calendarStyles.leftContent}>
            <Text style={calendarStyles.txt}>
              {JSON.parse(data.reportCategoryName)[languageCode]}
            </Text>
            <Text style={calendarStyles.txt}>{data.reportName}</Text>
          </View>
          <View style={calendarStyles.rightContent}>
            <Icon name="arrowRight" />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  /**
   * tap the product
   */
  const renderProduct = () => {
    return (
      <TouchableOpacity style={[business.container]} onPress={handleOnPress}>
        <View style={business.icon}>
          <Image
            style={business.iconItem}
            source={data?.productImagePath ? {
              uri: data.productImagePath,
            } : appImages.iconNoImage}
          />

        </View>
        <View style={business.content}>
          <Text style={business.txt}>
            {" "}
            {data.productCategoryName == null
              ? "  "
              : JSON.parse(data.productCategoryName)[languageCode]}
          </Text>
          <Text style={business.txt}>{data.productName}</Text>
          <Text style={business.txt}>{formatJaPrice(data.unitPrice, currencyUnit, typeUnit)}</Text>
        </View>
        <View style={business.rightContent}>
          <Icon name="arrowRight" />
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * tap task
   */
  const renderTask = () => {
    return (
      <>
        <TouchableOpacity
          style={calendarStyles.container}
          onPress={handleOnPress}
        >
          <View style={calendarStyles.leftContent}>
            <Text style={calendarStyles.txt}>
              {`${data.milestone.milestoneName}( ${data.customer.customerName} ${data.productTradings[0].productTradingName} )`}
            </Text>
            <Text style={calendarStyles.txt}>
              {`${data.taskName}(${data.finishDate})`}
            </Text>
            <Text style={calendarStyles.txt}>{data.operatorNames}</Text>
          </View>
          <View style={calendarStyles.rightContent}>
            <Icon name="arrowRight" />
          </View>
        </TouchableOpacity>
      </>
    );
  };

  /**
   * tap Product Trading Suggestions
   * Not maping
   * TODO:
   */
  const renderTransaction = () => {
    return (
      <TouchableOpacity style={business.container} onPress={handleOnPress}>
        <View style={business.icon}>
          <Icon
            name="iconItemSearch"
            style={business.iconItem}
            resizeMode="contain"
          />
        </View>
        <View style={business.content}>
          <Text style={business.txt}>{data.customerName}</Text>
          <Text style={business.txt}>取引商品 A ( 進捗 )</Text>
          <Text style={business.txt}>担当者名 A</Text>
        </View>
        <View style={business.rightContent}>
          <Icon name="arrowRight" />
        </View>
      </TouchableOpacity>
    );
  };

  // if (type === "calendar") timeline;
  // businessCard;
  // customers;
  // activities;
  // employees;
  // analysis;
  // products;
  // schedules;
  // sales;

  // switch (type) {
  //   case "calendar": {
  //     return renderCalender;
  //   }
  //   case "businessCard": {
  //     return renderTransaction;
  //   }
  //   default: {
  //     return renderTransaction;
  //   }
  // }

  // return type === "calendar" ? renderTask() : type === "businessCard" ? renderTransaction() : ;
  if (type === "calendar") {
    return renderCalender();
  }
  if (type === "timeline") {
    return renderTimeline();
  }
  if (type === "businessCard") {
    return renderBusiness();
  }
  if (type === "customers") {
    return renderCustomers();
  }
  if (type === "activities") {
    return renderWorks();
  }
  if (type === "employees") {
    return renderStaff();
  }
  if (type === "analysis") {
    return renderAnalysis();
  }
  if (type === "products") {
    return renderProduct();
  }
  if (type === "task") {
    return renderTask();
  }
  if (type === "productTrading") {
    return renderTransaction();
  }

  return <View />;
}
