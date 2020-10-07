package com.viettel.coms.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.coms.bo.ConstructionBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

@XmlRootElement(name = "CONSTRUCTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionTaskSlowDTO extends ComsBaseFWDTO<ConstructionBO> {

	private java.lang.String timeReport;
	private java.lang.String sysGroupName;
	private java.lang.String constructionCode;
	private java.lang.String workItemName;
	private java.lang.String taskName;
	private java.lang.String fullName;
	private java.lang.String email;
	private java.lang.String phoneNumber;
	private java.lang.String status;
	private java.lang.String month;
	private java.lang.String year;
	private List<String> sysGroupId;
	private java.lang.String provinceCode;
	private java.lang.String partnerName;
	
	public java.lang.String getProvinceCode() {
		return provinceCode;
	}

	public void setProvinceCode(java.lang.String provinceCode) {
		this.provinceCode = provinceCode;
	}

	public java.lang.String getPartnerName() {
		return partnerName;
	}

	public void setPartnerName(java.lang.String partnerName) {
		this.partnerName = partnerName;
	}

	public List<String> getSysGroupId() {
		return sysGroupId;
	}

	public void setSysGroupId(List<String> sysGroupId) {
		this.sysGroupId = sysGroupId;
	}

	public java.lang.String getMonth() {
		return month;
	}

	public void setMonth(java.lang.String month) {
		this.month = month;
	}

	public java.lang.String getYear() {
		return year;
	}

	public void setYear(java.lang.String year) {
		this.year = year;
	}

	@JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date startDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date endDate;
	
	
	public java.lang.String getTimeReport() {
		return timeReport;
	}

	public void setTimeReport(java.lang.String timeReport) {
		this.timeReport = timeReport;
	}

	public java.lang.String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(java.lang.String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}

	public java.lang.String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(java.lang.String constructionCode) {
		this.constructionCode = constructionCode;
	}

	public java.lang.String getWorkItemName() {
		return workItemName;
	}

	public void setWorkItemName(java.lang.String workItemName) {
		this.workItemName = workItemName;
	}

	public java.lang.String getTaskName() {
		return taskName;
	}

	public void setTaskName(java.lang.String taskName) {
		this.taskName = taskName;
	}

	public java.lang.String getFullName() {
		return fullName;
	}

	public void setFullName(java.lang.String fullName) {
		this.fullName = fullName;
	}

	public java.lang.String getEmail() {
		return email;
	}

	public void setEmail(java.lang.String email) {
		this.email = email;
	}

	public java.lang.String getPhoneNumber() {
		return phoneNumber;
	}

	public void setPhoneNumber(java.lang.String phoneNumber) {
		this.phoneNumber = phoneNumber;
	}

	public java.lang.String getStatus() {
		return status;
	}

	public void setStatus(java.lang.String status) {
		this.status = status;
	}

	public java.util.Date getStartDate() {
		return startDate;
	}

	public void setStartDate(java.util.Date startDate) {
		this.startDate = startDate;
	}

	public java.util.Date getEndDate() {
		return endDate;
	}

	public void setEndDate(java.util.Date endDate) {
		this.endDate = endDate;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public ConstructionBO toModel() {
		// TODO Auto-generated method stub
		return null;
	}

}
