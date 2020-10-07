package com.viettel.coms.dto;

import java.util.Date;
import java.util.List;

import javax.xml.bind.annotation.XmlRootElement;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import com.viettel.coms.bo.GoodsPlanBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;

/**
 * @author Hoangnh38
 */
@XmlRootElement(name = "GOODSPLANBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoodsPlanDTO extends ComsBaseFWDTO<GoodsPlanBO> {
	private Long goodsPlanId;
	private String code;
	private String name;
	private String baseContent;
	private String performContent;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date createdDate;
	private Long createdUserId;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date updateDate;
	private Long updateUserId;
	private String status;
	private String signState;
	private Long cntContractId;
	private Long constructionId;
	private Long sysGroupId;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date startDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date endDate;
	
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date toStartDate;
	@JsonSerialize(using = JsonDateSerializerDate.class)
	@JsonDeserialize(using = JsonDateDeserializer.class)
	private Date toEndDate;
	
	private Long catProvinceId;
	private String keySearch;
	private Long requestGoodsId;
	private List<String> signVO;
	private List<GoodsPlanDetailDTO> listData;
	private String cntContractCode;
	
	public String getCntContractCode() {
		return cntContractCode;
	}

	public void setCntContractCode(String cntContractCode) {
		this.cntContractCode = cntContractCode;
	}

	public Date getToStartDate() {
		return toStartDate;
	}

	public void setToStartDate(Date toStartDate) {
		this.toStartDate = toStartDate;
	}

	public Date getToEndDate() {
		return toEndDate;
	}

	public void setToEndDate(Date toEndDate) {
		this.toEndDate = toEndDate;
	}

	public List<String> getSignVO() {
		return signVO;
	}

	public void setSignVO(List<String> signVO) {
		this.signVO = signVO;
	}

	public List<GoodsPlanDetailDTO> getListData() {
		return listData;
	}

	public void setListData(List<GoodsPlanDetailDTO> listData) {
		this.listData = listData;
	}

	public Long getRequestGoodsId() {
		return requestGoodsId;
	}

	public void setRequestGoodsId(Long requestGoodsId) {
		this.requestGoodsId = requestGoodsId;
	}

	public String getKeySearch() {
		return keySearch;
	}

	public void setKeySearch(String keySearch) {
		this.keySearch = keySearch;
	}

	public Long getCatProvinceId() {
		return catProvinceId;
	}

	public void setCatProvinceId(Long catProvinceId) {
		this.catProvinceId = catProvinceId;
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

	public Long getSysGroupId() {
		return sysGroupId;
	}

	public void setSysGroupId(Long sysGroupId) {
		this.sysGroupId = sysGroupId;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Long getGoodsPlanId() {
		return goodsPlanId;
	}

	public void setGoodsPlanId(Long goodsPlanId) {
		this.goodsPlanId = goodsPlanId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
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

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getCreatedUserId() {
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}

	public Date getUpdateDate() {
		return updateDate;
	}

	public void setUpdateDate(Date updateDate) {
		this.updateDate = updateDate;
	}

	public Long getUpdateUserId() {
		return updateUserId;
	}

	public void setUpdateUserId(Long updateUserId) {
		this.updateUserId = updateUserId;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getSignState() {
		return signState;
	}

	public void setSignState(String signState) {
		this.signState = signState;
	}

	@Override
	public GoodsPlanBO toModel() {
		GoodsPlanBO goodsPlanBO = new GoodsPlanBO();
		goodsPlanBO.setGoodsPlanId(this.goodsPlanId);
		goodsPlanBO.setCode(this.code);
		goodsPlanBO.setName(this.name);
		goodsPlanBO.setBaseContent(this.baseContent);
		goodsPlanBO.setPerformContent(this.performContent);
		goodsPlanBO.setCreatedDate(this.createdDate);
		goodsPlanBO.setCreatedUserId(this.createdUserId);
		goodsPlanBO.setUpdateDate(this.updateDate);
		goodsPlanBO.setUpdateUserId(this.updateUserId);
		goodsPlanBO.setStatus(this.status);
		goodsPlanBO.setSignState(this.signState);
		return goodsPlanBO;
	}

	@Override
	public String catchName() {
		return getGoodsPlanId().toString();
	}

	@Override
	public Long getFWModelId() {
		return goodsPlanId;
	}

}
