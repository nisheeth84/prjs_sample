package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;

import java.util.List;

/**
 * @author phucvx_26/06/2018
 */
public class AppParamManageDto {
    private ResultInfo resultInfo;
    private List<AppParamDTO> listAppParam;
    private List<AppParamDTO> listDetail;
    private Double proscess;
    private Double amountPreview;
    private int confirmDaily;

    public int getConfirmDaily() {
        return confirmDaily;
    }

    public void setConfirmDaily(int confirmDaily) {
        this.confirmDaily = confirmDaily;
    }

    public Double getAmountPreview() {
        return amountPreview;
    }

    public void setAmountPreview(Double amountPreview) {
        this.amountPreview = amountPreview;
    }

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }

    public List<AppParamDTO> getListAppParam() {
        return listAppParam;
    }

    public void setListAppParam(List<AppParamDTO> listAppParam) {
        this.listAppParam = listAppParam;
    }

    public List<AppParamDTO> getListDetail() {
        return listDetail;
    }

    public Double getProscess() {
        return proscess;
    }

    public void setProscess(Double proscess) {
        this.proscess = proscess;
    }

    public void setListDetail(List<AppParamDTO> listDetail) {
        this.listDetail = listDetail;
    }

}
