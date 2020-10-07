/* 
 * Copyright 2011 Viettel Telecom. All rights reserved. 
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms. 
 */
package com.viettel.aio.bo;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.service.base.model.BaseFWModelImpl;
import com.viettel.aio.dto.AIOSynStockTransDTO;

@Entity
@Table(name = "STOCK_TRANS")
/**
 *
 * @author: PhongPV
 * @version: 1.0
 * @since: 1.0
 */
public class StockTransBO extends BaseFWModelImpl {

	private java.lang.Long stockTransId;
	private java.lang.Long orderId;
	private java.lang.String orderCode;
	private java.lang.String code;
	private java.lang.String type;
	private java.lang.Long stockId;
	private java.lang.String status;
	private java.lang.String signState;
	private java.lang.Long fromStockTransId;
	private java.lang.String description;
	private java.lang.Long createdBy;
	private java.lang.String createdByName;
	private java.util.Date createdDate;
	private java.lang.Long createdDeptId;
	private java.lang.String createdDeptName;
	private java.lang.Long updatedBy;
	private java.util.Date updatedDate;
	private java.util.Date realIeTransDate;
	private java.lang.String realIeUserId;
	private java.lang.String realIeUserName;
	private java.lang.Long shipperId;
	private java.lang.String shipperName;
	private java.util.Date cancelDate;
	private java.lang.Long cancelBy;
	private java.lang.String cancelByName;
	private java.lang.String cancelReasonName;
	private java.lang.String cancelDescription;
	private java.lang.String vofficeTransactionCode;
	private java.lang.String shipmentCode;
	private java.lang.String contractCode;
	private java.lang.Long custId;
	private java.lang.String projectCode;
	private java.lang.String businessTypeName;
	private java.lang.String businessType;
	private String inRoal;
	private Long deptReceiveId;
	private String deptReceiveName;
	private java.lang.String stockReceiveCode;
	private java.lang.Long stockReceiveId;
	private java.lang.Long isReturn;
	private String confirm;
	private Long constructionId;
	private java.lang.String constructionCode;
	private Long workItemId;
	// private java.lang.Long merEntityId;
	private java.lang.Long assetManagermentRequestId;
	private java.lang.String stockName;
	private java.lang.String stockCode;

	private java.lang.Long lastShipperId;
//	aio_20190323_start
	private java.lang.Long approved;
//	aio_20190323_end
	
	private Long isFromTemp;

	public StockTransBO() {
		setColId("orderId");
		setColName("orderId");
		setUniqueColumn(new String[] { "orderId" });
	}

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
			@Parameter(name = "sequence", value = "STOCK_TRANS_SEQ") })
	@Column(name = "STOCK_TRANS_ID", length = 22)
	public java.lang.Long getStockTransId() {
		return stockTransId;
	}

	public void setStockTransId(java.lang.Long stockTransId) {
		this.stockTransId = stockTransId;
	}

	@Column(name = "ORDER_ID", length = 22)
	public java.lang.Long getOrderId() {
		return orderId;
	}

	public void setOrderId(java.lang.Long orderId) {
		this.orderId = orderId;
	}

	@Column(name = "WORK_ITEM_ID", length = 10)
	public Long getWorkItemId() {
		return workItemId;
	}

	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
	}

	@Column(name = "CUST_ID", length = 22)
	public java.lang.Long getCustId() {
		return custId;
	}

	public void setCustId(java.lang.Long custId) {
		this.custId = custId;
	}

	@Column(name = "ORDER_CODE", length = 22)
	public java.lang.String getOrderCode() {
		return orderCode;
	}

	public void setOrderCode(java.lang.String orderCode) {
		this.orderCode = orderCode;
	}

	@Column(name = "CODE", length = 200)
	public java.lang.String getCode() {
		return code;
	}

	public void setCode(java.lang.String code) {
		this.code = code;
	}

	@Column(name = "TYPE", length = 2)
	public java.lang.String getType() {
		return type;
	}

	public void setType(java.lang.String type) {
		this.type = type;
	}

	@Column(name = "STOCK_ID", length = 22)
	public java.lang.Long getStockId() {
		return stockId;
	}

	public void setStockId(java.lang.Long stockId) {
		this.stockId = stockId;
	}

	@Column(name = "STATUS", length = 20)
	public java.lang.String getStatus() {
		return status;
	}

	public void setStatus(java.lang.String status) {
		this.status = status;
	}

	@Column(name = "SIGN_STATE", length = 4)
	public java.lang.String getSignState() {
		return signState;
	}

	public void setSignState(java.lang.String signState) {
		this.signState = signState;
	}

	@Column(name = "FROM_STOCK_TRANS_ID", length = 22)
	public java.lang.Long getFromStockTransId() {
		return fromStockTransId;
	}

	public void setFromStockTransId(java.lang.Long fromStockTransId) {
		this.fromStockTransId = fromStockTransId;
	}

	@Column(name = "DESCRIPTION", length = 2000)
	public java.lang.String getDescription() {
		return description;
	}

	public void setDescription(java.lang.String description) {
		this.description = description;
	}

	@Column(name = "CREATED_BY", length = 22)
	public java.lang.Long getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(java.lang.Long createdBy) {
		this.createdBy = createdBy;
	}

	@Column(name = "CREATED_BY_NAME", length = 200)
	public java.lang.String getCreatedByName() {
		return createdByName;
	}

	public void setCreatedByName(java.lang.String createdByName) {
		this.createdByName = createdByName;
	}

	@Column(name = "CREATED_DATE", length = 10)
	public java.util.Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate) {
		this.createdDate = createdDate;
	}

	@Column(name = "CREATED_DEPT_ID", length = 22)
	public java.lang.Long getCreatedDeptId() {
		return createdDeptId;
	}

	public void setCreatedDeptId(java.lang.Long createdDeptId) {
		this.createdDeptId = createdDeptId;
	}

	@Column(name = "CREATED_DEPT_NAME", length = 200)
	public java.lang.String getCreatedDeptName() {
		return createdDeptName;
	}

	public void setCreatedDeptName(java.lang.String createdDeptName) {
		this.createdDeptName = createdDeptName;
	}

	@Column(name = "UPDATED_BY", length = 22)
	public java.lang.Long getUpdatedBy() {
		return updatedBy;
	}

	public void setUpdatedBy(java.lang.Long updatedBy) {
		this.updatedBy = updatedBy;
	}

	@Column(name = "UPDATED_DATE", length = 7)
	public java.util.Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	@Column(name = "REAL_IE_TRANS_DATE", length = 7)
	public java.util.Date getRealIeTransDate() {
		return realIeTransDate;
	}

	public void setRealIeTransDate(java.util.Date realIeTransDate) {
		this.realIeTransDate = realIeTransDate;
	}

	@Column(name = "REAL_IE_USER_ID", length = 20)
	public java.lang.String getRealIeUserId() {
		return realIeUserId;
	}

	public void setRealIeUserId(java.lang.String realIeUserId) {
		this.realIeUserId = realIeUserId;
	}

	@Column(name = "REAL_IE_USER_NAME", length = 200)
	public java.lang.String getRealIeUserName() {
		return realIeUserName;
	}

	public void setRealIeUserName(java.lang.String realIeUserName) {
		this.realIeUserName = realIeUserName;
	}

	@Column(name = "SHIPPER_ID", length = 22)
	public java.lang.Long getShipperId() {
		return shipperId;
	}

	public void setShipperId(java.lang.Long shipperId) {
		this.shipperId = shipperId;
	}

	@Column(name = "SHIPPER_NAME", length = 200)
	public java.lang.String getShipperName() {
		return shipperName;
	}

	public void setShipperName(java.lang.String shipperName) {
		this.shipperName = shipperName;
	}

	@Column(name = "CANCEL_DATE", length = 7)
	public java.util.Date getCancelDate() {
		return cancelDate;
	}

	public void setCancelDate(java.util.Date cancelDate) {
		this.cancelDate = cancelDate;
	}

	@Column(name = "CANCEL_BY_NAME", length = 200)
	public java.lang.String getCancelByName() {
		return cancelByName;
	}

	public void setCancelByName(java.lang.String cancelByName) {
		this.cancelByName = cancelByName;
	}

	@Column(name = "CANCEL_REASON_NAME", length = 20)
	public java.lang.String getCancelReasonName() {
		return cancelReasonName;
	}

	public void setCancelReasonName(java.lang.String cancelReasonName) {
		this.cancelReasonName = cancelReasonName;
	}

	@Column(name = "CANCEL_DESCRIPTION", length = 20)
	public java.lang.String getCancelDescription() {
		return cancelDescription;
	}

	public void setCancelDescription(java.lang.String cancelDescription) {
		this.cancelDescription = cancelDescription;
	}

	@Column(name = "VOFFICE_TRANSACTION_CODE", length = 200)
	public java.lang.String getVofficeTransactionCode() {
		return vofficeTransactionCode;
	}

	public void setVofficeTransactionCode(java.lang.String vofficeTransactionCode) {
		this.vofficeTransactionCode = vofficeTransactionCode;
	}

	@Column(name = "SHIPMENT_CODE", length = 100)
	public java.lang.String getShipmentCode() {
		return shipmentCode;
	}

	public void setShipmentCode(java.lang.String shipmentCode) {
		this.shipmentCode = shipmentCode;
	}

	@Column(name = "CONTRACT_CODE", length = 100)
	public java.lang.String getContractCode() {
		return contractCode;
	}

	public void setContractCode(java.lang.String contractCode) {
		this.contractCode = contractCode;
	}

	@Column(name = "PROJECT_CODE", length = 100)
	public java.lang.String getProjectCode() {
		return projectCode;
	}

	public void setProjectCode(java.lang.String projectCode) {
		this.projectCode = projectCode;
	}

	@Column(name = "BUSINESS_TYPE_NAME", length = 100)
	public java.lang.String getBusinessTypeName() {
		return businessTypeName;
	}

	public void setBusinessTypeName(java.lang.String businessTypeName) {
		this.businessTypeName = businessTypeName;
	}

	@Column(name = "BUSINESS_TYPE", length = 2)
	public java.lang.String getBusinessType() {
		return businessType;
	}

	public void setBusinessType(java.lang.String business) {
		this.businessType = business;
	}

	@Column(name = "CANCEL_BY", length = 10)
	public java.lang.Long getCancelBy() {
		return cancelBy;
	}

	public void setCancelBy(java.lang.Long cancelBy) {
		this.cancelBy = cancelBy;
	}

	@Column(name = "IN_ROAL", length = 2)
	public String getInRoal() {
		return inRoal;
	}

	public void setInRoal(String inRoal) {
		this.inRoal = inRoal;
	}

	@Column(name = "DEPT_RECEIVE_ID", length = 10)
	public Long getDeptReceiveId() {
		return deptReceiveId;
	}

	public void setDeptReceiveId(Long deptReceiveId) {
		this.deptReceiveId = deptReceiveId;
	}

	@Column(name = "DEPT_RECEIVE_NAME", length = 100)
	public String getDeptReceiveName() {
		return deptReceiveName;
	}

	public void setDeptReceiveName(String deptReceiveName) {
		this.deptReceiveName = deptReceiveName;
	}

	@Column(name = "STOCK_RECEIVE_CODE", length = 100)
	public java.lang.String getStockReceiveCode() {
		return stockReceiveCode;
	}

	public void setStockReceiveCode(java.lang.String stockReceiveCode) {
		this.stockReceiveCode = stockReceiveCode;
	}

	@Column(name = "STOCK_RECEIVE_ID", length = 10)
	public java.lang.Long getStockReceiveId() {
		return stockReceiveId;
	}

	public void setStockReceiveId(java.lang.Long stockReceiveId) {
		this.stockReceiveId = stockReceiveId;
	}

	@Column(name = "IS_RETURN", length = 1)
	public java.lang.Long getIsReturn() {
		return isReturn;
	}

	public void setIsReturn(java.lang.Long isReturn) {
		this.isReturn = isReturn;
	}

	/*
	 * @Column(name = "MER_ENTITY_ID", length = 10) public java.lang.Long
	 * getMerEntityId() { return merEntityId; }
	 * 
	 * public void setMerEntityId(java.lang.Long merEntityId) { this.merEntityId =
	 * merEntityId; }
	 */

	@Override
	public AIOSynStockTransDTO toDTO() {
		AIOSynStockTransDTO stockTransDTO = new AIOSynStockTransDTO();
		// set cac gia tri
		stockTransDTO.setStockTransId(this.stockTransId);
		stockTransDTO.setOrderId(this.orderId);
		stockTransDTO.setOrderCode(this.orderCode);
		stockTransDTO.setCode(this.code);
		stockTransDTO.setType(this.type);
		stockTransDTO.setStockId(this.stockId);
		stockTransDTO.setStatus(this.status);
		stockTransDTO.setSignState(this.signState);
		stockTransDTO.setFromStockTransId(this.fromStockTransId);
		stockTransDTO.setDescription(this.description);
		stockTransDTO.setCreatedBy(this.createdBy);
		stockTransDTO.setCreatedByName(this.createdByName);
		stockTransDTO.setCreatedDate(this.createdDate);
		stockTransDTO.setCreatedDeptId(this.createdDeptId);
		stockTransDTO.setCreatedDeptName(this.createdDeptName);
		stockTransDTO.setUpdatedBy(this.updatedBy);
		stockTransDTO.setUpdatedDate(this.updatedDate);
		stockTransDTO.setRealIeTransDate(this.realIeTransDate);
		stockTransDTO.setRealIeUserId(this.realIeUserId);
		stockTransDTO.setRealIeUserName(this.realIeUserName);
		stockTransDTO.setShipperId(this.shipperId);
		stockTransDTO.setShipperName(this.shipperName);
		stockTransDTO.setCancelDate(this.cancelDate);
		stockTransDTO.setCancelByName(this.cancelByName);
		stockTransDTO.setCancelReasonName(this.cancelReasonName);
		stockTransDTO.setCancelDescription(this.cancelDescription);
		stockTransDTO.setVofficeTransactionCode(this.vofficeTransactionCode);
		stockTransDTO.setShipmentCode(this.shipmentCode);
		stockTransDTO.setContractCode(this.contractCode);
		stockTransDTO.setProjectCode(this.projectCode);
		stockTransDTO.setBusinessTypeName(this.businessTypeName);
		stockTransDTO.setBusinessType(this.businessType);
		stockTransDTO.setCancelBy(this.cancelBy);
		stockTransDTO.setCustId(this.custId);
//		stockTransDTO.setIn_roal(this.inRoal);
		stockTransDTO.setDeptReceiveId(this.deptReceiveId);
		stockTransDTO.setDeptReceiveName(this.deptReceiveName);
		stockTransDTO.setStockReceiveCode(this.stockReceiveCode);
		stockTransDTO.setStockReceiveId(this.stockReceiveId);
//		stockTransDTO.setIsReturn(this.isReturn);
		stockTransDTO.setConstructionId(this.constructionId);
		stockTransDTO.setConstructionCode(this.constructionCode);
		// stockTransDTO.setMerEntityId(this.merEntityId);
//		stockTransDTO.setWorkItemId(workItemId);
//		stockTransDTO.setAssetManagermentRequestId(this.assetManagermentRequestId);
		stockTransDTO.setStockCode(this.stockCode);
		stockTransDTO.setStockName(this.stockName);
		stockTransDTO.setLastShipperId(this.lastShipperId);
//		stockTransDTO.setIsFromTemp(this.isFromTemp);
		//add 20181031 by tanqn
		stockTransDTO.setConfirm(this.confirm);
		//
//		aio_20190323_start
		stockTransDTO.setApproved(approved);
//		aio_20190323_end
		return stockTransDTO;
	}

	@Column(name = "CONSTRUCTION_ID", length = 22)
	public Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}

	@Column(name = "CONSTRUCTION_CODE", length = 22)
	public java.lang.String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(java.lang.String constructionCode) {
		this.constructionCode = constructionCode;
	}

	@Column(name = "ASSET_MANAGEMENT_REQUEST_ID", length = 10)
	public java.lang.Long getAssetManagermentRequestId() {
		return assetManagermentRequestId;
	}

	public void setAssetManagermentRequestId(java.lang.Long assetManagermentRequestId) {
		this.assetManagermentRequestId = assetManagermentRequestId;
	}

	@Column(name = "STOCK_NAME", length = 100)
	public java.lang.String getStockName() {
		return stockName;
	}

	public void setStockName(java.lang.String stockName) {
		this.stockName = stockName;
	}

	@Column(name = "STOCK_CODE", length = 100)
	public java.lang.String getStockCode() {
		return stockCode;
	}

	public void setStockCode(java.lang.String stockCode) {
		this.stockCode = stockCode;
	}

	@Column(name = "LAST_SHIPPER_ID", length = 22)
	public java.lang.Long getLastShipperId() {
		return lastShipperId;
	}

	public void setLastShipperId(java.lang.Long lastShipperId) {
		this.lastShipperId = lastShipperId;
	}

	@Column(name = "IS_FROM_TEMP", length = 2)
	public Long getIsFromTemp() {
		return isFromTemp;
	}

	public void setIsFromTemp(Long isFromTemp) {
		this.isFromTemp = isFromTemp;
	}

	public String getConfirm() {
		return confirm;
	}

	public void setConfirm(String confirm) {
		this.confirm = confirm;
	}

	public java.lang.Long getApproved() {
		return approved;
	}

	public void setApproved(java.lang.Long approved) {
		this.approved = approved;
	}
	
	
}
