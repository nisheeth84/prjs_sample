package com.viettel.aio.bo;

import com.viettel.aio.dto.WorkItemDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.WorkItemBO")
@Table(name = "WORK_ITEM")
/**
 *
 * @author: hailh10
 */
public class WorkItemBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "WORK_ITEM_SEQ") })
	@Column(name = "WORK_ITEM_ID", length = 22)
	private Long workItemId;
	@Column(name = "CONSTRUCTION_ID", length = 22)
	private Long constructionId;
	@Column(name = "CAT_WORK_ITEM_TYPE_ID", length = 22)
	private Long catWorkItemTypeId;
	@Column(name = "CODE", length = 100)
	private String code;
	@Column(name = "NAME", length = 400)
	private String name;
	@Column(name = "IS_INTERNAL", length = 2)
	private String isInternal;
	@Column(name = "CONSTRUCTOR_ID", length = 22)
	private Long constructorId;
	@Column(name = "SUPERVISOR_ID", length = 22)
	private Long supervisorId;
	@Column(name = "STARTING_DATE", length = 7)
	private java.util.Date startingDate;
	@Column(name = "COMPLETE_DATE", length = 7)
	private java.util.Date completeDate;
	@Column(name = "STATUS", length = 2)
	private String status;
	@Column(name = "QUANTITY", length = 22)
	private Double quantity;
	@Column(name = "APPROVE_QUANTITY", length = 22)
	private Double approveQuantity;
	@Column(name = "APPROVE_STATE", length = 2)
	private String approveState;
	@Column(name = "APPROVE_DATE", length = 7)
	private java.util.Date approveDate;
	@Column(name = "APPROVE_USER_ID", length = 22)
	private Long approveUserId;
	@Column(name = "APPROVE_DESCRIPTION", length = 2000)
	private String approveDescription;
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


	public Long getWorkItemId(){
		return workItemId;
	}

	public void setWorkItemId(Long workItemId)
	{
		this.workItemId = workItemId;
	}

	public Long getConstructionId(){
		return constructionId;
	}

	public void setConstructionId(Long constructionId)
	{
		this.constructionId = constructionId;
	}

	public Long getCatWorkItemTypeId(){
		return catWorkItemTypeId;
	}

	public void setCatWorkItemTypeId(Long catWorkItemTypeId)
	{
		this.catWorkItemTypeId = catWorkItemTypeId;
	}

	public String getCode(){
		return code;
	}

	public void setCode(String code)
	{
		this.code = code;
	}

	public String getName(){
		return name;
	}

	public void setName(String name)
	{
		this.name = name;
	}

	public String getIsInternal(){
		return isInternal;
	}

	public void setIsInternal(String isInternal)
	{
		this.isInternal = isInternal;
	}

	public Long getConstructorId(){
		return constructorId;
	}

	public void setConstructorId(Long constructorId)
	{
		this.constructorId = constructorId;
	}

	public Long getSupervisorId(){
		return supervisorId;
	}

	public void setSupervisorId(Long supervisorId)
	{
		this.supervisorId = supervisorId;
	}

	public java.util.Date getStartingDate(){
		return startingDate;
	}

	public void setStartingDate(java.util.Date startingDate)
	{
		this.startingDate = startingDate;
	}

	public java.util.Date getCompleteDate(){
		return completeDate;
	}

	public void setCompleteDate(java.util.Date completeDate)
	{
		this.completeDate = completeDate;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status)
	{
		this.status = status;
	}

	public Double getQuantity(){
		return quantity;
	}

	public void setQuantity(Double quantity)
	{
		this.quantity = quantity;
	}

	public Double getApproveQuantity(){
		return approveQuantity;
	}

	public void setApproveQuantity(Double approveQuantity)
	{
		this.approveQuantity = approveQuantity;
	}

	public String getApproveState(){
		return approveState;
	}

	public void setApproveState(String approveState)
	{
		this.approveState = approveState;
	}

	public java.util.Date getApproveDate(){
		return approveDate;
	}

	public void setApproveDate(java.util.Date approveDate)
	{
		this.approveDate = approveDate;
	}

	public Long getApproveUserId(){
		return approveUserId;
	}

	public void setApproveUserId(Long approveUserId)
	{
		this.approveUserId = approveUserId;
	}

	public String getApproveDescription(){
		return approveDescription;
	}

	public void setApproveDescription(String approveDescription)
	{
		this.approveDescription = approveDescription;
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
    public WorkItemDTO toDTO() {
        WorkItemDTO workItemDTO = new WorkItemDTO(); 
        workItemDTO.setWorkItemId(this.workItemId);		
        workItemDTO.setConstructionId(this.constructionId);		
        workItemDTO.setCatWorkItemTypeId(this.catWorkItemTypeId);		
        workItemDTO.setCode(this.code);		
        workItemDTO.setName(this.name);		
        workItemDTO.setIsInternal(this.isInternal);		
        workItemDTO.setConstructorId(this.constructorId);		
        workItemDTO.setSupervisorId(this.supervisorId);		
        workItemDTO.setStartingDate(this.startingDate);		
        workItemDTO.setCompleteDate(this.completeDate);		
        workItemDTO.setStatus(this.status);		
        workItemDTO.setQuantity(this.quantity);		
        workItemDTO.setApproveQuantity(this.approveQuantity);		
        workItemDTO.setApproveState(this.approveState);		
        workItemDTO.setApproveDate(this.approveDate);		
        workItemDTO.setApproveUserId(this.approveUserId);		
        workItemDTO.setApproveDescription(this.approveDescription);		
        workItemDTO.setCreatedDate(this.createdDate);		
        workItemDTO.setCreatedUserId(this.createdUserId);		
        workItemDTO.setCreatedGroupId(this.createdGroupId);		
        workItemDTO.setUpdatedDate(this.updatedDate);		
        workItemDTO.setUpdatedUserId(this.updatedUserId);		
        workItemDTO.setUpdatedGroupId(this.updatedGroupId);		
        return workItemDTO;
    }
}
