package com.viettel.aio.dto;

import java.util.List;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.coms.dto.UtilAttachDocumentDTO;

public class AIOProductMobileResponse {
	private ResultInfo resultInfo;
	private List<AIOProductInfoDTO> lstProductInfoDTO;
	private List<AIOAreaDTO> areaProvinceCity;
	private List<UtilAttachDocumentDTO> lstImageInfo;
	private Double amountStock;

	public Double getAmountStock() {
		return amountStock;
	}

	public void setAmountStock(Double amountStock) {
		this.amountStock = amountStock;
	}

	public List<UtilAttachDocumentDTO> getLstImageInfo() {
		return lstImageInfo;
	}

	public void setLstImageInfo(List<UtilAttachDocumentDTO> lstImageInfo) {
		this.lstImageInfo = lstImageInfo;
	}

	public List<AIOAreaDTO> getAreaProvinceCity() {
		return areaProvinceCity;
	}

	public void setAreaProvinceCity(List<AIOAreaDTO> areaProvinceCity) {
		this.areaProvinceCity = areaProvinceCity;
	}

	public ResultInfo getResultInfo() {
		return resultInfo;
	}

	public void setResultInfo(ResultInfo resultInfo) {
		this.resultInfo = resultInfo;
	}

	public List<AIOProductInfoDTO> getLstProductInfoDTO() {
		return lstProductInfoDTO;
	}

	public void setLstProductInfoDTO(List<AIOProductInfoDTO> lstProductInfoDTO) {
		this.lstProductInfoDTO = lstProductInfoDTO;
	}

}
