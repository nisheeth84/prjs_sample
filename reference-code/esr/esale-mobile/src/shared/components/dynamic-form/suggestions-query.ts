/**
 * Return graphql of employeesSuggestion api
 * @param searchValue, @param startTime  @param endTime  @param searchType
 */
export const queryEmployeeSuggestion = (keyWords: string, startTime: string, endTime: string, searchType: string) => {
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