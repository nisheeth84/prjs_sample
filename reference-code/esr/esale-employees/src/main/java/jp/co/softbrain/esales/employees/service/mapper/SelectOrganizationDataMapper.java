package jp.co.softbrain.esales.employees.service.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.NullValueCheckStrategy;
import org.mapstruct.NullValueMappingStrategy;
import org.mapstruct.NullValuePropertyMappingStrategy;

import jp.co.softbrain.esales.employees.service.dto.SelectOrganizationDataDTO;

/**
 * @author chungochai
 */
@Mapper(componentModel = "spring", uses = {}, nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE, nullValueCheckStrategy = NullValueCheckStrategy.ALWAYS, nullValueMappingStrategy = NullValueMappingStrategy.RETURN_DEFAULT)
public interface SelectOrganizationDataMapper
        extends EntityMapper<SelectOrganizationDataDTO, jp.co.softbrain.esales.employees.service.dto.commons.SelectOrganizationDataDTO> {

}
