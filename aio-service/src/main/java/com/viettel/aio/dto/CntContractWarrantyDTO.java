package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractWarrantyBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
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
@XmlRootElement(name = "CNT_CONTRACT_WARRANTYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractWarrantyDTO extends ComsBaseFWDTO<CntContractWarrantyBO> {

	private Long cntContractWarrantyId;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startTime;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startTimeFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startTimeTo;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endTime;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endTimeFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endTimeTo;
	private String content;
	private Double price;
	private String description;
	private Long cntContractId;
	private String cntContractName;
	private Long status;
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
	private List<UtilAttachDocumentDTO> attachmentLst;
	private Integer moneyType;

    @Override
    public CntContractWarrantyBO toModel() {
        CntContractWarrantyBO cntContractWarrantyBO = new CntContractWarrantyBO();
        cntContractWarrantyBO.setCntContractWarrantyId(this.cntContractWarrantyId);
        cntContractWarrantyBO.setStartTime(this.startTime);
        cntContractWarrantyBO.setEndTime(this.endTime);
        cntContractWarrantyBO.setContent(this.content);
        cntContractWarrantyBO.setPrice(this.price);
        cntContractWarrantyBO.setDescription(this.description);
        cntContractWarrantyBO.setCntContractId(this.cntContractId);
        cntContractWarrantyBO.setStatus(this.status);
        cntContractWarrantyBO.setCreatedDate(this.createdDate);
        cntContractWarrantyBO.setCreatedUserId(this.createdUserId);
        cntContractWarrantyBO.setCreatedGroupId(this.createdGroupId);
        cntContractWarrantyBO.setUpdatedDate(this.updatedDate);
        cntContractWarrantyBO.setUpdatedUserId(this.updatedUserId);
        cntContractWarrantyBO.setUpdatedGroupId(this.updatedGroupId);
        cntContractWarrantyBO.setMoneyType(moneyType);
        return cntContractWarrantyBO;
    }

    @Override
     public Long getFWModelId() {
        return cntContractWarrantyId;
    }

    @Override
    public String catchName() {
        return getCntContractWarrantyId().toString();
    }

	@JsonProperty("cntContractWarrantyId")
    public Long getCntContractWarrantyId(){
		return cntContractWarrantyId;
    }

    public void setCntContractWarrantyId(Long cntContractWarrantyId){
		this.cntContractWarrantyId = cntContractWarrantyId;
    }

	@JsonProperty("startTime")
    public java.util.Date getStartTime(){
		return startTime;
    }

    public void setStartTime(java.util.Date startTime){
		this.startTime = startTime;
    }

	public java.util.Date getStartTimeFrom() {
    	return startTimeFrom;
    }

    public void setStartTimeFrom(java.util.Date startTimeFrom) {
    	this.startTimeFrom = startTimeFrom;
    }

	public java.util.Date getStartTimeTo() {
    	return startTimeTo;
    }

    public void setStartTimeTo(java.util.Date startTimeTo) {
    	this.startTimeTo = startTimeTo;
    }

	@JsonProperty("endTime")
    public java.util.Date getEndTime(){
		return endTime;
    }

    public void setEndTime(java.util.Date endTime){
		this.endTime = endTime;
    }

	public java.util.Date getEndTimeFrom() {
    	return endTimeFrom;
    }

    public void setEndTimeFrom(java.util.Date endTimeFrom) {
    	this.endTimeFrom = endTimeFrom;
    }

	public java.util.Date getEndTimeTo() {
    	return endTimeTo;
    }

    public void setEndTimeTo(java.util.Date endTimeTo) {
    	this.endTimeTo = endTimeTo;
    }

	@JsonProperty("content")
    public String getContent(){
		return content;
    }

    public void setContent(String content){
		this.content = content;
    }

	@JsonProperty("price")
    public Double getPrice(){
		return price;
    }

    public void setPrice(Double price){
		this.price = price;
    }

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
    }

	@JsonProperty("cntContractId")
    public Long getCntContractId(){
		return cntContractId;
    }

    public void setCntContractId(Long cntContractId){
		this.cntContractId = cntContractId;
    }

	@JsonProperty("cntContractName")
    public String getCntContractName(){
		return cntContractName;
    }

    public void setCntContractName(String cntContractName){
		this.cntContractName = cntContractName;
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
    @JsonProperty("attachmentLst")
   	public List<UtilAttachDocumentDTO> getAttachmentLst() {
   		return attachmentLst;
   	}

   	public void setAttachmentLst(List<UtilAttachDocumentDTO> attachmentLst) {
   		this.attachmentLst = attachmentLst;
   	}

	public Integer getMoneyType() {
		return moneyType;
	}

	public void setMoneyType(Integer moneyType) {
		this.moneyType = moneyType;
	}	
   	
}
