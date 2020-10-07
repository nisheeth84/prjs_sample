package com.viettel.aio.bo;

import com.viettel.aio.dto.CntConstrWorkItemTaskDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.aio.bo.CntConstrWorkItemTaskBO")
@Table(name = "CNT_CONSTR_WORK_ITEM_TASK")
/**
 *
 * @author: hailh10
 */
public class CntConstrWorkItemTaskBO extends BaseFWModelImpl {
     
	@Column(name = "CONSTRUCTION_ID", length = 22)
	private Long constructionId;
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
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "STATUS", length = 22)
	private Long status;
	@Column(name = "DESCRIPTION", length = 4000)
	private String description;
	@Column(name = "PRICE", length = 22)
	private Double price;
	@Column(name = "UNIT_PRICE", length = 22)
	private Double unitPrice;
	@Column(name = "QUANTITY", length = 22)
	private Long quantity;
	@Column(name = "CAT_UNIT_ID", length = 22)
	private Long catUnitId;
	@Column(name = "CAT_TASK_ID", length = 22)
	private Long catTaskId;
	@Column(name = "WORK_ITEM_ID", length = 22)
	private Long workItemId;
	@Column(name = "CNT_CONTRACT_ID", length = 22)
	private Long cntContractId;
	/**hoangnh start 02012018**/
	@Column(name = "SYN_STATUS", length = 1)
	private String synStatus;
	/**hoangnh start 02012018**/

	//hienvd: START 7/9/2019
	@Column(name = "STATION_HTCT", length = 1)
	private String stationHTCT;
	//hienvd: END 7/9/2019
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CNT_CONSTR_WORK_ITEM_TASK_SEQ") })
	@Column(name = "CNT_CONSTR_WORK_ITEM_TASK_ID", length = 22)
	private Long cntConstrWorkItemTaskId;


	public Long getConstructionId(){
		return constructionId;
	}

	public void setConstructionId(Long constructionId)
	{
		this.constructionId = constructionId;
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

	public java.util.Date getCreatedDate(){
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate)
	{
		this.createdDate = createdDate;
	}

	public Long getStatus(){
		return status;
	}

	public void setStatus(Long status)
	{
		this.status = status;
	}

	public String getDescription(){
		return description;
	}

	public void setDescription(String description)
	{
		this.description = description;
	}

	public Double getPrice(){
		return price;
	}

	public void setPrice(Double price)
	{
		this.price = price;
	}

	public Double getUnitPrice(){
		return unitPrice;
	}

	public void setUnitPrice(Double unitPrice)
	{
		this.unitPrice = unitPrice;
	}

	public Long getQuantity(){
		return quantity;
	}

	public void setQuantity(Long quantity)
	{
		this.quantity = quantity;
	}

	public Long getCatUnitId(){
		return catUnitId;
	}

	public void setCatUnitId(Long catUnitId)
	{
		this.catUnitId = catUnitId;
	}

	public Long getCatTaskId(){
		return catTaskId;
	}

	public void setCatTaskId(Long catTaskId)
	{
		this.catTaskId = catTaskId;
	}

	public Long getWorkItemId(){
		return workItemId;
	}

	public void setWorkItemId(Long workItemId)
	{
		this.workItemId = workItemId;
	}

	public Long getCntContractId(){
		return cntContractId;
	}

	public void setCntContractId(Long cntContractId)
	{
		this.cntContractId = cntContractId;
	}

	public Long getCntConstrWorkItemTaskId(){
		return cntConstrWorkItemTaskId;
	}

	public void setCntConstrWorkItemTaskId(Long cntConstrWorkItemTaskId)
	{
		this.cntConstrWorkItemTaskId = cntConstrWorkItemTaskId;
	}


    public String getSynStatus() {
		return synStatus;
	}

	public void setSynStatus(String synStatus) {
		this.synStatus = synStatus;
	}

	public String getStationHTCT() {
		return stationHTCT;
	}

	public void setStationHTCT(String stationHTCT) {
		this.stationHTCT = stationHTCT;
	}

	@Override
    public CntConstrWorkItemTaskDTO toDTO() {
        CntConstrWorkItemTaskDTO cntConstrWorkItemTaskDTO = new CntConstrWorkItemTaskDTO(); 
        cntConstrWorkItemTaskDTO.setConstructionId(this.constructionId);		
        cntConstrWorkItemTaskDTO.setUpdatedGroupId(this.updatedGroupId);		
        cntConstrWorkItemTaskDTO.setUpdatedUserId(this.updatedUserId);		
        cntConstrWorkItemTaskDTO.setUpdatedDate(this.updatedDate);		
        cntConstrWorkItemTaskDTO.setCreatedGroupId(this.createdGroupId);		
        cntConstrWorkItemTaskDTO.setCreatedUserId(this.createdUserId);		
        cntConstrWorkItemTaskDTO.setCreatedDate(this.createdDate);		
        cntConstrWorkItemTaskDTO.setStatus(this.status);		
        cntConstrWorkItemTaskDTO.setDescription(this.description);		
        cntConstrWorkItemTaskDTO.setPrice(this.price);		
        cntConstrWorkItemTaskDTO.setUnitPrice(this.unitPrice);		
        cntConstrWorkItemTaskDTO.setQuantity(this.quantity);		
        cntConstrWorkItemTaskDTO.setCatUnitId(this.catUnitId);		
        cntConstrWorkItemTaskDTO.setCatTaskId(this.catTaskId);		
        cntConstrWorkItemTaskDTO.setWorkItemId(this.workItemId);		
        cntConstrWorkItemTaskDTO.setCntContractId(this.cntContractId);		
        cntConstrWorkItemTaskDTO.setCntConstrWorkItemTaskId(this.cntConstrWorkItemTaskId);
        cntConstrWorkItemTaskDTO.setSynStatus(this.synStatus);
        //hienvd: ADD 7/9/2019
		cntConstrWorkItemTaskDTO.setStationHTCT(this.stationHTCT);
		//hienvd: END 7/9/2019

        return cntConstrWorkItemTaskDTO;
    }
}
