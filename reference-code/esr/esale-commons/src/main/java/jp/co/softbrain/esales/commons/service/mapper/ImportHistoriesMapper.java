package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;
import jp.co.softbrain.esales.commons.domain.ImportHistories;
import jp.co.softbrain.esales.commons.service.dto.ImportHistoriesDTO;

/**
 * Mapper for the entity {@link ImportHistories} and its DTO
 * {@link ImportHistoriesDTO}.
 *
 * @author chungochai
 */
@Mapper(componentModel = "spring", uses = {})
public interface ImportHistoriesMapper extends EntityMapper<ImportHistoriesDTO, ImportHistories> {

}
