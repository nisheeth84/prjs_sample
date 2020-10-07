package com.viettel.aio.bo;

import com.viettel.aio.dto.ConstructionDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.ConstructionBO")
@Table(name = "CONSTRUCTION")
/**
 *
 * @author: hailh10
 */
public class ConstructionBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CONSTRUCTION_SEQ") })
	@Column(name = "CONSTRUCTION_ID", length = 22)
	private Long constructionId;
	@Column(name = "APPROVE_REVENUE_STATE", length = 2)
	private String approveRevenueState;
	@Column(name = "APPROVE_COMPLETE_STATE", length = 2)
	private String approveCompleteState;
	@Column(name = "CODE", length = 100)
	private String code;
	@Column(name = "NAME", length = 400)
	private String name;
	@Column(name = "MONTH", length = 22)
	private Long month;
	@Column(name = "YEAR", length = 22)
	private Long year;
	@Column(name = "SYS_GROUP_ID", length = 10)
	private String sysGroupId;
	@Column(name = "CAT_PARTNER_ID", length = 10)
	private String catPartnerId;
	@Column(name = "HANDOVER_DATE", length = 7)
	private java.util.Date handoverDate;
	@Column(name = "HANDOVER_NOTE", length = 4000)
	private String handoverNote;
	@Column(name = "STARTING_DATE", length = 7)
	private java.util.Date startingDate;
	@Column(name = "EXCPECTED_COMPLETE_DATE", length = 7)
	private java.util.Date excpectedCompleteDate;
	@Column(name = "COMPLETE_DATE", length = 7)
	private java.util.Date completeDate;
	@Column(name = "STARTING_NOTE", length = 4000)
	private String startingNote;
	@Column(name = "IS_OBSTRUCTED", length = 2)
	private String isObstructed;
	@Column(name = "OBSTRUCTED_STATE", length = 2)
	private String obstructedState;
	@Column(name = "OBSTRUCTED_CONTENT", length = 4000)
	private String obstructedContent;
	@Column(name = "BROADCASTING_DATE", length = 7)
	private java.util.Date broadcastingDate;
	@Column(name = "DESCRIPTION", length = 20)
	private String description;
	@Column(name = "IS_RETURN", length = 2)
	private String isReturn;
	@Column(name = "COMPLETE_VALUE", length = 10)
	private String completeValue;
	@Column(name = "APPROVE_COMPLETE_VALUE", length = 22)
	private Double approveCompleteValue;
	@Column(name = "APPROVE_COMPLETE_DATE", length = 7)
	private java.util.Date approveCompleteDate;
	@Column(name = "APPROVE_COMPLETE_USER_ID", length = 22)
	private Long approveCompleteUserId;
	@Column(name = "APPROVE_COMPLETE_DESCRIPTION", length = 2000)
	private String approveCompleteDescription;
	@Column(name = "APPROVE_REVENUE_VALUE", length = 22)
	private Double approveRevenueValue;
	@Column(name = "APPROVE_REVENUE_DATE", length = 7)
	private java.util.Date approveRevenueDate;
	@Column(name = "APPROVE_REVENUE_USER_ID", length = 22)
	private Long approveRevenueUserId;
	@Column(name = "APPROVE_REVENUE_DESCRIPTION", length = 2000)
	private String approveRevenueDescription;
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
	@Column(name = "CAT_CONSTRUCTION_TYPE_ID", length = 22)
	private Long catConstructionTypeId;
	@Column(name = "STATUS", length = 2)
	private String status;
	@Column(name = "CAT_CONSTRUCTION_DEPLOY_ID", length = 22)
	private Long catConstructionDeployId;
	@Column(name = "REGION", length = 22)
	private Long region;
	@Column(name = "CAT_STATION_ID", length = 22)
	private Long catStationId;
	@Column(name = "RETURNER", length = 4000)
	private String returner;
	@Column(name = "RETURN_DATE", length = 7)
	private java.util.Date returnDate;


	public Long getConstructionId(){
		return constructionId;
	}

	public void setConstructionId(Long constructionId)
	{
		this.constructionId = constructionId;
	}

	public String getApproveRevenueState(){
		return approveRevenueState;
	}

	public void setApproveRevenueState(String approveRevenueState)
	{
		this.approveRevenueState = approveRevenueState;
	}

	public String getApproveCompleteState(){
		return approveCompleteState;
	}

	public void setApproveCompleteState(String approveCompleteState)
	{
		this.approveCompleteState = approveCompleteState;
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

	public Long getMonth(){
		return month;
	}

	public void setMonth(Long month)
	{
		this.month = month;
	}

	public Long getYear(){
		return year;
	}

	public void setYear(Long year)
	{
		this.year = year;
	}

	public String getSysGroupId(){
		return sysGroupId;
	}

	public void setSysGroupId(String sysGroupId)
	{
		this.sysGroupId = sysGroupId;
	}

	public String getCatPartnerId(){
		return catPartnerId;
	}

	public void setCatPartnerId(String catPartnerId)
	{
		this.catPartnerId = catPartnerId;
	}

	public java.util.Date getHandoverDate(){
		return handoverDate;
	}

	public void setHandoverDate(java.util.Date handoverDate)
	{
		this.handoverDate = handoverDate;
	}

	public String getHandoverNote(){
		return handoverNote;
	}

	public void setHandoverNote(String handoverNote)
	{
		this.handoverNote = handoverNote;
	}

	public java.util.Date getStartingDate(){
		return startingDate;
	}

	public void setStartingDate(java.util.Date startingDate)
	{
		this.startingDate = startingDate;
	}

	public java.util.Date getExcpectedCompleteDate(){
		return excpectedCompleteDate;
	}

	public void setExcpectedCompleteDate(java.util.Date excpectedCompleteDate)
	{
		this.excpectedCompleteDate = excpectedCompleteDate;
	}

	public java.util.Date getCompleteDate(){
		return completeDate;
	}

	public void setCompleteDate(java.util.Date completeDate)
	{
		this.completeDate = completeDate;
	}

	public String getStartingNote(){
		return startingNote;
	}

	public void setStartingNote(String startingNote)
	{
		this.startingNote = startingNote;
	}

	public String getIsObstructed(){
		return isObstructed;
	}

	public void setIsObstructed(String isObstructed)
	{
		this.isObstructed = isObstructed;
	}

	public String getObstructedState(){
		return obstructedState;
	}

	public void setObstructedState(String obstructedState)
	{
		this.obstructedState = obstructedState;
	}

	public String getObstructedContent(){
		return obstructedContent;
	}

	public void setObstructedContent(String obstructedContent)
	{
		this.obstructedContent = obstructedContent;
	}

	public java.util.Date getBroadcastingDate(){
		return broadcastingDate;
	}

	public void setBroadcastingDate(java.util.Date broadcastingDate)
	{
		this.broadcastingDate = broadcastingDate;
	}

	public String getDescription(){
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public String getIsReturn(){
		return isReturn;
	}

	public void setIsReturn(String isReturn)
	{
		this.isReturn = isReturn;
	}

	public String getCompleteValue(){
		return completeValue;
	}

	public void setCompleteValue(String completeValue)
	{
		this.completeValue = completeValue;
	}

	public Double getApproveCompleteValue(){
		return approveCompleteValue;
	}

	public void setApproveCompleteValue(Double approveCompleteValue)
	{
		this.approveCompleteValue = approveCompleteValue;
	}

	public java.util.Date getApproveCompleteDate(){
		return approveCompleteDate;
	}

	public void setApproveCompleteDate(java.util.Date approveCompleteDate)
	{
		this.approveCompleteDate = approveCompleteDate;
	}

	public Long getApproveCompleteUserId(){
		return approveCompleteUserId;
	}

	public void setApproveCompleteUserId(Long approveCompleteUserId)
	{
		this.approveCompleteUserId = approveCompleteUserId;
	}

	public String getApproveCompleteDescription(){
		return approveCompleteDescription;
	}

	public void setApproveCompleteDescription(String approveCompleteDescription)
	{
		this.approveCompleteDescription = approveCompleteDescription;
	}

	public Double getApproveRevenueValue(){
		return approveRevenueValue;
	}

	public void setApproveRevenueValue(Double approveRevenueValue)
	{
		this.approveRevenueValue = approveRevenueValue;
	}

	public java.util.Date getApproveRevenueDate(){
		return approveRevenueDate;
	}

	public void setApproveRevenueDate(java.util.Date approveRevenueDate)
	{
		this.approveRevenueDate = approveRevenueDate;
	}

	public Long getApproveRevenueUserId(){
		return approveRevenueUserId;
	}

	public void setApproveRevenueUserId(Long approveRevenueUserId)
	{
		this.approveRevenueUserId = approveRevenueUserId;
	}

	public String getApproveRevenueDescription(){
		return approveRevenueDescription;
	}

	public void setApproveRevenueDescription(String approveRevenueDescription)
	{
		this.approveRevenueDescription = approveRevenueDescription;
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

	public Long getCatConstructionTypeId(){
		return catConstructionTypeId;
	}

	public void setCatConstructionTypeId(Long catConstructionTypeId)
	{
		this.catConstructionTypeId = catConstructionTypeId;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status)
	{
		this.status = status;
	}

	public Long getCatConstructionDeployId(){
		return catConstructionDeployId;
	}

	public void setCatConstructionDeployId(Long catConstructionDeployId)
	{
		this.catConstructionDeployId = catConstructionDeployId;
	}

	public Long getRegion(){
		return region;
	}

	public void setRegion(Long region)
	{
		this.region = region;
	}

	public Long getCatStationId(){
		return catStationId;
	}

	public void setCatStationId(Long catStationId)
	{
		this.catStationId = catStationId;
	}

	public String getReturner(){
		return returner;
	}

	public void setReturner(String returner)
	{
		this.returner = returner;
	}
	
	public java.util.Date getReturnDate(){
		return returnDate;
	}
	
	public void setReturnDate(java.util.Date returnDate)
	{
		this.returnDate = returnDate;
	}
   
    @Override
    public ConstructionDTO toDTO() {
        ConstructionDTO constructionDTO = new ConstructionDTO(); 
        constructionDTO.setConstructionId(this.constructionId);		
        constructionDTO.setApproveRevenueState(this.approveRevenueState);		
        constructionDTO.setApproveCompleteState(this.approveCompleteState);		
        constructionDTO.setCode(this.code);		
        constructionDTO.setName(this.name);		
        constructionDTO.setMonth(this.month);		
        constructionDTO.setYear(this.year);		
        constructionDTO.setSysGroupId(this.sysGroupId);		
        constructionDTO.setCatPartnerId(this.catPartnerId);		
        constructionDTO.setHandoverDate(this.handoverDate);		
        constructionDTO.setHandoverNote(this.handoverNote);		
        constructionDTO.setStartingDate(this.startingDate);		
        constructionDTO.setExcpectedCompleteDate(this.excpectedCompleteDate);		
        constructionDTO.setCompleteDate(this.completeDate);		
        constructionDTO.setStartingNote(this.startingNote);		
        constructionDTO.setIsObstructed(this.isObstructed);		
        constructionDTO.setObstructedState(this.obstructedState);		
        constructionDTO.setObstructedContent(this.obstructedContent);		
        constructionDTO.setBroadcastingDate(this.broadcastingDate);		
        constructionDTO.setDescription(this.description);		
        constructionDTO.setIsReturn(this.isReturn);		
        constructionDTO.setCompleteValue(this.completeValue);		
        constructionDTO.setApproveCompleteValue(this.approveCompleteValue);		
        constructionDTO.setApproveCompleteDate(this.approveCompleteDate);		
        constructionDTO.setApproveCompleteUserId(this.approveCompleteUserId);		
        constructionDTO.setApproveCompleteDescription(this.approveCompleteDescription);		
        constructionDTO.setApproveRevenueValue(this.approveRevenueValue);		
        constructionDTO.setApproveRevenueDate(this.approveRevenueDate);		
        constructionDTO.setApproveRevenueUserId(this.approveRevenueUserId);		
        constructionDTO.setApproveRevenueDescription(this.approveRevenueDescription);		
        constructionDTO.setCreatedDate(this.createdDate);		
        constructionDTO.setCreatedUserId(this.createdUserId);		
        constructionDTO.setCreatedGroupId(this.createdGroupId);		
        constructionDTO.setUpdatedDate(this.updatedDate);		
        constructionDTO.setUpdatedUserId(this.updatedUserId);		
        constructionDTO.setUpdatedGroupId(this.updatedGroupId);		
        constructionDTO.setCatConstructionTypeId(this.catConstructionTypeId);		
        constructionDTO.setStatus(this.status);		
        constructionDTO.setCatConstructionDeployId(this.catConstructionDeployId);		
        constructionDTO.setRegion(this.region);		
        constructionDTO.setCatStationId(this.catStationId);		
        constructionDTO.setReturner(this.returner);		
        constructionDTO.setReturnDate(this.returnDate);		
        return constructionDTO;
    }
}
