package com.viettel.aio.dto;

import com.viettel.coms.bo.WorkItemBO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "WORK_ITEMBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkItemDTO extends ComsBaseFWDTO<WorkItemBO> {

	private Long workItemId;
	private Long constructionId;
	private String constructionName;
	private Long catWorkItemTypeId;
	private String catWorkItemTypeName;
	private String code;
	private String name;
	private String isInternal;
	private Long constructorId;
	private String constructorName;
	private Long supervisorId;
	private String supervisorName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startingDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startingDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startingDateTo;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date completeDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date completeDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date completeDateTo;
	private String status;
	private Double quantity;
	private Double approveQuantity;
	private String approveState;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveDateTo;
	private Long approveUserId;
	private String approveUserName;
	private String approveDescription;
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
    public WorkItemBO toModel() {
        WorkItemBO workItemBO = new WorkItemBO();
        workItemBO.setWorkItemId(this.workItemId);
        workItemBO.setConstructionId(this.constructionId);
        workItemBO.setCatWorkItemTypeId(this.catWorkItemTypeId);
        workItemBO.setCode(this.code);
        workItemBO.setName(this.name);
        workItemBO.setIsInternal(this.isInternal);
        workItemBO.setConstructorId(this.constructorId);
        workItemBO.setSupervisorId(this.supervisorId);
        workItemBO.setStartingDate(this.startingDate);
        workItemBO.setCompleteDate(this.completeDate);
        workItemBO.setStatus(this.status);
        workItemBO.setQuantity(this.quantity);
        workItemBO.setApproveQuantity(this.approveQuantity);
        workItemBO.setApproveState(this.approveState);
        workItemBO.setApproveDate(this.approveDate);
        workItemBO.setApproveUserId(this.approveUserId);
        workItemBO.setApproveDescription(this.approveDescription);
        workItemBO.setCreatedDate(this.createdDate);
        workItemBO.setCreatedUserId(this.createdUserId);
        workItemBO.setCreatedGroupId(this.createdGroupId);
        workItemBO.setUpdatedDate(this.updatedDate);
        workItemBO.setUpdatedUserId(this.updatedUserId);
        workItemBO.setUpdatedGroupId(this.updatedGroupId);
        return workItemBO;
    }

    @Override
     public Long getFWModelId() {
        return workItemId;
    }

    @Override
    public String catchName() {
        return getWorkItemId().toString();
    }

	@JsonProperty("workItemId")
    public Long getWorkItemId(){
		return workItemId;
    }

    public void setWorkItemId(Long workItemId){
		this.workItemId = workItemId;
    }

	@JsonProperty("constructionId")
    public Long getConstructionId(){
		return constructionId;
    }

    public void setConstructionId(Long constructionId){
		this.constructionId = constructionId;
    }

	@JsonProperty("constructionName")
    public String getConstructionName(){
		return constructionName;
    }

    public void setConstructionName(String constructionName){
		this.constructionName = constructionName;
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

	@JsonProperty("code")
    public String getCode(){
		return code;
    }

    public void setCode(String code){
		this.code = code;
    }

	@JsonProperty("name")
    public String getName(){
		return name;
    }

    public void setName(String name){
		this.name = name;
    }

	@JsonProperty("isInternal")
    public String getIsInternal(){
		return isInternal;
    }

    public void setIsInternal(String isInternal){
		this.isInternal = isInternal;
    }

	@JsonProperty("constructorId")
    public Long getConstructorId(){
		return constructorId;
    }

    public void setConstructorId(Long constructorId){
		this.constructorId = constructorId;
    }

	@JsonProperty("constructorName")
    public String getConstructorName(){
		return constructorName;
    }

    public void setConstructorName(String constructorName){
		this.constructorName = constructorName;
    }

	@JsonProperty("supervisorId")
    public Long getSupervisorId(){
		return supervisorId;
    }

    public void setSupervisorId(Long supervisorId){
		this.supervisorId = supervisorId;
    }

	@JsonProperty("supervisorName")
    public String getSupervisorName(){
		return supervisorName;
    }

    public void setSupervisorName(String supervisorName){
		this.supervisorName = supervisorName;
    }

	@JsonProperty("startingDate")
    public java.util.Date getStartingDate(){
		return startingDate;
    }

    public void setStartingDate(java.util.Date startingDate){
		this.startingDate = startingDate;
    }

	public java.util.Date getStartingDateFrom() {
    	return startingDateFrom;
    }

    public void setStartingDateFrom(java.util.Date startingDateFrom) {
    	this.startingDateFrom = startingDateFrom;
    }

	public java.util.Date getStartingDateTo() {
    	return startingDateTo;
    }

    public void setStartingDateTo(java.util.Date startingDateTo) {
    	this.startingDateTo = startingDateTo;
    }

	@JsonProperty("completeDate")
    public java.util.Date getCompleteDate(){
		return completeDate;
    }

    public void setCompleteDate(java.util.Date completeDate){
		this.completeDate = completeDate;
    }

	public java.util.Date getCompleteDateFrom() {
    	return completeDateFrom;
    }

    public void setCompleteDateFrom(java.util.Date completeDateFrom) {
    	this.completeDateFrom = completeDateFrom;
    }

	public java.util.Date getCompleteDateTo() {
    	return completeDateTo;
    }

    public void setCompleteDateTo(java.util.Date completeDateTo) {
    	this.completeDateTo = completeDateTo;
    }

	@JsonProperty("status")
    public String getStatus(){
		return status;
    }

    public void setStatus(String status){
		this.status = status;
    }

	@JsonProperty("quantity")
    public Double getQuantity(){
		return quantity;
    }

    public void setQuantity(Double quantity){
		this.quantity = quantity;
    }

	@JsonProperty("approveQuantity")
    public Double getApproveQuantity(){
		return approveQuantity;
    }

    public void setApproveQuantity(Double approveQuantity){
		this.approveQuantity = approveQuantity;
    }

	@JsonProperty("approveState")
    public String getApproveState(){
		return approveState;
    }

    public void setApproveState(String approveState){
		this.approveState = approveState;
    }

	@JsonProperty("approveDate")
    public java.util.Date getApproveDate(){
		return approveDate;
    }

    public void setApproveDate(java.util.Date approveDate){
		this.approveDate = approveDate;
    }

	public java.util.Date getApproveDateFrom() {
    	return approveDateFrom;
    }

    public void setApproveDateFrom(java.util.Date approveDateFrom) {
    	this.approveDateFrom = approveDateFrom;
    }

	public java.util.Date getApproveDateTo() {
    	return approveDateTo;
    }

    public void setApproveDateTo(java.util.Date approveDateTo) {
    	this.approveDateTo = approveDateTo;
    }

	@JsonProperty("approveUserId")
    public Long getApproveUserId(){
		return approveUserId;
    }

    public void setApproveUserId(Long approveUserId){
		this.approveUserId = approveUserId;
    }

	@JsonProperty("approveUserName")
    public String getApproveUserName(){
		return approveUserName;
    }

    public void setApproveUserName(String approveUserName){
		this.approveUserName = approveUserName;
    }

	@JsonProperty("approveDescription")
    public String getApproveDescription(){
		return approveDescription;
    }

    public void setApproveDescription(String approveDescription){
		this.approveDescription = approveDescription;
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
