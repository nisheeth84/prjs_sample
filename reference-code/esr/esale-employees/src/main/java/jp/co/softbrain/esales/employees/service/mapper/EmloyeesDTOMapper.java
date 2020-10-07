package jp.co.softbrain.esales.employees.service.mapper;
import org.mapstruct.*;
import jp.co.softbrain.esales.employees.service.dto.EmployeesDTO;
import jp.co.softbrain.esales.employees.service.dto.EmployeesHistoriesDTO;

/**
 * Mapper for the DTO {@link EmployeesHistoriesDTO} and its DTO {@link EmloyeesDTO}.
 */

@Mapper(componentModel = "spring", uses = {})
public interface EmloyeesDTOMapper extends EntityMapper<EmployeesHistoriesDTO, EmployeesDTO>{
    
}
