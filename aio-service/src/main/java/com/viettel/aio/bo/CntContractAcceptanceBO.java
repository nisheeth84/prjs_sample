package com.viettel.aio.bo;

import com.viettel.aio.dto.CntContractAcceptanceDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntContractAcceptanceBO")
@Table(name = "CNT_CONTRACT_ACCEPTANCE")
/**
 *
 * @author: hailh10
 */
public class CntContractAcceptanceBO extends BaseFWModelImpl {
     
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
	@Column(name = "ACCEPTANCE_RESULT", length = 200)
	private String acceptanceResult;
	@Column(name = "ACCEPTANCE_DATE", length = 7)
	private java.util.Date acceptanceDate;
	@Column(name = "ACCEPTANCE_SIGNER", length = 200)
	private String acceptanceSigner;
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONTRACT_ACCEPTANCE_SEQ") })
	@Column(name = "CNT_CONTRACT_ACCEPTANCE_ID", length = 22)
	private Long cntContractAcceptanceId;


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

	public String getAcceptanceResult(){
		return acceptanceResult;
	}

	public void setAcceptanceResult(String acceptanceResult)
	{
		this.acceptanceResult = acceptanceResult;
	}

	public java.util.Date getAcceptanceDate(){
		return acceptanceDate;
	}

	public void setAcceptanceDate(java.util.Date acceptanceDate)
	{
		this.acceptanceDate = acceptanceDate;
	}

	public String getAcceptanceSigner(){
		return acceptanceSigner;
	}

	public void setAcceptanceSigner(String acceptanceSigner)
	{
		this.acceptanceSigner = acceptanceSigner;
	}

	public Long getCntContractAcceptanceId(){
		return cntContractAcceptanceId;
	}

	public void setCntContractAcceptanceId(Long cntContractAcceptanceId)
	{
		this.cntContractAcceptanceId = cntContractAcceptanceId;
	}   
    public java.util.Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate) {
		this.createdDate = createdDate;
	}

	@Override
    public CntContractAcceptanceDTO toDTO() {
        CntContractAcceptanceDTO cntContractAcceptanceDTO = new CntContractAcceptanceDTO(); 
        cntContractAcceptanceDTO.setUpdatedGroupId(this.updatedGroupId);		
        cntContractAcceptanceDTO.setUpdatedUserId(this.updatedUserId);		
        cntContractAcceptanceDTO.setUpdatedDate(this.updatedDate);		
        cntContractAcceptanceDTO.setCreatedGroupId(this.createdGroupId);		
        cntContractAcceptanceDTO.setCreatedUserId(this.createdUserId);		
        cntContractAcceptanceDTO.setStatus(this.status);		
        cntContractAcceptanceDTO.setCntContractId(this.cntContractId);		
        cntContractAcceptanceDTO.setDescription(this.description);		
        cntContractAcceptanceDTO.setAcceptanceResult(this.acceptanceResult);		
        cntContractAcceptanceDTO.setAcceptanceDate(this.acceptanceDate);		
        cntContractAcceptanceDTO.setAcceptanceSigner(this.acceptanceSigner);		
        cntContractAcceptanceDTO.setCntContractAcceptanceId(this.cntContractAcceptanceId);		
        cntContractAcceptanceDTO.setCreatedDate(this.createdDate);		
        return cntContractAcceptanceDTO;
    }
}
