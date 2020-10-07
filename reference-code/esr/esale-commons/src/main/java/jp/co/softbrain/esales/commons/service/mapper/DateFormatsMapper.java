package jp.co.softbrain.esales.commons.service.mapper;


import jp.co.softbrain.esales.commons.domain.*;
import jp.co.softbrain.esales.commons.service.dto.DateFormatsDTO;

import org.mapstruct.*;

/**
 * Mapper for the entity {@link DateFormats} and its DTO {@link DateFormatsDTO}.
 */
@Mapper(componentModel = "spring", uses = {})
public interface DateFormatsMapper extends EntityMapper<DateFormatsDTO, DateFormats> {

}
