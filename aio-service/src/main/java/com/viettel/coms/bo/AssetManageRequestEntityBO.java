/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.AssetManageRequestEntityDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@Entity
@Table(name = "ASSET_MANAGE_REQUEST_ENTITY")
/**
 *
 * @author: ThuanNHT
 * @version: 1.0
 * @since: 1.0
 */
public class AssetManageRequestEntityBO extends BaseFWModelImpl {

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
	private Double parentMerEntityId;

	
	@Column(name = "PARENT_MER_ENTITY_ID", length = 10)
	public Double getParentMerEntityId() {
		return parentMerEntityId;
	}

	public void setParentMerEntityId(Double parentMerEntityId) {
		this.parentMerEntityId = parentMerEntityId;
	}
	
	@Column(name = "ASSET_MANAGEMENT_REQUEST_ID", length = 10)
	public java.lang.Long getAssetManagementRequestId() {
		return assetManagementRequestId;
	}
	
	public void setAssetManagementRequestId(
			java.lang.Long assetManagementRequestId) {
		this.assetManagementRequestId = assetManagementRequestId;
	}

	@Column(name = "QUANTITY", length = 22)
	public java.lang.Double getQuantity() {
		return quantity;
	}

	public void setQuantity(java.lang.Double quantity) {
		this.quantity = quantity;
	}

	@Column(name = "MER_ENTITY_ID", length = 22)
	public java.lang.Double getMerEntityId() {
		return merEntityId;
	}

	public void setMerEntityId(java.lang.Double merEntityId) {
		this.merEntityId = merEntityId;
	}

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "ASSET_M_R_ENTITY_SEQ") })
	@Column(name = "ASSET_MANAGE_REQUEST_ENTITY_ID", length = 10)
	public java.lang.Long getAssetManageRequestEntityId() {
		return assetManageRequestEntityId;
	}

	public void setAssetManageRequestEntityId(
			java.lang.Long assetManageRequestEntityId) {
		this.assetManageRequestEntityId = assetManageRequestEntityId;
	}

	@Column(name = "GOODS_ID", length = 22)
	public java.lang.Long getGoodsId() {
		return goodsId;
	}

	public void setGoodsId(java.lang.Long goodsId) {
		this.goodsId = goodsId;
	}

	@Column(name = "GOODS_CODE", length = 200)
	public java.lang.String getGoodsCode() {
		return goodsCode;
	}

	public void setGoodsCode(java.lang.String goodsCode) {
		this.goodsCode = goodsCode;
	}

	@Column(name = "GOODS_NAME", length = 2000)
	public java.lang.String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(java.lang.String goodsName) {
		this.goodsName = goodsName;
	}

	@Column(name = "GOODS_UNIT_NAME", length = 100)
	public java.lang.String getGoodsUnitName() {
		return goodsUnitName;
	}

	public void setGoodsUnitName(java.lang.String goodsUnitName) {
		this.goodsUnitName = goodsUnitName;
	}

	@Column(name = "GOODS_IS_SERIAL", length = 40)
	public java.lang.String getGoodsIsSerial() {
		return goodsIsSerial;
	}

	public void setGoodsIsSerial(java.lang.String goodsIsSerial) {
		this.goodsIsSerial = goodsIsSerial;
	}

	@Column(name = "SERIAL", length = 200)
	public java.lang.String getSerial() {
		return serial;
	}

	public void setSerial(java.lang.String serial) {
		this.serial = serial;
	}

	@Override
	public AssetManageRequestEntityDTO toDTO() {
		AssetManageRequestEntityDTO assetManageRequestEntityDTO = new AssetManageRequestEntityDTO();
		// set cac gia tri
		assetManageRequestEntityDTO
				.setAssetManagementRequestId(this.assetManagementRequestId);
		assetManageRequestEntityDTO.setQuantity(this.quantity);
		assetManageRequestEntityDTO.setMerEntityId(this.merEntityId);
		assetManageRequestEntityDTO
				.setAssetManageRequestEntityId(this.assetManageRequestEntityId);
		assetManageRequestEntityDTO.setGoodsId(this.goodsId);
		assetManageRequestEntityDTO.setGoodsCode(this.goodsCode);
		assetManageRequestEntityDTO.setGoodsName(this.goodsName);
		assetManageRequestEntityDTO.setGoodsUnitName(this.goodsUnitName);
		assetManageRequestEntityDTO.setGoodsIsSerial(this.goodsIsSerial);
		assetManageRequestEntityDTO.setSerial(this.serial);
		assetManageRequestEntityDTO
				.setParentMerEntityId(this.parentMerEntityId);
		return assetManageRequestEntityDTO;
	}
}
