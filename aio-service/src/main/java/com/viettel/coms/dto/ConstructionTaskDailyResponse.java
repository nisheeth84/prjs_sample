package com.viettel.coms.dto;

import java.util.List;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;

public class ConstructionTaskDailyResponse {
	private ResultInfo resultInfo;
	private List<ConstructionImageInfo> listImage;

	public ResultInfo getResultInfo() {
		return resultInfo;
	}

	public void setResultInfo(ResultInfo resultInfo) {
		this.resultInfo = resultInfo;
	}

	public List<ConstructionImageInfo> getListImage() {
		return listImage;
	}

	public void setListImage(List<ConstructionImageInfo> listImage) {
		this.listImage = listImage;
	}

}
