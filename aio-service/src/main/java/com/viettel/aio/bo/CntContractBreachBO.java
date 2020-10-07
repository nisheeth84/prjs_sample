package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractBreachDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntContractBreachBO")
@Table(name = "CNT_CONTRACT_BREACH")
/**
 *
 * @author: hailh10
 */
public class CntContractBreachBO extends BaseFWModelImpl {
     
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_BREACH_SEQ") })
	@Column(name = "CNT_CONTRACT_BREACH_ID", length = 22)
	private Long cntContractBreachId;
	@Column(name = "CONTENT_BREACH", length = 2000)
	private String contentBreach;
	@Column(name = "PRICE", length = 22)
	private Double price;
	@Column(name = "DESCRIPTION", length = 4000)
	private String description;
	@Column(name = "CNT_CONTRACT_ID", length = 22)
	private Long cntContractId;
	@Column(name = "STATUS", length = 22)
	private Long status;
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
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "MONEY_TYPE", length = 6)
	private Integer moneyType;


	public Long getCntContractBreachId(){
		return cntContractBreachId;
	}

	public void setCntContractBreachId(Long cntContractBreachId)
	{
		this.cntContractBreachId = cntContractBreachId;
	}

	public String getContentBreach(){
		return contentBreach;
	}

	public void setContentBreach(String contentBreach)
	{
		this.contentBreach = contentBreach;
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
	   
    public java.util.Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate) {
		this.createdDate = createdDate;
	}
   
    public Integer getMoneyType() {
		return moneyType;
	}

	public void setMoneyType(Integer moneyType) {
		this.moneyType = moneyType;
	}

	@Override
    public CntContractBreachDTO toDTO() {
        CntContractBreachDTO cntContractBreachDTO = new CntContractBreachDTO(); 
        cntContractBreachDTO.setCntContractBreachId(this.cntContractBreachId);		
        cntContractBreachDTO.setContentBreach(this.contentBreach);		
        cntContractBreachDTO.setPrice(this.price);		
        cntContractBreachDTO.setDescription(this.description);		
        cntContractBreachDTO.setCntContractId(this.cntContractId);		
        cntContractBreachDTO.setStatus(this.status);		
        cntContractBreachDTO.setCreatedUserId(this.createdUserId);		
        cntContractBreachDTO.setCreatedGroupId(this.createdGroupId);		
        cntContractBreachDTO.setUpdatedDate(this.updatedDate);		
        cntContractBreachDTO.setUpdatedUserId(this.updatedUserId);		
        cntContractBreachDTO.setUpdatedGroupId(this.updatedGroupId);		
        cntContractBreachDTO.setCreatedDate(this.createdDate);
        cntContractBreachDTO.setMoneyType(moneyType);
        return cntContractBreachDTO;
    }
}
