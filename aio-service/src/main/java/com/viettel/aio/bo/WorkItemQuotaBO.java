package com.viettel.aio.bo;

import com.viettel.aio.dto.WorkItemQuotaDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.WorkItemQuotaBO")
@Table(name = "WORK_ITEM_QUOTA")
/**
 *
 * @author: hailh10
 */
public class WorkItemQuotaBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "WORK_ITEM_QUOTA_SEQ") })
	@Column(name = "WORK_ITEM_QUOTA_ID", length = 22)
	private Long workItemQuotaId;
	@Column(name = "SYS_GROUP_ID", length = 22)
	private Long sysGroupId;
	@Column(name = "CAT_CONSTRUCTION_TYPE_ID", length = 22)
	private Long catConstructionTypeId;
	@Column(name = "CAT_WORK_ITEM_TYPE_ID", length = 22)
	private Long catWorkItemTypeId;
	@Column(name = "PRICE", length = 22)
	private Double price;
	@Column(name = "WORK_DAY", length = 22)
	private Double workDay;
	@Column(name = "QUOTA_TYPE", length = 22)
	private Long quotaType;
	@Column(name = "DESCRIPTION", length = 4000)
	private String description;
	@Column(name = "STATUS", length = 22)
	private Long status;
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "CREATED_USER_ID", length = 22)
	private Long createdUserId;
	@Column(name = "CREATED_GROUP_ID", length = 22)
	private Long createdGroupId;
	@Column(name = "UPDATED_DATE", length = 7)
	private java.util.Date updatedDate;
	@Column(name = "UPDATED_USER_ID", length = 22)
	private Long updatedUserId;
	@Column(name = "UPDATED_GROUP_ID", length = 22)
	private Long updatedGroupId;
	@Column(name = "TYPE", length = 22)
	private Long type;


	public Long getType() {
		return type;
	}

	public void setType(Long type) {
		this.type = type;
	}

	public Long getWorkItemQuotaId(){
		return workItemQuotaId;
	}

	public void setWorkItemQuotaId(Long workItemQuotaId)
	{
		this.workItemQuotaId = workItemQuotaId;
	}

	public Long getSysGroupId(){
		return sysGroupId;
	}

	public void setSysGroupId(Long sysGroupId)
	{
		this.sysGroupId = sysGroupId;
	}

	public Long getCatConstructionTypeId(){
		return catConstructionTypeId;
	}

	public void setCatConstructionTypeId(Long catConstructionTypeId)
	{
		this.catConstructionTypeId = catConstructionTypeId;
	}

	public Long getCatWorkItemTypeId(){
		return catWorkItemTypeId;
	}

	public void setCatWorkItemTypeId(Long catWorkItemTypeId)
	{
		this.catWorkItemTypeId = catWorkItemTypeId;
	}

	public Double getPrice(){
		return price;
	}

	public void setPrice(Double price)
	{
		this.price = price;
	}

	public Double getWorkDay(){
		return workDay;
	}

	public void setWorkDay(Double workDay)
	{
		this.workDay = workDay;
	}

	public Long getQuotaType(){
		return quotaType;
	}

	public void setQuotaType(Long quotaType)
	{
		this.quotaType = quotaType;
	}

	public String getDescription(){
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public Long getStatus(){
		return status;
	}

	public void setStatus(Long status)
	{
		this.status = status;
	}

	public java.util.Date getCreatedDate(){
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate)
	{
		this.createdDate = createdDate;
	}

	public Long getCreatedUserId(){
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId)
	{
		this.createdUserId = createdUserId;
	}

	public Long getCreatedGroupId(){
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId)
	{
		this.createdGroupId = createdGroupId;
	}

	public java.util.Date getUpdatedDate(){
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate)
	{
		this.updatedDate = updatedDate;
	}

	public Long getUpdatedUserId(){
		return updatedUserId;
	}

	public void setUpdatedUserId(Long updatedUserId)
	{
		this.updatedUserId = updatedUserId;
	}

	public Long getUpdatedGroupId(){
		return updatedGroupId;
	}

	public void setUpdatedGroupId(Long updatedGroupId)
	{
		this.updatedGroupId = updatedGroupId;
	}
   
    @Override
    public WorkItemQuotaDTO toDTO() {
        WorkItemQuotaDTO workItemQuotaDTO = new WorkItemQuotaDTO(); 
        workItemQuotaDTO.setWorkItemQuotaId(this.workItemQuotaId);		
        workItemQuotaDTO.setSysGroupId(this.sysGroupId);		
        workItemQuotaDTO.setCatConstructionTypeId(this.catConstructionTypeId);		
        workItemQuotaDTO.setCatWorkItemTypeId(this.catWorkItemTypeId);		
        workItemQuotaDTO.setPrice(this.price);		
        workItemQuotaDTO.setWorkDay(this.workDay);		
        workItemQuotaDTO.setQuotaType(this.quotaType);		
        workItemQuotaDTO.setDescription(this.description);		
        workItemQuotaDTO.setStatus(this.status);		
        workItemQuotaDTO.setCreatedDate(this.createdDate);		
        workItemQuotaDTO.setCreatedUserId(this.createdUserId);		
        workItemQuotaDTO.setCreatedGroupId(this.createdGroupId);		
        workItemQuotaDTO.setUpdatedDate(this.updatedDate);		
        workItemQuotaDTO.setUpdatedUserId(this.updatedUserId);		
        workItemQuotaDTO.setUpdatedGroupId(this.updatedGroupId);
        workItemQuotaDTO.setType(this.type);
        return workItemQuotaDTO;
    }
}
