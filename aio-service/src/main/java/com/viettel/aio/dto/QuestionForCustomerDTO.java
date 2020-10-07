package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "AIO_QUESTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class QuestionForCustomerDTO {

    public List<AIOQuestionDTO> getAioQuestions() {
        return aioQuestions;
    }

    public void setAioQuestions(List<AIOQuestionDTO> aioQuestions) {
        this.aioQuestions = aioQuestions;
    }

    List<AIOQuestionDTO> aioQuestions;

    public List<AIOCustomerDTO> getAioCustomers() {
        return aioCustomers;
    }

    public void setAioCustomers(List<AIOCustomerDTO> aioCustomers) {
        this.aioCustomers = aioCustomers;
    }

    List<AIOCustomerDTO> aioCustomers;

}
