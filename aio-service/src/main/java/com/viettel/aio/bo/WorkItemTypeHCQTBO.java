package com.viettel.aio.bo;

import com.viettel.aio.dto.WorkItemTypeHCQTDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.WorkItemTypeHCQTBO")
@Table(name = "WORK_ITEM_TYPE_HCQT")

public class WorkItemTypeHCQTBO extends BaseFWModelImpl {
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "WORK_ITEM_TYPE_HCQT_SEQ") })
	@Column(name = "WORK_ITEM_TYPE_ID", length = 22)
	private Long workItemTypeId;
	@Column(name = "WORK_ITEM_TYPE_NAME", length = 500)
	private String workItemTypeName;
	@Column(name = "WORK_ITEM_TYPE_CODE", length = 400)
	private String workItemTypeCode;
	@Column(name = "STATUS", length = 2)
	private Long status;

	public Long getWorkItemTypeId() {
		return workItemTypeId;
	}

	public void setWorkItemTypeId(Long workItemTypeId) {
		this.workItemTypeId = workItemTypeId;
	}

	public String getWorkItemTypeName() {
		return workItemTypeName;
	}

	public void setWorkItemTypeName(String workItemTypeName) {
		this.workItemTypeName = workItemTypeName;
	}

	public String getWorkItemTypeCode() {
		return workItemTypeCode;
	}

	public void setWorkItemTypeCode(String workItemTypeCode) {
		this.workItemTypeCode = workItemTypeCode;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	@Override
    public WorkItemTypeHCQTDTO toDTO() {
		WorkItemTypeHCQTDTO workItemTypeHCQTDTO = new WorkItemTypeHCQTDTO();
		workItemTypeHCQTDTO.setWorkItemTypeId(this.getWorkItemTypeId());
		workItemTypeHCQTDTO.setWorkItemTypeCode(this.getWorkItemTypeCode());
		workItemTypeHCQTDTO.setWorkItemTypeName(this.getWorkItemTypeName());
		workItemTypeHCQTDTO.setStatus(this.getStatus());
        return workItemTypeHCQTDTO;
    }
}
