package com.viettel.aio.dto;

import com.viettel.asset.dto.ResultInfo;

import java.util.List;

public class AIOStockTransResponse {
	private ResultInfo resultInfo;
	private AIOCountConstructionTaskDTO countStockTrans;
	private List<AIOSynStockTransDTO> lstSynStockTransDto;
	private List<AIOSynStockTransDetailDTO> lstSynStockTransDetail;
	private List<AIOMerEntityDTO> lstMerEntity;
	private List<AIORevenueDTO> lstStockGood;

	private AIORevenueDTO revenueDTO;
	private List<AIORevenueDTO> lstRevenueDTO;
	// hoanm1_20190420_start
	private AIOSynStockTransDTO synStockTransDto;

	public AIOSynStockTransDTO getSynStockTransDto() {
		return synStockTransDto;
	}

	public void setSynStockTransDto(AIOSynStockTransDTO synStockTransDto) {
		this.synStockTransDto = synStockTransDto;
	}

	// hoanm1_20190420_end
	public List<AIORevenueDTO> getLstRevenueDTO() {
		return lstRevenueDTO;
	}

	public void setLstRevenueDTO(List<AIORevenueDTO> lstRevenueDTO) {
		this.lstRevenueDTO = lstRevenueDTO;
	}

	public AIORevenueDTO getRevenueDTO() {
		return revenueDTO;
	}

	public void setRevenueDTO(AIORevenueDTO revenueDTO) {
		this.revenueDTO = revenueDTO;
	}

	public ResultInfo getResultInfo() {
		return resultInfo;
	}

	public void setResultInfo(ResultInfo resultInfo) {
		this.resultInfo = resultInfo;
	}

	public AIOCountConstructionTaskDTO getCountStockTrans() {
		return countStockTrans;
	}

	public void setCountStockTrans(AIOCountConstructionTaskDTO countStockTrans) {
		this.countStockTrans = countStockTrans;
	}

	public List<AIOSynStockTransDTO> getLstSynStockTransDto() {
		return lstSynStockTransDto;
	}

	public void setLstSynStockTransDto(
			List<AIOSynStockTransDTO> lstSynStockTransDto) {
		this.lstSynStockTransDto = lstSynStockTransDto;
	}

	public List<AIOSynStockTransDetailDTO> getLstSynStockTransDetail() {
		return lstSynStockTransDetail;
	}

	public void setLstSynStockTransDetail(
			List<AIOSynStockTransDetailDTO> lstSynStockTransDetail) {
		this.lstSynStockTransDetail = lstSynStockTransDetail;
	}

	public List<AIOMerEntityDTO> getLstMerEntity() {
		return lstMerEntity;
	}

	public void setLstMerEntity(List<AIOMerEntityDTO> lstMerEntity) {
		this.lstMerEntity = lstMerEntity;
	}

	public List<AIORevenueDTO> getLstStockGood() {
		return lstStockGood;
	}

	public void setLstStockGood(List<AIORevenueDTO> lstStockGood) {
		this.lstStockGood = lstStockGood;
	}

}
