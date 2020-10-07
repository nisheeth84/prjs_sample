package com.viettel.aio.bo;

import com.viettel.aio.dto.WorkItemHCQTDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

@SuppressWarnings("serial")
@Entity(name = "com.viettel.erp.bo.WorkItemHCQTBO")
@Table(name = "WORK_ITEM_HCQT")

public class WorkItemHCQTBO extends BaseFWModelImpl {
	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "WORK_ITEM_HCQT_SEQ") })

	@Column(name = "WORK_ITEM_ID", length = 22)
	private Long workItemId;
	@Column(name = "WORK_ITEM_TYPE_ID", length = 22)
	private Long workItemTypeId;
	@Column(name = "WORK_ITEM_NAME", length = 500)
	private String workItemName;
	@Column(name = "WORK_ITEM_CODE", length = 400)
	private String workItemCode;
	@Column(name = "STATUS", length = 2)
	private Long status;

	public Long getWorkItemId() {
		return workItemId;
	}

	public void setWorkItemId(Long workItemId) {
		this.workItemId = workItemId;
	}

	public Long getWorkItemTypeId() {
		return workItemTypeId;
	}

	public void setWorkItemTypeId(Long workItemTypeId) {
		this.workItemTypeId = workItemTypeId;
	}

	public String getWorkItemName() {
		return workItemName;
	}

	public void setWorkItemName(String workItemName) {
		this.workItemName = workItemName;
	}

	public String getWorkItemCode() {
		return workItemCode;
	}

	public void setWorkItemCode(String workItemCode) {
		this.workItemCode = workItemCode;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	@Override
    public WorkItemHCQTDTO toDTO() {
		WorkItemHCQTDTO workItemHCQTDTO = new WorkItemHCQTDTO();
		workItemHCQTDTO.setWorkItemId(this.getWorkItemId());
		workItemHCQTDTO.setWorkItemCode(this.getWorkItemCode());
		workItemHCQTDTO.setWorkItemName(this.getWorkItemName());
		workItemHCQTDTO.setStatus(this.getStatus());
		workItemHCQTDTO.setWorkItemTypeId(this.getWorkItemTypeId());
        return workItemHCQTDTO;
    }
}
