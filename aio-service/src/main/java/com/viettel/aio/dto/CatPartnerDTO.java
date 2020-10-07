package com.viettel.aio.dto;


import com.viettel.aio.bo.CatPartnerBO;
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
@XmlRootElement(name = "CAT_PARTNERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatPartnerDTO extends ComsBaseFWDTO<CatPartnerBO> {

	private Long catPartnerId;
	private String code;
	private String name;
	private String taxCode;
	private String fax;
	private String phone;
	private String address;
	private String represent;
	private Long partnerType;
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


    @Override
    public CatPartnerBO toModel() {
        CatPartnerBO catPartnerBO = new CatPartnerBO();
        catPartnerBO.setCatPartnerId(this.catPartnerId);
        catPartnerBO.setCode(this.code);
        catPartnerBO.setName(this.name);
        catPartnerBO.setTaxCode(this.taxCode);
        catPartnerBO.setFax(this.fax);
        catPartnerBO.setPhone(this.phone);
        catPartnerBO.setAddress(this.address);
        catPartnerBO.setRepresent(this.represent);
        catPartnerBO.setPartnerType(this.partnerType);
        catPartnerBO.setDescription(this.description);
        catPartnerBO.setStatus(this.status);
        catPartnerBO.setCreatedDate(this.createdDate);
        catPartnerBO.setCreatedUserId(this.createdUserId);
        catPartnerBO.setCreatedGroupId(this.createdGroupId);
        catPartnerBO.setUpdatedDate(this.updatedDate);
        catPartnerBO.setUpdatedUserId(this.updatedUserId);
        catPartnerBO.setUpdatedGroupId(this.updatedGroupId);
        return catPartnerBO;
    }

    @Override
     public Long getFWModelId() {
        return catPartnerId;
    }

    @Override
    public String catchName() {
        return getCatPartnerId().toString();
    }

	@JsonProperty("catPartnerId")
    public Long getCatPartnerId(){
		return catPartnerId;
    }

    public void setCatPartnerId(Long catPartnerId){
		this.catPartnerId = catPartnerId;
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

	@JsonProperty("taxCode")
    public String getTaxCode(){
		return taxCode;
    }

    public void setTaxCode(String taxCode){
		this.taxCode = taxCode;
    }

	@JsonProperty("fax")
    public String getFax(){
		return fax;
    }

    public void setFax(String fax){
		this.fax = fax;
    }

	@JsonProperty("phone")
    public String getPhone(){
		return phone;
    }

    public void setPhone(String phone){
		this.phone = phone;
    }

	@JsonProperty("address")
    public String getAddress(){
		return address;
    }

    public void setAddress(String address){
		this.address = address;
    }

	@JsonProperty("represent")
    public String getRepresent(){
		return represent;
    }

    public void setRepresent(String represent){
		this.represent = represent;
    }

	@JsonProperty("partnerType")
    public Long getPartnerType(){
		return partnerType;
    }

    public void setPartnerType(Long partnerType){
		this.partnerType = partnerType;
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
