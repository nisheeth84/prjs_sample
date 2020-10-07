/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.MerEntitySimpleDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "MER_ENTITY")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class MerEntityBO extends BaseFWModelImpl {

    private java.util.Date updatedDate;
    private java.lang.Long stockCellId;
    private java.lang.String stockCellCode;
    private java.lang.Long catProducingCountryId;
    private java.lang.Long parentMerEntityId;
    private java.lang.String catUnitName;
    private java.util.Date importDate;
    private java.lang.String manufacturerName;
    private java.lang.String producingCountryName;
    private java.lang.Long catUnitId;
    private java.lang.Long orderId;
    private java.lang.String cntContractCode;
    private java.lang.Long merEntityId;
    private java.lang.String serial;
    private java.lang.Long goodsId;
    private java.lang.String goodsCode;
    private java.lang.String goodsName;
    private java.lang.String state;
    private java.lang.String status;
    private java.lang.Double amount;
    private java.lang.Long catManufacturerId;
    private java.lang.Long stockId;
    private java.lang.Long cntContractId;
    private java.lang.Long sysGroupId;
    private java.lang.Long projectId;
    private java.lang.Long shipmentId;
    private java.lang.String partNumber;
    private java.lang.Double unitPrice;
    private java.lang.Double applyPrice;

    private java.util.Date exportDate;
    private java.lang.Long importStockTransId;
    private java.lang.String levelParentId;
    
    
    @Column(name="LEVEL_PARENT_ID", length=100)
    public java.lang.String getLevelParentId() {
		return levelParentId;
	}

	public void setLevelParentId(java.lang.String levelParentId) {
		this.levelParentId = levelParentId;
	}

	@Column(name = "UPDATED_DATE", length = 7)
    public java.util.Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Column(name = "STOCK_CELL_ID", length = 22)
    public java.lang.Long getStockCellId() {
        return stockCellId;
    }

    public void setStockCellId(java.lang.Long stockCellId) {
        this.stockCellId = stockCellId;
    }

    @Column(name = "STOCK_CELL_CODE", length = 100)
    public java.lang.String getStockCellCode() {
        return stockCellCode;
    }

    public void setStockCellCode(java.lang.String stockCellCode) {
        this.stockCellCode = stockCellCode;
    }

    @Column(name = "CAT_PRODUCING_COUNTRY_ID", length = 22)
    public java.lang.Long getCatProducingCountryId() {
        return catProducingCountryId;
    }

    public void setCatProducingCountryId(java.lang.Long catProducingCountryId) {
        this.catProducingCountryId = catProducingCountryId;
    }

    @Column(name = "PARENT_MER_ENTITY_ID", length = 22)
    public java.lang.Long getParentMerEntityId() {
        return parentMerEntityId;
    }

    public void setParentMerEntityId(java.lang.Long parentMerEntityId) {
        this.parentMerEntityId = parentMerEntityId;
    }

    @Column(name = "CAT_UNIT_NAME", length = 1000)
    public java.lang.String getCatUnitName() {
        return catUnitName;
    }

    public void setCatUnitName(java.lang.String catUnitName) {
        this.catUnitName = catUnitName;
    }

    @Column(name = "IMPORT_DATE", length = 7)
    public java.util.Date getImportDate() {
        return importDate;
    }

    public void setImportDate(java.util.Date importDate) {
        this.importDate = importDate;
    }

    @Column(name = "MANUFACTURER_NAME", length = 1000)
    public java.lang.String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(java.lang.String manufacturerName) {
        this.manufacturerName = manufacturerName;
    }

    @Column(name = "PRODUCING_COUNTRY_NAME", length = 1000)
    public java.lang.String getProducingCountryName() {
        return producingCountryName;
    }

    public void setProducingCountryName(java.lang.String producingCountryName) {
        this.producingCountryName = producingCountryName;
    }

    @Column(name = "CAT_UNIT_ID", length = 22)
    public java.lang.Long getCatUnitId() {
        return catUnitId;
    }

    public void setCatUnitId(java.lang.Long catUnitId) {
        this.catUnitId = catUnitId;
    }

    //@Id
//@GeneratedValue(generator = "sequence")
//    @GenericGenerator(name = "sequence", strategy = "sequence",
//            parameters = {
//                @Parameter(name = "sequence", value = "MER_ENTITY_SEQ")
//            }
//    )
    @Column(name = "ORDER_ID", length = 22)
    public java.lang.Long getOrderId() {
        return orderId;
    }

    public void setOrderId(java.lang.Long orderId) {
        this.orderId = orderId;
    }

    @Column(name = "CNT_CONTRACT_CODE", length = 2000)
    public java.lang.String getCntContractCode() {
        return cntContractCode;
    }

    public void setCntContractCode(java.lang.String cntContractCode) {
        this.cntContractCode = cntContractCode;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @Parameter(name = "sequence", value = "MER_ENTITY_SEQ")})
    @Column(name = "MER_ENTITY_ID", length = 22)
    public java.lang.Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(java.lang.Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    @Column(name = "SERIAL", length = 400)
    public java.lang.String getSerial() {
        return serial;
    }

    public void setSerial(java.lang.String serial) {
        this.serial = serial;
    }

    @Column(name = "GOODS_ID", length = 22)
    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    @Column(name = "GOODS_CODE", length = 40)
    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    @Column(name = "GOODS_NAME", length = 1000)
    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    @Column(name = "STATE", length = 2)
    public java.lang.String getState() {
        return state;
    }

    public void setState(java.lang.String state) {
        this.state = state;
    }

    @Column(name = "STATUS", length = 2)
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @Column(name = "AMOUNT", length = 22)
    public java.lang.Double getAmount() {
        return amount;
    }

    public void setAmount(java.lang.Double amount) {
        this.amount = amount;
    }

    @Column(name = "CAT_MANUFACTURER_ID", length = 22)
    public java.lang.Long getCatManufacturerId() {
        return catManufacturerId;
    }

    public void setCatManufacturerId(java.lang.Long catManufacturerId) {
        this.catManufacturerId = catManufacturerId;
    }

    @Column(name = "STOCK_ID", length = 22)
    public java.lang.Long getStockId() {
        return stockId;
    }

    public void setStockId(java.lang.Long stockId) {
        this.stockId = stockId;
    }

    @Column(name = "CNT_CONTRACT_ID", length = 22)
    public java.lang.Long getCntContractId() {
        return cntContractId;
    }

    public void setCntContractId(java.lang.Long cntContractId) {
        this.cntContractId = cntContractId;
    }

    @Column(name = "SYS_GROUP_ID", length = 22)
    public java.lang.Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(java.lang.Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    @Column(name = "PROJECT_ID", length = 22)
    public java.lang.Long getProjectId() {
        return projectId;
    }

    public void setProjectId(java.lang.Long projectId) {
        this.projectId = projectId;
    }

    @Column(name = "SHIPMENT_ID", length = 22)
    public java.lang.Long getShipmentId() {
        return shipmentId;
    }

    public void setShipmentId(java.lang.Long shipmentId) {
        this.shipmentId = shipmentId;
    }

    @Column(name = "PART_NUMBER", length = 1000)
    public java.lang.String getPartNumber() {
        return partNumber;
    }

    public void setPartNumber(java.lang.String partNumber) {
        this.partNumber = partNumber;
    }

    @Column(name = "UNIT_PRICE", length = 22)
    public java.lang.Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(java.lang.Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    @Column(name = "APPLY_PRICE", length = 22)
    public java.lang.Double getApplyPrice() {
        return applyPrice;
    }

    public void setApplyPrice(java.lang.Double applyPrice) {
        this.applyPrice = applyPrice;
    }

    @Column(name = "EXPORT_DATE", length = 7)
    public java.util.Date getExportDate() {
        return exportDate;
    }

    public void setExportDate(java.util.Date exportDate) {
        this.exportDate = exportDate;
    }

    @Column(name = "IMPORT_STOCK_TRANS_ID", length = 22)
    public java.lang.Long getImportStockTransId() {
        return importStockTransId;
    }

    public void setImportStockTransId(java.lang.Long importStockTransId) {
        this.importStockTransId = importStockTransId;
    }

    @Override
    public MerEntitySimpleDTO toDTO() {
        MerEntitySimpleDTO merEntityDTO = new MerEntitySimpleDTO();
        // set cac gia tri
        merEntityDTO.setUpdatedDate(this.updatedDate);
        merEntityDTO.setStockCellId(this.stockCellId);
        merEntityDTO.setStockCellCode(this.stockCellCode);
        merEntityDTO.setCatProducingCountryId(this.catProducingCountryId);
        merEntityDTO.setParentMerEntityId(this.parentMerEntityId);
        merEntityDTO.setCatUnitName(this.catUnitName);
        merEntityDTO.setImportDate(this.importDate);
        merEntityDTO.setManufacturerName(this.manufacturerName);
        merEntityDTO.setProducingCountryName(this.producingCountryName);
        merEntityDTO.setCatUnitId(this.catUnitId);
        merEntityDTO.setOrderId(this.orderId);
        merEntityDTO.setCntContractCode(this.cntContractCode);
        merEntityDTO.setMerEntityId(this.merEntityId);
        merEntityDTO.setSerial(this.serial);
        merEntityDTO.setGoodsId(this.goodsId);
        merEntityDTO.setGoodsCode(this.goodsCode);
        merEntityDTO.setGoodsName(this.goodsName);
        merEntityDTO.setState(this.state);
        merEntityDTO.setStatus(this.status);
        merEntityDTO.setAmount(this.amount);
        merEntityDTO.setCatManufacturerId(this.catManufacturerId);
        merEntityDTO.setStockId(this.stockId);
        merEntityDTO.setCntContractId(this.cntContractId);
        merEntityDTO.setSysGroupId(this.sysGroupId);
        merEntityDTO.setProjectId(this.projectId);
        merEntityDTO.setShipmentId(this.shipmentId);
        merEntityDTO.setPartNumber(this.partNumber);
        merEntityDTO.setUnitPrice(this.unitPrice);
        merEntityDTO.setApplyPrice(this.applyPrice);
        merEntityDTO.setExportDate(this.exportDate);
        merEntityDTO.setImportStockTransId(this.importStockTransId);
        merEntityDTO.setLevelParentId(this.levelParentId);
        return merEntityDTO;
    }
}
