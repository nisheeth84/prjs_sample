package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOSurveyCustomerDetailBO;
import com.viettel.aio.bo.AIOSurveyQuestionBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_SURVEY_QUESTION_BO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSurveyCustomerDetailDTO extends ComsBaseFWDTO<AIOSurveyCustomerDetailBO> {
	private Long aioSurveyCustomerDetialId;
	private Long aioSurveyCustomerId;


	@Override
	public AIOSurveyCustomerDetailBO toModel() {
		AIOSurveyCustomerDetailBO obj = new AIOSurveyCustomerDetailBO();
		obj.setAioSurveyCustomerDetialId(aioSurveyCustomerDetialId);
		obj.setAioSurveyCustomerId(aioSurveyCustomerId);
		return obj;
	}

	@Override
	public Long getFWModelId() {
		return aioSurveyCustomerDetialId;
	}

	@Override
	public String catchName() {
		return aioSurveyCustomerDetialId.toString();
	}

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
}
