/* 
 * Copyright 2011 Viettel Telecom. All rights reserved. 
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms. 
 */
package com.viettel.aio.bo;

import com.viettel.aio.dto.BiddingPackageDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "BIDDING_PACKAGE")
/**
 *
 * @author: PhongPV
 * @version: 1.0
 * @since: 1.0
 */
public class BiddingPackageBO extends BaseFWModelImpl {

	private Long biddingPackageId;
	private String code;
	private String name;
	private Double price;
	private Long procurementFormsId;
	private Long investmentOwnerType;
	private String content;
	private Date signDate;
	private Long status;
	private Date createdDate;
	private Long createdUserId;
	private Long createdGroupId;
	private Date updatedDate;
	private Long updatedUserId;
	private Long updatedGroupId;



	public BiddingPackageBO() {
		setColId("biddingPackageId");
		setColName("biddingPackageId");
		setUniqueColumn(new String[] { "biddingPackageId" });
	}



	@Column(name = "NAME", length = 500)
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "BPE_SEQ") })
	@Column(name = "BIDDING_PACKAGE_ID")
	public Long getBiddingPackageId() {
		return biddingPackageId;
	}
	public void setBiddingPackageId(Long biddingPackageId) {
		this.biddingPackageId = biddingPackageId;
	}

	@Column(name = "CODE", length = 100)
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}

	@Column(name = "PRICE", length = 38)
	public Double getPrice() {
		return price;
	}
	public void setPrice(Double price) {
		this.price = price;
	}

	@Column(name = "PROCUREMENT_FORMS_ID", length = 2)
	public Long getProcurementFormsId() {
		return procurementFormsId;
	}
	public void setProcurementFormsId(Long procurementFormsId) {
		this.procurementFormsId = procurementFormsId;
	}

	@Column(name = "INVESTMENT_OWNER_TYPE", length = 2)
	public Long getInvestmentOwnerType() {
		return investmentOwnerType;
	}
	public void setInvestmentOwnerType(Long investmentOwnerType) {
		this.investmentOwnerType = investmentOwnerType;
	}

	@Column(name = "CONTENT", length = 2000)
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}

	@Column(name = "SIGN_DATE")
	public Date getSignDate() {
		return signDate;
	}
	public void setSignDate(Date signDate) {
		this.signDate = signDate;
	}

	@Column(name = "STATUS", length = 2)
	public Long getStatus() {
		return status;
	}
	public void setStatus(Long status) {
		this.status = status;
	}

	@Column(name = "CREATED_DATE")
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	@Column(name = "CREATED_USER_ID", length = 11)
	public Long getCreatedUserId() {
		return createdUserId;
	}
	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}

	@Column(name = "CREATED_GROUP_ID", length = 11)
	public Long getCreatedGroupId() {
		return createdGroupId;
	}
	public void setCreatedGroupId(Long createdGroupId) {
		this.createdGroupId = createdGroupId;
	}

	@Column(name = "UPDATED_DATE")
	public Date getUpdatedDate() {
		return updatedDate;
	}
	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	@Column(name = "UPDATED_USER_ID", length = 11)
	public	Long getUpdatedUserId() {
		return updatedUserId;
	}

	public void setUpdatedUserId(Long updatedUserId) {
		this.updatedUserId = updatedUserId;
	}

	@Column(name = "UPDATED_GROUP_ID", length = 1)
	public Long getUpdatedGroupId() {
		return updatedGroupId;
	}
	public void setUpdatedGroupId(Long updatedGroupId) {
		this.updatedGroupId = updatedGroupId;
	}
	
	@Override
	public BiddingPackageDTO toDTO() {
		BiddingPackageDTO bidPackageDTO = new BiddingPackageDTO();
		// set cac gia tri
		bidPackageDTO.setBiddingPackageId(this.biddingPackageId);
		bidPackageDTO.setName(this.name);
		bidPackageDTO.setCode(code);
		bidPackageDTO.setContent(content);
		bidPackageDTO.setCreatedDate(createdDate);
		bidPackageDTO.setCreatedGroupId(createdGroupId);
		bidPackageDTO.setCreatedUserId(createdUserId);
		bidPackageDTO.setPrice(price);
		bidPackageDTO.setProcurementFormsId(procurementFormsId);
		bidPackageDTO.setInvestmentOwnerType(investmentOwnerType);
		bidPackageDTO.setSignDate(signDate);
		bidPackageDTO.setStatus(status);
		bidPackageDTO.setUpdatedDate(updatedDate);
		bidPackageDTO.setUpdatedGroupId(updatedGroupId);;
		bidPackageDTO.setUpdatedUserId(updatedUserId);
		return bidPackageDTO;
	}
}
