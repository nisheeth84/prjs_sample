package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOSurveyDTO;
import com.viettel.aio.dto.AIOSurveyQuestionDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//anhnd
@Entity
@Table(name = "AIO_SURVEY_QUESTION")
public class AIOSurveyQuestionBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_SURVEY_QUESTION_SEQ")})
    @Column(name = "AIO_SURVEY_QUESTION_ID", length = 10)
    private Long surveyQuestionId;
    @Column(name = "SURVEY_ID", length = 10)
    private Long surveyId;
    @Column(name = "QUESTION_ID", length = 10)
    private Long questionId;

    public Long getSurveyQuestionId() {
        return surveyQuestionId;
    }

    public void setSurveyQuestionId(Long surveyQuestionId) {
        this.surveyQuestionId = surveyQuestionId;
    }

    public Long getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Long surveyId) {
        this.surveyId = surveyId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    @Override
    public BaseFWDTOImpl toDTO() {

        AIOSurveyQuestionDTO obj = new AIOSurveyQuestionDTO();
        obj.setSurveyId(surveyId);
        obj.setQuestionId(questionId);
        obj.setSurveyQuestionId(surveyQuestionId);
        return obj;
    }


}
