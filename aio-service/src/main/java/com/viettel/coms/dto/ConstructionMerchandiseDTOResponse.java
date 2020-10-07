package com.viettel.coms.dto;

import com.viettel.asset.dto.ResultInfo;
import com.viettel.cat.dto.ConstructionImageInfo;

import java.util.List;

public class ConstructionMerchandiseDTOResponse {
    private ResultInfo resultInfo;
    private SysUserRequest sysUser;
    private List<ConstructionMerchandiseDetailDTO> listConstructionMerchandisePagesDTO;
    private List<ConstructionMerchandiseDetailDTO> listConstructionMerchandiseWorkItemPagesDTO;
    private List<ConstructionMerchandiseDetailVTDTO> listConstructionMerchandiseVT;
    private List<ConstructionMerchandiseDetailVTDTO> listConstructionMerchandiseTB;

    private List<ConstructionImageInfo> listImage;

    private Long numberNoConstructionReturn;
    private Long numberConstructionReturn;

    public Long getNumberNoConstructionReturn() {
        return numberNoConstructionReturn;
    }

    public void setNumberNoConstructionReturn(Long numberNoConstructionReturn) {
        this.numberNoConstructionReturn = numberNoConstructionReturn;
    }

    public Long getNumberConstructionReturn() {
        return numberConstructionReturn;
    }

    public void setNumberConstructionReturn(Long numberConstructionReturn) {
        this.numberConstructionReturn = numberConstructionReturn;
    }

    public List<ConstructionImageInfo> getListImage() {
        return listImage;
    }

    public void setListImage(List<ConstructionImageInfo> listImage) {
        this.listImage = listImage;
    }

    public List<ConstructionMerchandiseDetailDTO> getListConstructionMerchandiseWorkItemPagesDTO() {
        return listConstructionMerchandiseWorkItemPagesDTO;
    }

    public void setListConstructionMerchandiseWorkItemPagesDTO(
            List<ConstructionMerchandiseDetailDTO> listConstructionMerchandiseWorkItemPagesDTO) {
        this.listConstructionMerchandiseWorkItemPagesDTO = listConstructionMerchandiseWorkItemPagesDTO;
    }

    public List<ConstructionMerchandiseDetailVTDTO> getListConstructionMerchandiseVT() {
        return listConstructionMerchandiseVT;
    }

    public void setListConstructionMerchandiseVT(
            List<ConstructionMerchandiseDetailVTDTO> listConstructionMerchandiseVT) {
        this.listConstructionMerchandiseVT = listConstructionMerchandiseVT;
    }

    public List<ConstructionMerchandiseDetailVTDTO> getListConstructionMerchandiseTB() {
        return listConstructionMerchandiseTB;
    }

    public void setListConstructionMerchandiseTB(
            List<ConstructionMerchandiseDetailVTDTO> listConstructionMerchandiseTB) {
        this.listConstructionMerchandiseTB = listConstructionMerchandiseTB;
    }

    public List<ConstructionMerchandiseDetailDTO> getListConstructionMerchandisePagesDTO() {
        return listConstructionMerchandisePagesDTO;
    }

    public void setListConstructionMerchandisePagesDTO(
            List<ConstructionMerchandiseDetailDTO> listConstructionMerchandisePagesDTO) {
        this.listConstructionMerchandisePagesDTO = listConstructionMerchandisePagesDTO;
    }

    public SysUserRequest getSysUser() {
        return sysUser;
    }

    public void setSysUser(SysUserRequest sysUser) {
        this.sysUser = sysUser;
    }

    public ResultInfo getResultInfo() {
        return resultInfo;
    }

    public void setResultInfo(ResultInfo resultInfo) {
        this.resultInfo = resultInfo;
    }
}
