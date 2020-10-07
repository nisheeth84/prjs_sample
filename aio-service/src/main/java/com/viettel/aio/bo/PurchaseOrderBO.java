package com.viettel.aio.bo;

import com.viettel.aio.dto.PurchaseOrderDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.PurchaseOrderBO")
@Table(name = "PURCHASE_ORDER")
/**
 *
 * @author: hailh10
 */
public class PurchaseOrderBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "PURCHASE_ORDER_SEQ") })
	@Column(name = "PURCHASE_ORDER_ID", length = 22)
	private Long purchaseOrderId;
	@Column(name = "CODE", length = 200)
	private String code;
	@Column(name = "NAME", length = 1000)
	private String name;
	@Column(name = "CAT_PARTNER_ID", length = 22)
	private Long catPartnerId;
	@Column(name = "SIGNER_PARTNER", length = 200)
	private String signerPartner;
	@Column(name = "SYS_GROUP_ID", length = 22)
	private Long sysGroupId;
	@Column(name = "SIGNER_GROUP_NAME", length = 200)
	private String signerGroupName;
	@Column(name = "SIGNER_GROUP_ID", length = 22)
	private Long signerGroupId;
	@Column(name = "SIGN_DATE", length = 7)
	private java.util.Date signDate;
	@Column(name = "PRICE", length = 22)
	private Double price;
	@Column(name = "EXPENSE", length = 2000)
	private String expense;
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


	public Long getPurchaseOrderId(){
		return purchaseOrderId;
	}

	public void setPurchaseOrderId(Long purchaseOrderId)
	{
		this.purchaseOrderId = purchaseOrderId;
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

	public Long getCatPartnerId(){
		return catPartnerId;
	}

	public void setCatPartnerId(Long catPartnerId)
	{
		this.catPartnerId = catPartnerId;
	}

	public String getSignerPartner(){
		return signerPartner;
	}

	public void setSignerPartner(String signerPartner)
	{
		this.signerPartner = signerPartner;
	}

	public Long getSysGroupId(){
		return sysGroupId;
	}

	public void setSysGroupId(Long sysGroupId)
	{
		this.sysGroupId = sysGroupId;
	}

	public String getSignerGroupName() {
		return signerGroupName;
	}

	public void setSignerGroupName(String signerGroupName) {
		this.signerGroupName = signerGroupName;
	}

	public Long getSignerGroupId() {
		return signerGroupId;
	}

	public void setSignerGroupId(Long signerGroupId) {
		this.signerGroupId = signerGroupId;
	}

	public java.util.Date getSignDate(){
		return signDate;
	}

	public void setSignDate(java.util.Date signDate)
	{
		this.signDate = signDate;
	}

	public Double getPrice(){
		return price;
	}

	public void setPrice(Double price)
	{
		this.price = price;
	}

	public String getExpense(){
		return expense;
	}

	public void setExpense(String expense)
	{
		this.expense = expense;
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
    public PurchaseOrderDTO toDTO() {
        PurchaseOrderDTO purchaseOrderDTO = new PurchaseOrderDTO();
        purchaseOrderDTO.setPurchaseOrderId(this.purchaseOrderId);		
        purchaseOrderDTO.setCode(this.code);		
        purchaseOrderDTO.setName(this.name);		
        purchaseOrderDTO.setCatPartnerId(this.catPartnerId);		
        purchaseOrderDTO.setSignerPartner(this.signerPartner);		
        purchaseOrderDTO.setSysGroupId(this.sysGroupId);		
        purchaseOrderDTO.setSignerGroupName(this.signerGroupName);
        purchaseOrderDTO.setSignerGroupId(this.signerGroupId);
        purchaseOrderDTO.setSignDate(this.signDate);		
        purchaseOrderDTO.setPrice(this.price);		
        purchaseOrderDTO.setExpense(this.expense);		
        purchaseOrderDTO.setDescription(this.description);		
        purchaseOrderDTO.setStatus(this.status);		
        purchaseOrderDTO.setCreatedDate(this.createdDate);		
        purchaseOrderDTO.setCreatedUserId(this.createdUserId);		
        purchaseOrderDTO.setCreatedGroupId(this.createdGroupId);		
        purchaseOrderDTO.setUpdatedDate(this.updatedDate);		
        purchaseOrderDTO.setUpdatedUserId(this.updatedUserId);		
        purchaseOrderDTO.setUpdatedGroupId(this.updatedGroupId);		
        return purchaseOrderDTO;
    }
}
