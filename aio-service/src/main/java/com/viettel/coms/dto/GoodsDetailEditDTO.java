package com.viettel.coms.dto;
import java.util.Date;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import com.viettel.coms.bo.GoodsPlanDetailBO;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GoodsDetailEditDTO  extends ComsBaseFWDTO<GoodsPlanDetailBO>{
	private String constructionCode;
	private String cntContractCode;
	private String goodsName;
	private String catUnitName;
	private Long quantity;
	private Date expectedDate;
	private String description;
	public String getConstructionCode() {
		return constructionCode;
	}
	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
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
		// TODO Auto-generated method stub
		return null;
	}
	
	
	
}
