import React, { useEffect, useState } from 'react';
import { FlatList, SafeAreaView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { AppbarCommon } from '../../../shared/components/appbar/appbar-common';
import { theme } from '../../../config/constants';
import { Input } from '../../../shared/components/input';
import { GroupMemberItem } from './group-member-item';
import { GroupSelectedItem } from './group-selected-item';
import { translate } from '../../../config/i18n';
import { messages } from './group-messages';
// import { QUERY_EMPLOYEES_SUGGESTION } from '../../../config/constants/query';
// import { employeesSuggestion } from './group-add-list-member-repository';
// import { useDebounce } from '../../../config/utils/debounce';
import { listMemberActions } from './group-add-list-member-reducer';
import { GroupAddListMemberStyles, GroupCommonStyles } from './group-style';

export interface EmployeeIcon {
  fileName: string;
  filePath: string;
}

export interface EmployeeDepartment {
  departmentId: number;
  departmentName: string;
  positionId: number;
  positionName: string;
}
export interface Employee {
  employeeId: number;
  employeeIcon: EmployeeIcon;
  employeeDepartments: Array<EmployeeDepartment>;
  employeeName: string;
  employeeNameKana: string;
  employeeSurname: string;
  employeeSurnameKana: string;
  participantType?: string;
}

export interface ParentDepartment {
  departmentId: number;
  departmentName: string;
}

export interface EmployeeDepartment2 {
  employeeId: number;
  photoFileName: string;
  photoFilePath: string;
  employeeName: string;
  employeeNameKana: string;
  employeeSurname: string;
  employeeSurnameKana: string;
  departments: Array<EmployeeDepartment>;
}

export interface Department {
  departmentId: number;
  departmentName: string;
  parentDepartment: ParentDepartment;
  employeeDepartments: Array<EmployeeDepartment2>;
}

export interface Group {
  groupId: number;
  groupName: string;
}

export interface DataResponse {
  departments: Array<Department>;
  employees: Array<Employee>;
  groups: Array<Group>;
}

export interface Search {
  searchValue: string;
}

/**
 * Group add list member to group screen
 */
export const GroupAddListMember = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // list data selected
  const [dataSelectMember, setDataSelectMember] = useState<Employee[]>([]);
  // dummy response structure
  const response = useState<DataResponse>({
    departments: [
      {
        departmentId: 4,
        departmentName: '部署 A-1',
        parentDepartment: {
          departmentId: 1,
          departmentName: '部署 A',
        },
        employeeDepartments: [
          {
            employeeId: 1002,
            photoFileName: '',
            photoFilePath: '',
            employeeName: 'awer',
            employeeNameKana: 'kanta',
            employeeSurname: 'rtyu',
            employeeSurnameKana: 'nana',
            departments: [
              {
                departmentId: 1,
                departmentName: 'qwer',
                positionId: 1,
                positionName: 'qac',
              },
            ],
          },
        ],
      },
    ],
    employees: [
      {
        employeeId: 1002,
        employeeIcon: {
          fileName: '',
          filePath: '',
        },
        employeeDepartments: [
          {
            departmentId: 1,
            departmentName: 'qwer',
            positionId: 1,
            positionName: 'qac',
          },
        ],
        employeeName: 'awer',
        employeeNameKana: 'kanta',
        employeeSurname: 'rtyu',
        employeeSurnameKana: 'nana',
      },
      {
        employeeId: 1003,
        employeeIcon: {
          fileName: '',
          filePath: '',
        },
        employeeDepartments: [
          {
            departmentId: 2,
            departmentName: 'qwer',
            positionId: 1,
            positionName: 'qac',
          },
        ],
        employeeName: 'rcf',
        employeeNameKana: 'kanata',
        employeeSurname: 'ryaga',
        employeeSurnameKana: 'nanaka',
      },
      {
        employeeId: 1004,
        employeeIcon: {
          fileName: '',
          filePath: '',
        },
        employeeDepartments: [
          {
            departmentId: 3,
            departmentName: 'qwer',
            positionId: 1,
            positionName: 'qac',
          },
        ],
        employeeName: 'bnmjf',
        employeeNameKana: 'kanatawa',
        employeeSurname: 'ryagaKo',
        employeeSurnameKana: 'nanakaOK',
      },
      {
        employeeId: 1005,
        employeeIcon: {
          fileName: '',
          filePath: '',
        },
        employeeDepartments: [
          {
            departmentId: 2,
            departmentName: 'qwer',
            positionId: 1,
            positionName: 'qac',
          },
        ],
        employeeName: 'brtjnkl',
        employeeNameKana: 'hirosima',
        employeeSurname: 'asfav',
        employeeSurnameKana: 'narasaki',
      },
    ],
    groups: [
      {
        groupId: 1,
        groupName: '1qwrr',
      },
    ],
  });
  // list data search
  const [dataMember, setDataMember] = useState<Employee[]>([]);
  // search value input
  const [searchValue, setSearchValue] = useState('');
  // active button
  const [buttonActive, setActiveButton] = useState(true);
  const [dataCheck, setDataCheck] = useState<boolean[]>([]);

  /**
   * handle set item select false in start
   */
  useEffect(() => {
    const data = [...dataCheck];
    // eslint-disable-next-line no-unused-expressions
    dataMember.forEach((item: Employee, index: number) => {
      data[index] = false;
      return item;
    });
    if (data) {
      setDataCheck([...data]);
    }
  }, []);

  /**
   * function hanlde add member
   */
  const handleAddMember = (item: Employee, checked: boolean) => {
    const data = dataSelectMember;
    if (checked) {
      let checkExisted = false;
      data.forEach((i: Employee) => {
        if (i.employeeName === item.employeeName) {
          checkExisted = true;
        }
        return i;
      });
      if (!checkExisted) {
        data.push(item);
      }
    } else {
      data.forEach((i: Employee, ind: number) => {
        if (i.employeeName === item.employeeName) {
          data.splice(ind, 1);
        }
        return i;
      });
    }
    const temp = dataCheck;
    dataMember.forEach((i: Employee, ind: number) => {
      if (i.employeeNameKana === item.employeeNameKana) {
        temp[ind] = checked;
      }
      return i;
    });
    setDataCheck([...temp]);
    setDataSelectMember([...data]);
  };

  /**
   * function hanlde finish add member
   */
  const handleFinishAddMember = () => {
    setActiveButton(false);
    dataSelectMember.forEach((item: Employee, index: number) => {
      dataSelectMember[index].participantType = '閲覧者';
      return item;
    });
    dispatch(listMemberActions.setListMember({ listMember: dataSelectMember }));
    setActiveButton(true);
    navigation.goBack();
  };

  /**
   * function hanlde remove member
   */
  const handleRemoveMember = (title: string) => {
    const data = dataSelectMember;
    data.forEach((i: Employee, ind: number) => {
      if (i.employeeNameKana === title) {
        data.splice(ind, 1);
      }
      return i;
    });
    setDataSelectMember([...data]);
    const temp = dataCheck;
    dataMember.forEach((i: Employee, ind: number) => {
      if (i.employeeNameKana === title) {
        temp[ind] = false;
      }
      return i;
    });
    setDataCheck([...temp]);
  };

  /**
   * function hanlde employees suggestion
   */
  const hanldeEmployeesSuggestion = (text: string) => {
    const { employees } = response;
    let temp = employees.filter(
      (e: Employee) =>
        e.employeeName.includes(text) || e.employeeSurname.includes(text)
    );
    if (text === '') temp = employees;
    // const localMenu = await employeesSuggestion(
    //   QUERY_EMPLOYEES_SUGGESTION(text),
    //   {}
    // );
    // if (localMenu.status === 200) {
    //   if (localMenu?.data?.data?.employeesSuggestion?.employees) {
    //     setDataMember(localMenu?.data?.data.employeesSuggestion.employees);
    //   }
    // }
    setDataMember([...temp]);
  };

  // const debouncedSearchTerm = useDebounce(searchValue, 0);
  // function hanlde search member
  // useEffect(() => {
  //   if (debouncedSearchTerm) {
  //     hanldeEmployeesSuggestion(debouncedSearchTerm);
  //   } else {
  //     setDataMember([]);
  //   }
  // }, [debouncedSearchTerm]);
  useEffect(() => {
    hanldeEmployeesSuggestion(searchValue);
  }, [searchValue]);

  /**
   * Tracking search text
   */
  const onChangeTextDelayed = (text: string) => {
    setSearchValue(text);
  };

  const onHandleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={GroupCommonStyles.container}>
      <SafeAreaView style={GroupCommonStyles.paddingTop}>
        <AppbarCommon
          title={translate(messages.groupAddListParticipants)}
          buttonText={translate(messages.groupDecision)}
          onPress={handleFinishAddMember}
          handleLeftPress={onHandleBack}
          buttonType="complete"
          leftIcon="close"
          buttonDisabled={!buttonActive}
        />
        <Text style={GroupAddListMemberStyles.title}>
          {translate(messages.groupParticipantsToAdd)}
        </Text>
        <View style={GroupAddListMemberStyles.search}>
          <Input
            value={searchValue}
            placeholder={translate(messages.groupSearchParticipants)}
            placeholderColor={theme.colors.gray}
            style={GroupAddListMemberStyles.inputStyle}
            autoCapitalize="none"
            autoCompleteType="off"
            autoCorrect={false}
            onChangeText={onChangeTextDelayed}
          />
        </View>
        <View style={GroupAddListMemberStyles.divide} />
        <View>
          <FlatList
            data={dataMember}
            renderItem={({
              item,
              index,
            }: {
              item: Employee;
              index: number;
            }) => {
              return (
                <GroupMemberItem
                  employeeId={item.employeeId}
                  employeeName={item.employeeName}
                  employeeNameKana={item.employeeNameKana}
                  employeeSurname={item.employeeSurname}
                  employeeSurnameKana={item.employeeSurnameKana}
                  employeeIcon={item.employeeIcon}
                  employeeDepartments={item.employeeDepartments}
                  key={item.employeeId}
                  handleAddMember={handleAddMember}
                  check={dataCheck[index]}
                />
              );
            }}
            keyExtractor={(item: Employee) => item.employeeId.toString()}
            contentContainerStyle={{
              paddingBottom: dataSelectMember.length !== 0 ? 250 : 200,
            }}
          />
        </View>
      </SafeAreaView>
      {dataSelectMember.length !== 0 && (
        <View style={GroupAddListMemberStyles.wrapSelectedItem}>
          {dataSelectMember.map((item: Employee) => {
            return (
              <GroupSelectedItem
                title={item.employeeNameKana}
                key={item.employeeId.toString()}
                handleRemoveMember={handleRemoveMember}
              />
            );
          })}
        </View>
      )}
    </View>
  );
};
