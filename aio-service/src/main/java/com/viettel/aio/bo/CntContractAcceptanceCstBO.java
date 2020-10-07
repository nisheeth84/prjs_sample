package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractAcceptanceCstDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "CntContractAcceptanceCstBO")
@Table(name = "CNT_CONTRACT_ACCEPTANCE_CST")
public class CntContractAcceptanceCstBO extends BaseFWModelImpl {

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_ACCEPTANCE_CST_SEQ") })
	@Column(name = "CNT_CONTRACT_ACCEPTANCE_CST_ID")
	private Long cntContractAcceptanceCstId;
	@Column(name = "CNT_CONTRACT_ACCEPTANCE_ID")
	private Long cntContractAcceptanceId;
	@Column(name = "CNT_CONTRACT_ID")
	private Long cntContractId;
	@Column(name = "CONSTRUCTION_ID")
	private Long constructionId;
	@Column(name = "SHIPMENT_GOODS_ID")
	private Long shipmentGoodsId;
	@Column(name = "STOCK_TRANS_DETAIL_ID")
	private Long stockTransDetailId;

	@Override
	public CntContractAcceptanceCstDTO toDTO() {
		CntContractAcceptanceCstDTO dto = new CntContractAcceptanceCstDTO();
		dto.setCntContractAcceptanceCstId(cntContractAcceptanceCstId);
		dto.setCntContractAcceptanceId(cntContractAcceptanceId);
		dto.setCntContractId(cntContractId);
		dto.setConstructionId(constructionId);
		dto.setShipmentGoodsId(shipmentGoodsId);
		dto.setStockTransDetailId(stockTransDetailId);
		return dto;
	}

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
