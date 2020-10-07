package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractLiquidateBO;
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
@XmlRootElement(name = "CNT_CONTRACT_LIQUIDATEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractLiquidateDTO extends ComsBaseFWDTO<CntContractLiquidateBO> {

	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDateTo;
	private Long updatedGroupId;
	private String updatedGroupName;
	private Long updatedUserId;
	private String updatedUserName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDateTo;
	private Long createdGroupId;
	private String createdGroupName;
	private Long createdUserId;
	private String createdUserName;
	private Long status;
	private Long cntContractId;
	private String cntContractName;
	private String description;
	private String paymentMode;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date liquidateDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date liquidateDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date liquidateDateTo;
	private Long cntContractLiquidateId;

	private List<UtilAttachDocumentDTO> attachmentLst;

    @Override
    public CntContractLiquidateBO toModel() {
        CntContractLiquidateBO cntContractLiquidateBO = new CntContractLiquidateBO();
        cntContractLiquidateBO.setCreatedDate(this.createdDate);
        cntContractLiquidateBO.setUpdatedGroupId(this.updatedGroupId);
        cntContractLiquidateBO.setUpdatedUserId(this.updatedUserId);
        cntContractLiquidateBO.setUpdatedDate(this.updatedDate);
        cntContractLiquidateBO.setCreatedGroupId(this.createdGroupId);
        cntContractLiquidateBO.setCreatedUserId(this.createdUserId);
        cntContractLiquidateBO.setStatus(this.status);
        cntContractLiquidateBO.setCntContractId(this.cntContractId);
        cntContractLiquidateBO.setDescription(this.description);
        cntContractLiquidateBO.setPaymentMode(this.paymentMode);
        cntContractLiquidateBO.setLiquidateDate(this.liquidateDate);
        cntContractLiquidateBO.setCntContractLiquidateId(this.cntContractLiquidateId);
        return cntContractLiquidateBO;
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

	@JsonProperty("status")
    public Long getStatus(){
		return status;
    }

    public void setStatus(Long status){
		this.status = status;
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

	@JsonProperty("description")
    public String getDescription(){
		return description;
    }

    public void setDescription(String description){
		this.description = description;
    }

	@JsonProperty("paymentMode")
    public String getPaymentMode(){
		return paymentMode;
    }

    public void setPaymentMode(String paymentMode){
		this.paymentMode = paymentMode;
    }

	@JsonProperty("liquidateDate")
    public java.util.Date getLiquidateDate(){
		return liquidateDate;
    }

    public void setLiquidateDate(java.util.Date liquidateDate){
		this.liquidateDate = liquidateDate;
    }

	public java.util.Date getLiquidateDateFrom() {
    	return liquidateDateFrom;
    }

    public void setLiquidateDateFrom(java.util.Date liquidateDateFrom) {
    	this.liquidateDateFrom = liquidateDateFrom;
    }

	public java.util.Date getLiquidateDateTo() {
    	return liquidateDateTo;
    }

    public void setLiquidateDateTo(java.util.Date liquidateDateTo) {
    	this.liquidateDateTo = liquidateDateTo;
    }

    @Override
     public Long getFWModelId() {
        return cntContractLiquidateId;
    }

    @Override
    public String catchName() {
        return getCntContractLiquidateId().toString();
    }

	@JsonProperty("cntContractLiquidateId")
    public Long getCntContractLiquidateId(){
		return cntContractLiquidateId;
    }

    public void setCntContractLiquidateId(Long cntContractLiquidateId){
		this.cntContractLiquidateId = cntContractLiquidateId;
    }	
    
    @JsonProperty("attachmentLst")
  	public List<UtilAttachDocumentDTO> getAttachmentLst() {
  		return attachmentLst;
  	}

  	public void setAttachmentLst(List<UtilAttachDocumentDTO> attachmentLst) {
  		this.attachmentLst = attachmentLst;
  	}	
  	
	
}
