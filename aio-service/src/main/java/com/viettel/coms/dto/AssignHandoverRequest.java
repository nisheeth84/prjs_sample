package com.viettel.coms.dto;

import java.util.List;

import com.viettel.cat.dto.ConstructionImageInfo;

public class AssignHandoverRequest {
	private AssignHandoverDTO assignHandoverDTO;
	private Long sysUserId;
	private String employeeCode;
	private String fullName;
	private String email;
	private String keySearch;
	private String status;
	private String rowNum;
	private Long assignHandoverId;
	private List<ConstructionImageInfo> constructionImageInfo;

	public List<ConstructionImageInfo> getConstructionImageInfo() {
		return constructionImageInfo;
	}

	public void setConstructionImageInfo(
			List<ConstructionImageInfo> constructionImageInfo) {
		this.constructionImageInfo = constructionImageInfo;
	}

	public String getRowNum() {
		return rowNum;
	}

	public void setRowNum(String rowNum) {
		this.rowNum = rowNum;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getKeySearch() {
		return keySearch;
	}

	public void setKeySearch(String keySearch) {
		this.keySearch = keySearch;
	}

	public AssignHandoverDTO getAssignHandoverDTO() {
		return assignHandoverDTO;
	}

	public void setAssignHandoverDTO(AssignHandoverDTO assignHandoverDTO) {
		this.assignHandoverDTO = assignHandoverDTO;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Long getSysUserId() {
		return sysUserId;
	}

	public void setSysUserId(Long sysUserId) {
		this.sysUserId = sysUserId;
	}

	public String getEmployeeCode() {
		return employeeCode;
	}

	public void setEmployeeCode(String employeeCode) {
		this.employeeCode = employeeCode;
	}

	public Long getAssignHandoverId() {
		return assignHandoverId;
	}

	public void setAssignHandoverId(Long assignHandoverId) {
		this.assignHandoverId = assignHandoverId;
	}

}
