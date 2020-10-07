package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.ServicesInfo;
import jp.co.softbrain.esales.commons.service.dto.ServicesInfoOutDTO;

/**
 * Mapper for the entity {@link ServicesInfo} and its DTO
 * {@link ServicesInfoOutDTO}.
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {})
public interface ServicesInfoOutMapper extends EntityMapper<ServicesInfoOutDTO, ServicesInfo> {

}
