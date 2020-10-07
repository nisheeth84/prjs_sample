package com.viettel.aio.bo;

import com.viettel.aio.dto.ProjectContractDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import javax.persistence.*;

/**
 * 
 * @author HUNGNX
 *
 */
@SuppressWarnings("serial")
@Entity(name = "ProjectContract")
@Table(name = "PROJECT_CONTRACT")
public class ProjectContractBO extends BaseFWModelImpl {

	@Id
	@GeneratedValue(generator = "sequence")
	@GenericGenerator(name = "sequence", strategy = "sequence", parameters = { @Parameter(name = "sequence", value = "PROJECT_CONTRACT_SEQ") })
	@Column(name = "PROJECT_CONTRACT_ID", length = 22)
	private Long projectContractId;
	@Column(name="CODE", length = 200)
	private String code;
	@Column(name = "NAME", length = 1000)
	private String name;
	@Column(name = "DESCRIPTION", length = 4000)
	private String description;
	@Column(name = "START_DATE", length = 7)
	private java.util.Date startDate;
	@Column(name = "END_DATE", length = 7)
	private java.util.Date endDate;
	@Column(name = "STATUS")
	private Long status;
	@Column(name = "CREATED_DATE", length = 7)
	private java.util.Date createdDate;
	@Column(name = "CREATED_USER_ID", length = 22)
	private Long createdUserId;
	@Column(name = "CREATED_GROUP_ID", length = 22)
	private Long createdGroupId;
	@Column(name = "UPDATED_DATE", length = 7)
	private java.util.Date updatedDate;
	@Column(name = "UPDATED_USER_ID", length = 7)
	private Long updatedUserId;
	@Column(name = "UPDATED_GROUP_ID", length = 7)
	private Long updatedGroupId;

	@Override
	public ProjectContractDTO toDTO() {
		ProjectContractDTO dto = new ProjectContractDTO();
		dto.setProjectContractId(projectContractId);
		dto.setCode(code);
		dto.setName(name);
		dto.setStartDate(startDate);
		dto.setEndDate(endDate);
		dto.setStatus(status);
		dto.setDescription(description);
		dto.setCreatedDate(createdDate);
		dto.setCreatedGroupId(createdGroupId);
		dto.setCreatedUserId(createdUserId);
		dto.setUpdatedDate(updatedDate);
		dto.setUpdatedUserId(updatedUserId);
		dto.setUpdatedGroupId(updatedGroupId);
		return dto;
	}

	public Long getProjectContractId() {
		return projectContractId;
	}

	public void setProjectContractId(Long projectContractId) {
		this.projectContractId = projectContractId;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public java.util.Date getStartDate() {
		return startDate;
	}

	public void setStartDate(java.util.Date startDate) {
		this.startDate = startDate;
	}

	public java.util.Date getEndDate() {
		return endDate;
	}

	public void setEndDate(java.util.Date endDate) {
		this.endDate = endDate;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}

	public java.util.Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(java.util.Date createdDate) {
		this.createdDate = createdDate;
	}

	public Long getCreatedUserId() {
		return createdUserId;
	}

	public void setCreatedUserId(Long createdUserId) {
		this.createdUserId = createdUserId;
	}

	public Long getCreatedGroupId() {
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId) {
		this.createdGroupId = createdGroupId;
	}

	public java.util.Date getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(java.util.Date updatedDate) {
		this.updatedDate = updatedDate;
	}

	public Long getUpdatedUserId() {
		return updatedUserId;
	}

	public void setUpdatedUserId(Long updatedUserId) {
		this.updatedUserId = updatedUserId;
	}

	public Long getUpdatedGroupId() {
		return updatedGroupId;
	}

	public void setUpdatedGroupId(Long updatedGroupId) {
		this.updatedGroupId = updatedGroupId;
	}
}
