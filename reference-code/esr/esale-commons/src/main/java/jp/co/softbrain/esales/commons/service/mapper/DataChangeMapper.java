package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import jp.co.softbrain.esales.commons.domain.DataChange;
import jp.co.softbrain.esales.commons.service.dto.DataChangeDTO;

/**
 * Mapper for the entity {@link DataChange} and its DTO {@link DataChangeDTO}.
 * 
 * @author chungochai
 */
@Mapper(componentModel = "spring", uses = {})
public interface DataChangeMapper extends EntityMapper<DataChangeDTO, DataChange> {

}
