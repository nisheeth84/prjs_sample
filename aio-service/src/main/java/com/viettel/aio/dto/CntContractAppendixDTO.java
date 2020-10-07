package com.viettel.aio.dto;

import com.viettel.aio.bo.CntContractAppendixBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;


@SuppressWarnings("serial")
@XmlRootElement(name = "CNT_CONTRACT_APPENDIXBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CntContractAppendixDTO extends ComsBaseFWDTO<CntContractAppendixBO> {

	private Long cntContractAppendixId;
	private String contentAppendix;

	private Double price;
	private String description;
	private Long cntContractId;
	private String cntContractName;
	private Long status;
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
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	private List<UtilAttachDocumentDTO> attachmentLst;

    @Override
    public CntContractAppendixBO toModel() {
        CntContractAppendixBO cntContractAppendixBO = new CntContractAppendixBO();
        cntContractAppendixBO.setCntContractAppendixId(this.cntContractAppendixId);
        cntContractAppendixBO.setPrice(this.price);
        cntContractAppendixBO.setDescription(this.description);
        cntContractAppendixBO.setCntContractId(this.cntContractId);
        cntContractAppendixBO.setStatus(this.status);
        cntContractAppendixBO.setCreatedUserId(this.createdUserId);
        cntContractAppendixBO.setCreatedGroupId(this.createdGroupId);
        cntContractAppendixBO.setUpdatedDate(this.updatedDate);
        cntContractAppendixBO.setUpdatedUserId(this.updatedUserId);
        cntContractAppendixBO.setUpdatedGroupId(this.updatedGroupId);
        cntContractAppendixBO.setCreatedDate(this.createdDate);
        return cntContractAppendixBO;
    }

    @Override
     public Long getFWModelId() {
        return cntContractAppendixId;
    }

    @Override
    public String catchName() {
        return getCntContractAppendixId().toString();
    }

	@JsonProperty("cntContractAppendixId")
    public Long getCntContractAppendixId(){
		return cntContractAppendixId;
    }

    public void setCntContractAppendixId(Long cntContractAppendixId){
		this.cntContractAppendixId = cntContractAppendixId;
    }

	@JsonProperty("contentAppendix")
    public String getContentAppendix(){
		return contentAppendix;
    }

    public void setContentAppendix(String contentAppendix){
		this.contentAppendix = contentAppendix;
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
    @JsonProperty("createdDate")
    public java.util.Date getCreatedDate(){
		return createdDate;
    }
	
    public void setCreatedDate(java.util.Date createdDate){
		this.createdDate = createdDate;
    }	
    
    @JsonProperty("attachmentLst") 
   	public List<UtilAttachDocumentDTO> getAttachmentLst() {
   		return attachmentLst;
   	}

   	public void setAttachmentLst(List<UtilAttachDocumentDTO> attachmentLst) {
   		this.attachmentLst = attachmentLst;
   	}	
	
}
