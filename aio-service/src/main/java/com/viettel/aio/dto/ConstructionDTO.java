package com.viettel.aio.dto;

import com.viettel.aio.bo.ConstructionBO;
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
@XmlRootElement(name = "CONSTRUCTIONBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ConstructionDTO extends ComsBaseFWDTO<ConstructionBO> {

	private Long constructionId;
	private String approveRevenueState;
	private String approveCompleteState;
	private String code;
	private String name;
	private Long month;
	private Long year;
	private String sysGroupId;
	private String sysGroupName;
	private String catPartnerId;
	private String catPartnerName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date handoverDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date handoverDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date handoverDateTo;
	private String handoverNote;
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
	private java.util.Date excpectedCompleteDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date excpectedCompleteDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date excpectedCompleteDateTo;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date completeDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date completeDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date completeDateTo;
	private String startingNote;
	private String isObstructed;
	private String obstructedState;
	private String obstructedContent;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date broadcastingDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date broadcastingDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date broadcastingDateTo;
	private String description;
	private String isReturn;
	private String completeValue;
	private Double approveCompleteValue;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveCompleteDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveCompleteDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveCompleteDateTo;
	private Long approveCompleteUserId;
	private String approveCompleteUserName;
	private String approveCompleteDescription;
	private Double approveRevenueValue;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveRevenueDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveRevenueDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date approveRevenueDateTo;
	private Long approveRevenueUserId;
	private String approveRevenueUserName;
	private String approveRevenueDescription;
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
	private Long catConstructionTypeId;
	private String catConstructionTypeName;
	private String status;
	private Long catConstructionDeployId;
	private String catConstructionDeployName;
	private Long region;
	private Long catStationId;
	private String catStationName;
	private String returner;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date returnDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date returnDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date returnDateTo;
//	private java.lang.Long cntContractMapId;
	private String cntContractMapId;

    @Override
    public ConstructionBO toModel() {
        ConstructionBO constructionBO = new ConstructionBO();
        constructionBO.setConstructionId(this.constructionId);
        constructionBO.setApproveRevenueState(this.approveRevenueState);
        constructionBO.setApproveCompleteState(this.approveCompleteState);
        constructionBO.setCode(this.code);
        constructionBO.setName(this.name);
        constructionBO.setMonth(this.month);
        constructionBO.setYear(this.year);
        constructionBO.setSysGroupId(this.sysGroupId);
        constructionBO.setCatPartnerId(this.catPartnerId);
        constructionBO.setHandoverDate(this.handoverDate);
        constructionBO.setHandoverNote(this.handoverNote);
        constructionBO.setStartingDate(this.startingDate);
        constructionBO.setExcpectedCompleteDate(this.excpectedCompleteDate);
        constructionBO.setCompleteDate(this.completeDate);
        constructionBO.setStartingNote(this.startingNote);
        constructionBO.setIsObstructed(this.isObstructed);
		if (this.isObstructed == null || "".equalsIgnoreCase(this.isObstructed) || "N".equalsIgnoreCase(this.isObstructed)) {
			constructionBO.setIsObstructed("N");
		} else {
			constructionBO.setIsObstructed("Y");
		}
        constructionBO.setObstructedState(this.obstructedState);
        constructionBO.setObstructedContent(this.obstructedContent);
        constructionBO.setBroadcastingDate(this.broadcastingDate);
        constructionBO.setDescription(this.description);
        constructionBO.setIsReturn(this.isReturn);
		if (this.isReturn == null || "".equalsIgnoreCase(this.isReturn) || "N".equalsIgnoreCase(this.isReturn)) {
			constructionBO.setIsReturn("N");
		} else {
			constructionBO.setIsReturn("Y");
		}
        constructionBO.setCompleteValue(this.completeValue);
        constructionBO.setApproveCompleteValue(this.approveCompleteValue);
        constructionBO.setApproveCompleteDate(this.approveCompleteDate);
        constructionBO.setApproveCompleteUserId(this.approveCompleteUserId);
        constructionBO.setApproveCompleteDescription(this.approveCompleteDescription);
        constructionBO.setApproveRevenueValue(this.approveRevenueValue);
        constructionBO.setApproveRevenueDate(this.approveRevenueDate);
        constructionBO.setApproveRevenueUserId(this.approveRevenueUserId);
        constructionBO.setApproveRevenueDescription(this.approveRevenueDescription);
        constructionBO.setCreatedDate(this.createdDate);
        constructionBO.setCreatedUserId(this.createdUserId);
        constructionBO.setCreatedGroupId(this.createdGroupId);
        constructionBO.setUpdatedDate(this.updatedDate);
        constructionBO.setUpdatedUserId(this.updatedUserId);
        constructionBO.setUpdatedGroupId(this.updatedGroupId);
        constructionBO.setCatConstructionTypeId(this.catConstructionTypeId);
        constructionBO.setStatus(this.status);
        constructionBO.setCatConstructionDeployId(this.catConstructionDeployId);
        constructionBO.setRegion(this.region);
        constructionBO.setCatStationId(this.catStationId);
        constructionBO.setReturner(this.returner);
        constructionBO.setReturnDate(this.returnDate);
        return constructionBO;
    }

    @Override
     public Long getFWModelId() {
        return constructionId;
    }

    @Override
    public String catchName() {
        return getConstructionId().toString();
    }

	@JsonProperty("constructionId")
    public Long getConstructionId(){
		return constructionId;
    }

    public void setConstructionId(Long constructionId){
		this.constructionId = constructionId;
    }

	@JsonProperty("approveRevenueState")
    public String getApproveRevenueState(){
		return approveRevenueState;
    }

    public void setApproveRevenueState(String approveRevenueState){
		this.approveRevenueState = approveRevenueState;
    }

	@JsonProperty("approveCompleteState")
    public String getApproveCompleteState(){
		return approveCompleteState;
    }

    public void setApproveCompleteState(String approveCompleteState){
		this.approveCompleteState = approveCompleteState;
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

	@JsonProperty("month")
    public Long getMonth(){
		return month;
    }

    public void setMonth(Long month){
		this.month = month;
    }

	@JsonProperty("year")
    public Long getYear(){
		return year;
    }

    public void setYear(Long year){
		this.year = year;
    }

	@JsonProperty("sysGroupId")
    public String getSysGroupId(){
		return sysGroupId;
    }

    public void setSysGroupId(String sysGroupId){
		this.sysGroupId = sysGroupId;
    }

	@JsonProperty("sysGroupName")
    public String getSysGroupName(){
		return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName){
		this.sysGroupName = sysGroupName;
    }

	@JsonProperty("catPartnerId")
    public String getCatPartnerId(){
		return catPartnerId;
    }

    public void setCatPartnerId(String catPartnerId){
		this.catPartnerId = catPartnerId;
    }

	@JsonProperty("catPartnerName")
    public String getCatPartnerName(){
		return catPartnerName;
    }

    public void setCatPartnerName(String catPartnerName){
		this.catPartnerName = catPartnerName;
    }

	@JsonProperty("handoverDate")
    public java.util.Date getHandoverDate(){
		return handoverDate;
    }

    public void setHandoverDate(java.util.Date handoverDate){
		this.handoverDate = handoverDate;
    }

	public java.util.Date getHandoverDateFrom() {
    	return handoverDateFrom;
    }

    public void setHandoverDateFrom(java.util.Date handoverDateFrom) {
    	this.handoverDateFrom = handoverDateFrom;
    }

	public java.util.Date getHandoverDateTo() {
    	return handoverDateTo;
    }

    public void setHandoverDateTo(java.util.Date handoverDateTo) {
    	this.handoverDateTo = handoverDateTo;
    }

	@JsonProperty("handoverNote")
    public String getHandoverNote(){
		return handoverNote;
    }

    public void setHandoverNote(String handoverNote){
		this.handoverNote = handoverNote;
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

	@JsonProperty("excpectedCompleteDate")
    public java.util.Date getExcpectedCompleteDate(){
		return excpectedCompleteDate;
    }

    public void setExcpectedCompleteDate(java.util.Date excpectedCompleteDate){
		this.excpectedCompleteDate = excpectedCompleteDate;
    }

	public java.util.Date getExcpectedCompleteDateFrom() {
    	return excpectedCompleteDateFrom;
    }

    public void setExcpectedCompleteDateFrom(java.util.Date excpectedCompleteDateFrom) {
    	this.excpectedCompleteDateFrom = excpectedCompleteDateFrom;
    }

	public java.util.Date getExcpectedCompleteDateTo() {
    	return excpectedCompleteDateTo;
    }

    public void setExcpectedCompleteDateTo(java.util.Date excpectedCompleteDateTo) {
    	this.excpectedCompleteDateTo = excpectedCompleteDateTo;
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

	@JsonProperty("startingNote")
    public String getStartingNote(){
		return startingNote;
    }

    public void setStartingNote(String startingNote){
		this.startingNote = startingNote;
    }

	@JsonProperty("isObstructed")
    public String getIsObstructed(){
		return isObstructed;
    }

    public void setIsObstructed(String isObstructed){
		this.isObstructed = isObstructed;
    }

	@JsonProperty("obstructedState")
    public String getObstructedState(){
		return obstructedState;
    }

    public void setObstructedState(String obstructedState){
		this.obstructedState = obstructedState;
    }

	@JsonProperty("obstructedContent")
    public String getObstructedContent(){
		return obstructedContent;
    }

    public void setObstructedContent(String obstructedContent){
		this.obstructedContent = obstructedContent;
    }

	@JsonProperty("broadcastingDate")
    public java.util.Date getBroadcastingDate(){
		return broadcastingDate;
    }

    public void setBroadcastingDate(java.util.Date broadcastingDate){
		this.broadcastingDate = broadcastingDate;
    }

	public java.util.Date getBroadcastingDateFrom() {
    	return broadcastingDateFrom;
    }

    public void setBroadcastingDateFrom(java.util.Date broadcastingDateFrom) {
    	this.broadcastingDateFrom = broadcastingDateFrom;
    }

	public java.util.Date getBroadcastingDateTo() {
    	return broadcastingDateTo;
    }

    public void setBroadcastingDateTo(java.util.Date broadcastingDateTo) {
    	this.broadcastingDateTo = broadcastingDateTo;
    }

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
    }

	@JsonProperty("isReturn")
    public String getIsReturn(){
		return isReturn;
    }

    public void setIsReturn(String isReturn){
		this.isReturn = isReturn;
    }

	@JsonProperty("completeValue")
    public String getCompleteValue(){
		return completeValue;
    }

    public void setCompleteValue(String completeValue){
		this.completeValue = completeValue;
    }

	@JsonProperty("approveCompleteValue")
    public Double getApproveCompleteValue(){
		return approveCompleteValue;
    }

    public void setApproveCompleteValue(Double approveCompleteValue){
		this.approveCompleteValue = approveCompleteValue;
    }

	@JsonProperty("approveCompleteDate")
    public java.util.Date getApproveCompleteDate(){
		return approveCompleteDate;
    }

    public void setApproveCompleteDate(java.util.Date approveCompleteDate){
		this.approveCompleteDate = approveCompleteDate;
    }

	public java.util.Date getApproveCompleteDateFrom() {
    	return approveCompleteDateFrom;
    }

    public void setApproveCompleteDateFrom(java.util.Date approveCompleteDateFrom) {
    	this.approveCompleteDateFrom = approveCompleteDateFrom;
    }

	public java.util.Date getApproveCompleteDateTo() {
    	return approveCompleteDateTo;
    }

    public void setApproveCompleteDateTo(java.util.Date approveCompleteDateTo) {
    	this.approveCompleteDateTo = approveCompleteDateTo;
    }

	@JsonProperty("approveCompleteUserId")
    public Long getApproveCompleteUserId(){
		return approveCompleteUserId;
    }

    public void setApproveCompleteUserId(Long approveCompleteUserId){
		this.approveCompleteUserId = approveCompleteUserId;
    }

	@JsonProperty("approveCompleteUserName")
    public String getApproveCompleteUserName(){
		return approveCompleteUserName;
    }

    public void setApproveCompleteUserName(String approveCompleteUserName){
		this.approveCompleteUserName = approveCompleteUserName;
    }

	@JsonProperty("approveCompleteDescription")
    public String getApproveCompleteDescription(){
		return approveCompleteDescription;
    }

    public void setApproveCompleteDescription(String approveCompleteDescription){
		this.approveCompleteDescription = approveCompleteDescription;
    }

	@JsonProperty("approveRevenueValue")
    public Double getApproveRevenueValue(){
		return approveRevenueValue;
    }

    public void setApproveRevenueValue(Double approveRevenueValue){
		this.approveRevenueValue = approveRevenueValue;
    }

	@JsonProperty("approveRevenueDate")
    public java.util.Date getApproveRevenueDate(){
		return approveRevenueDate;
    }

    public void setApproveRevenueDate(java.util.Date approveRevenueDate){
		this.approveRevenueDate = approveRevenueDate;
    }

	public java.util.Date getApproveRevenueDateFrom() {
    	return approveRevenueDateFrom;
    }

    public void setApproveRevenueDateFrom(java.util.Date approveRevenueDateFrom) {
    	this.approveRevenueDateFrom = approveRevenueDateFrom;
    }

	public java.util.Date getApproveRevenueDateTo() {
    	return approveRevenueDateTo;
    }

    public void setApproveRevenueDateTo(java.util.Date approveRevenueDateTo) {
    	this.approveRevenueDateTo = approveRevenueDateTo;
    }

	@JsonProperty("approveRevenueUserId")
    public Long getApproveRevenueUserId(){
		return approveRevenueUserId;
    }

    public void setApproveRevenueUserId(Long approveRevenueUserId){
		this.approveRevenueUserId = approveRevenueUserId;
    }

	@JsonProperty("approveRevenueUserName")
    public String getApproveRevenueUserName(){
		return approveRevenueUserName;
    }

    public void setApproveRevenueUserName(String approveRevenueUserName){
		this.approveRevenueUserName = approveRevenueUserName;
    }

	@JsonProperty("approveRevenueDescription")
    public String getApproveRevenueDescription(){
		return approveRevenueDescription;
    }

    public void setApproveRevenueDescription(String approveRevenueDescription){
		this.approveRevenueDescription = approveRevenueDescription;
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

	@JsonProperty("status")
    public String getStatus(){
		return status;
    }

    public void setStatus(String status){
		this.status = status;
    }

	@JsonProperty("catConstructionDeployId")
    public Long getCatConstructionDeployId(){
		return catConstructionDeployId;
    }

    public void setCatConstructionDeployId(Long catConstructionDeployId){
		this.catConstructionDeployId = catConstructionDeployId;
    }

	@JsonProperty("catConstructionDeployName")
    public String getCatConstructionDeployName(){
		return catConstructionDeployName;
    }

    public void setCatConstructionDeployName(String catConstructionDeployName){
		this.catConstructionDeployName = catConstructionDeployName;
    }

	@JsonProperty("region")
    public Long getRegion(){
		return region;
    }

    public void setRegion(Long region){
		this.region = region;
    }

	@JsonProperty("catStationId")
    public Long getCatStationId(){
		return catStationId;
    }

    public void setCatStationId(Long catStationId){
		this.catStationId = catStationId;
    }

	@JsonProperty("catStationName")
    public String getCatStationName(){
		return catStationName;
    }

    public void setCatStationName(String catStationName){
		this.catStationName = catStationName;
    }

	@JsonProperty("returner")
    public String getReturner(){
		return returner;
    }

    public void setReturner(String returner){
		this.returner = returner;
    }

	@JsonProperty("returnDate")
    public java.util.Date getReturnDate(){
		return returnDate;
    }

    public void setReturnDate(java.util.Date returnDate){
		this.returnDate = returnDate;
    }

	public java.util.Date getReturnDateFrom() {
    	return returnDateFrom;
    }

    public void setReturnDateFrom(java.util.Date returnDateFrom) {
    	this.returnDateFrom = returnDateFrom;
    }

	public java.util.Date getReturnDateTo() {
    	return returnDateTo;
    }

    public void setReturnDateTo(java.util.Date returnDateTo) {
    	this.returnDateTo = returnDateTo;
    }

    @JsonProperty("cntContractMapId")
    public String getCntContractMapId(){
		return cntContractMapId;
    }

    public void setCntContractMapId(String cntContractMapId){
		this.cntContractMapId = cntContractMapId;
    }	
}
