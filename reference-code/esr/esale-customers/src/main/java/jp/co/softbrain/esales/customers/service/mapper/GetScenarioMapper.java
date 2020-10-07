package jp.co.softbrain.esales.customers.service.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutSubTypeEmployeesDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutSubTypeMilestonesDTO;
import jp.co.softbrain.esales.customers.service.dto.GetScenarioOutSubTypeTasksDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetMilestonesByCustomerDTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.GetMilestonesByCustomerSubType1DTO;
import jp.co.softbrain.esales.customers.service.dto.schedules.OperatorOfTaskDTO;

/**
 * Mapper for API getScenario
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface GetScenarioMapper {

    // map for operators of task
    GetScenarioOutSubTypeEmployeesDTO mapToOperator(OperatorOfTaskDTO taskOperator);

    List<GetScenarioOutSubTypeEmployeesDTO> mapToOperator(List<OperatorOfTaskDTO> taskOperators);

    // mapp for task
    @Mapping(target = "operators", ignore = true)
    @Mapping(target = "finishDate", source = "finishtDate")
    @Mapping(target = "statusTaskId", source = "status")
    @Mapping(target = "parentId", source = "parentTaskId")
    @Mapping(target = "nestedOperators", source = "operators")
    GetScenarioOutSubTypeTasksDTO fromTaskByCustomerIdToTaskScenario(GetMilestonesByCustomerSubType1DTO taskByCustomer);

    List<GetScenarioOutSubTypeTasksDTO> fromTaskByCustomerIdToTaskScenario(
            List<GetMilestonesByCustomerSubType1DTO> listTaskByCustomer);

    // map for milestone
    @Mapping(target = "statusMilestoneId", source = "isDone")
    @Mapping(target = "finishDate", source = "endDate")
    @Mapping(target = "tasks", source = "listTask")
    @Mapping(target = "taskIds", source = "listTaskIds")
    GetScenarioOutSubTypeMilestonesDTO toMilestoneOutDTO(GetMilestonesByCustomerDTO milestone);

    List<GetScenarioOutSubTypeMilestonesDTO> toMilestoneOutDTO(List<GetMilestonesByCustomerDTO> milestones);
}
