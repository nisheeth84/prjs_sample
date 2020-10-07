package jp.co.softbrain.esales.tenants.service.mapper;

import org.mapstruct.Mapper;

import jp.co.softbrain.esales.tenants.domain.FeedbackStatusOpen;
import jp.co.softbrain.esales.tenants.service.dto.FeedbackStatusOpenDTO;

/**
 * FeedbackStatusOpenMapper
 * 
 * @author DatDV
 *
 */
@Mapper(componentModel = "spring", uses = {})
public interface FeedbackStatusOpenMapper extends EntityMapper<FeedbackStatusOpenDTO, FeedbackStatusOpen>{

}
