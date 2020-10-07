package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

import java.util.List;

public class StockTransResponse {
    private ResultInfo resultInfo;
    private CountConstructionTaskDTO countStockTrans;
    private List<SynStockTransDTO> lstSynStockTransDto;
    private List<SynStockTransDetailDTO> lstSynStockTransDetail;
    private List<MerEntityDTO> lstMerEntity;

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public CountConstructionTaskDTO getCountStockTrans() {
        return countStockTrans;
    }

    public void setCountStockTrans(CountConstructionTaskDTO countStockTrans) {
        this.countStockTrans = countStockTrans;
    }

    public List<SynStockTransDTO> getLstSynStockTransDto() {
        return lstSynStockTransDto;
    }

    public void setLstSynStockTransDto(List<SynStockTransDTO> lstSynStockTransDto) {
        this.lstSynStockTransDto = lstSynStockTransDto;
    }

    public List<SynStockTransDetailDTO> getLstSynStockTransDetail() {
        return lstSynStockTransDetail;
    }

    public void setLstSynStockTransDetail(List<SynStockTransDetailDTO> lstSynStockTransDetail) {
        this.lstSynStockTransDetail = lstSynStockTransDetail;
    }

    public List<MerEntityDTO> getLstMerEntity() {
        return lstMerEntity;
    }

    public void setLstMerEntity(List<MerEntityDTO> lstMerEntity) {
        this.lstMerEntity = lstMerEntity;
    }

}
