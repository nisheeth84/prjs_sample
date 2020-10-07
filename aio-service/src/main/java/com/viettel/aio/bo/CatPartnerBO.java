package com.viettel.aio.bo;

import com.viettel.aio.dto.CatPartnerDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.CatPartnerBO")
@Table(name = "CAT_PARTNER")
/**
 *
 * @author: hailh10
 */
public class CatPartnerBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CAT_PARTNER_SEQ") })
	@Column(name = "CAT_PARTNER_ID", length = 22)
	private Long catPartnerId;
	@Column(name = "CODE", length = 200)
	private String code;
	@Column(name = "NAME", length = 1000)
	private String name;
	@Column(name = "TAX_CODE", length = 100)
	private String taxCode;
	@Column(name = "FAX", length = 60)
	private String fax;
	@Column(name = "PHONE", length = 60)
	private String phone;
	@Column(name = "ADDRESS", length = 600)
	private String address;
	@Column(name = "REPRESENT", length = 200)
	private String represent;
	@Column(name = "PARTNER_TYPE", length = 22)
	private Long partnerType;
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


	public Long getCatPartnerId(){
		return catPartnerId;
	}

	public void setCatPartnerId(Long catPartnerId)
	{
		this.catPartnerId = catPartnerId;
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

	public String getTaxCode(){
		return taxCode;
	}

	public void setTaxCode(String taxCode)
	{
		this.taxCode = taxCode;
	}

	public String getFax(){
		return fax;
	}

	public void setFax(String fax)
	{
		this.fax = fax;
	}

	public String getPhone(){
		return phone;
	}

	public void setPhone(String phone)
	{
		this.phone = phone;
	}

	public String getAddress(){
		return address;
	}

	public void setAddress(String address)
	{
		this.address = address;
	}

	public String getRepresent(){
		return represent;
	}

	public void setRepresent(String represent)
	{
		this.represent = represent;
	}

	public Long getPartnerType(){
		return partnerType;
	}

	public void setPartnerType(Long partnerType)
	{
		this.partnerType = partnerType;
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
    public CatPartnerDTO toDTO() {
        CatPartnerDTO catPartnerDTO = new CatPartnerDTO(); 
        catPartnerDTO.setCatPartnerId(this.catPartnerId);		
        catPartnerDTO.setCode(this.code);		
        catPartnerDTO.setName(this.name);		
        catPartnerDTO.setTaxCode(this.taxCode);		
        catPartnerDTO.setFax(this.fax);		
        catPartnerDTO.setPhone(this.phone);		
        catPartnerDTO.setAddress(this.address);		
        catPartnerDTO.setRepresent(this.represent);		
        catPartnerDTO.setPartnerType(this.partnerType);		
        catPartnerDTO.setDescription(this.description);		
        catPartnerDTO.setStatus(this.status);		
        catPartnerDTO.setCreatedDate(this.createdDate);		
        catPartnerDTO.setCreatedUserId(this.createdUserId);		
        catPartnerDTO.setCreatedGroupId(this.createdGroupId);		
        catPartnerDTO.setUpdatedDate(this.updatedDate);		
        catPartnerDTO.setUpdatedUserId(this.updatedUserId);		
        catPartnerDTO.setUpdatedGroupId(this.updatedGroupId);		
        return catPartnerDTO;
    }
}
