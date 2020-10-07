package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractLiquidateDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntContractLiquidateBO")
@Table(name = "CNT_CONTRACT_LIQUIDATE")
/**
 *
 * @author: hailh10
 */
public class CntContractLiquidateBO extends BaseFWModelImpl {
     
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "UPDATED_GROUP_ID", length = 22)
	private Long updatedGroupId;
	@Column(name = "UPDATED_USER_ID", length = 22)
	private Long updatedUserId;
	@Column(name = "UPDATED_DATE", length = 7)
	private java.util.Date updatedDate;
	@Column(name = "CREATED_GROUP_ID", length = 22)
	private Long createdGroupId;
	@Column(name = "CREATED_USER_ID", length = 22)
	private Long createdUserId;
	@Column(name = "STATUS", length = 22)
	private Long status;
	@Column(name = "CNT_CONTRACT_ID", length = 22)
	private Long cntContractId;
	@Column(name = "DESCRIPTION", length = 4000)
	private String description;
	@Column(name = "PAYMENT_MODE", length = 200)
	private String paymentMode;
	@Column(name = "LIQUIDATE_DATE", length = 7)
	private java.util.Date liquidateDate;
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_LIQUIDATE_SEQ") })
	@Column(name = "CNT_CONTRACT_LIQUIDATE_ID", length = 22)
	private Long cntContractLiquidateId;


	public java.util.Date getCreatedDate(){
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate)
	{
		this.createdDate = createdDate;
	}

	public Long getUpdatedGroupId(){
		return updatedGroupId;
	}

	public void setUpdatedGroupId(Long updatedGroupId)
	{
		this.updatedGroupId = updatedGroupId;
	}

	public Long getUpdatedUserId(){
		return updatedUserId;
	}

	public void setUpdatedUserId(Long updatedUserId)
	{
		this.updatedUserId = updatedUserId;
	}

	public java.util.Date getUpdatedDate(){
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate)
	{
		this.updatedDate = updatedDate;
	}

	public Long getCreatedGroupId(){
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId)
	{
		this.createdGroupId = createdGroupId;
	}

	public Long getCreatedUserId(){
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId)
	{
		this.createdUserId = createdUserId;
	}

	public Long getStatus(){
		return status;
	}

	public void setStatus(Long status)
	{
		this.status = status;
	}

	public Long getCntContractId(){
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId)
	{
		this.cntContractId = cntContractId;
	}

	public String getDescription(){
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public String getPaymentMode(){
		return paymentMode;
	}

	public void setPaymentMode(String paymentMode)
	{
		this.paymentMode = paymentMode;
	}

	public java.util.Date getLiquidateDate(){
		return liquidateDate;
	}

	public void setLiquidateDate(java.util.Date liquidateDate)
	{
		this.liquidateDate = liquidateDate;
	}

	public Long getCntContractLiquidateId(){
		return cntContractLiquidateId;
	}

	public void setCntContractLiquidateId(Long cntContractLiquidateId)
	{
		this.cntContractLiquidateId = cntContractLiquidateId;
	}
   
    @Override
    public CntContractLiquidateDTO toDTO() {
        CntContractLiquidateDTO cntContractLiquidateDTO = new CntContractLiquidateDTO(); 
        cntContractLiquidateDTO.setCreatedDate(this.createdDate);		
        cntContractLiquidateDTO.setUpdatedGroupId(this.updatedGroupId);		
        cntContractLiquidateDTO.setUpdatedUserId(this.updatedUserId);		
        cntContractLiquidateDTO.setUpdatedDate(this.updatedDate);		
        cntContractLiquidateDTO.setCreatedGroupId(this.createdGroupId);		
        cntContractLiquidateDTO.setCreatedUserId(this.createdUserId);		
        cntContractLiquidateDTO.setStatus(this.status);		
        cntContractLiquidateDTO.setCntContractId(this.cntContractId);		
        cntContractLiquidateDTO.setDescription(this.description);		
        cntContractLiquidateDTO.setPaymentMode(this.paymentMode);		
        cntContractLiquidateDTO.setLiquidateDate(this.liquidateDate);		
        cntContractLiquidateDTO.setCntContractLiquidateId(this.cntContractLiquidateId);		
        return cntContractLiquidateDTO;
    }
}
