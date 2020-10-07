package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOSurveyBO;
import com.viettel.aio.bo.AIOSurveyQuestionBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.persistence.Column;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_SURVEY_QUESTION_BO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSurveyQuestionDTO extends ComsBaseFWDTO<AIOSurveyQuestionBO> {
	private Long surveyQuestionId;
	private Long surveyId;
	private Long questionId;


	@Override
	public AIOSurveyQuestionBO toModel() {
		AIOSurveyQuestionBO obj = new AIOSurveyQuestionBO();
		obj.setSurveyId(surveyId);
		obj.setQuestionId(questionId);
		obj.setSurveyQuestionId(surveyQuestionId);
		return obj;
	}

	@Override
	public Long getFWModelId() {
		return surveyQuestionId;
	}

	@Override
	public String catchName() {
		return surveyQuestionId.toString();
	}

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
}
