package com.viettel.aio.request.survey;

import com.viettel.aio.dto.QuestionForCustomerDTO;
import com.viettel.aio.request.RequestBase;

public class RequestSurveyCustomer extends RequestBase {

    private Long surveyId;
    private Long surveyCustomerId;

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public Long getSurveyCustomerId() {
        return surveyCustomerId;
    }

    public void setSurveyCustomerId(Long surveyCustomerId) {
        this.surveyCustomerId = surveyCustomerId;
    }

    public QuestionForCustomerDTO getQuestionForCustomerDTO() {
        return questionForCustomerDTO;
    }

    public void setQuestionForCustomerDTO(QuestionForCustomerDTO questionForCustomerDTO) {
        this.questionForCustomerDTO = questionForCustomerDTO;
    }

    private QuestionForCustomerDTO questionForCustomerDTO;
}
