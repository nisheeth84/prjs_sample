package jp.co.softbrain.esales.tenants.service.mapper;

import org.elasticsearch.common.inject.name.Named;
import org.mapstruct.Mapper;

import jp.co.softbrain.esales.tenants.domain.Feedback;
import jp.co.softbrain.esales.tenants.service.dto.CreateFeedBackInDTO;
import jp.co.softbrain.esales.tenants.service.dto.FeedbackDTO;

/**
 * FeedbackMapper
 * 
 * @author DatDV
 *
 */
@Mapper(componentModel = "spring", uses = {})
public interface FeedbackMapper extends EntityMapper<FeedbackDTO, Feedback> {

    @Named("toFeedbackDTO")
    FeedbackDTO toFeedbackDTO(CreateFeedBackInDTO source);
}
