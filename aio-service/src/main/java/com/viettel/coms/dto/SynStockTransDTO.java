/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.SynStockTransBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

/**
 * @author thuannht
 */
@XmlRootElement(name = "SYN_STOCK_TRANSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SynStockTransDTO extends ComsBaseFWDTO<SynStockTransBO> {

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
    private java.lang.Long stockTransId;
    private Long synType;
    private Long userLogin;
    private java.lang.String stockType;
    private java.lang.String confirmDescription;
    // CuongNV2 added start
// Tình trạng : stock_trans.state/syn_stock_trans.state
    private java.lang.String state;
    private java.lang.Long receiverId;
    private java.lang.String consCode;
    private java.lang.String synStockName;
    private java.lang.String synCreatedByName;
    private Date synCreatedDate;
    private java.lang.Long lastShipperId;
// CuongNV2 added end

    public java.lang.Long getReceiverId() {
        return receiverId;
    }

    public java.lang.String getConsCode() {
        return consCode;
    }

    public void setConsCode(java.lang.String consCode) {
        this.consCode = consCode;
    }

    public java.lang.String getSynStockName() {
        return synStockName;
    }

    public void setSynStockName(java.lang.String synStockName) {
        this.synStockName = synStockName;
    }

    public java.lang.String getSynCreatedByName() {
        return synCreatedByName;
    }

    public void setSynCreatedByName(java.lang.String synCreatedByName) {
        this.synCreatedByName = synCreatedByName;
    }

    public void setReceiverId(java.lang.Long receiverId) {
        this.receiverId = receiverId;
    }

    public java.lang.String getConfirmDescription() {
        return confirmDescription;
    }

    public void setConfirmDescription(java.lang.String confirmDescription) {
        this.confirmDescription = confirmDescription;
    }

    public Long getSynType() {
        return synType;
    }

    public void setSynType(Long synType) {

        this.synType = synType;
    }

    public java.lang.Long getStockTransId() {
        return stockTransId;
    }

    public void setStockTransId(java.lang.Long stockTransId) {
        this.stockTransId = stockTransId;
    }

    private java.util.Date updatedDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date realIeTransDate;
    private java.lang.String realIeUserId;
    private java.lang.String realIeUserName;
    private java.lang.Long shipperId;
    private java.lang.String shipperName;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
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
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private java.util.Date createdDate;
    private java.lang.String cancelByName;
    private java.lang.String bussinessTypeName;
    private java.lang.String inRoal;
    private java.lang.String deptReceiveName;
    private java.lang.Long deptReceiveId;
    private java.lang.Long stockReceiveId;
    private java.lang.String stockReceiveCode;
    private java.lang.Long partnerId;
    private java.lang.Long typeExport;
    private java.lang.Long codeTinhTruong;

    public java.lang.Long getTypeExport() {
        return typeExport;
    }

    public void setTypeExport(java.lang.Long typeExport) {
        this.typeExport = typeExport;
    }

    private java.lang.String synTransType;
    private java.lang.String stockCode;
    private java.lang.String stockName;
    // Trạng thái: stock_trans.confirm/ syn_stock_trans.confirm
    private java.lang.String confirm;
    private String buss;

    //VietNT_20190116_start
    private String bussinessType;

    //dto only
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;
    private String constructionCode;
    private Long sysGroupId;
    private String sysGroupName;
    private List<SynStockTransDTO> listToForward;
    // thong tin tinh truong
    private Long sysUserId;
    private String sysUserName;

    public String getBussinessType() {
        return bussinessType;
    }

    public void setBussinessType(String bussinessType) {
        this.bussinessType = bussinessType;
    }

    public List<SynStockTransDTO> getListToForward() {
        return listToForward;
    }

    public void setListToForward(List<SynStockTransDTO> listToForward) {
        this.listToForward = listToForward;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public Date getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(Date dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Date getDateTo() {
        return dateTo;
    }

    public void setDateTo(Date dateTo) {
        this.dateTo = dateTo;
    }

    //VietNT_end

    @Override
    public SynStockTransBO toModel() {
        SynStockTransBO synStockTransBO = new SynStockTransBO();
        synStockTransBO.setSynStockTransId(this.synStockTransId);
        synStockTransBO.setOrderId(this.orderId);
        synStockTransBO.setOrderCode(this.orderCode);
        synStockTransBO.setCode(this.code);
        synStockTransBO.setType(this.type);
        synStockTransBO.setStockId(this.stockId);
        synStockTransBO.setStatus(this.status);
        synStockTransBO.setSignState(this.signState);
        synStockTransBO.setFromStockTransId(this.fromStockTransId);
        synStockTransBO.setDescription(this.description);
        synStockTransBO.setCreatedByName(this.createdByName);
        synStockTransBO.setCreatedDeptId(this.createdDeptId);
        synStockTransBO.setCreatedDeptName(this.createdDeptName);
        synStockTransBO.setUpdatedBy(this.updatedBy);
        synStockTransBO.setUpdatedDate(this.updatedDate);
        synStockTransBO.setRealIeTransDate(this.realIeTransDate);
        synStockTransBO.setRealIeUserId(this.realIeUserId);
        synStockTransBO.setRealIeUserName(this.realIeUserName);
        synStockTransBO.setShipperId(this.shipperId);
        synStockTransBO.setShipperName(this.shipperName);
        synStockTransBO.setCancelDate(this.cancelDate);
        synStockTransBO.setCancelBy(this.cancelBy);
        synStockTransBO.setCancelReasonName(this.cancelReasonName);
        synStockTransBO.setCancelDescription(this.cancelDescription);
        synStockTransBO.setVofficeTransactionCode(this.vofficeTransactionCode);
        synStockTransBO.setShipmentCode(this.shipmentCode);
        synStockTransBO.setContractCode(this.contractCode);
        synStockTransBO.setProjectCode(this.projectCode);
        synStockTransBO.setCustId(this.custId);
        synStockTransBO.setCreatedBy(this.createdBy);
        synStockTransBO.setCreatedDate(this.createdDate);
        synStockTransBO.setCancelByName(this.cancelByName);
        synStockTransBO.setBussinessTypeName(this.bussinessTypeName);
        synStockTransBO.setInRoal(this.inRoal);
        synStockTransBO.setDeptReceiveName(this.deptReceiveName);
        synStockTransBO.setDeptReceiveId(this.deptReceiveId);
        synStockTransBO.setStockReceiveId(this.stockReceiveId);
        synStockTransBO.setStockReceiveCode(this.stockReceiveCode);
        synStockTransBO.setPartnerId(this.partnerId);
        synStockTransBO.setSynTransType(this.synTransType);
        synStockTransBO.setStockCode(this.stockCode);
        synStockTransBO.setStockName(this.stockName);
        synStockTransBO.setConfirm(this.confirm);
        synStockTransBO.setState(this.state);
        return synStockTransBO;
    }

    @Override
    public Long getFWModelId() {
        return synStockTransId;
    }

    @Override
    public String catchName() {
        return getSynStockTransId().toString();
    }

    public java.lang.Long getSynStockTransId() {
        return synStockTransId;
    }

    public void setSynStockTransId(java.lang.Long synStockTransId) {
        this.synStockTransId = synStockTransId;
    }

    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

    public java.lang.String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(java.lang.String orderCode) {
        this.orderCode = orderCode;
    }

    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    public java.lang.Long getStockId() {
        return stockId;
    }

    public void setStockId(java.lang.Long stockId) {
        this.stockId = stockId;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getSignState() {
        return signState;
    }

    public void setSignState(java.lang.String signState) {
        this.signState = signState;
    }

    public java.lang.Long getFromStockTransId() {
        return fromStockTransId;
    }

    public void setFromStockTransId(java.lang.Long fromStockTransId) {
        this.fromStockTransId = fromStockTransId;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(java.lang.String createdByName) {
        this.createdByName = createdByName;
    }

    public java.lang.Long getCreatedDeptId() {
        return createdDeptId;
    }

    public void setCreatedDeptId(java.lang.Long createdDeptId) {
        this.createdDeptId = createdDeptId;
    }

    public java.lang.String getCreatedDeptName() {
        return createdDeptName;
    }

    public void setCreatedDeptName(java.lang.String createdDeptName) {
        this.createdDeptName = createdDeptName;
    }

    public java.lang.Long getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(java.lang.Long updatedBy) {
        this.updatedBy = updatedBy;
    }

    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public java.util.Date getRealIeTransDate() {
        return realIeTransDate;
    }

    public void setRealIeTransDate(java.util.Date realIeTransDate) {
        this.realIeTransDate = realIeTransDate;
    }

    public java.lang.String getRealIeUserId() {
        return realIeUserId;
    }

    public void setRealIeUserId(java.lang.String realIeUserId) {
        this.realIeUserId = realIeUserId;
    }

    public java.lang.String getRealIeUserName() {
        return realIeUserName;
    }

    public void setRealIeUserName(java.lang.String realIeUserName) {
        this.realIeUserName = realIeUserName;
    }

    public java.lang.Long getShipperId() {
        return shipperId;
    }

    public void setShipperId(java.lang.Long shipperId) {
        this.shipperId = shipperId;
    }

    public java.lang.String getShipperName() {
        return shipperName;
    }

    public void setShipperName(java.lang.String shipperName) {
        this.shipperName = shipperName;
    }

    public java.util.Date getCancelDate() {
        return cancelDate;
    }

    public void setCancelDate(java.util.Date cancelDate) {
        this.cancelDate = cancelDate;
    }

    public java.lang.Long getCancelBy() {
        return cancelBy;
    }

    public void setCancelBy(java.lang.Long cancelBy) {
        this.cancelBy = cancelBy;
    }

    public java.lang.String getCancelReasonName() {
        return cancelReasonName;
    }

    public void setCancelReasonName(java.lang.String cancelReasonName) {
        this.cancelReasonName = cancelReasonName;
    }

    public java.lang.String getCancelDescription() {
        return cancelDescription;
    }

    public void setCancelDescription(java.lang.String cancelDescription) {
        this.cancelDescription = cancelDescription;
    }

    public java.lang.String getVofficeTransactionCode() {
        return vofficeTransactionCode;
    }

    public void setVofficeTransactionCode(java.lang.String vofficeTransactionCode) {
        this.vofficeTransactionCode = vofficeTransactionCode;
    }

    public java.lang.String getShipmentCode() {
        return shipmentCode;
    }

    public void setShipmentCode(java.lang.String shipmentCode) {
        this.shipmentCode = shipmentCode;
    }

    public java.lang.String getContractCode() {
        return contractCode;
    }

    public void setContractCode(java.lang.String contractCode) {
        this.contractCode = contractCode;
    }

    public java.lang.String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(java.lang.String projectCode) {
        this.projectCode = projectCode;
    }

    public java.lang.Long getCustId() {
        return custId;
    }

    public void setCustId(java.lang.Long custId) {
        this.custId = custId;
    }

    public java.lang.Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(java.lang.Long createdBy) {
        this.createdBy = createdBy;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.String getCancelByName() {
        return cancelByName;
    }

    public void setCancelByName(java.lang.String cancelByName) {
        this.cancelByName = cancelByName;
    }

    public java.lang.String getBussinessTypeName() {
        return bussinessTypeName;
    }

    public void setBussinessTypeName(java.lang.String bussinessTypeName) {
        this.bussinessTypeName = bussinessTypeName;
    }

    public java.lang.String getInRoal() {
        return inRoal;
    }

    public void setInRoal(java.lang.String inRoal) {
        this.inRoal = inRoal;
    }

    public java.lang.String getDeptReceiveName() {
        return deptReceiveName;
    }

    public void setDeptReceiveName(java.lang.String deptReceiveName) {
        this.deptReceiveName = deptReceiveName;
    }

    public java.lang.Long getDeptReceiveId() {
        return deptReceiveId;
    }

    public void setDeptReceiveId(java.lang.Long deptReceiveId) {
        this.deptReceiveId = deptReceiveId;
    }

    public java.lang.Long getStockReceiveId() {
        return stockReceiveId;
    }

    public void setStockReceiveId(java.lang.Long stockReceiveId) {
        this.stockReceiveId = stockReceiveId;
    }

    public java.lang.String getStockReceiveCode() {
        return stockReceiveCode;
    }

    public void setStockReceiveCode(java.lang.String stockReceiveCode) {
        this.stockReceiveCode = stockReceiveCode;
    }

    public java.lang.Long getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(java.lang.Long partnerId) {
        this.partnerId = partnerId;
    }

    public java.lang.String getSynTransType() {
        return synTransType;
    }

    public void setSynTransType(java.lang.String synTransType) {
        this.synTransType = synTransType;
    }

    public java.lang.String getStockCode() {
        return stockCode;
    }

    public void setStockCode(java.lang.String stockCode) {
        this.stockCode = stockCode;
    }

    public java.lang.String getStockName() {
        return stockName;
    }

    public void setStockName(java.lang.String stockName) {
        this.stockName = stockName;
    }

    public java.lang.String getConfirm() {
        return confirm;
    }

    public void setConfirm(java.lang.String confirm) {
        this.confirm = confirm;
    }

    private java.lang.Long constructionId;

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    private java.lang.String isSyn;

    public java.lang.String getIsSyn() {
        return isSyn;
    }

    public void setIsSyn(java.lang.String isSyn) {
        this.isSyn = isSyn;
    }

    public String getBuss() {
        return buss;
    }

    public void setBuss(String buss) {
        this.buss = buss;
    }

    public java.lang.String getStockType() {
        return stockType;
    }

    public void setStockType(java.lang.String stockType) {
        this.stockType = stockType;
    }

    public Long getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(Long userLogin) {
        this.userLogin = userLogin;
    }

    public java.lang.Long getCodeTinhTruong() {
        return codeTinhTruong;
    }

    public void setCodeTinhTruong(java.lang.Long codeTinhTruong) {
        this.codeTinhTruong = codeTinhTruong;
    }

    public java.lang.String getState() {
        return state;
    }

    public void setState(java.lang.String state) {
        this.state = state;
    }

    public Date getSynCreatedDate() {
        return synCreatedDate;
    }

    public void setSynCreatedDate(Date synCreatedDate) {
        this.synCreatedDate = synCreatedDate;
    }

    public java.lang.Long getLastShipperId() {
        return lastShipperId;
    }

    public void setLastShipperId(java.lang.Long lastShipperId) {
        this.lastShipperId = lastShipperId;
    }
}
