package com.viettel.aio.dto;

import com.viettel.aio.bo.PurchaseOrderBO;
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
@XmlRootElement(name = "PURCHASE_ORDERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class PurchaseOrderDTO extends ComsBaseFWDTO<PurchaseOrderBO> {

	private Long purchaseOrderId;
	private String code;
	private String name;
	private Long catPartnerId;
	private String catPartnerName;
	private String signerPartner;
	private Long sysGroupId;
	private String sysGroupName;
	private String signerGroupName;
	private Long signerGroupId;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date signDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date signDateFrom;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date signDateTo;
	private Double price;
	private String expense;
	private String description;
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
	private List <UtilAttachDocumentDTO> fileLst;

    @Override
    public PurchaseOrderBO toModel() {
        PurchaseOrderBO purchaseOrderBO = new PurchaseOrderBO();
        purchaseOrderBO.setPurchaseOrderId(this.purchaseOrderId);
        purchaseOrderBO.setCode(this.code);
        purchaseOrderBO.setName(this.name);
        purchaseOrderBO.setCatPartnerId(this.catPartnerId);
        purchaseOrderBO.setSignerPartner(this.signerPartner);
        purchaseOrderBO.setSysGroupId(this.sysGroupId);
        purchaseOrderBO.setSignerGroupName(this.signerGroupName);
        purchaseOrderBO.setSignerGroupId(this.signerGroupId);
        purchaseOrderBO.setSignDate(this.signDate);
        purchaseOrderBO.setPrice(this.price);
        purchaseOrderBO.setExpense(this.expense);
        purchaseOrderBO.setDescription(this.description);
        purchaseOrderBO.setStatus(this.status);
        purchaseOrderBO.setCreatedDate(this.createdDate);
        purchaseOrderBO.setCreatedUserId(this.createdUserId);
        purchaseOrderBO.setCreatedGroupId(this.createdGroupId);
        purchaseOrderBO.setUpdatedDate(this.updatedDate);
        purchaseOrderBO.setUpdatedUserId(this.updatedUserId);
        purchaseOrderBO.setUpdatedGroupId(this.updatedGroupId);
        return purchaseOrderBO;
    }

    @Override
     public Long getFWModelId() {
        return purchaseOrderId;
    }

    @Override
    public String catchName() {
        return getPurchaseOrderId().toString();
    }

	@JsonProperty("purchaseOrderId")
    public Long getPurchaseOrderId(){
		return purchaseOrderId;
    }

    public void setPurchaseOrderId(Long purchaseOrderId){
		this.purchaseOrderId = purchaseOrderId;
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

	@JsonProperty("catPartnerId")
    public Long getCatPartnerId(){
		return catPartnerId;
    }

    public void setCatPartnerId(Long catPartnerId){
		this.catPartnerId = catPartnerId;
    }

	@JsonProperty("catPartnerName")
    public String getCatPartnerName(){
		return catPartnerName;
    }

    public void setCatPartnerName(String catPartnerName){
		this.catPartnerName = catPartnerName;
    }

	@JsonProperty("signerPartner")
    public String getSignerPartner(){
		return signerPartner;
    }

    public void setSignerPartner(String signerPartner){
		this.signerPartner = signerPartner;
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

	@JsonProperty("signerGroupName")
	public String getSignerGroupName() {
		return signerGroupName;
	}

	public void setSignerGroupName(String signerGroupName) {
		this.signerGroupName = signerGroupName;
	}

	@JsonProperty("signerGroupId")
	public Long getSignerGroupId() {
		return signerGroupId;
	}

	public void setSignerGroupId(Long signerGroupId) {
		this.signerGroupId = signerGroupId;
	}

	@JsonProperty("signDate")
    public java.util.Date getSignDate(){
		return signDate;
    }

    public void setSignDate(java.util.Date signDate){
		this.signDate = signDate;
    }

	public java.util.Date getSignDateFrom() {
    	return signDateFrom;
    }

    public void setSignDateFrom(java.util.Date signDateFrom) {
    	this.signDateFrom = signDateFrom;
    }

	public java.util.Date getSignDateTo() {
    	return signDateTo;
    }

    public void setSignDateTo(java.util.Date signDateTo) {
    	this.signDateTo = signDateTo;
    }

	@JsonProperty("price")
    public Double getPrice(){
		return price;
    }

    public void setPrice(Double price){
		this.price = price;
    }

	@JsonProperty("expense")
    public String getExpense(){
		return expense;
    }

    public void setExpense(String expense){
		this.expense = expense;
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

	public void setFileLst(List<UtilAttachDocumentDTO> fileLst) {
		this.fileLst = fileLst;
	}

	public List<UtilAttachDocumentDTO> getFileLst() {
		return fileLst;
	}
}
