import React, { useEffect, useState } from 'react'
import { View, Text, Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Icon } from "../../../../shared/components/icon"
import { ScenarioStyle } from "./scenario-style"
import { translate } from "../../../../config/i18n"
import { getScenario, Scenario, EmployeeScenario, MilestonesScenario, TasksScenario } from "../../activity-repository"
import { messages } from "./scenario-messages"
import moment from 'moment';
import { useSelector } from 'react-redux'
import { scenarioSelector } from '../../detail/activity-detail-selector'
import { TEXT_EMPTY, APP_DATE_FORMAT } from '../../../../config/constants/constants'

/**
 * Define scenario view props
 */
export interface ScenarioProps {
  customerId: number
}

/**
 * component to show scenario
 * @param param 
 */
export const ScenarioView = (param: ScenarioProps) => {
  const KEY_MILESTONE = "milestone_"
  const KEY_TASK = "task_"
  const currentTime = new Date().setHours(0, 0, 0, 0)
  const scenarioData = useSelector(scenarioSelector)

  /**
   * error message if call API error
   */
  const [errorMessage, setErrorMessage] = useState(TEXT_EMPTY)

  /**
   * error message if call API error
   */
  const [scenario, setScenario] = useState<Scenario>()

  /**
   * map employee with milestone, task
   */
  const [mapEmployee, setMapEmployee] = useState(new Map)

  /**
   * map check expand show tasks
   */
  const [expandMap, setExpandMap] = useState(new Map)

  /**
   * state to update view
   */
  const [isUpdate, setUpdate] = useState(false)

  /**
   * boolean to prevent call api getScenario when change customerId in first time enter edit screen
   */
  const [isPreventChangeCustomer, setIsPreventChangeCustomer] = useState<boolean>(true)

  const [isShowScenario, setIsShowScenario] = useState(false)

  useEffect(() => {
    if (scenarioData) {
      setScenario(scenarioData)
      countEmployee(scenarioData)
    }
  }, [])

  useEffect(() => {
    if (param.customerId && param.customerId > 0
       && !(scenario && scenario?.milestones.length > 0 && isPreventChangeCustomer)) {
      callAPIGetScenario()
    }
    setIsPreventChangeCustomer(false)
  }, [param])

  useEffect(() => {
    setUpdate(false)
  }, [isUpdate])

  useEffect(() => {
    if (scenario) {
      setIsShowScenario(true)
    }
  }, [scenario])

  /**
   * call API getScenario
   */
  const callAPIGetScenario = async () => {
    const payload = {
      customerId: param.customerId
    }
    const response = await getScenario(payload)
    handleErrorGetScenario(response)
  }

  /**
   * handle error API getScenario
   * @param response 
   */
  const handleErrorGetScenario = (response: any) => {
    if (response?.status && response.status === 200) {
      setScenario(response.data.scenarios)
      countEmployee(response.data.scenarios)
    } else {
      setErrorMessage(translate(messages.errorCallAPI))
    }
  }

  /**
   * count employee in milestone, task
   */
  const countEmployee = (scenario: Scenario) => {
    let mapEmployee = new Map
    let expandMap = new Map
    for (const milestone of scenario?.milestones) {
      expandMap.set(milestone.milestoneId, false)
      let employeeMilestoneList: Array<EmployeeScenario> = []
      let isExistProduct
      for (const task of milestone?.tasks) {
        let employeeTaskList: Array<EmployeeScenario> = []
        for (const employee of task?.employees) {
          isExistProduct = employeeTaskList.filter(item => item.employeeId === employee.employeeId)
          if (isExistProduct.length === 0) {
            employeeTaskList.push(employee)
          }
          isExistProduct = employeeMilestoneList.filter(item => item.employeeId === employee.employeeId)
          if (isExistProduct.length === 0) {
            employeeMilestoneList.push(employee)
          }
        }
        for (const subtask of task?.subtasks) {
          for (const employeeSubtask of subtask?.employees) {
            isExistProduct = employeeTaskList.filter(item => item.employeeId === employeeSubtask.employeeId)
            if (isExistProduct.length === 0) {
              employeeTaskList.push(employeeSubtask)
            }
            isExistProduct = employeeMilestoneList.filter(item => item.employeeId === employeeSubtask.employeeId)
            if (isExistProduct.length === 0) {
              employeeMilestoneList.push(employeeSubtask)
            }
          }
        }
        mapEmployee.set(KEY_TASK + task.taskId, employeeTaskList)
      }
      mapEmployee.set(KEY_MILESTONE + milestone.milestoneId, employeeMilestoneList)
    }
    setMapEmployee(mapEmployee)
    setExpandMap(expandMap)
  }

  const handleExpand = (milestoneId: number) => {
    let map = expandMap
    map.set(milestoneId, !expandMap.get(milestoneId))
    setExpandMap(map)
    setUpdate(true)
  }

  /**
   * render Milestone
   * @param milestone 
   * @param index 
   */
  const renderMilestone = (milestone: MilestonesScenario, index: number) => {
    const finishTime = moment(milestone.finishDate).toDate().getTime()
    return (
      <View
        key={KEY_MILESTONE + milestone.milestoneId}
        style={[
          ScenarioStyle.tabHistory,
          ScenarioStyle.paddingBottom30,
          index === scenario?.milestones.length ? null : ScenarioStyle.borderLeft]}>
        <View style={ScenarioStyle.dotHistory}>
          <Icon name={milestone.isDone === 1 ? "circleCheckSmall" : "circle"} />
        </View>
        <View style={ScenarioStyle.ViewScenario}>
          <View style={[ScenarioStyle.ViewBoxSce, ScenarioStyle.borderBottom]}>
            <View style={ScenarioStyle.flex_D}>
              {
                milestone.isDone === 1 &&
                <Icon name="icFlagGreenCheck" style={ScenarioStyle.imgTitle} />
              }
              {
                milestone.isDone === 0 && currentTime <= finishTime &&
                <Icon name="icFlagGreen" style={ScenarioStyle.imgTitle} />
              }
              {
                milestone.isDone === 0 && currentTime > finishTime &&
                <Icon name="icFlagRed" style={ScenarioStyle.imgTitle} />
              }
              <Text style={ScenarioStyle.titleSce}>{milestone.milestoneName}</Text>
            </View>
            <Text style={[ScenarioStyle.desSce, (milestone.isDone === 0 && finishTime < currentTime) ? ScenarioStyle.redText : null]}>
              {translate(messages.finishDate)}{milestone.finishDate ? moment(milestone.finishDate).format(APP_DATE_FORMAT) : TEXT_EMPTY}
            </Text>
            <Text style={ScenarioStyle.desScenario}>{milestone.memo}</Text>
            {renderEmployee(KEY_MILESTONE + milestone.milestoneId)}
          </View>
          {
            expandMap.get(milestone.milestoneId) &&
            renderTask(milestone?.tasks)
          }
          <TouchableOpacity 
            style={[ScenarioStyle.ViewImageRow]}
            onPress={() => {handleExpand(milestone.milestoneId)}}
          >
            <Icon
              name={expandMap.get(milestone.milestoneId) ? "icArrow" : "icArrowDownSign"}
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  /**
   * render employee in milestone, task
   */
  const renderEmployee = (employeeKey: string) => {
    const employeeList: Array<EmployeeScenario> = mapEmployee.get(employeeKey)
    return (
      <View style={[ScenarioStyle.flex_D, ScenarioStyle.viewImg]}>
        {
          employeeList?.map((employee, index) => {
            return (
              <View key={employeeKey + "_" + employee.employeeId}>
                {
                  index < 3 &&
                  <TouchableOpacity>
                    <Image
                      source={{uri: employee.photoEmployeeImg}}
                      style={ScenarioStyle.imagePerson}
                    />
                  </TouchableOpacity>
                }
                {
                  employeeList.length > 3 && index === 3 &&
                  <TouchableOpacity>
                    <View style={ScenarioStyle.count}>
                      <Text style={ScenarioStyle.textCount}>+{employeeList.length - 3}</Text>
                    </View>
                  </TouchableOpacity>
                }
              </View>
            )
          })
        }
      </View>
    )
  }

  /**
   * render task of milestone
   * @param taskList 
   */
  const renderTask = (taskList: Array<TasksScenario>) => {
    return (
      <View style={{paddingTop: 15}}>
        {
          taskList?.map((task) => {
            const finishTime = moment(task.finishDate).toDate().getTime()
            return (
              <View key={KEY_TASK + task.taskId}
                style={[
                  ScenarioStyle.ViewBoxSce,
                  ScenarioStyle.ViewBoxSceOther,
                  (task.statusTaskId !== 3 && finishTime < currentTime) ? ScenarioStyle.bgPink : ScenarioStyle.bgWhite,
                ]}
              >
                <View style={[ScenarioStyle.flex_D, { justifyContent: "space-between" }]}>
                  <View style={ScenarioStyle.flex_D}>
                    <Icon
                      name={task.statusTaskId === 3 ? "icChecklist" : "task"}
                      style={ScenarioStyle.imgCheckList}
                    ></Icon>
                    <Text style={ScenarioStyle.titleSce}>{task.taskName}</Text>
                  </View>
                  {
                    task.statusTaskId === 1 &&
                    <Text style={ScenarioStyle.desScenario}>{translate(messages.statusTaskId1Name)}</Text>
                  }
                  {
                    task.statusTaskId === 2 &&
                    <Text style={ScenarioStyle.desScenario}>{translate(messages.statusTaskId2Name)}</Text>
                  }
                  {
                    task.statusTaskId === 3 &&
                    <Text style={ScenarioStyle.desScenario}>{translate(messages.statusTaskId3Name)}</Text>
                  }
                </View>
                <Text style={ScenarioStyle.desSce}>{translate(messages.finishDate)} {moment(task.startDate).format(APP_DATE_FORMAT)}~{moment(task.finishDate).format(APP_DATE_FORMAT)}</Text>
                {renderEmployee(KEY_TASK + task.taskId)}
              </View>
            )
          })
        }
      </View>
    )
  }

  return (
    <View style={ScenarioStyle.marginTop30}>
      {
        errorMessage !== TEXT_EMPTY && 
        <View>
          <Text style={ScenarioStyle.errorMessage}>{errorMessage}</Text>
        </View>
      }
      {
        isShowScenario && scenario?.milestones?.map((item: MilestonesScenario, index: number) => {
          return (
            renderMilestone(item, index + 1)
          )
        })
      }
    </View>
  )
}