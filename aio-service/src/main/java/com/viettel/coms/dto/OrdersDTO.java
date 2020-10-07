/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.OrdersBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author thuannht
 */
@XmlRootElement(name = "ORDERSBO")
@JsonIgnoreProperties(ignoreUnknown = true)

public class OrdersDTO extends ComsBaseFWDTO<OrdersBO> {

    private java.lang.Long assetManagementRequestId;
    private java.lang.Long isReturn;
    private java.lang.String exportType;
    private java.lang.Long cntContractId;
    private java.lang.String contractCode;
    private java.lang.Long constructionId;
    private java.lang.Long workItemId;
    private java.lang.String workItemName;
    private java.lang.Long orderId;
    private java.lang.String code;
    private java.lang.String type;
    private java.lang.String bussinessType;
    private java.lang.Long stockId;
    private java.lang.Long deptReceiveId;
    private java.lang.String deptReceiveName;
    private java.lang.String status;
    private java.lang.String description;
    private java.lang.String purchaseOrderNo;
    private java.util.Date purchaseOrderDate;
    private java.lang.String cerNo;
    private java.util.Date cerDate;
    private java.util.Date createdDate;
    private java.lang.Long createdBy;
    private java.lang.Long createdDeptedId;
    private java.lang.String createdDeptedName;
    private java.lang.Long updatedBy;
    private java.util.Date updatedDate;
    private java.lang.String shipperId;
    private java.lang.String shipperName;
    private java.util.Date shipDate;
    private java.lang.Long shipmentId;
    private java.lang.String shipmentCode;
    private java.lang.String constructionCode;
    private java.lang.String partnerId;
    private java.lang.Long ieStockId;
    private java.lang.String projectCode;
    private java.lang.String signState;
    private java.util.Date cancelDate;
    private java.lang.Long cancelBy;
    private java.lang.String cancelByName;
    private java.lang.String cancelDescription;
    private java.lang.String vofficeTransactionCode;
    private java.lang.Long catReasonId;
    private java.lang.String createdByName;
    private java.lang.String cancelReasonName;
    private java.lang.Long receiverId;
    private java.util.Date expectedRecievedDate;
    private java.lang.Long ieStockTransId;
    private java.lang.Long stationId;
    private java.lang.String stationCode;

    @Override
    public OrdersBO toModel() {
        OrdersBO ordersBO = new OrdersBO();
        ordersBO.setAssetManagementRequestId(this.assetManagementRequestId);
        ordersBO.setIsReturn(this.isReturn);
        ordersBO.setExportType(this.exportType);
        ordersBO.setCntContractId(this.cntContractId);
        ordersBO.setContractCode(this.contractCode);
        ordersBO.setConstructionId(this.constructionId);
        ordersBO.setWorkItemId(this.workItemId);
        ordersBO.setWorkItemName(this.workItemName);
        ordersBO.setOrderId(this.orderId);
        ordersBO.setCode(this.code);
        ordersBO.setType(this.type);
        ordersBO.setBussinessType(this.bussinessType);
        ordersBO.setStockId(this.stockId);
        ordersBO.setDeptReceiveId(this.deptReceiveId);
        ordersBO.setDeptReceiveName(this.deptReceiveName);
        ordersBO.setStatus(this.status);
        ordersBO.setDescription(this.description);
        ordersBO.setPurchaseOrderNo(this.purchaseOrderNo);
        ordersBO.setPurchaseOrderDate(this.purchaseOrderDate);
        ordersBO.setCerNo(this.cerNo);
        ordersBO.setCerDate(this.cerDate);
        ordersBO.setCreatedDate(this.createdDate);
        ordersBO.setCreatedBy(this.createdBy);
        ordersBO.setCreatedDeptedId(this.createdDeptedId);
        ordersBO.setCreatedDeptedName(this.createdDeptedName);
        ordersBO.setUpdatedBy(this.updatedBy);
        ordersBO.setUpdatedDate(this.updatedDate);
        ordersBO.setShipperId(this.shipperId);
        ordersBO.setShipperName(this.shipperName);
        ordersBO.setShipDate(this.shipDate);
        ordersBO.setShipmentId(this.shipmentId);
        ordersBO.setShipmentCode(this.shipmentCode);
        ordersBO.setConstructionCode(this.constructionCode);
        ordersBO.setPartnerId(this.partnerId);
        ordersBO.setIeStockId(this.ieStockId);
        ordersBO.setProjectCode(this.projectCode);
        ordersBO.setSignState(this.signState);
        ordersBO.setCancelDate(this.cancelDate);
        ordersBO.setCancelBy(this.cancelBy);
        ordersBO.setCancelByName(this.cancelByName);
        ordersBO.setCancelDescription(this.cancelDescription);
        ordersBO.setVofficeTransactionCode(this.vofficeTransactionCode);
        ordersBO.setCatReasonId(this.catReasonId);
        ordersBO.setCreatedByName(this.createdByName);
        ordersBO.setCancelReasonName(this.cancelReasonName);
        ordersBO.setReceiverId(this.receiverId);
        ordersBO.setExpectedRecievedDate(this.expectedRecievedDate);
        ordersBO.setIeStockTransId(this.ieStockTransId);
        ordersBO.setStationId(this.stationId);
        ordersBO.setStationCode(this.stationCode);
        return ordersBO;
    }

    public java.lang.Long getAssetManagementRequestId() {
        return assetManagementRequestId;
    }

    public void setAssetManagementRequestId(java.lang.Long assetManagementRequestId) {
        this.assetManagementRequestId = assetManagementRequestId;
    }

    public java.lang.Long getIsReturn() {
        return isReturn;
    }

    public void setIsReturn(java.lang.Long isReturn) {
        this.isReturn = isReturn;
    }

    public java.lang.String getExportType() {
        return exportType;
    }

    public void setExportType(java.lang.String exportType) {
        this.exportType = exportType;
    }

    public java.lang.Long getCntContractId() {
        return cntContractId;
    }

    public void setCntContractId(java.lang.Long cntContractId) {
        this.cntContractId = cntContractId;
    }

    public java.lang.String getContractCode() {
        return contractCode;
    }

    public void setContractCode(java.lang.String contractCode) {
        this.contractCode = contractCode;
    }

    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    @Override
    public Long getFWModelId() {
        return orderId;
    }

    @Override
    public String catchName() {
        return getOrderId().toString();
    }

    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
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

    public java.lang.String getBussinessType() {
        return bussinessType;
    }

    public void setBussinessType(java.lang.String bussinessType) {
        this.bussinessType = bussinessType;
    }

    public java.lang.Long getStockId() {
        return stockId;
    }

    public void setStockId(java.lang.Long stockId) {
        this.stockId = stockId;
    }

    public java.lang.Long getDeptReceiveId() {
        return deptReceiveId;
    }

    public void setDeptReceiveId(java.lang.Long deptReceiveId) {
        this.deptReceiveId = deptReceiveId;
    }

    public java.lang.String getDeptReceiveName() {
        return deptReceiveName;
    }

    public void setDeptReceiveName(java.lang.String deptReceiveName) {
        this.deptReceiveName = deptReceiveName;
    }

    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    public java.lang.String getPurchaseOrderNo() {
        return purchaseOrderNo;
    }

    public void setPurchaseOrderNo(java.lang.String purchaseOrderNo) {
        this.purchaseOrderNo = purchaseOrderNo;
    }

    public java.util.Date getPurchaseOrderDate() {
        return purchaseOrderDate;
    }

    public void setPurchaseOrderDate(java.util.Date purchaseOrderDate) {
        this.purchaseOrderDate = purchaseOrderDate;
    }

    public java.lang.String getCerNo() {
        return cerNo;
    }

    public void setCerNo(java.lang.String cerNo) {
        this.cerNo = cerNo;
    }

    public java.util.Date getCerDate() {
        return cerDate;
    }

    public void setCerDate(java.util.Date cerDate) {
        this.cerDate = cerDate;
    }

    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    public java.lang.Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(java.lang.Long createdBy) {
        this.createdBy = createdBy;
    }

    public java.lang.Long getCreatedDeptedId() {
        return createdDeptedId;
    }

    public void setCreatedDeptedId(java.lang.Long createdDeptedId) {
        this.createdDeptedId = createdDeptedId;
    }

    public java.lang.String getCreatedDeptedName() {
        return createdDeptedName;
    }

    public void setCreatedDeptedName(java.lang.String createdDeptedName) {
        this.createdDeptedName = createdDeptedName;
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

    public java.lang.String getShipperId() {
        return shipperId;
    }

    public void setShipperId(java.lang.String shipperId) {
        this.shipperId = shipperId;
    }

    public java.lang.String getShipperName() {
        return shipperName;
    }

    public void setShipperName(java.lang.String shipperName) {
        this.shipperName = shipperName;
    }

    public java.util.Date getShipDate() {
        return shipDate;
    }

    public void setShipDate(java.util.Date shipDate) {
        this.shipDate = shipDate;
    }

    public java.lang.Long getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(java.lang.Long shipmentId) {
        this.shipmentId = shipmentId;
    }

    public java.lang.String getShipmentCode() {
        return shipmentCode;
    }

    public void setShipmentCode(java.lang.String shipmentCode) {
        this.shipmentCode = shipmentCode;
    }

    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public java.lang.String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(java.lang.String partnerId) {
        this.partnerId = partnerId;
    }

    public java.lang.Long getIeStockId() {
        return ieStockId;
    }

    public void setIeStockId(java.lang.Long ieStockId) {
        this.ieStockId = ieStockId;
    }

    public java.lang.String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(java.lang.String projectCode) {
        this.projectCode = projectCode;
    }

    public java.lang.String getSignState() {
        return signState;
    }

    public void setSignState(java.lang.String signState) {
        this.signState = signState;
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

    public java.lang.String getCancelByName() {
        return cancelByName;
    }

    public void setCancelByName(java.lang.String cancelByName) {
        this.cancelByName = cancelByName;
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

    public java.lang.Long getCatReasonId() {
        return catReasonId;
    }

    public void setCatReasonId(java.lang.Long catReasonId) {
        this.catReasonId = catReasonId;
    }

    public java.lang.String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(java.lang.String createdByName) {
        this.createdByName = createdByName;
    }

    public java.lang.String getCancelReasonName() {
        return cancelReasonName;
    }

    public void setCancelReasonName(java.lang.String cancelReasonName) {
        this.cancelReasonName = cancelReasonName;
    }

    public java.lang.Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(java.lang.Long receiverId) {
        this.receiverId = receiverId;
    }

    public java.util.Date getExpectedRecievedDate() {
        return expectedRecievedDate;
    }

    public void setExpectedRecievedDate(java.util.Date expectedRecievedDate) {
        this.expectedRecievedDate = expectedRecievedDate;
    }

    public java.lang.Long getIeStockTransId() {
        return ieStockTransId;
    }

    public void setIeStockTransId(java.lang.Long ieStockTransId) {
        this.ieStockTransId = ieStockTransId;
    }

	public java.lang.Long getStationId() {
		return stationId;
	}

	public void setStationId(java.lang.Long stationId) {
		this.stationId = stationId;
	}

	public java.lang.String getStationCode() {
		return stationCode;
	}

	public void setStationCode(java.lang.String stationCode) {
		this.stationCode = stationCode;
	}

}
