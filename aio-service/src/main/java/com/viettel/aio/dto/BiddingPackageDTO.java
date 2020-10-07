/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.dto;

import com.viettel.aio.bo.BiddingPackageBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import com.viettel.utils.JsonDateDeserializer;
import com.viettel.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//import com.viettel.service.base.utils.StringUtils;

/**
 *
 * @author PhongPV
 */
@XmlRootElement(name = "BIDDING_PACKAGEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class BiddingPackageDTO extends ComsBaseFWDTO<BiddingPackageBO> {

	private Long biddingPackageId;
	private String code;
	private String name;
	private Double price;
	private Long procurementFormsId;
	private Long investmentOwnerType;
	private String content;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date signDate;
	private Long status;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date createdDate;
	private Long createdUserId;
	private Long createdGroupId;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date updatedDate;
	private Long updatedUserId;
	private Long updatedGroupId;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date signDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private Date signDateTo;
	private List<String> procurementFormsIdLst;

	@Override
	public BiddingPackageBO toModel() {
		BiddingPackageBO biddingPackage = new BiddingPackageBO();
		biddingPackage.setBiddingPackageId(this.biddingPackageId);
		biddingPackage.setName(this.name);
		biddingPackage.setCode(code);
		biddingPackage.setContent(content);
		biddingPackage.setCreatedDate(createdDate);
		biddingPackage.setCreatedGroupId(createdGroupId);
		biddingPackage.setCreatedUserId(createdUserId);
		biddingPackage.setPrice(price);
		biddingPackage.setProcurementFormsId(procurementFormsId);
		biddingPackage.setInvestmentOwnerType(investmentOwnerType);
		biddingPackage.setSignDate(signDate);
		biddingPackage.setStatus(status);
		biddingPackage.setUpdatedDate(updatedDate);
		biddingPackage.setUpdatedGroupId(updatedGroupId);;
		biddingPackage.setUpdatedUserId(updatedUserId);
		return biddingPackage;
	}

	@Override
	public Long getFWModelId() {
		return biddingPackageId;
	}

	@Override
	public String catchName() {
		return getId().toString();
	}

	public String getName() {
		return name;
	}

	public Long getBiddingPackageId() {
		return biddingPackageId;
	}

	public void setBiddingPackageId(Long biddingPackageId) {
		this.biddingPackageId = biddingPackageId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Long getProcurementFormsId() {
		return procurementFormsId;
	}

	public void setProcurementFormsId(Long procurementFormsId) {
		this.procurementFormsId = procurementFormsId;
	}

	public Long getInvestmentOwnerType() {
		return investmentOwnerType;
	}

	public void setInvestmentOwnerType(Long investmentOwnerType) {
		this.investmentOwnerType = investmentOwnerType;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public Date getSignDate() {
		return signDate;
	}

	public void setSignDate(Date signDate) {
		this.signDate = signDate;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getCreatedUserId() {
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}

	public Long getCreatedGroupId() {
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId) {
		this.createdGroupId = createdGroupId;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Long getUpdatedUserId() {
		return updatedUserId;
	}

	public void setUpdatedUserId(Long updatedUserId) {
		this.updatedUserId = updatedUserId;
	}

	public Long getUpdatedGroupId() {
		return updatedGroupId;
	}

	public void setUpdatedGroupId(Long updatedGroupId) {
		this.updatedGroupId = updatedGroupId;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Date getSignDateFrom() {
		return signDateFrom;
	}

	public void setSignDateFrom(Date signDateFrom) {
		this.signDateFrom = signDateFrom;
	}

	public Date getSignDateTo() {
		return signDateTo;
	}

	public void setSignDateTo(Date signDateTo) {
		this.signDateTo = signDateTo;
	}
	
	@JsonProperty("procurementFormsIdLst")
	public List<String> getProcurementFormsIdLst() {
		return procurementFormsIdLst;
	}

	public void setProcurementFormsIdLst(List<String> procurementFormsIdLst) {
		this.procurementFormsIdLst = procurementFormsIdLst;
	}

}
