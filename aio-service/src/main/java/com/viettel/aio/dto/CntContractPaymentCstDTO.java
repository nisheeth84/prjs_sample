package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractPaymentCstBO;

@SuppressWarnings("serial")
public class CntContractPaymentCstDTO extends ComsBaseFWDTO<CntContractPaymentCstBO> {

	private Long cntContractId;
	private Long constructionId;
	private Long cntContractPaymentCstId;
	private Long cntContractPaymentId;
	private Long shipmentGoodsId;
	private Long stockTransDetailId;

	public Long getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}

	public Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}

	@Override
	public String catchName() {
		return cntContractPaymentCstId.toString();
	}

	@Override
	public Long getFWModelId() {
		return cntContractPaymentCstId;
	}

	@Override
	public CntContractPaymentCstBO toModel() {
		CntContractPaymentCstBO bo = new CntContractPaymentCstBO();
		bo.setCntContractPaymentCstId(cntContractPaymentCstId);
		bo.setCntContractPaymentId(cntContractPaymentId);
		bo.setCntContractId(cntContractId);
		bo.setConstructionId(constructionId);
		bo.setShipmentGoodsId(shipmentGoodsId);
		bo.setStockTransDetailId(stockTransDetailId);
		return bo;
	}

	public Long getCntContractPaymentCstId() {
		return cntContractPaymentCstId;
	}

	public void setCntContractPaymentCstId(Long cntContractPaymentCstId) {
		this.cntContractPaymentCstId = cntContractPaymentCstId;
	}

	public Long getCntContractPaymentId() {
		return cntContractPaymentId;
	}

	public void setCntContractPaymentId(Long cntContractPaymentId) {
		this.cntContractPaymentId = cntContractPaymentId;
	}

	public Long getShipmentGoodsId() {
		return shipmentGoodsId;
	}

	public void setShipmentGoodsId(Long shipmentGoodsId) {
		this.shipmentGoodsId = shipmentGoodsId;
	}

	public Long getStockTransDetailId() {
		return stockTransDetailId;
	}

	public void setStockTransDetailId(Long stockTransDetailId) {
		this.stockTransDetailId = stockTransDetailId;
	}
}
