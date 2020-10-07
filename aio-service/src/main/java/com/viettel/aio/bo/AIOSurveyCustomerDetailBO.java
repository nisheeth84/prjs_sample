package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOSurveyCustomerDetailDTO;
import com.viettel.aio.dto.AIOSurveyQuestionDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//anhnd
@Entity
@Table(name = "AIO_SURVEY_CUSTOMER_DETAIL")
public class AIOSurveyCustomerDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_SURVEY_CUSTOMER_DETAIL_SEQ")})
    @Column(name = "AIO_SURVEY_CUSTOMER_DETAIL_ID", length = 10)
    private Long aioSurveyCustomerDetialId;
    @Column(name = "AIO_SURVEY_CUSTOMER_ID", length = 10)
    private Long aioSurveyCustomerId;

    public Long getAioSurveyCustomerDetialId() {
        return aioSurveyCustomerDetialId;
    }

    public void setAioSurveyCustomerDetialId(Long aioSurveyCustomerDetialId) {
        this.aioSurveyCustomerDetialId = aioSurveyCustomerDetialId;
    }

    public Long getAioSurveyCustomerId() {
        return aioSurveyCustomerId;
    }

    public void setAioSurveyCustomerId(Long aioSurveyCustomerId) {
        this.aioSurveyCustomerId = aioSurveyCustomerId;
    }

    @Override
    public BaseFWDTOImpl toDTO() {

        AIOSurveyCustomerDetailDTO obj = new AIOSurveyCustomerDetailDTO();
        obj.setAioSurveyCustomerDetialId(aioSurveyCustomerDetialId);
        obj.setAioSurveyCustomerId(aioSurveyCustomerId);
        return obj;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    @Column(name = "QUESTION_ID")
    private Long questionId;

    @Column(name = "type")
    private int type;
    @Column(name = "ANSWER")
    private String answer;

}
