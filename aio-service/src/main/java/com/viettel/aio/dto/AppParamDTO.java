/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.dto;

import com.viettel.aio.bo.AppParamBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author HungNX
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "APP_PARAMBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AppParamDTO extends ComsBaseFWDTO<AppParamBO> {
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date updatedDate;
	private Long updatedBy;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private java.util.Date createdDate;
	private Long createdBy;
	private String description;
	private Long appParamId;
	private String parOrder;
	private String parType;
	private String name;
	private String code;
	private String status;

	@Override
	public AppParamBO toModel() {
		AppParamBO appParamBO = new AppParamBO();
		appParamBO.setUpdatedDate(this.updatedDate);
		appParamBO.setUpdatedBy(this.updatedBy);
		appParamBO.setCreatedDate(this.createdDate);
		appParamBO.setCreatedBy(this.createdBy);
		appParamBO.setDescription(this.description);
		appParamBO.setAppParamId(this.appParamId);
		appParamBO.setParOrder(this.parOrder);
		appParamBO.setParType(this.parType);
		appParamBO.setName(this.name);
		appParamBO.setCode(this.code);
		appParamBO.setStatus(this.status);
		return appParamBO;
	}

	public java.util.Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Long getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(Long updatedBy) {
		this.updatedBy = updatedBy;
	}

	public java.util.Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Long createdBy) {
		this.createdBy = createdBy;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	@Override
	public Long getFWModelId() {
		return appParamId;
	}

	@Override
	public String catchName() {
		return getAppParamId().toString();
	}

	public Long getAppParamId() {
		return appParamId;
	}

	public void setAppParamId(Long appParamId) {
		this.appParamId = appParamId;
	}

	public String getParOrder() {
		return parOrder;
	}

	public void setParOrder(String parOrder) {
		this.parOrder = parOrder;
	}

	public String getParType() {
		return parType;
	}

	public void setParType(String parType) {
		this.parType = org.apache.commons.lang3.StringUtils.isNotEmpty(parType) ? parType.toUpperCase():null;
	}


	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = org.apache.commons.lang3.StringUtils.isNotEmpty(code) ? code.toUpperCase():null;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

}
