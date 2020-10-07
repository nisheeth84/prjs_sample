package com.viettel.coms.dto;
import java.util.Date;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.coms.bo.GoodsPlanDetailBO;
import com.viettel.coms.bo.manufacturingVTBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GoodsPlanDetailDTO  extends ComsBaseFWDTO<GoodsPlanDetailBO>{
	private Long goodsPlanDetailId;
	private Long goodsPlanId;
	private Long requestGoodsId;
	private Long requestGoodsDetailId;
	private Long constructionId;
	private String constructionCode;
	private Long cntContractId;
	private String cntContractCode;
	private String goodsName;
	private Long catUnitId;
	private String catUnitName;
	private Long quantity;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date expectedDate;
	private String description;
	private String realIeTransDate;
	
	public Long getGoodsPlanDetailId() {
		return goodsPlanDetailId;
	}

	public void setGoodsPlanDetailId(Long goodsPlanDetailId) {
		this.goodsPlanDetailId = goodsPlanDetailId;
	}

	public Long getGoodsPlanId() {
		return goodsPlanId;
	}

	public void setGoodsPlanId(Long goodsPlanId) {
		this.goodsPlanId = goodsPlanId;
	}

	public Long getRequestGoodsId() {
		return requestGoodsId;
	}

	public void setRequestGoodsId(Long requestGoodsId) {
		this.requestGoodsId = requestGoodsId;
	}

	public Long getRequestGoodsDetailId() {
		return requestGoodsDetailId;
	}

	public void setRequestGoodsDetailId(Long requestGoodsDetailId) {
		this.requestGoodsDetailId = requestGoodsDetailId;
	}

	public Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}

	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
	}

	public Long getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}

	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	public String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName;
	}

	public Long getCatUnitId() {
		return catUnitId;
	}

	public void setCatUnitId(Long catUnitId) {
		this.catUnitId = catUnitId;
	}

	public String getCatUnitName() {
		return catUnitName;
	}

	public void setCatUnitName(String catUnitName) {
		this.catUnitName = catUnitName;
	}

	public Long getQuantity() {
		return quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public Date getExpectedDate() {
		return expectedDate;
	}

	public void setExpectedDate(Date expectedDate) {
		this.expectedDate = expectedDate;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getRealIeTransDate() {
		return realIeTransDate;
	}

	public void setRealIeTransDate(String realIeTransDate) {
		this.realIeTransDate = realIeTransDate;
	}
	
	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public GoodsPlanDetailBO toModel() {
		GoodsPlanDetailBO goodsPlanDetailBO = new GoodsPlanDetailBO();
		goodsPlanDetailBO.setGoodsPlanDetailId(this.goodsPlanDetailId);
		goodsPlanDetailBO.setGoodsPlanId(this.goodsPlanId);
		goodsPlanDetailBO.setRequestGoodsDetailId(this.requestGoodsDetailId);
		goodsPlanDetailBO.setRequestGoodsId(this.requestGoodsId);
		goodsPlanDetailBO.setConstructionId(this.constructionId);
		goodsPlanDetailBO.setConstructionCode(this.constructionCode);
		goodsPlanDetailBO.setCntContractId(this.cntContractId);
		goodsPlanDetailBO.setCntContractCode(this.cntContractCode);
		goodsPlanDetailBO.setGoodsName(this.goodsName);
		goodsPlanDetailBO.setCatUnitId(this.catUnitId);
		goodsPlanDetailBO.setCatUnitName(this.catUnitName);
		goodsPlanDetailBO.setQuantity(this.quantity);
		goodsPlanDetailBO.setDescription(this.description);
		goodsPlanDetailBO.setRealIeTransDate(this.realIeTransDate);
		goodsPlanDetailBO.setExpectedDate(this.expectedDate);
		return goodsPlanDetailBO;
	}
}
