package com.viettel.aio.dto;

import com.viettel.aio.bo.WorkItemQuotaBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "WORK_ITEM_QUOTABO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkItemQuotaDTO extends ComsBaseFWDTO<WorkItemQuotaBO> {

	private Long workItemQuotaId;
	private Long sysGroupId;
	private String sysGroupName;
	private Long catConstructionTypeId;
	private String catConstructionTypeName;
	private Long catWorkItemTypeId;
	private String catWorkItemTypeName;
	private Double price;
	private Double price1;
	private Double price2;
	private Double price3;
	private Double workDay;
	private Double workDay1;
	private Double workDay2;
	private Double workDay3;


	private List<Double> priceLst;
	private List<Double> workDayLst;
	private List<Long> typeLst;
	private List<Long> workItemQuotaIdLst;



	private Long quotaType;
	private String description;
	private Long status;
	private Long type;

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateTo;
	private Long createdUserId;
	private String createdUserName;
	private Long createdGroupId;
	private String createdGroupName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateTo;
	private Long updatedUserId;
	private String updatedUserName;
	private Long updatedGroupId;
	private String updatedGroupName;




	@Override
    public WorkItemQuotaBO toModel() {
        WorkItemQuotaBO workItemQuotaBO = new WorkItemQuotaBO();
        workItemQuotaBO.setWorkItemQuotaId(this.workItemQuotaId);
        workItemQuotaBO.setSysGroupId(this.sysGroupId);
        workItemQuotaBO.setCatConstructionTypeId(this.catConstructionTypeId);
        workItemQuotaBO.setCatWorkItemTypeId(this.catWorkItemTypeId);
        workItemQuotaBO.setPrice(this.price);
        workItemQuotaBO.setWorkDay(this.workDay);
        workItemQuotaBO.setQuotaType(this.quotaType);
        workItemQuotaBO.setDescription(this.description);
        workItemQuotaBO.setStatus(this.status);
        workItemQuotaBO.setCreatedDate(this.createdDate);
        workItemQuotaBO.setCreatedUserId(this.createdUserId);
        workItemQuotaBO.setCreatedGroupId(this.createdGroupId);
        workItemQuotaBO.setUpdatedDate(this.updatedDate);
        workItemQuotaBO.setUpdatedUserId(this.updatedUserId);
        workItemQuotaBO.setUpdatedGroupId(this.updatedGroupId);
        workItemQuotaBO.setType(this.type);
        return workItemQuotaBO;
    }

	@JsonProperty("workItemQuotaIdLst")
	public List<Long> getWorkItemQuotaIdLst() {
		return workItemQuotaIdLst;
	}

	public void setWorkItemQuotaIdLst(List<Long> workItemQuotaIdLst) {
		this.workItemQuotaIdLst = workItemQuotaIdLst;
	}

	@JsonProperty("typeLst")
	public List<Long> getTypeLst() {
		return typeLst;
	}

	public void setTypeLst(List<Long> typeLst) {
		this.typeLst = typeLst;
	}

	@JsonProperty("type")
	public Long getType() {
		return type;
	}

	public void setType(Long type) {
		this.type = type;
	}

    @JsonProperty("priceLst")
    public List<Double> getPriceLst() {
		return priceLst;
	}

	public void setPriceLst(List<Double> priceLst) {
		this.priceLst = priceLst;
	}

	@JsonProperty("workDayLst")
	public List<Double> getWorkDayLst() {
		return workDayLst;
	}

	public void setWorkDayLst(List<Double> workDayLst) {
		this.workDayLst = workDayLst;
	}

    @Override
     public Long getFWModelId() {
        return workItemQuotaId;
    }

    @Override
    public String catchName() {
        return getWorkItemQuotaId().toString();
    }

	@JsonProperty("workItemQuotaId")
    public Long getWorkItemQuotaId(){
		return workItemQuotaId;
    }

    public void setWorkItemQuotaId(Long workItemQuotaId){
		this.workItemQuotaId = workItemQuotaId;
    }

	@JsonProperty("sysGroupId")
    public Long getSysGroupId(){
		return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId){
		this.sysGroupId = sysGroupId;
    }

	@JsonProperty("sysGroupName")
    public String getSysGroupName(){
		return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName){
		this.sysGroupName = sysGroupName;
    }

	@JsonProperty("catConstructionTypeId")
    public Long getCatConstructionTypeId(){
		return catConstructionTypeId;
    }

    public void setCatConstructionTypeId(Long catConstructionTypeId){
		this.catConstructionTypeId = catConstructionTypeId;
    }

	@JsonProperty("catConstructionTypeName")
    public String getCatConstructionTypeName(){
		return catConstructionTypeName;
    }

    public void setCatConstructionTypeName(String catConstructionTypeName){
		this.catConstructionTypeName = catConstructionTypeName;
    }

	@JsonProperty("catWorkItemTypeId")
    public Long getCatWorkItemTypeId(){
		return catWorkItemTypeId;
    }

    public void setCatWorkItemTypeId(Long catWorkItemTypeId){
		this.catWorkItemTypeId = catWorkItemTypeId;
    }

	@JsonProperty("catWorkItemTypeName")
    public String getCatWorkItemTypeName(){
		return catWorkItemTypeName;
    }

    public void setCatWorkItemTypeName(String catWorkItemTypeName){
		this.catWorkItemTypeName = catWorkItemTypeName;
    }

	@JsonProperty("price")
    public Double getPrice(){
		return price;
    }

    public void setPrice(Double price){
		this.price = price;
    }

	@JsonProperty("workDay")
    public Double getWorkDay(){
		return workDay;
    }

    public void setWorkDay(Double workDay){
		this.workDay = workDay;
    }
    @JsonProperty("price1")
    public Double getPrice1() {
		return price1;
	}

	public void setPrice1(Double price1) {
		this.price1 = price1;
	}

	@JsonProperty("price2")
	public Double getPrice2() {
		return price2;
	}

	public void setPrice2(Double price2) {
		this.price2 = price2;
	}

	@JsonProperty("price3")
	public Double getPrice3() {
		return price3;
	}

	public void setPrice3(Double price3) {
		this.price3 = price3;
	}

	@JsonProperty("workDay1")
	public Double getWorkDay1() {
		return workDay1;
	}

	public void setWorkDay1(Double workDay1) {
		this.workDay1 = workDay1;
	}

	@JsonProperty("workDay2")
	public Double getWorkDay2() {
		return workDay2;
	}

	public void setWorkDay2(Double workDay2) {
		this.workDay2 = workDay2;
	}

	@JsonProperty("workDay3")
	public Double getWorkDay3() {
		return workDay3;
	}

	public void setWorkDay3(Double workDay3) {
		this.workDay3 = workDay3;
	}

	@JsonProperty("quotaType")
    public Long getQuotaType(){
		return quotaType;
    }

    public void setQuotaType(Long quotaType){
		this.quotaType = quotaType;
    }

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
    }

	@JsonProperty("status")
    public Long getStatus(){
		return status;
    }

    public void setStatus(Long status){
		this.status = status;
    }

	@JsonProperty("createdDate")
    public java.util.Date getCreatedDate(){
		return createdDate;
    }

    public void setCreatedDate(java.util.Date createdDate){
		this.createdDate = createdDate;
    }

	public java.util.Date getCreatedDateFrom() {
    	return createdDateFrom;
    }

    public void setCreatedDateFrom(java.util.Date createdDateFrom) {
    	this.createdDateFrom = createdDateFrom;
    }

	public java.util.Date getCreatedDateTo() {
    	return createdDateTo;
    }

    public void setCreatedDateTo(java.util.Date createdDateTo) {
    	this.createdDateTo = createdDateTo;
    }

	@JsonProperty("createdUserId")
    public Long getCreatedUserId(){
		return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId){
		this.createdUserId = createdUserId;
    }

	@JsonProperty("createdUserName")
    public String getCreatedUserName(){
		return createdUserName;
    }

    public void setCreatedUserName(String createdUserName){
		this.createdUserName = createdUserName;
    }

	@JsonProperty("createdGroupId")
    public Long getCreatedGroupId(){
		return createdGroupId;
    }

    public void setCreatedGroupId(Long createdGroupId){
		this.createdGroupId = createdGroupId;
    }

	@JsonProperty("createdGroupName")
    public String getCreatedGroupName(){
		return createdGroupName;
    }

    public void setCreatedGroupName(String createdGroupName){
		this.createdGroupName = createdGroupName;
    }

	@JsonProperty("updatedDate")
    public java.util.Date getUpdatedDate(){
		return updatedDate;
    }

    public void setUpdatedDate(java.util.Date updatedDate){
		this.updatedDate = updatedDate;
    }

	public java.util.Date getUpdatedDateFrom() {
    	return updatedDateFrom;
    }

    public void setUpdatedDateFrom(java.util.Date updatedDateFrom) {
    	this.updatedDateFrom = updatedDateFrom;
    }

	public java.util.Date getUpdatedDateTo() {
    	return updatedDateTo;
    }

    public void setUpdatedDateTo(java.util.Date updatedDateTo) {
    	this.updatedDateTo = updatedDateTo;
    }

	@JsonProperty("updatedUserId")
    public Long getUpdatedUserId(){
		return updatedUserId;
    }

    public void setUpdatedUserId(Long updatedUserId){
		this.updatedUserId = updatedUserId;
    }

	@JsonProperty("updatedUserName")
    public String getUpdatedUserName(){
		return updatedUserName;
    }

    public void setUpdatedUserName(String updatedUserName){
		this.updatedUserName = updatedUserName;
    }

	@JsonProperty("updatedGroupId")
    public Long getUpdatedGroupId(){
		return updatedGroupId;
    }

    public void setUpdatedGroupId(Long updatedGroupId){
		this.updatedGroupId = updatedGroupId;
    }

	@JsonProperty("updatedGroupName")
    public String getUpdatedGroupName(){
		return updatedGroupName;
    }

    public void setUpdatedGroupName(String updatedGroupName){
		this.updatedGroupName = updatedGroupName;
    }	
	
}
