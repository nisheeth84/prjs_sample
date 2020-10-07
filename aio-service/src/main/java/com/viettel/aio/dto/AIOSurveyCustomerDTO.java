package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOSurveyCustomerBO;
import com.viettel.aio.bo.AIOSurveyQuestionBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.persistence.Column;
import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_SURVEY_CUSTOMER_BO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSurveyCustomerDTO extends ComsBaseFWDTO<AIOSurveyCustomerBO> {

	public static final long STATUS_ACTIVE = 1;

	private Long aioSurveyCustomerId;
	private Long customerId;
	private String customerName;
	private String customerAddress;
	private String customerPhone;
	private String customerEmail;
	private Long surveyId;
	private Long performerId;
	private Long status;
	private Date startDate;
	private Date endDate;
	private String performerCode;
	private String performerName;
	private Long sysGroupLv2Id;
	private String sysGroupLv2Name;

	@Override
	public AIOSurveyCustomerBO toModel() {
		AIOSurveyCustomerBO obj = new AIOSurveyCustomerBO();
		obj.setAioSurveyCustomerId(aioSurveyCustomerId);
		obj.setCustomerId(aioSurveyCustomerId);
		obj.setCustomerName(customerName);
		obj.setCustomerAddress(customerAddress);
		obj.setCustomerEmail(customerEmail);
		obj.setCustomerPhone(customerPhone);
		obj.setStartDate(startDate);
		obj.setEndDate(endDate);
		obj.setSurveyId(surveyId);
		obj.setStatus(status);
		obj	.setStartDate(startDate);
		obj.setPerformerId(performerId);
		return obj;
	}

	@Override
	public Long getFWModelId() {
		return aioSurveyCustomerId;
	}

	@Override
	public String catchName() {
		return aioSurveyCustomerId.toString();
	}

	public Long getAioSurveyCustomerId() {
		return aioSurveyCustomerId;
	}

	public void setAioSurveyCustomerId(Long aioSurveyCustomerId) {
		this.aioSurveyCustomerId = aioSurveyCustomerId;
	}

	public Long getCustomerId() {
		return customerId;
	}

	public void setCustomerId(Long customerId) {
		this.customerId = customerId;
	}

	public String getCustomerName() {
		return customerName;
	}

	public void setCustomerName(String customerName) {
		this.customerName = customerName;
	}

	public String getCustomerAddress() {
		return customerAddress;
	}

	public void setCustomerAddress(String customerAddress) {
		this.customerAddress = customerAddress;
	}

	public String getCustomerPhone() {
		return customerPhone;
	}

	public void setCustomerPhone(String customerPhone) {
		this.customerPhone = customerPhone;
	}

	public String getCustomerEmail() {
		return customerEmail;
	}

	public void setCustomerEmail(String customerEmail) {
		this.customerEmail = customerEmail;
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

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public String getPerformerCode() {
		return performerCode;
	}

	public void setPerformerCode(String performerCode) {
		this.performerCode = performerCode;
	}

	public String getPerformerName() {
		return performerName;
	}

	public void setPerformerName(String performerName) {
		this.performerName = performerName;
	}

	public Long getSysGroupLv2Id() {
		return sysGroupLv2Id;
	}

	public void setSysGroupLv2Id(Long sysGroupLv2Id) {
		this.sysGroupLv2Id = sysGroupLv2Id;
	}

	public String getSysGroupLv2Name() {
		return sysGroupLv2Name;
	}

	public void setSysGroupLv2Name(String sysGroupLv2Name) {
		this.sysGroupLv2Name = sysGroupLv2Name;
	}
}
