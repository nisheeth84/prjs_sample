package com.viettel.aio.dto;

import com.viettel.aio.bo.ProjectContractBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.utils.CustomJsonDateDeserializer;
import com.viettel.utils.CustomJsonDateSerializer;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@SuppressWarnings("serial")
@XmlRootElement(name = "ProjectContractDTO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class ProjectContractDTO extends ComsBaseFWDTO<ProjectContractBO> {

	private Long projectContractId;
	private String code;
	private String name;
	private String description;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date startDate;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date endDate;
	private Long status;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date createdDate;
	private Long createdUserId;
	private String createdUserName;
	private Long createdGroupId;
	private String createdGroupName;
	@JsonDeserialize(using = CustomJsonDateDeserializer.class)
	@JsonSerialize(using = CustomJsonDateSerializer.class)
	private java.util.Date updatedDate;
	private Long updatedUserId;
	private String updatedUserName;
	private Long updatedGroupId;
	private String updatedGroupName;
	private List <UtilAttachDocumentDTO> fileLst;

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

	@Override
	public String catchName() {
		return projectContractId.toString();
	}

	@Override
	public Long getFWModelId() {
		return projectContractId;
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

	public String getCreatedUserName() {
		return createdUserName;
	}

	public void setCreatedUserName(String createdUserName) {
		this.createdUserName = createdUserName;
	}

	public Long getCreatedGroupId() {
		return createdGroupId;
	}

	public void setCreatedGroupId(Long createdGroupId) {
		this.createdGroupId = createdGroupId;
	}

	public String getCreatedGroupName() {
		return createdGroupName;
	}

	public void setCreatedGroupName(String createdGroupName) {
		this.createdGroupName = createdGroupName;
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

	public String getUpdatedUserName() {
		return updatedUserName;
	}

	public void setUpdatedUserName(String updatedUserName) {
		this.updatedUserName = updatedUserName;
	}

	public Long getUpdatedGroupId() {
		return updatedGroupId;
	}

	public void setUpdatedGroupId(Long updatedGroupId) {
		this.updatedGroupId = updatedGroupId;
	}

	public String getUpdatedGroupName() {
		return updatedGroupName;
	}

	public void setUpdatedGroupName(String updatedGroupName) {
		this.updatedGroupName = updatedGroupName;
	}

	@Override
	public ProjectContractBO toModel() {
		ProjectContractBO bo = new ProjectContractBO();
		bo.setProjectContractId(projectContractId);
		bo.setCode(code);
		bo.setName(name);
		bo.setStartDate(startDate);
		bo.setEndDate(endDate);
		bo.setStatus(status);
		bo.setDescription(description);
		bo.setCreatedDate(createdDate);
		bo.setCreatedGroupId(createdGroupId);
		bo.setCreatedUserId(createdUserId);
		bo.setUpdatedDate(updatedDate);
		bo.setUpdatedUserId(updatedUserId);
		bo.setUpdatedGroupId(updatedGroupId);
		return bo;
	}

	public List <UtilAttachDocumentDTO> getFileLst() {
		return fileLst;
	}

	public void setFileLst(List <UtilAttachDocumentDTO> fileLst) {
		this.fileLst = fileLst;
	}
}
