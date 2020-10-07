/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.SynStockTransDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "SYN_STOCK_TRANS")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class SynStockTransBO extends BaseFWModelImpl {

    private java.lang.Long synStockTransId;
    private java.lang.Long orderId;
    private java.lang.String orderCode;
    private java.lang.String code;
    private java.lang.String type;
    private java.lang.Long stockId;
    private java.lang.String status;
    private java.lang.String signState;
    private java.lang.Long fromStockTransId;
    private java.lang.String description;
    private java.lang.String createdByName;
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
    private java.lang.String cancelReasonName;
    private java.lang.String cancelDescription;
    private java.lang.String vofficeTransactionCode;
    private java.lang.String shipmentCode;
    private java.lang.String contractCode;
    private java.lang.String projectCode;
    private java.lang.Long custId;
    private java.lang.Long createdBy;
    private java.util.Date createdDate;
    private java.lang.String cancelByName;
    private java.lang.String bussinessTypeName;
    private java.lang.String inRoal;
    private java.lang.String deptReceiveName;
    private java.lang.Long deptReceiveId;
    private java.lang.Long stockReceiveId;
    private java.lang.String stockReceiveCode;
    private java.lang.Long partnerId;
    private java.lang.String synTransType;
    private java.lang.String stockCode;
    private java.lang.String stockName;
    private java.lang.String confirm;
    private java.lang.String state;

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "SYN_STOCK_TRANS_SEQ")})
    @Column(name = "SYN_STOCK_TRANS_ID", length = 22)
    public java.lang.Long getSynStockTransId() {
        return synStockTransId;
    }

    public void setSynStockTransId(java.lang.Long synStockTransId) {
        this.synStockTransId = synStockTransId;
    }

    @Column(name = "ORDER_ID", length = 22)
    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

    @Column(name = "ORDER_CODE", length = 200)
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

    @Column(name = "DESCRIPTION", length = 200)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "CREATED_BY_NAME", length = 200)
    public java.lang.String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(java.lang.String createdByName) {
        this.createdByName = createdByName;
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

    @Column(name = "REAL_IE_TRANS_DATE", length = 11)
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

    @Column(name = "CANCEL_BY", length = 22)
    public java.lang.Long getCancelBy() {
        return cancelBy;
    }

    public void setCancelBy(java.lang.Long cancelBy) {
        this.cancelBy = cancelBy;
    }

    @Column(name = "CANCEL_REASON_NAME", length = 200)
    public java.lang.String getCancelReasonName() {
        return cancelReasonName;
    }

    public void setCancelReasonName(java.lang.String cancelReasonName) {
        this.cancelReasonName = cancelReasonName;
    }

    @Column(name = "CANCEL_DESCRIPTION", length = 200)
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

    @Column(name = "CUST_ID", length = 22)
    public java.lang.Long getCustId() {
        return custId;
    }

    public void setCustId(java.lang.Long custId) {
        this.custId = custId;
    }

    @Column(name = "CREATED_BY", length = 22)
    public java.lang.Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(java.lang.Long createdBy) {
        this.createdBy = createdBy;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "CANCEL_BY_NAME", length = 20)
    public java.lang.String getCancelByName() {
        return cancelByName;
    }

    public void setCancelByName(java.lang.String cancelByName) {
        this.cancelByName = cancelByName;
    }

    @Column(name = "BUSSINESS_TYPE_NAME", length = 200)
    public java.lang.String getBussinessTypeName() {
        return bussinessTypeName;
    }

    public void setBussinessTypeName(java.lang.String bussinessTypeName) {
        this.bussinessTypeName = bussinessTypeName;
    }

    @Column(name = "IN_ROAL", length = 2)
    public java.lang.String getInRoal() {
        return inRoal;
    }

    public void setInRoal(java.lang.String inRoal) {
        this.inRoal = inRoal;
    }

    @Column(name = "DEPT_RECEIVE_NAME", length = 200)
    public java.lang.String getDeptReceiveName() {
        return deptReceiveName;
    }

    public void setDeptReceiveName(java.lang.String deptReceiveName) {
        this.deptReceiveName = deptReceiveName;
    }

    @Column(name = "DEPT_RECEIVE_ID", length = 22)
    public java.lang.Long getDeptReceiveId() {
        return deptReceiveId;
    }

    public void setDeptReceiveId(java.lang.Long deptReceiveId) {
        this.deptReceiveId = deptReceiveId;
    }

    @Column(name = "STOCK_RECEIVE_ID", length = 22)
    public java.lang.Long getStockReceiveId() {
        return stockReceiveId;
    }

    public void setStockReceiveId(java.lang.Long stockReceiveId) {
        this.stockReceiveId = stockReceiveId;
    }

    @Column(name = "STOCK_RECEIVE_CODE", length = 100)
    public java.lang.String getStockReceiveCode() {
        return stockReceiveCode;
    }

    public void setStockReceiveCode(java.lang.String stockReceiveCode) {
        this.stockReceiveCode = stockReceiveCode;
    }

    @Column(name = "PARTNER_ID", length = 22)
    public java.lang.Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(java.lang.Long partnerId) {
        this.partnerId = partnerId;
    }

    @Column(name = "SYN_TRANS_TYPE", length = 4)
    public java.lang.String getSynTransType() {
        return synTransType;
    }

    public void setSynTransType(java.lang.String synTransType) {
        this.synTransType = synTransType;
    }

    @Column(name = "STOCK_CODE", length = 200)
    public java.lang.String getStockCode() {
        return stockCode;
    }

    public void setStockCode(java.lang.String stockCode) {
        this.stockCode = stockCode;
    }

    @Column(name = "STOCK_NAME", length = 2000)
    public java.lang.String getStockName() {
        return stockName;
    }

    public void setStockName(java.lang.String stockName) {
        this.stockName = stockName;
    }

    @Column(name = "CONFIRM", length = 2)
    public java.lang.String getConfirm() {
        return confirm;
    }

    public void setConfirm(java.lang.String confirm) {
        this.confirm = confirm;
    }

    @Override
    public SynStockTransDTO toDTO() {
        SynStockTransDTO synStockTransDTO = new SynStockTransDTO();
        // set cac gia tri
        synStockTransDTO.setSynStockTransId(this.synStockTransId);
        synStockTransDTO.setOrderId(this.orderId);
        synStockTransDTO.setOrderCode(this.orderCode);
        synStockTransDTO.setCode(this.code);
        synStockTransDTO.setType(this.type);
        synStockTransDTO.setStockId(this.stockId);
        synStockTransDTO.setStatus(this.status);
        synStockTransDTO.setSignState(this.signState);
        synStockTransDTO.setFromStockTransId(this.fromStockTransId);
        synStockTransDTO.setDescription(this.description);
        synStockTransDTO.setCreatedByName(this.createdByName);
        synStockTransDTO.setCreatedDeptId(this.createdDeptId);
        synStockTransDTO.setCreatedDeptName(this.createdDeptName);
        synStockTransDTO.setUpdatedBy(this.updatedBy);
        synStockTransDTO.setUpdatedDate(this.updatedDate);
        synStockTransDTO.setRealIeTransDate(this.realIeTransDate);
        synStockTransDTO.setRealIeUserId(this.realIeUserId);
        synStockTransDTO.setRealIeUserName(this.realIeUserName);
        synStockTransDTO.setShipperId(this.shipperId);
        synStockTransDTO.setShipperName(this.shipperName);
        synStockTransDTO.setCancelDate(this.cancelDate);
        synStockTransDTO.setCancelBy(this.cancelBy);
        synStockTransDTO.setCancelReasonName(this.cancelReasonName);
        synStockTransDTO.setCancelDescription(this.cancelDescription);
        synStockTransDTO.setVofficeTransactionCode(this.vofficeTransactionCode);
        synStockTransDTO.setShipmentCode(this.shipmentCode);
        synStockTransDTO.setContractCode(this.contractCode);
        synStockTransDTO.setProjectCode(this.projectCode);
        synStockTransDTO.setCustId(this.custId);
        synStockTransDTO.setCreatedBy(this.createdBy);
        synStockTransDTO.setCreatedDate(this.createdDate);
        synStockTransDTO.setCancelByName(this.cancelByName);
        synStockTransDTO.setBussinessTypeName(this.bussinessTypeName);
        synStockTransDTO.setInRoal(this.inRoal);
        synStockTransDTO.setDeptReceiveName(this.deptReceiveName);
        synStockTransDTO.setDeptReceiveId(this.deptReceiveId);
        synStockTransDTO.setStockReceiveId(this.stockReceiveId);
        synStockTransDTO.setStockReceiveCode(this.stockReceiveCode);
        synStockTransDTO.setPartnerId(this.partnerId);
        synStockTransDTO.setSynTransType(this.synTransType);
        synStockTransDTO.setStockCode(this.stockCode);
        synStockTransDTO.setStockName(this.stockName);
        synStockTransDTO.setConfirm(this.confirm);
        synStockTransDTO.setState(this.state);
        return synStockTransDTO;
    }

    public java.lang.String getState() {
        return state;
    }

    public void setState(java.lang.String state) {
        this.state = state;
    }
}
