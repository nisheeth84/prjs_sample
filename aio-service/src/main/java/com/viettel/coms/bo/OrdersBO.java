/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.OrdersDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ORDERS")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class OrdersBO extends BaseFWModelImpl {

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

    @Column(name = "ASSET_MANAGEMENT_REQUEST_ID", length = 22)
    public java.lang.Long getAssetManagementRequestId() {
        return assetManagementRequestId;
    }

    public void setAssetManagementRequestId(java.lang.Long assetManagementRequestId) {
        this.assetManagementRequestId = assetManagementRequestId;
    }

    @Column(name = "IS_RETURN", length = 22)
    public java.lang.Long getIsReturn() {
        return isReturn;
    }

    public void setIsReturn(java.lang.Long isReturn) {
        this.isReturn = isReturn;
    }

    @Column(name = "EXPORT_TYPE", length = 2)
    public java.lang.String getExportType() {
        return exportType;
    }

    public void setExportType(java.lang.String exportType) {
        this.exportType = exportType;
    }

    @Column(name = "CNT_CONTRACT_ID", length = 22)
    public java.lang.Long getCntContractId() {
        return cntContractId;
    }

    public void setCntContractId(java.lang.Long cntContractId) {
        this.cntContractId = cntContractId;
    }

    @Column(name = "CONTRACT_CODE", length = 200)
    public java.lang.String getContractCode() {
        return contractCode;
    }

    public void setContractCode(java.lang.String contractCode) {
        this.contractCode = contractCode;
    }

    @Column(name = "CONSTRUCTION_ID", length = 22)
    public java.lang.Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(java.lang.Long constructionId) {
        this.constructionId = constructionId;
    }

    @Column(name = "WORK_ITEM_ID", length = 22)
    public java.lang.Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(java.lang.Long workItemId) {
        this.workItemId = workItemId;
    }

    @Column(name = "WORK_ITEM_NAME", length = 400)
    public java.lang.String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(java.lang.String workItemName) {
        this.workItemName = workItemName;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "CTCT_WMS_OWNER.ORDER_SEQ")})
    @Column(name = "ORDER_ID", length = 22)
    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

    @Column(name = "CODE", length = 200)
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @Column(name = "TYPE", length = 4)
    public java.lang.String getType() {
        return type;
    }

    public void setType(java.lang.String type) {
        this.type = type;
    }

    @Column(name = "BUSSINESS_TYPE", length = 4)
    public java.lang.String getBussinessType() {
        return bussinessType;
    }

    public void setBussinessType(java.lang.String bussinessType) {
        this.bussinessType = bussinessType;
    }

    @Column(name = "STOCK_ID", length = 22)
    public java.lang.Long getStockId() {
        return stockId;
    }

    public void setStockId(java.lang.Long stockId) {
        this.stockId = stockId;
    }

    @Column(name = "DEPT_RECEIVE_ID", length = 22)
    public java.lang.Long getDeptReceiveId() {
        return deptReceiveId;
    }

    public void setDeptReceiveId(java.lang.Long deptReceiveId) {
        this.deptReceiveId = deptReceiveId;
    }

    @Column(name = "DEPT_RECEIVE_NAME", length = 200)
    public java.lang.String getDeptReceiveName() {
        return deptReceiveName;
    }

    public void setDeptReceiveName(java.lang.String deptReceiveName) {
        this.deptReceiveName = deptReceiveName;
    }

    @Column(name = "STATUS", length = 4)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "DESCRIPTION", length = 2000)
    public java.lang.String getDescription() {
        return description;
    }

    public void setDescription(java.lang.String description) {
        this.description = description;
    }

    @Column(name = "PURCHASE_ORDER_NO", length = 200)
    public java.lang.String getPurchaseOrderNo() {
        return purchaseOrderNo;
    }

    public void setPurchaseOrderNo(java.lang.String purchaseOrderNo) {
        this.purchaseOrderNo = purchaseOrderNo;
    }

    @Column(name = "PURCHASE_ORDER_DATE", length = 7)
    public java.util.Date getPurchaseOrderDate() {
        return purchaseOrderDate;
    }

    public void setPurchaseOrderDate(java.util.Date purchaseOrderDate) {
        this.purchaseOrderDate = purchaseOrderDate;
    }

    @Column(name = "CER_NO", length = 200)
    public java.lang.String getCerNo() {
        return cerNo;
    }

    public void setCerNo(java.lang.String cerNo) {
        this.cerNo = cerNo;
    }

    @Column(name = "CER_DATE", length = 7)
    public java.util.Date getCerDate() {
        return cerDate;
    }

    public void setCerDate(java.util.Date cerDate) {
        this.cerDate = cerDate;
    }

    @Column(name = "CREATED_DATE", length = 7)
    public java.util.Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate) {
        this.createdDate = createdDate;
    }

    @Column(name = "CREATED_BY", length = 22)
    public java.lang.Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(java.lang.Long createdBy) {
        this.createdBy = createdBy;
    }

    @Column(name = "CREATED_DEPTED_ID", length = 22)
    public java.lang.Long getCreatedDeptedId() {
        return createdDeptedId;
    }

    public void setCreatedDeptedId(java.lang.Long createdDeptedId) {
        this.createdDeptedId = createdDeptedId;
    }

    @Column(name = "CREATED_DEPTED_NAME", length = 400)
    public java.lang.String getCreatedDeptedName() {
        return createdDeptedName;
    }

    public void setCreatedDeptedName(java.lang.String createdDeptedName) {
        this.createdDeptedName = createdDeptedName;
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

    @Column(name = "SHIPPER_ID", length = 20)
    public java.lang.String getShipperId() {
        return shipperId;
    }

    public void setShipperId(java.lang.String shipperId) {
        this.shipperId = shipperId;
    }

    @Column(name = "SHIPPER_NAME", length = 200)
    public java.lang.String getShipperName() {
        return shipperName;
    }

    public void setShipperName(java.lang.String shipperName) {
        this.shipperName = shipperName;
    }

    @Column(name = "SHIP_DATE", length = 7)
    public java.util.Date getShipDate() {
        return shipDate;
    }

    public void setShipDate(java.util.Date shipDate) {
        this.shipDate = shipDate;
    }

    @Column(name = "SHIPMENT_ID", length = 22)
    public java.lang.Long getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(java.lang.Long shipmentId) {
        this.shipmentId = shipmentId;
    }

    @Column(name = "SHIPMENT_CODE", length = 200)
    public java.lang.String getShipmentCode() {
        return shipmentCode;
    }

    public void setShipmentCode(java.lang.String shipmentCode) {
        this.shipmentCode = shipmentCode;
    }

    @Column(name = "CONSTRUCTION_CODE", length = 200)
    public java.lang.String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(java.lang.String constructionCode) {
        this.constructionCode = constructionCode;
    }

    @Column(name = "PARTNER_ID", length = 20)
    public java.lang.String getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(java.lang.String partnerId) {
        this.partnerId = partnerId;
    }

    @Column(name = "IE_STOCK_ID", length = 22)
    public java.lang.Long getIeStockId() {
        return ieStockId;
    }

    public void setIeStockId(java.lang.Long ieStockId) {
        this.ieStockId = ieStockId;
    }

    @Column(name = "PROJECT_CODE", length = 200)
    public java.lang.String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(java.lang.String projectCode) {
        this.projectCode = projectCode;
    }

    @Column(name = "SIGN_STATE", length = 4)
    public java.lang.String getSignState() {
        return signState;
    }

    public void setSignState(java.lang.String signState) {
        this.signState = signState;
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

    @Column(name = "CANCEL_BY_NAME", length = 200)
    public java.lang.String getCancelByName() {
        return cancelByName;
    }

    public void setCancelByName(java.lang.String cancelByName) {
        this.cancelByName = cancelByName;
    }

    @Column(name = "CANCEL_DESCRIPTION", length = 2000)
    public java.lang.String getCancelDescription() {
        return cancelDescription;
    }

    public void setCancelDescription(java.lang.String cancelDescription) {
        this.cancelDescription = cancelDescription;
    }

    @Column(name = "VOFFICE_TRANSACTION_CODE", length = 20)
    public java.lang.String getVofficeTransactionCode() {
        return vofficeTransactionCode;
    }

    public void setVofficeTransactionCode(java.lang.String vofficeTransactionCode) {
        this.vofficeTransactionCode = vofficeTransactionCode;
    }

    @Column(name = "CAT_REASON_ID", length = 22)
    public java.lang.Long getCatReasonId() {
        return catReasonId;
    }

    public void setCatReasonId(java.lang.Long catReasonId) {
        this.catReasonId = catReasonId;
    }

    @Column(name = "CREATED_BY_NAME", length = 400)
    public java.lang.String getCreatedByName() {
        return createdByName;
    }

    public void setCreatedByName(java.lang.String createdByName) {
        this.createdByName = createdByName;
    }

    @Column(name = "CANCEL_REASON_NAME", length = 400)
    public java.lang.String getCancelReasonName() {
        return cancelReasonName;
    }

    public void setCancelReasonName(java.lang.String cancelReasonName) {
        this.cancelReasonName = cancelReasonName;
    }

    @Column(name = "RECEIVER_ID", length = 22)
    public java.lang.Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(java.lang.Long receiverId) {
        this.receiverId = receiverId;
    }

    @Column(name = "EXPECTED_RECIEVED_DATE", length = 7)
    public java.util.Date getExpectedRecievedDate() {
        return expectedRecievedDate;
    }

    public void setExpectedRecievedDate(java.util.Date expectedRecievedDate) {
        this.expectedRecievedDate = expectedRecievedDate;
    }

    @Column(name = "IE_STOCK_TRANS_ID", length = 22)
    public java.lang.Long getIeStockTransId() {
        return ieStockTransId;
    }

    public void setIeStockTransId(java.lang.Long ieStockTransId) {
        this.ieStockTransId = ieStockTransId;
    }

    @Column(name = "STATION_ID", length = 22)
    public java.lang.Long getStationId() {
		return stationId;
	}

	public void setStationId(java.lang.Long stationId) {
		this.stationId = stationId;
	}

    @Column(name = "STATION_CODE", length = 200)
	public java.lang.String getStationCode() {
		return stationCode;
	}

	public void setStationCode(java.lang.String stationCode) {
		this.stationCode = stationCode;
	}

	@Override
    public OrdersDTO toDTO() {
        OrdersDTO ordersDTO = new OrdersDTO();
        // set cac gia tri
        ordersDTO.setAssetManagementRequestId(this.assetManagementRequestId);
        ordersDTO.setIsReturn(this.isReturn);
        ordersDTO.setExportType(this.exportType);
        ordersDTO.setCntContractId(this.cntContractId);
        ordersDTO.setContractCode(this.contractCode);
        ordersDTO.setConstructionId(this.constructionId);
        ordersDTO.setWorkItemId(this.workItemId);
        ordersDTO.setWorkItemName(this.workItemName);
        ordersDTO.setOrderId(this.orderId);
        ordersDTO.setCode(this.code);
        ordersDTO.setType(this.type);
        ordersDTO.setBussinessType(this.bussinessType);
        ordersDTO.setStockId(this.stockId);
        ordersDTO.setDeptReceiveId(this.deptReceiveId);
        ordersDTO.setDeptReceiveName(this.deptReceiveName);
        ordersDTO.setStatus(this.status);
        ordersDTO.setDescription(this.description);
        ordersDTO.setPurchaseOrderNo(this.purchaseOrderNo);
        ordersDTO.setPurchaseOrderDate(this.purchaseOrderDate);
        ordersDTO.setCerNo(this.cerNo);
        ordersDTO.setCerDate(this.cerDate);
        ordersDTO.setCreatedDate(this.createdDate);
        ordersDTO.setCreatedBy(this.createdBy);
        ordersDTO.setCreatedDeptedId(this.createdDeptedId);
        ordersDTO.setCreatedDeptedName(this.createdDeptedName);
        ordersDTO.setUpdatedBy(this.updatedBy);
        ordersDTO.setUpdatedDate(this.updatedDate);
        ordersDTO.setShipperId(this.shipperId);
        ordersDTO.setShipperName(this.shipperName);
        ordersDTO.setShipDate(this.shipDate);
        ordersDTO.setShipmentId(this.shipmentId);
        ordersDTO.setShipmentCode(this.shipmentCode);
        ordersDTO.setConstructionCode(this.constructionCode);
        ordersDTO.setPartnerId(this.partnerId);
        ordersDTO.setIeStockId(this.ieStockId);
        ordersDTO.setProjectCode(this.projectCode);
        ordersDTO.setSignState(this.signState);
        ordersDTO.setCancelDate(this.cancelDate);
        ordersDTO.setCancelBy(this.cancelBy);
        ordersDTO.setCancelByName(this.cancelByName);
        ordersDTO.setCancelDescription(this.cancelDescription);
        ordersDTO.setVofficeTransactionCode(this.vofficeTransactionCode);
        ordersDTO.setCatReasonId(this.catReasonId);
        ordersDTO.setCreatedByName(this.createdByName);
        ordersDTO.setCancelReasonName(this.cancelReasonName);
        ordersDTO.setReceiverId(this.receiverId);
        ordersDTO.setExpectedRecievedDate(this.expectedRecievedDate);
        ordersDTO.setIeStockTransId(this.ieStockTransId);
        ordersDTO.setStationId(this.stationId);
        ordersDTO.setStationCode(this.stationCode);
        return ordersDTO;
    }
}
