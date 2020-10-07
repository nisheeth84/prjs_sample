package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractAcceptanceCstBO;

@SuppressWarnings("serial")
public class CntContractAcceptanceCstDTO extends ComsBaseFWDTO<CntContractAcceptanceCstBO> {

	private Long cntContractAcceptanceCstId;
	private Long cntContractAcceptanceId;
	private Long cntContractId;
	private Long constructionId;
	private Long shipmentGoodsId;
	private Long stockTransDetailId;

	public Long getCntContractAcceptanceCstId() {
		return cntContractAcceptanceCstId;
	}

	public void setCntContractAcceptanceCstId(Long cntContractAcceptanceCstId) {
		this.cntContractAcceptanceCstId = cntContractAcceptanceCstId;
	}

	public Long getCntContractAcceptanceId() {
		return cntContractAcceptanceId;
	}

	public void setCntContractAcceptanceId(Long cntContractAcceptanceId) {
		this.cntContractAcceptanceId = cntContractAcceptanceId;
	}

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
		return cntContractAcceptanceCstId.toString();
	}

	@Override
	public Long getFWModelId() {
		return cntContractAcceptanceCstId;
	}

	@Override
	public CntContractAcceptanceCstBO toModel() {
		CntContractAcceptanceCstBO bo = new CntContractAcceptanceCstBO();
		bo.setCntContractAcceptanceCstId(cntContractAcceptanceCstId);
		bo.setCntContractAcceptanceId(cntContractAcceptanceId);
		bo.setCntContractId(cntContractId);
		bo.setConstructionId(constructionId);
		bo.setShipmentGoodsId(shipmentGoodsId);
		bo.setStockTransDetailId(stockTransDetailId);
		return bo;
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
