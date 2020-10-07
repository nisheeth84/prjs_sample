/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.dto;

import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.aio.bo.StockTransDetailBO;
import com.viettel.aio.bo.StockTransDetailSerialBO;

@SuppressWarnings("serial")
@XmlRootElement(name = "STOCK_TRANS_DETAIL_SERIALBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOStockTransDetailSerialDTO extends ComsBaseFWDTO<StockTransDetailSerialBO> {

	private java.lang.Long stockTransDetailSerialId;
	private java.lang.Long goodsId;
	private java.lang.Long orderId;
	private java.lang.String serial;
	private java.lang.String contractCode;
	private java.lang.String partNumber;
	private java.lang.Long catManufacturerId;
	private java.lang.Long catProducingCountryId;
	private java.lang.String manufacturerName;
	private java.lang.String producingCountryName;
	private java.lang.Double price;
	private java.lang.String cellCode;
	private java.lang.Long stockTransId;
	private java.lang.Long stockTransDetailId;
	private java.lang.String goodsCode;
	private java.lang.String goodsName;
	private java.lang.String goodsUnitName;
	private java.lang.String unitTypeName;
	private java.lang.Long amountReal;
	private java.lang.String goodsState;
	private java.lang.Double totalPrice;
	private java.lang.Double amount;
	private java.lang.Long id;
	private java.lang.String manufacturer;
	private java.lang.String producerCountry;
	private java.lang.String filePathError;
	private java.lang.String newSerial;
	private java.lang.Long merEntityId;
	private java.lang.Double quantity;
	private java.lang.Double quantityIssue;
	private java.lang.Double unitPrice;
	private java.lang.Long stockId;
	private java.lang.String goodsStateName;
	private java.lang.Long goodsUnitId;
	private java.lang.String stockName;
	private java.lang.String stockCode;
	private java.lang.String goodsIsSerial;
	private java.lang.String goodsType;
	private java.lang.String goodsTypeName;
	private java.lang.Long parentGoodsId;
	private java.lang.String isReal;
	private java.lang.String goodsChildCode;
//	aio_20190325_start
	private java.lang.String goodState;
	
	public java.lang.String getGoodState() {
		return goodState;
	}

	public void setGoodState(java.lang.String goodState) {
		this.goodState = goodState;
	}

	//	aio_20190325_end
	@Override
	public StockTransDetailSerialBO toModel() {
		StockTransDetailSerialBO stockTransDetailSerialBO = new StockTransDetailSerialBO();
		stockTransDetailSerialBO.setStockTransDetailSerialId(this.stockTransDetailSerialId);
		stockTransDetailSerialBO.setSerial(this.serial);
		stockTransDetailSerialBO.setPrice(this.price);
		stockTransDetailSerialBO.setCellCode(this.cellCode);
		stockTransDetailSerialBO.setStockTransId(this.stockTransId);
		stockTransDetailSerialBO.setStockTransDetailId(this.stockTransDetailId);
		stockTransDetailSerialBO.setQuantity(this.quantity);
		stockTransDetailSerialBO.setQuantityIssue(this.quantityIssue);
		stockTransDetailSerialBO.setGoodsState(this.goodsState);
		stockTransDetailSerialBO.setMerEntityId(this.merEntityId);
		return stockTransDetailSerialBO;
	}

	public java.lang.Long getGoodsUnitId() {
		return goodsUnitId;
	}

	public void setGoodsUnitId(java.lang.Long goodsUnitId) {
		this.goodsUnitId = goodsUnitId;
	}

	public java.lang.String getStockName() {
		return stockName;
	}

	public void setStockName(java.lang.String stockName) {
		this.stockName = stockName;
	}

	public java.lang.String getStockCode() {
		return stockCode;
	}

	public void setStockCode(java.lang.String stockCode) {
		this.stockCode = stockCode;
	}

	public java.lang.String getGoodsIsSerial() {
		return goodsIsSerial;
	}

	public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
		this.goodsIsSerial = goodsIsSerial;
	}

	public java.lang.String getGoodsType() {
		return goodsType;
	}

	public void setGoodsType(java.lang.String goodsType) {
		this.goodsType = goodsType;
	}

	public java.lang.String getGoodsTypeName() {
		return goodsTypeName;
	}

	public void setGoodsTypeName(java.lang.String goodsTypeName) {
		this.goodsTypeName = goodsTypeName;
	}

	public java.lang.String getGoodsStateName() {
		return goodsStateName;
	}

	public void setGoodsStateName(java.lang.String goodsStateName) {
		this.goodsStateName = goodsStateName;
	}

	public java.lang.Long getStockId() {
		return stockId;
	}

	public void setStockId(java.lang.Long stockId) {
		this.stockId = stockId;
	}


	public java.lang.Double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(java.lang.Double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public java.lang.Double getUnitPrice() {
		return unitPrice;
	}

	public void setUnitPrice(java.lang.Double unitPrice) {
		this.unitPrice = unitPrice;
	}

	public java.lang.String getNewSerial() {
		return newSerial;
	}

	public void setNewSerial(java.lang.String newSerial) {
		this.newSerial = newSerial;
	}

	@Override
	public java.lang.String getFilePathError() {
		return filePathError;
	}

	@Override
	public void setFilePathError(java.lang.String filePathError) {
		this.filePathError = filePathError;
	}

	public java.lang.Double getQuantity() {
		return quantity;
	}

	public void setQuantity(java.lang.Double quantity) {
		this.quantity = quantity;
	}

	public java.lang.Double getQuantityIssue() {
		return quantityIssue;
	}

	public void setQuantityIssue(java.lang.Double quantityIssue) {
		this.quantityIssue = quantityIssue;
	}

	@Override
	public Long getFWModelId() {
		return stockTransDetailSerialId;
	}

	@Override
	public String catchName() {
		return getStockTransDetailSerialId().toString();
	}

	public java.lang.Long getStockTransDetailSerialId() {
		return stockTransDetailSerialId;
	}

	public void setStockTransDetailSerialId(java.lang.Long stockTransDetailSerialId) {
		this.stockTransDetailSerialId = stockTransDetailSerialId;
	}

	public java.lang.Long getGoodsId() {
		return goodsId;
	}

	public void setGoodsId(java.lang.Long goodsId) {
		this.goodsId = goodsId;
	}

	public java.lang.String getSerial() {
		return serial;
	}

	public void setSerial(java.lang.String serial) {
		this.serial = StringUtils.isNotEmpty(serial) ? serial : null;
	}

	public java.lang.String getContractCode() {
		return contractCode;
	}

	public void setContractCode(java.lang.String contractCode) {
		this.contractCode = contractCode;
	}

	public java.lang.String getPartNumber() {
		return partNumber;
	}

	public void setPartNumber(java.lang.String partNumber) {
		this.partNumber = partNumber;
	}

	public java.lang.Long getCatManufacturerId() {
		return catManufacturerId;
	}

	public void setCatManufacturerId(java.lang.Long catManufacturerId) {
		this.catManufacturerId = catManufacturerId;
	}

	public java.lang.Long getCatProducingCountryId() {
		return catProducingCountryId;
	}

	public void setCatProducingCountryId(java.lang.Long catProducingCountryId) {
		this.catProducingCountryId = catProducingCountryId;
	}

	public java.lang.String getManufacturerName() {
		return manufacturerName;
	}

	public void setManufacturerName(java.lang.String manufacturerName) {
		this.manufacturerName = manufacturerName;
	}

	public java.lang.String getProducingCountryName() {
		return producingCountryName;
	}

	public void setProducingCountryName(java.lang.String producingCountryName) {
		this.producingCountryName = producingCountryName;
	}

	public java.lang.Double getPrice() {
		return price;
	}

	public void setPrice(java.lang.Double price) {
		this.price = price;
	}

	public java.lang.String getCellCode() {
		return cellCode;
	}

	public void setCellCode(java.lang.String cellCode) {
		this.cellCode = cellCode;
	}

	public java.lang.Long getStockTransId() {
		return stockTransId;
	}

	public void setStockTransId(java.lang.Long stockTransId) {
		this.stockTransId = stockTransId;
	}

	public java.lang.Long getStockTransDetailId() {
		return stockTransDetailId;
	}

	public void setStockTransDetailId(java.lang.Long stockTransDetailId) {
		this.stockTransDetailId = stockTransDetailId;
	}

	public java.lang.String getGoodsCode() {
		return goodsCode;
	}

	public void setGoodsCode(java.lang.String goodsCode) {
		if (org.apache.commons.lang3.StringUtils.isNotEmpty(goodsCode)) {
			this.goodsCode = goodsCode.toUpperCase();
		} else {
			this.goodsCode = null;
		}

	}

	public java.lang.String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(java.lang.String goodsName) {
		this.goodsName = goodsName;
	}

	public java.lang.String getGoodsUnitName() {
		return goodsUnitName;
	}

	public void setGoodsUnitName(java.lang.String goodsUnitName) {
		this.goodsUnitName = goodsUnitName;
	}

	public java.lang.String getUnitTypeName() {
		return unitTypeName;
	}

	public void setUnitTypeName(java.lang.String unitTypeName) {
		this.unitTypeName = unitTypeName;
	}

	public java.lang.Double getAmount() {
		return amount;
	}

	public void setAmount(java.lang.Double amount) {
		this.amount = amount;
	}

	@Override
	public java.lang.Long getId() {
		return id;
	}

	@Override
	public void setId(java.lang.Long id) {
		this.id = id;
	}

	public java.lang.String getManufacturer() {
		return manufacturer;
	}

	public void setManufacturer(java.lang.String manufacturer) {
		this.manufacturer = manufacturer;
	}

	public java.lang.String getProducerCountry() {
		return producerCountry;
	}

	public void setProducerCountry(java.lang.String producerCountry) {
		this.producerCountry = producerCountry;
	}

	public java.lang.Long getAmountReal() {
		return amountReal;
	}

	public void setAmountReal(java.lang.Long amountReal) {
		this.amountReal = amountReal;
	}

	public java.lang.String getGoodsState() {
		return goodsState;
	}

	public void setGoodsState(java.lang.String goodsState) {
		this.goodsState = goodsState;
	}

	public java.lang.Long getMerEntityId() {
		return merEntityId;
	}

	public void setMerEntityId(java.lang.Long merEntityId) {
		this.merEntityId = merEntityId;
	}

	public java.lang.Long getOrderId() {
		return orderId;
	}

	public void setOrderId(java.lang.Long orderId) {
		this.orderId = orderId;
	}

	public java.lang.Long getParentGoodsId() {
		return parentGoodsId;
	}

	public void setParentGoodsId(java.lang.Long parentGoodsId) {
		this.parentGoodsId = parentGoodsId;
	}

	public java.lang.String getIsReal() {
		return isReal;
	}

	public void setIsReal(java.lang.String isReal) {
		this.isReal = isReal;
	}

	public java.lang.String getGoodsChildCode() {
		return goodsChildCode;
	}

	public void setGoodsChildCode(java.lang.String goodsChildCode) {
		this.goodsChildCode = goodsChildCode;
	}

	@Override
	public String toString() {
		return "StockTransDetailSerialDTO [stockTransDetailSerialId=" + stockTransDetailSerialId + ", goodsId="
				+ goodsId + ", serial=" + serial + ", goodsCode=" + goodsCode + ", quantity=" + quantity
				+ ", quantityIssue=" + quantityIssue + "]";
	}
	
	public Object clone() throws CloneNotSupportedException{
		return super.clone();
	}

}
