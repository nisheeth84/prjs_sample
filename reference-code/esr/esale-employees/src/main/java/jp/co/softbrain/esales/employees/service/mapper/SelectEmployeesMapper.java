package jp.co.softbrain.esales.employees.service.mapper;

import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.SelectEmployeesDTO;

import org.mapstruct.*;

/**
 * Mapper for the {@link EmployeesDTO} and its DTO {@link SelectEmployeesDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface SelectEmployeesMapper extends EntityMapper<EmployeesDTO, SelectEmployeesDTO> {

}
