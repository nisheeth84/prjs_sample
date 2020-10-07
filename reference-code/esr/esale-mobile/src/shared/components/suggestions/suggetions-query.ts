export const queryProductSuggestion = (keyWords: string) => {
  const query = {
    query: `{
    productSuggestions(searchValue: ${JSON.stringify(keyWords)}) {
	    dataInfo {
			  productId
			  productName
			  unitPrice
			  isDisplay
			  productCategoryId
			  productCategoryName
      }
    }
  }`,
  };
  return query;
};


export const queryProductTradingSuggestion = (keyWords: string, offset: number, customerIds: number) => {
  const query = {
    query: `{
      productTradingSuggestions(
        keyWords: ${JSON.stringify(keyWords)},
        offset: ${offset},
        customerIds: ${JSON.stringify(customerIds)}
      ) {
        productTradings {
          productTradingId
          customerId
          customerName
          productId
          productName
          memoProduct
          quantity
          price
          amount
          employeeId
          employeeName
          endPlanDate
          orderPlanDate
          progressName
          productImageName
          productImagePath
          productCategoryId
          productCategoryName
          memo
        }
      }`,
  };
  return query;
}

/**
 * Return graphql of getMilestonesSuggestion api
 * @param searchValue,@param limit,
 * @param number,@param listIdChoice,
 * @param relationFieldId,
 */
const queryGetMilestonesSuggestion = (searchValue:string,limit:number,offset:number, listIdChoice:[] , relationFieldId:number) =>
  `query {
    getMilestonesSuggestion( 
      searchValue: ${JSON.stringify(searchValue)},
      limit: ${limit},
      offset: ${offset},
      listIdChoice: ${JSON.stringify(listIdChoice)},
      relationFieldId: ${relationFieldId}) {
        milestones {
          milestoneId
          milestoneName
          endDate 
          customerId 
          customerName 
          parentCustomerName
        }
    }
  }`;

  /**
   * Return graphql of employeesSuggestion api
   * @param searchValue, @param startTime  @param endTime  @param searchType
   */
export const queryEmployeeSuggestion = (keyWords: string,startTime: string, endTime: string, searchType: string) => {
  const query = {
    query: `
    query {
      employeesSuggestion(keyWords: ${JSON.stringify(keyWords)}, startTime: ${JSON.stringify(startTime)}, endTime: ${JSON.stringify(endTime)}, searchType: ${searchType}) {
        departments {
          departmentId
          departmentName
          parentDepartment {
            departmentId
            departmentName
          }
          employeesDepartments {
            employeeId
            photoFileName,
            photoFilePath,
            employeeSurname
            employeeName
            employeeSurnameKana
            employeeNameKana
            departments {
              departmentId
              departmentName
              positionId
              positionName
            }
          }
        }
        employees {
          employeeId
          photoFileName,
          photoFilePath,
          employeeSurname
          employeeName
          employeeSurnameKana
          employeeNameKana
          departments {
            departmentId
            departmentName
            positionId
            positionName
          }
        }
        groups {
          groupId
          groupName
        }
      }
    }`,
  };
  return query;
};
