package com.viettel.coms.dto;

import java.util.Date;
import java.util.List;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.coms.bo.manufacturingVTBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

@JsonIgnoreProperties(ignoreUnknown = true)
public class manufacturingVT_DTO extends ComsBaseFWDTO<manufacturingVTBO> {
	private Long requestgoodsId;
	private String constructionCode;
	private String requestContent;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date createdDate;
	private Long status;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateFrom;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date dateTo;
	private Long constructionId;
	private Long cntContractId;
	private String goodsName;
	private String description;
	private String baseContent;
	private String performContent;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date expectedDate;
	private Long sysgroupId;
	private Long catProvinceId;
	private String cntContractCode;
	private Date receiveDate;
	private Long objectId;
	private Date sendDate;
	private Long isOrder;
	private Long createdUserId;
	private Date updatedDate;
	private Long updatedUserId;
	private String name;
	private String code;
	private Long goodsPlanId;
	private Long goodsPlanDetailId;
	private Long signState;
	private Long requestGoodsId;
	private Long quantity;
	private String catUnitName;
	private Long catUnitId;
	
	public Long getCatUnitId() {
		return catUnitId;
	}

	public void setCatUnitId(Long catUnitId) {
		this.catUnitId = catUnitId;
	}

	private List<GoodsPlanDetailDTO> listData;
	
	public List<GoodsPlanDetailDTO> getListData() {
		return listData;
	}

	public void setListData(List<GoodsPlanDetailDTO> listData) {
		this.listData = listData;
	}

	public Long getQuantity() {
		return quantity;
	}

	public void setQuantity(Long quantity) {
		this.quantity = quantity;
	}

	public String getCatUnitName() {
		return catUnitName;
	}

	public void setCatUnitName(String catUnitName) {
		this.catUnitName = catUnitName;
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

	public String getSysGroupName() {
		return sysGroupName;
	}

	public void setSysGroupName(String sysGroupName) {
		this.sysGroupName = sysGroupName;
	}

	private Long requestGoodsDetailId;
	private String sysGroupName;
	
	
	
	
	
	public Long getSignState() {
		return signState;
	}

	public void setSignState(Long signState) {
		this.signState = signState;
	}

	public Long getGoodsPlanDetailId() {
		return goodsPlanDetailId;
	}

	public void setGoodsPlanDetailId(Long goodsPlanDetailId) {
		this.goodsPlanDetailId = goodsPlanDetailId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public Long getGoodsPlanId() {
		return goodsPlanId;
	}

	public void setGoodsPlanId(Long goodsPlanId) {
		this.goodsPlanId = goodsPlanId;
	}

	public Long getSysgroupId() {
		return sysgroupId;
	}

	public void setSysgroupId(Long sysgroupId) {
		this.sysgroupId = sysgroupId;
	}

	public Long getCatProvinceId() {
		return catProvinceId;
	}

	public void setCatProvinceId(Long catProvinceId) {
		this.catProvinceId = catProvinceId;
	}

	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	public Date getReceiveDate() {
		return receiveDate;
	}

	public void setReceiveDate(Date receiveDate) {
		this.receiveDate = receiveDate;
	}

	public Long getObjectId() {
		return objectId;
	}

	public void setObjectId(Long objectId) {
		this.objectId = objectId;
	}

	public Date getSendDate() {
		return sendDate;
	}

	public void setSendDate(Date sendDate) {
		this.sendDate = sendDate;
	}

	public Long getIsOrder() {
		return isOrder;
	}

	public void setIsOrder(Long isOrder) {
		this.isOrder = isOrder;
	}

	public Long getCreatedUserId() {
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}

	public Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Long getUpdatedUserId() {
		return updatedUserId;
	}

	public void setUpdatedUserId(Long updatedUserId) {
		this.updatedUserId = updatedUserId;
	}

	public String getBaseContent() {
		return baseContent;
	}

	public void setBaseContent(String baseContent) {
		this.baseContent = baseContent;
	}

	public String getPerformContent() {
		return performContent;
	}

	public void setPerformContent(String performContent) {
		this.performContent = performContent;
	}


	public Date getExpectedDate() {
		return expectedDate;
	}

	public void setExpectedDate(Date expectedDate) {
		this.expectedDate = expectedDate;
	}

	public Long getConstructionId() {
		return constructionId;
	}

	public void setConstructionId(Long constructionId) {
		this.constructionId = constructionId;
	}

	public Long getCntContractId() {
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId) {
		this.cntContractId = cntContractId;
	}

	public String getGoodsName() {
		return goodsName;
	}

	public void setGoodsName(String goodsName) {
		this.goodsName = goodsName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Date getDateFrom() {
		return dateFrom;
	}

	public void setDateFrom(Date dateFrom) {
		this.dateFrom = dateFrom;
	}

	public Date getDateTo() {
		return dateTo;
	}

	public void setDateTo(Date dateTo) {
		this.dateTo = dateTo;
	}

	public Long getRequestgoodsId() {
		return requestgoodsId;
	}

	public void setRequestgoodsId(Long requestgoodsId) {
		this.requestgoodsId = requestgoodsId;
	}

	public String getRequestGroupName() {
		return requestGroupName;
	}

	public void setRequestGroupName(String requestGroupName) {
		this.requestGroupName = requestGroupName;
	}

	public String getConstructionCode() {
		return constructionCode;
	}

	public void setConstructionCode(String constructionCode) {
		this.constructionCode = constructionCode;
	}

	public String getRequestContent() {
		return requestContent;
	}

	public void setRequestContent(String requestContent) {
		this.requestContent = requestContent;
	}

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	private String requestGroupName;
//	public Integer getTotalRecord() {
//		// TODO Auto-generated method stub
//		return null;
//	}
//
//	public Integer getPageSize() {
//		// TODO Auto-generated method stub
//		return null;
//	}
//
//	public void setTotalRecord(int intValue) {
//		// TODO Auto-generated method stub
//		
//	}
//
//	public String getCode() {
//		// TODO Auto-generated method stub
//		return null;
//	}

//	@Override
//	public String catchName() {
//		// TODO Auto-generated method stub
//		return null;
//	}
//
//	@Override
//	public Long getFWModelId() {
//		// TODO Auto-generated method stub
//		return null;
//	}

//	@Override
//	public manufacturingVTBO toModel() {
//		// TODO Auto-generated method stub
//		return null;
//	}
	@Override
	public manufacturingVTBO toModel() {
		manufacturingVTBO manufacturingVTBO = new manufacturingVTBO();
		manufacturingVTBO.setBaseContent(this.baseContent);
		manufacturingVTBO.setPerformContent(this.performContent);
//		manufacturingVTBO.setGoodsName(this.goodsName);
//		manufacturingVTBO.setExpectedDate(this.expectedDate);
//		manufacturingVTBO.setCntContractId(this.cntContractId);
//		manufacturingVTBO.setDescription(this.description);
//		manufacturingVTBO.setRequestgoodsId(this.requestgoodsId);
		manufacturingVTBO.setCreatedDate(this.createdDate);
//		manufacturingVTBO.setRequestContent(this.requestContent);
		manufacturingVTBO.setStatus(this.status);
//		manufacturingVTBO.setConstructionCode(this.constructionCode);
		
		manufacturingVTBO.setName(this.name);
		manufacturingVTBO.setCode(this.code);
		manufacturingVTBO.setGoodsPlanId(this.goodsPlanId);
		manufacturingVTBO.setSignState(this.signState);
//		manufacturingVTBO.setSysgroupId(this.sysgroupId);
//		manufacturingVTBO.setCatProvinceId(this.catProvinceId);
//		manufacturingVTBO.setCntContractCode(this.cntContractCode);
//		manufacturingVTBO.setCntContractCode(this.cntContractCode);
//		manufacturingVTBO.setObjectId(this.objectId);
//		manufacturingVTBO.setSendDate(this.sendDate);
//		manufacturingVTBO.setCatProvinceId(this.catProvinceId);
//		manufacturingVTBO.setIsOrder(this.isOrder);
		manufacturingVTBO.setCreatedUserId(this.createdUserId);
		manufacturingVTBO.setUpdatedDate(this.updatedDate);
		manufacturingVTBO.setUpdatedUserId(this.updatedUserId);
		return manufacturingVTBO;
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
}
