package com.viettel.aio.dto;

import com.viettel.aio.bo.WorkItemHCQTBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author hienvd
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "WORK_ITEM_HCQTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkItemHCQTDTO extends ComsBaseFWDTO<WorkItemHCQTBO> {

	
	private Long workItemId;
	private String workItemCode;
	private String workItemName;
	private Long workItemTypeId;
	private Long status;
	private String workItemTypeCode;
	private String  workItemTypeName;
	
	public String getWorkItemTypeCode() {
		return workItemTypeCode;
	}

	public void setWorkItemTypeCode(String workItemTypeCode) {
		this.workItemTypeCode = workItemTypeCode;
	}

	public String getWorkItemTypeName() {
		return workItemTypeName;
	}

	public void setWorkItemTypeName(String workItemTypeName) {
		this.workItemTypeName = workItemTypeName;
	}

	public Long getWorkItemId() {
		return workItemId;
	}

	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
	}

	public String getWorkItemCode() {
		return workItemCode;
	}

	public void setWorkItemCode(String workItemCode) {
		this.workItemCode = workItemCode;
	}

	public String getWorkItemName() {
		return workItemName;
	}

	public void setWorkItemName(String workItemName) {
		this.workItemName = workItemName;
	}

	public Long getWorkItemTypeId() {
		return workItemTypeId;
	}

	public void setWorkItemTypeId(Long workItemTypeId) {
		this.workItemTypeId = workItemTypeId;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return workItemId.toString();
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return workItemId;
	}

	@Override
	public WorkItemHCQTBO toModel() {
		// TODO Auto-generated method stub
		WorkItemHCQTBO bo = new WorkItemHCQTBO();
		bo.setWorkItemId(this.getWorkItemId());
		bo.setWorkItemCode(this.getWorkItemCode());
		bo.setWorkItemName(this.getWorkItemName());
		bo.setWorkItemTypeId(this.getWorkItemTypeId());
		bo.setStatus(this.getStatus());
		return bo;
	}

}
