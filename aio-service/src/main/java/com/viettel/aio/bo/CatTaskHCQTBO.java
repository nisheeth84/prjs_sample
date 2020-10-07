package com.viettel.aio.bo;

import com.viettel.aio.dto.CatTaskHCQTDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.ims.bo.CatTaskHcqtBO")
@Table(name = "CAT_TASK_HCQT")
public class CatTaskHCQTBO extends BaseFWModelImpl{
	
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "CAT_TASK_HCQT_SEQ") })
	@Column(name = "CAT_TASK_ID", length = 38)
	private Long catTaskId;
	@Column(name = "CAT_TASK_CODE", length = 50)
	private String catTaskCode;
	@Column(name = "CAT_TASK_NAME", length = 50)
	private String catTaskName;
	@Column(name = "WORK_ITEM_ID", length = 38)
	private Long workItemId;
	@Column(name = "STATUS", length = 2)
	private Long status;
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
	
	//Huypq-20190815-start
	@Column(name = "PRIORITY_TASK")
	private String priorityTask;
	
	public String getPriorityTask() {
		return priorityTask;
	}
	public void setPriorityTask(String priorityTask) {
		this.priorityTask = priorityTask;
	}
	//Huy-end
	@Override
	public BaseFWDTOImpl toDTO() {
		// TODO Auto-generated method stub
		CatTaskHCQTDTO dto = new CatTaskHCQTDTO();
		dto.setCatTaskId(this.getCatTaskId());
		dto.setCatTaskCode(this.getCatTaskCode());
		dto.setCatTaskName(this.getCatTaskName());
		dto.setWorkItemId(this.getWorkItemId());
		dto.setStatus(this.getStatus());
		dto.setPriorityTask(this.priorityTask);
		return dto;
	}
	
	
}
