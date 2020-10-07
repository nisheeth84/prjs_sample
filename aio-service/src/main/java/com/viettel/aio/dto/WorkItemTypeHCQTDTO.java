package com.viettel.aio.dto;

import com.viettel.aio.bo.WorkItemTypeHCQTBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author hienvd
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "WORK_ITEM_TYPE_HCQTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class WorkItemTypeHCQTDTO extends ComsBaseFWDTO<WorkItemTypeHCQTBO> {

	private Long workItemTypeId;
	private String workItemTypeCode;
	private String workItemTypeName;
	private Long status;
	
	
	
	public Long getWorkItemTypeId() {
		return workItemTypeId;
	}

	public void setWorkItemTypeId(Long workItemTypeId) {
		this.workItemTypeId = workItemTypeId;
	}

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

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	@Override
	public String catchName() {
		// TODO Auto-generated method stub
		return workItemTypeId.toString();
	}

	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return workItemTypeId;
	}

	@Override
	public WorkItemTypeHCQTBO toModel() {
		WorkItemTypeHCQTBO bo = new WorkItemTypeHCQTBO();
		// TODO Auto-generated method stub
		bo.setWorkItemTypeId(this.getWorkItemTypeId());
		bo.setWorkItemTypeCode(this.getWorkItemTypeCode());
		bo.setWorkItemTypeName(this.getWorkItemTypeName());
		bo.setStatus(this.getStatus());
		return bo;
	}

}
