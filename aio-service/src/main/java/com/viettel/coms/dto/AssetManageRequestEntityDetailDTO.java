package com.viettel.coms.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AssetManageRequestEntityDetailDTO extends
		AssetManageRequestEntityDTO {

	private static final long serialVersionUID = 1L;
	private Double amountPX; // SL trong phiếu xuất
	private Double amountNT; // SL nghiệm thu
	private Double amountDTH; // SL đã thu hồi
	private Double amountDYCTH;// SL đã y/c thu hồi"
	private Long constructionId;
	private Long merentityId;
	private Double consQuantity;
	private Double amountGoodsCode;
	private Double TotalPrice;
	private Double applyPrice;
	private Long employ;
	private Double aMountMerentity;
	private String goodsType;
	private String goodsTypeName;
	private Long unitType;
	private java.lang.Long stockId;
	private Double price;
	private Long importStockTransId;
	private String serial;
	private Double parentMerEntityId;
	private Long merEntityId2;
	private Long parentMerEntityId2;
	private Long merEntityId3;
	private Long parentMerEntityId3;

	public Long getMerEntityId2() {
		return merEntityId2;
	}

	public void setMerEntityId2(Long merEntityId2) {
		this.merEntityId2 = merEntityId2;
	}

	public Long getParentMerEntityId2() {
		return parentMerEntityId2;
	}

	public void setParentMerEntityId2(Long parentMerEntityId2) {
		this.parentMerEntityId2 = parentMerEntityId2;
	}

	public Long getMerEntityId3() {
		return merEntityId3;
	}

	public void setMerEntityId3(Long merEntityId3) {
		this.merEntityId3 = merEntityId3;
	}

	public Long getParentMerEntityId3() {
		return parentMerEntityId3;
	}

	public void setParentMerEntityId3(Long parentMerEntityId3) {
		this.parentMerEntityId3 = parentMerEntityId3;
	}

	public Double getParentMerEntityId() {
		return parentMerEntityId;
	}

	public void setParentMerEntityId(Double parentMerEntityId) {
		this.parentMerEntityId = parentMerEntityId;
	}

	public String getSerial() {
		return serial;
	}

	public void setSerial(String serial) {
		this.serial = serial;
	}

	public Double getaMountMerentity() {
		return aMountMerentity;
	}

	public void setaMountMerentity(Double aMountMerentity) {
		this.aMountMerentity = aMountMerentity;
	}

	public Long getEmploy() {
		return employ;
	}

	public void setEmploy(Long employ) {
		this.employ = employ;
	}

	public Double getApplyPrice() {
		return applyPrice;
	}

	public void setApplyPrice(Double applyPrice) {
		this.applyPrice = applyPrice;
	}

	public Double getTotalPrice() {
		return TotalPrice;
	}

	public void setTotalPrice(Double totalPrice) {
		TotalPrice = totalPrice;
	}

	public Double getAmountGoodsCode() {
		return amountGoodsCode;
	}

	public void setAmountGoodsCode(Double amountGoodsCode) {
		this.amountGoodsCode = amountGoodsCode;
	}

	public Double getAmountPX() {
		return amountPX;
	}

	public void setAmountPX(Double amountPX) {
		this.amountPX = amountPX;
	}

	public Double getAmountNT() {
		return amountNT;
	}

	public void setAmountNT(Double amountNT) {
		this.amountNT = amountNT;
	}

	public Double getAmountDTH() {
		return amountDTH;
	}

	public void setAmountDTH(Double amountDTH) {
		this.amountDTH = amountDTH;
	}

	public Double getAmountDYCTH() {
		return amountDYCTH;
	}

	public void setAmountDYCTH(Double amountDYCTH) {
		this.amountDYCTH = amountDYCTH;
	}

	public Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}

	public Long getMerentityId() {
		return merentityId;
	}

	public void setMerentityId(Long merentityId) {
		this.merentityId = merentityId;
	}

	public Double getConsQuantity() {
		return consQuantity;
	}

	public void setConsQuantity(Double consQuantity) {
		this.consQuantity = consQuantity;
	}

	public String getGoodsType() {
		return goodsType;
	}

	public void setGoodsType(String goodsType) {
		this.goodsType = goodsType;
	}

	public String getGoodsTypeName() {
		return goodsTypeName;
	}

	public void setGoodsTypeName(String goodsTypeName) {
		this.goodsTypeName = goodsTypeName;
	}

	public Long getUnitType() {
		return unitType;
	}

	public void setUnitType(Long unitType) {
		this.unitType = unitType;
	}

	public java.lang.Long getStockId() {
		return stockId;
	}

	public void setStockId(java.lang.Long stockId) {
		this.stockId = stockId;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Long getImportStockTransId() {
		return importStockTransId;
	}

	public void setImportStockTransId(Long importStockTransId) {
		this.importStockTransId = importStockTransId;
	}

}
