package com.viettel.coms.bo;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import com.viettel.coms.dto.GoodsPlanDetailDTO;
import com.viettel.service.base.model.BaseFWModelImpl;

//@SuppressWarnings({ "serial", "unused" })
//@Entity(name="com.viettel.erp.bo.GoodsPlanDetailBO")
@Entity
@Table(name = "GOODS_PLAN_DETAIL")
public class GoodsPlanDetailBO extends BaseFWModelImpl{

//	@Override
//	public BaseFWDTOImpl toDTO() {
//		// TODO Auto-generated method stub
//		return null;
//	}
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
	private Date expectedDate;
	private String description;
	private String realIeTransDate;
	
	@Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
    @Parameter(name = "sequence", value = "GOODS_PLAN_DETAIL_SEQ")})
	@Column(name = "GOODS_PLAN_DETAIL_ID",length = 22)
	public Long getGoodsPlanDetailId() {
		return goodsPlanDetailId;
	}
	public void setGoodsPlanDetailId(Long goodsPlanDetailId) {
		this.goodsPlanDetailId = goodsPlanDetailId;
	}
	@Column(name = "GOODS_PLAN_ID",length = 22)
	public Long getGoodsPlanId() {
		return goodsPlanId;
	}
	public void setGoodsPlanId(Long goodsPlanId) {
		this.goodsPlanId = goodsPlanId;
	}
	@Column(name = "REQUEST_GOODS_ID",length = 22)
	public Long getRequestGoodsId() {
		return requestGoodsId;
	}
	public void setRequestGoodsId(Long requestGoodsId) {
		this.requestGoodsId = requestGoodsId;
	}
	@Column(name = "REQUEST_GOODS_DETAIL_ID",length = 22)
	public Long getRequestGoodsDetailId() {
		return requestGoodsDetailId;
	}
	public void setRequestGoodsDetailId(Long requestGoodsDetailId) {
		this.requestGoodsDetailId = requestGoodsDetailId;
	}
	@Column(name = "CONSTRUCTION_ID",length = 22)
	public Long getConstructionId() {
		return constructionId;
	}
	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}
	@Column(name = "CONSTRUCTION_CODE",length = 22)
	public String getConstructionCode() {
		return constructionCode;
	}
	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
	}
	@Column(name = "CNT_CONTRACT_ID",length = 22)
	public Long getCntContractId() {
		return cntContractId;
	}
	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}
	@Column(name = "CNT_CONTRACT_CODE",length = 22)
	public String getCntContractCode() {
		return cntContractCode;
	}
	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}
	@Column(name = "GOODS_NAME",length = 22)
	public String getGoodsName() {
		return goodsName;
	}
	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName;
	}
	@Column(name = "CAT_UNIT_ID",length = 22)
	public Long getCatUnitId() {
		return catUnitId;
	}
	public void setCatUnitId(Long catUnitId) {
		this.catUnitId = catUnitId;
	}
	@Column(name = "CAT_UNIT_NAME",length = 22)
	public String getCatUnitName() {
		return catUnitName;
	}
	public void setCatUnitName(String catUnitName) {
		this.catUnitName = catUnitName;
	}
	@Column(name = "QUANTITY",length = 22)
	public Long getQuantity() {
		return quantity;
	}
	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}
	@Column(name = "EXPECTED_DATE",length = 22)
	public Date getExpectedDate() {
		return expectedDate;
	}
	public void setExpectedDate(Date expectedDate) {
		this.expectedDate = expectedDate;
	}
	@Column(name = "DESCRIPTION",length = 22)
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	@Column(name = "REAL_IE_TRANS_DATE",length = 22)
	public String getRealIeTransDate() {
		return realIeTransDate;
	}
	public void setRealIeTransDate(String realIeTransDate) {
		this.realIeTransDate = realIeTransDate;
	}
	@Override
	public GoodsPlanDetailDTO toDTO() {
		GoodsPlanDetailDTO goodsPlanDetailDTO = new GoodsPlanDetailDTO();
        // set cac gia tri
		goodsPlanDetailDTO.setGoodsPlanDetailId(this.goodsPlanDetailId);
		goodsPlanDetailDTO.setGoodsPlanId(this.goodsPlanId);
		goodsPlanDetailDTO.setRequestGoodsDetailId(this.requestGoodsDetailId);
		goodsPlanDetailDTO.setRequestGoodsId(this.requestGoodsId);
		goodsPlanDetailDTO.setConstructionId(this.constructionId);
		goodsPlanDetailDTO.setConstructionCode(this.constructionCode);
		goodsPlanDetailDTO.setCntContractId(this.cntContractId);
		goodsPlanDetailDTO.setCntContractCode(this.cntContractCode);
		goodsPlanDetailDTO.setGoodsName(this.goodsName);
		goodsPlanDetailDTO.setCatUnitId(this.catUnitId);
		goodsPlanDetailDTO.setCatUnitName(this.catUnitName);
		goodsPlanDetailDTO.setQuantity(this.quantity);
		goodsPlanDetailDTO.setDescription(this.description);
		goodsPlanDetailDTO.setRealIeTransDate(this.realIeTransDate);
		goodsPlanDetailDTO.setExpectedDate(this.expectedDate);
        return goodsPlanDetailDTO;
    }
	
}
