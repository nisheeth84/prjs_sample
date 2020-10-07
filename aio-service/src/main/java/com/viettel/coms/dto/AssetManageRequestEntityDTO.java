/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.coms.bo.AssetManageRequestEntityBO;

/**
 * @author thuannht
 */
@XmlRootElement(name = "ASSET_MANAGE_REQUEST_ENTITYBO")
@JsonIgnoreProperties(ignoreUnknown = true)

public class AssetManageRequestEntityDTO extends ComsBaseFWDTO<AssetManageRequestEntityBO> {

	private java.lang.Long assetManagementRequestId;
	private java.lang.Double quantity;
	private java.lang.Double merEntityId;
	private java.lang.Long assetManageRequestEntityId;
	private java.lang.Long goodsId;
	private java.lang.String goodsCode;
	private java.lang.String goodsName;
	private java.lang.String goodsUnitName;
	private java.lang.String goodsIsSerial;
	private java.lang.String serial;
	private java.lang.Double amount;
	private Double parentMerEntityId;

	@Override
	public AssetManageRequestEntityBO toModel() {
		AssetManageRequestEntityBO assetManageRequestEntityBO = new AssetManageRequestEntityBO();
		assetManageRequestEntityBO.setAssetManagementRequestId(this.assetManagementRequestId);
		assetManageRequestEntityBO.setQuantity(this.quantity);
		assetManageRequestEntityBO.setMerEntityId(this.merEntityId);
		assetManageRequestEntityBO.setAssetManageRequestEntityId(this.assetManageRequestEntityId);
		assetManageRequestEntityBO.setGoodsId(this.goodsId);
		assetManageRequestEntityBO.setGoodsCode(this.goodsCode);
		assetManageRequestEntityBO.setGoodsName(this.goodsName);
		assetManageRequestEntityBO.setGoodsUnitName(this.goodsUnitName);
		assetManageRequestEntityBO.setGoodsIsSerial(this.goodsIsSerial);
		assetManageRequestEntityBO.setSerial(this.serial);
		assetManageRequestEntityBO.setParentMerEntityId(this.parentMerEntityId);
		return assetManageRequestEntityBO;
	}


	public Double getParentMerEntityId() {
		return parentMerEntityId;
	}

	public void setParentMerEntityId(Double parentMerEntityId) {
		this.parentMerEntityId = parentMerEntityId;
	}



	public java.lang.Long getAssetManagementRequestId() {
		return assetManagementRequestId;
	}

	public void setAssetManagementRequestId(java.lang.Long assetManagementRequestId) {
		this.assetManagementRequestId = assetManagementRequestId;
	}

	public java.lang.Double getQuantity() {
		return quantity;
	}

	public void setQuantity(java.lang.Double quantity) {
		this.quantity = quantity;
	}

	public java.lang.Double getMerEntityId() {
		return merEntityId;
	}

	public void setMerEntityId(java.lang.Double merEntityId) {
		this.merEntityId = merEntityId;
	}

	@Override
	public Long getFWModelId() {
		return assetManageRequestEntityId;
	}

	@Override
	public String catchName() {
		return getAssetManageRequestEntityId().toString();
	}

	public java.lang.Long getAssetManageRequestEntityId() {
		return assetManageRequestEntityId;
	}

	public void setAssetManageRequestEntityId(java.lang.Long assetManageRequestEntityId) {
		this.assetManageRequestEntityId = assetManageRequestEntityId;
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

	public java.lang.String getGoodsUnitName() {
		return goodsUnitName;
	}

	public void setGoodsUnitName(java.lang.String goodsUnitName) {
		this.goodsUnitName = goodsUnitName;
	}

	public java.lang.String getGoodsIsSerial() {
		return goodsIsSerial;
	}

	public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
		this.goodsIsSerial = goodsIsSerial;
	}

	public java.lang.String getSerial() {
		return serial;
	}

	public void setSerial(java.lang.String serial) {
		this.serial = serial;
	}

	public java.lang.Double getAmount() {
		return amount;
	}

	public void setAmount(java.lang.Double amount) {
		this.amount = amount;
	}

	@Override
	public int hashCode() {
		final int prime = 31;
		int result = 1;
		result = prime * result + ((goodsCode == null) ? 0 : goodsCode.hashCode());
		result = prime * result + ((goodsId == null) ? 0 : goodsId.hashCode());
		return result;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		AssetManageRequestEntityDTO other = (AssetManageRequestEntityDTO) obj;
		if (goodsCode == null) {
			if (other.goodsCode != null)
				return false;
		} else if (!goodsCode.equals(other.goodsCode))
			return false;
		if (goodsId == null) {
			if (other.goodsId != null)
				return false;
		} else if (!goodsId.equals(other.goodsId))
			return false;
		return true;
	}

}
