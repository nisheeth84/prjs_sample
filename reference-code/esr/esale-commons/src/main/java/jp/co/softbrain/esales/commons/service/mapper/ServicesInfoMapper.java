package jp.co.softbrain.esales.commons.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.commons.domain.ServicesInfo;
import jp.co.softbrain.esales.commons.service.dto.ServicesInfoDTO;

/**
 * Mapper for the entity {@link ServicesInfo} and its DTO
 * {@link ServicesInfoDTO}.
 * 
 * @author nguyentienquan
 */
@Mapper(componentModel = "spring", uses = {})
public interface ServicesInfoMapper extends EntityMapper<ServicesInfoDTO, ServicesInfo> {

}
