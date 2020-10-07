/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.aio.dto;

//import com.viettel.coms.bo.SynStockTransDetailBO;
import java.util.List;

import com.viettel.aio.bo.StockTransDetailBO;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author HOANM1
 * @version 1.0
 * @since 2019-03-10
 */
@XmlRootElement(name = "STOCK_TRANS_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include=JsonSerialize.Inclusion.NON_NULL)
public class AIOSynStockTransDetailDTO extends
		ComsBaseFWDTO<StockTransDetailBO> {

	private java.lang.Long synStockTransDetailId;
	private java.lang.Long orderId;
	private java.lang.String goodsType;
	private java.lang.String goodsTypeName;
	private java.lang.Long goodsId;
	private java.lang.String goodsCode;
	private java.lang.String goodsName;
	private java.lang.String goodsIsSerial;
	private java.lang.String goodsState;
	private java.lang.String goodsStateName;
	private java.lang.String goodsUnitName;
	private java.lang.Long goodsUnitId;
	private java.lang.Double amountOrder;
	private java.lang.Double amountReal;
	private java.lang.Double totalPrice;
	private java.lang.Double amount;
	private java.lang.Long stockTransId;
	private java.lang.Long synStockTransId;
	private java.lang.Long idTable;
	private java.lang.Long typeExport;
	private java.lang.Long maxTransactionId;
	// aio_20190323_start
	private List<AIOMerEntityDTO> lstStockTransDetailSerial;
	private List<Long> lstTransDetailId;

	public List<Long> getLstTransDetailId() {
		return lstTransDetailId;
	}

	public void setLstTransDetailId(List<Long> lstTransDetailId) {
		this.lstTransDetailId = lstTransDetailId;
	}

	public List<AIOMerEntityDTO> getLstStockTransDetailSerial() {
		return lstStockTransDetailSerial;
	}

	public void setLstStockTransDetailSerial(
			List<AIOMerEntityDTO> lstStockTransDetailSerial) {
		this.lstStockTransDetailSerial = lstStockTransDetailSerial;
	}

	// aio_20190323_end
	public java.lang.Long getTypeExport() {
		return typeExport;
	}

	public void setTypeExport(java.lang.Long typeExport) {
		this.typeExport = typeExport;
	}

	public java.lang.Long getIdTable() {
		return idTable;
	}

	public void setIdTable(java.lang.Long idTable) {
		this.idTable = idTable;
	}

	public java.lang.Long getSynStockTransId() {
		return synStockTransId;
	}

	public void setSynStockTransId(java.lang.Long synStockTransId) {
		this.synStockTransId = synStockTransId;
	}

	@Override
	public StockTransDetailBO toModel() {
		StockTransDetailBO synStockTransDetailBO = new StockTransDetailBO();
		synStockTransDetailBO.setStockTransDetailId(this.synStockTransDetailId);
		synStockTransDetailBO.setOrderId(this.orderId);
		synStockTransDetailBO.setGoodsType(this.goodsType);
		synStockTransDetailBO.setGoodsTypeName(this.goodsTypeName);
		synStockTransDetailBO.setGoodsId(this.goodsId);
		synStockTransDetailBO.setGoodsCode(this.goodsCode);
		synStockTransDetailBO.setGoodsName(this.goodsName);
		synStockTransDetailBO.setGoodsIsSerial(this.goodsIsSerial);
		synStockTransDetailBO.setGoodsState(this.goodsState);
		synStockTransDetailBO.setGoodsStateName(this.goodsStateName);
		synStockTransDetailBO.setGoodsUnitName(this.goodsUnitName);
		synStockTransDetailBO.setGoodsUnitId(this.goodsUnitId);
		synStockTransDetailBO.setAmountOrder(this.amountOrder);
		synStockTransDetailBO.setAmountReal(this.amountReal);
		synStockTransDetailBO.setTotalPrice(this.totalPrice);
		synStockTransDetailBO.setStockTransId(this.stockTransId);
//		synStockTransDetailBO.setAmountReal(this.amount);
		return synStockTransDetailBO;
	}

	@Override
	public Long getFWModelId() {
		return synStockTransDetailId;
	}

	@Override
	public String catchName() {
		return getSynStockTransDetailId().toString();
	}

	public java.lang.Long getSynStockTransDetailId() {
		return synStockTransDetailId;
	}

	public void setSynStockTransDetailId(java.lang.Long synStockTransDetailId) {
		this.synStockTransDetailId = synStockTransDetailId;
	}

	public java.lang.Long getOrderId() {
		return orderId;
	}

	public void setOrderId(java.lang.Long orderId) {
		this.orderId = orderId;
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

	public java.lang.Long getGoodsId() {
		return goodsId;
	}

	public void setGoodsId(java.lang.Long goodsId) {
		this.goodsId = goodsId;
	}

	public java.lang.String getGoodsCode() {
		return goodsCode;
	}

	public void setGoodsCode(java.lang.String goodsCode) {
		this.goodsCode = goodsCode;
	}

	public java.lang.String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(java.lang.String goodsName) {
		this.goodsName = goodsName;
	}

	public java.lang.String getGoodsIsSerial() {
		return goodsIsSerial;
	}

	public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
		this.goodsIsSerial = goodsIsSerial;
	}

	public java.lang.String getGoodsState() {
		return goodsState;
	}

	public void setGoodsState(java.lang.String goodsState) {
		this.goodsState = goodsState;
	}

	public java.lang.String getGoodsStateName() {
		return goodsStateName;
	}

	public void setGoodsStateName(java.lang.String goodsStateName) {
		this.goodsStateName = goodsStateName;
	}

	public java.lang.String getGoodsUnitName() {
		return goodsUnitName;
	}

	public void setGoodsUnitName(java.lang.String goodsUnitName) {
		this.goodsUnitName = goodsUnitName;
	}

	public java.lang.Long getGoodsUnitId() {
		return goodsUnitId;
	}

	public void setGoodsUnitId(java.lang.Long goodsUnitId) {
		this.goodsUnitId = goodsUnitId;
	}

	public java.lang.Double getAmountOrder() {
		return amountOrder;
	}

	public void setAmountOrder(java.lang.Double amountOrder) {
		this.amountOrder = amountOrder;
	}

	public java.lang.Double getAmountReal() {
		return amountReal;
	}

	public void setAmountReal(java.lang.Double amountReal) {
		this.amountReal = amountReal;
	}

	public java.lang.Double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(java.lang.Double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public java.lang.Long getStockTransId() {
		return stockTransId;
	}

	public void setStockTransId(java.lang.Long stockTransId) {
		this.stockTransId = stockTransId;
	}

	public java.lang.Double getAmount() {
		return amount;
	}

	public void setAmount(java.lang.Double amount) {
		this.amount = amount;
	}

	public java.lang.Long getMaxTransactionId() {
		return maxTransactionId;
	}

	public void setMaxTransactionId(java.lang.Long maxTransactionId) {
		this.maxTransactionId = maxTransactionId;
	}

	private java.lang.String goodsNameImport;

	public java.lang.String getGoodsNameImport() {
		return goodsNameImport;
	}

	public void setGoodsNameImport(java.lang.String goodsNameImport) {
		this.goodsNameImport = goodsNameImport;
	}
//	hoanm1_20190422_start
	private List<String> lstSerial;
	private java.lang.Double amountReceive;

	public java.lang.Double getAmountReceive() {
		return amountReceive;
	}

	public void setAmountReceive(java.lang.Double amountReceive) {
		this.amountReceive = amountReceive;
	}

	public List<String> getLstSerial() {
		return lstSerial;
	}

	public void setLstSerial(List<String> lstSerial) {
		this.lstSerial = lstSerial;
	}
	
//	hoanm1_20190422_end

}
