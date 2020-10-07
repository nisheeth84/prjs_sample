package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractWarrantyDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntContractWarrantyBO")
@Table(name = "CNT_CONTRACT_WARRANTY")
/**
 *
 * @author: hailh10
 */
public class CntContractWarrantyBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_WARRANTY_SEQ") })
	@Column(name = "CNT_CONTRACT_WARRANTY_ID", length = 22)
	private Long cntContractWarrantyId;
	@Column(name = "START_TIME", length = 7)
	private java.util.Date startTime;
	@Column(name = "END_TIME", length = 7)
	private java.util.Date endTime;
	@Column(name = "CONTENT", length = 4000)
	private String content;
	@Column(name = "PRICE", length = 22)
	private Double price;
	@Column(name = "DESCRIPTION", length = 4000)
	private String description;
	@Column(name = "CNT_CONTRACT_ID", length = 22)
	private Long cntContractId;
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
	@Column(name = "MONEY_TYPE", length = 6)
	private Integer moneyType;


	public Long getCntContractWarrantyId(){
		return cntContractWarrantyId;
	}

	public void setCntContractWarrantyId(Long cntContractWarrantyId)
	{
		this.cntContractWarrantyId = cntContractWarrantyId;
	}

	public java.util.Date getStartTime(){
		return startTime;
	}

	public void setStartTime(java.util.Date startTime)
	{
		this.startTime = startTime;
	}

	public java.util.Date getEndTime(){
		return endTime;
	}

	public void setEndTime(java.util.Date endTime)
	{
		this.endTime = endTime;
	}

	public String getContent(){
		return content;
	}

	public void setContent(String content)
	{
		this.content = content;
	}

	public Double getPrice(){
		return price;
	}

	public void setPrice(Double price)
	{
		this.price = price;
	}

	public String getDescription(){
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public Long getCntContractId(){
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId)
	{
		this.cntContractId = cntContractId;
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
   
    public Integer getMoneyType() {
		return moneyType;
	}

	public void setMoneyType(Integer moneyType) {
		this.moneyType = moneyType;
	}

	@Override
    public CntContractWarrantyDTO toDTO() {
        CntContractWarrantyDTO cntContractWarrantyDTO = new CntContractWarrantyDTO(); 
        cntContractWarrantyDTO.setCntContractWarrantyId(this.cntContractWarrantyId);		
        cntContractWarrantyDTO.setStartTime(this.startTime);		
        cntContractWarrantyDTO.setEndTime(this.endTime);		
        cntContractWarrantyDTO.setContent(this.content);		
        cntContractWarrantyDTO.setPrice(this.price);		
        cntContractWarrantyDTO.setDescription(this.description);		
        cntContractWarrantyDTO.setCntContractId(this.cntContractId);		
        cntContractWarrantyDTO.setStatus(this.status);		
        cntContractWarrantyDTO.setCreatedDate(this.createdDate);		
        cntContractWarrantyDTO.setCreatedUserId(this.createdUserId);		
        cntContractWarrantyDTO.setCreatedGroupId(this.createdGroupId);		
        cntContractWarrantyDTO.setUpdatedDate(this.updatedDate);		
        cntContractWarrantyDTO.setUpdatedUserId(this.updatedUserId);		
        cntContractWarrantyDTO.setUpdatedGroupId(this.updatedGroupId);
        cntContractWarrantyDTO.setMoneyType(moneyType);
        return cntContractWarrantyDTO;
    }
}
