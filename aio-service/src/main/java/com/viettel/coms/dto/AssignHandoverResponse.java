package com.viettel.coms.dto;

import java.util.List;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;

public class AssignHandoverResponse {
	private ResultInfo resultInfo;
	private List<AssignHandoverDTO> assignHandoverDTO;
	private Double totalRecordNotReceived;
	private Double totalRecordReceived;
	private List<ConstructionImageInfo> constructionImageInfo;
	private List<AppParamDTO> houseType;
	private List<AppParamDTO> groundingType;
	
	public List<AppParamDTO> getHouseType() {
		return houseType;
	}

	public void setHouseType(List<AppParamDTO> houseType) {
		this.houseType = houseType;
	}

	public List<AppParamDTO> getGroundingType() {
		return groundingType;
	}

	public void setGroundingType(List<AppParamDTO> groundingType) {
		this.groundingType = groundingType;
	}

	public Double getTotalRecordNotReceived() {
		return totalRecordNotReceived;
	}

	public void setTotalRecordNotReceived(Double totalRecordNotReceived) {
		this.totalRecordNotReceived = totalRecordNotReceived;
	}

	public Double getTotalRecordReceived() {
		return totalRecordReceived;
	}

	public void setTotalRecordReceived(Double totalRecordReceived) {
		this.totalRecordReceived = totalRecordReceived;
	}

	public List<AssignHandoverDTO> getAssignHandoverDTO() {
		return assignHandoverDTO;
	}

	public void setAssignHandoverDTO(List<AssignHandoverDTO> assignHandoverDTO) {
		this.assignHandoverDTO = assignHandoverDTO;
	}

	public ResultInfo getResultInfo() {
		return resultInfo;
	}

	public void setResultInfo(ResultInfo resultInfo) {
		this.resultInfo = resultInfo;
	}

	public List<ConstructionImageInfo> getConstructionImageInfo() {
		return constructionImageInfo;
	}

	public void setConstructionImageInfo(
			List<ConstructionImageInfo> constructionImageInfo) {
		this.constructionImageInfo = constructionImageInfo;
	}

}
