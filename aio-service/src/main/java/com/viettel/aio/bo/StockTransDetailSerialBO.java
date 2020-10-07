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
import com.viettel.aio.dto.AIOStockTransDetailSerialDTO;

@SuppressWarnings("serial")
@Entity
@Table(name = "CTCT_WMS_OWNER.STOCK_TRANS_DETAIL_SERIAL")
public class StockTransDetailSerialBO extends BaseFWModelImpl {

	private java.lang.Long stockTransDetailSerialId;
	private java.lang.String serial;
	private java.lang.Double price;
	private java.lang.String cellCode;
	private java.lang.Long stockTransId;
	private java.lang.Long stockTransDetailId;
	private java.lang.Long merEntityId;
	private java.lang.Double quantity;
	private java.lang.Double quantityIssue;
	private java.lang.String goodsState;

	public StockTransDetailSerialBO() {
		setColId("stockTransDetailId");
		setColName("stockTransDetailId");
		setUniqueColumn(new String[] { "stockTransDetailId" });
	}

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
	@Parameter(name = "sequence", value = "CTCT_WMS_OWNER.STOCK_TRANS_DETAIL_SERIAL_SEQ") })
	@Column(name = "STOCK_TRANS_DETAIL_SERIAL_ID", length = 22)
	public java.lang.Long getStockTransDetailSerialId() {
		return stockTransDetailSerialId;
	}

	public void setStockTransDetailSerialId(java.lang.Long stockTransDetailSerialId) {
		this.stockTransDetailSerialId = stockTransDetailSerialId;
	}

	@Column(name = "SERIAL", length = 200)
	public java.lang.String getSerial() {
		return serial;
	}

	public void setSerial(java.lang.String serial) {
		this.serial = serial;
	}

	@Column(name = "PRICE", length = 22)
	public java.lang.Double getPrice() {
		return price;
	}

	public void setPrice(java.lang.Double price) {
		this.price = price;
	}

	@Column(name = "CELL_CODE", length = 100)
	public java.lang.String getCellCode() {
		return cellCode;
	}

	public void setCellCode(java.lang.String cellCode) {
		this.cellCode = cellCode;
	}

	@Column(name = "STOCK_TRANS_ID", length = 22)
	public java.lang.Long getStockTransId() {
		return stockTransId;
	}

	public void setStockTransId(java.lang.Long stockTransId) {
		this.stockTransId = stockTransId;
	}

	@Column(name = "STOCK_TRANS_DETAIL_ID", length = 22)
	public java.lang.Long getStockTransDetailId() {
		return stockTransDetailId;
	}

	public void setStockTransDetailId(java.lang.Long stockTransDetailId) {
		this.stockTransDetailId = stockTransDetailId;
	}

	@Column(name = "MER_ENTITY_ID", length = 10)
	public java.lang.Long getMerEntityId() {
		return merEntityId;
	}

	public void setMerEntityId(java.lang.Long merEntityId) {
		this.merEntityId = merEntityId;
	}

	@Column(name = "GOODS_STATE", length = 10)
	public java.lang.String getGoodsState() {
		return goodsState;
	}

	public void setGoodsState(java.lang.String goodsState) {
		this.goodsState = goodsState;
	}

	@Column(name = "QUANTITY", length = 10)
	public java.lang.Double getQuantity() {
		return quantity;
	}

	public void setQuantity(java.lang.Double quantity) {
		this.quantity = quantity;
	}

	@Column(name = "QUANTITY_ISSUE", length = 10)
	public java.lang.Double getQuantityIssue() {
		return quantityIssue;
	}

	public void setQuantityIssue(java.lang.Double quantityIssue) {
		this.quantityIssue = quantityIssue;
	}

	@Override
	public AIOStockTransDetailSerialDTO toDTO() {
		AIOStockTransDetailSerialDTO stockTransDetailSerialDTO = new AIOStockTransDetailSerialDTO();
		stockTransDetailSerialDTO.setStockTransDetailSerialId(this.stockTransDetailSerialId);
		stockTransDetailSerialDTO.setSerial(this.serial);
		stockTransDetailSerialDTO.setPrice(this.price);
		stockTransDetailSerialDTO.setQuantity(this.quantity);
		stockTransDetailSerialDTO.setQuantityIssue(this.quantityIssue);
		stockTransDetailSerialDTO.setGoodsState(this.goodsState);
		stockTransDetailSerialDTO.setCellCode(this.cellCode);
		stockTransDetailSerialDTO.setStockTransId(this.stockTransId);
		stockTransDetailSerialDTO.setStockTransDetailId(this.stockTransDetailId);
		stockTransDetailSerialDTO.setMerEntityId(this.merEntityId);
		return stockTransDetailSerialDTO;
	}
}
