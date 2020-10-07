package com.viettel.aio.business;

import com.viettel.aio.bo.AIOSurveyBO;
import com.viettel.aio.dto.*;
import com.viettel.service.base.business.BaseFWBusiness;
import com.viettel.service.base.dto.DataListDTO;

import java.io.InputStream;
import java.util.List;

public interface AIOSurveyBusiness extends BaseFWBusiness<AIOSurveyDTO, AIOSurveyBO> {
    DataListDTO doSearch(AIOSurveyDTO obj, Long sysUserId);

    Long doDelete(AIOSurveyDTO obj);

    List<AIOQuestionDTO> getQuestions(Long surveyId);

    List<AIOSurveyCustomerDTO> getPerformers(Long surveyId);

    void removeQuestions(Long surveyId);

    void removeSurveyCustomer(Long surveyId);

    AIOSurveyDTO checkPerformers(InputStream is) throws Exception;

    List<AIOSurveyDTO> getAioSurveyCustomer(Long performerId);


    QuestionForCustomerDTO getQuestionForCustomer(Long performerId, Long surveyId);

    void updateQuestionForCustomer(Long sysGroupId,Long performerId, Long surveyId,Long surveyCustomerId, AIOCustomerDTO customerDTO,List<AIOQuestionDTO> questionDTOs) throws  Exception;

}
