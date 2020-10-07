package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement(name = "AIO_QUESTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSurveyCustomerRequest {
    public AIOCustomerDTO getCustomer() {
        return customer;
    }

    public void setCustomer(AIOCustomerDTO customer) {
        this.customer = customer;
    }

    private AIOCustomerDTO customer;
    private AIOQuestionDTO question;
    private Long surveyId;

    public AIOQuestionDTO getQuestion() {
        return question;
    }

    public void setQuestion(AIOQuestionDTO question) {
        this.question = question;
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public Long getPerformerId() {
        return performerId;
    }

    public void setPerformerId(Long performerId) {
        this.performerId = performerId;
    }

    private Long performerId;
}
