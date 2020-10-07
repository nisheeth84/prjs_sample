package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractPaymentCstDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "CntContractPaymentCstBO")
@Table(name = "CNT_CONTRACT_PAYMENT_CST")
public class CntContractPaymentCstBO extends BaseFWModelImpl {

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_PAYMENT_CST_SEQ") })
	@Column(name = "CNT_CONTRACT_PAYMENT_CST_ID")
	private Long cntContractPaymentCstId;
	@Column(name = "CNT_CONTRACT_PAYMENT_ID")
	private Long cntContractPaymentId;
	@Column(name = "CNT_CONTRACT_ID")
	private Long cntContractId;
	@Column(name = "CONSTRUCTION_ID")
	private Long constructionId;
	@Column(name = "SHIPMENT_GOODS_ID")
	private Long shipmentGoodsId;
	@Column(name = "STOCK_TRANS_DETAIL_ID")
	private Long stockTransDetailId;

	@Override
	public CntContractPaymentCstDTO toDTO() {
		CntContractPaymentCstDTO dto = new CntContractPaymentCstDTO();
		dto.setCntContractPaymentCstId(cntContractPaymentCstId);
		dto.setCntContractPaymentId(cntContractPaymentId);
		dto.setCntContractId(cntContractId);
		dto.setConstructionId(constructionId);
		dto.setShipmentGoodsId(shipmentGoodsId);
		dto.setStockTransDetailId(stockTransDetailId);
		return dto;
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
