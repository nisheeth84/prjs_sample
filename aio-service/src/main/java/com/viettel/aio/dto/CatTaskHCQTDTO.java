package com.viettel.aio.dto;

import com.viettel.aio.bo.CatTaskHCQTBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author HIENVD
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CAT_TASK_HCQTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatTaskHCQTDTO extends ComsBaseFWDTO<CatTaskHCQTBO> {

	private Long catTaskId;
	private String catTaskCode;
	private String catTaskName;
	private Long workItemId;
	private Long status;
	private String workItemName;
	//Huypq-20190815-start
	private String priorityTask;
	
	public String getPriorityTask() {
		return priorityTask;
	}
	public void setPriorityTask(String priorityTask) {
		this.priorityTask = priorityTask;
	}
	//Huypq-end
	public String getWorkItemName() {
		return workItemName;
	}
	public void setWorkItemName(String workItemName) {
		this.workItemName = workItemName;
	}
	public Long getCatTaskId() {
		return catTaskId;
	}
	public void setCatTaskId(Long catTaskId) {
		this.catTaskId = catTaskId;
	}
	public String getCatTaskCode() {
		return catTaskCode;
	}
	public void setCatTaskCode(String catTaskCode) {
		this.catTaskCode = catTaskCode;
	}
	public String getCatTaskName() {
		return catTaskName;
	}
	public void setCatTaskName(String catTaskName) {
		this.catTaskName = catTaskName;
	}
	public Long getWorkItemId() {
		return workItemId;
	}
	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
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
		return catTaskId.toString();
	}
	@Override
	public Long getFWModelId() {
		// TODO Auto-generated method stub
		return catTaskId;
	}
	@Override
	public CatTaskHCQTBO toModel() {
		// TODO Auto-generated method stub
		CatTaskHCQTBO bo = new CatTaskHCQTBO();
		bo.setCatTaskId(this.getCatTaskId());
		bo.setCatTaskCode(this.getCatTaskCode());
		bo.setCatTaskName(this.getCatTaskName());
		bo.setWorkItemId(this.getWorkItemId());
		bo.setStatus(this.getStatus());
		bo.setPriorityTask(this.priorityTask);
		return bo;
	}
	
	
}
