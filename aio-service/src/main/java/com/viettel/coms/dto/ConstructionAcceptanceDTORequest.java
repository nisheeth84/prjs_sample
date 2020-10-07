package com.viettel.coms.dto;

import com.viettel.cat.dto.ConstructionImageInfo;

import java.util.List;

public class ConstructionAcceptanceDTORequest {
    private SysUserRequest sysUserRequest;

    private ConstructionAcceptanceCertDTO constructionAcceptanceCertDTO;

    private ConstructionAcceptanceCertDetailDTO constructionAcceptanceCertDetailDTO;

    private List<ConstructionAcceptanceCertDetailVTADTO> listDSVTA;
    private List<ConstructionAcceptanceCertDetailVTADTO> listDSTBA;
    private List<ConstructionAcceptanceCertDetailVTBDTO> listDSVTB;
    private List<ConstructionAcceptanceCertDetailVTBDTO> listDSTBB;

    //
    private List<ConstructionImageInfo> listImage;

    ///

    public List<ConstructionAcceptanceCertDetailVTBDTO> getListDSVTB() {
        return listDSVTB;
    }

    public List<ConstructionImageInfo> getListImage() {
        return listImage;
    }

    public void setListImage(List<ConstructionImageInfo> listImage) {
        this.listImage = listImage;
    }

    public void setListDSVTB(List<ConstructionAcceptanceCertDetailVTBDTO> listDSVTB) {
        this.listDSVTB = listDSVTB;
    }

    public List<ConstructionAcceptanceCertDetailVTBDTO> getListDSTBB() {
        return listDSTBB;
    }

    public void setListDSTBB(List<ConstructionAcceptanceCertDetailVTBDTO> listDSTBB) {
        this.listDSTBB = listDSTBB;
    }

    public List<ConstructionAcceptanceCertDetailVTADTO> getListDSTBA() {
        return listDSTBA;
    }

    public void setListDSTBA(List<ConstructionAcceptanceCertDetailVTADTO> listDSTBA) {
        this.listDSTBA = listDSTBA;
    }

    public List<ConstructionAcceptanceCertDetailVTADTO> getListDSVTA() {
        return listDSVTA;
    }

    public void setListDSVTA(List<ConstructionAcceptanceCertDetailVTADTO> listDSVTA) {
        this.listDSVTA = listDSVTA;
    }

    public ConstructionAcceptanceCertDetailDTO getConstructionAcceptanceCertDetailDTO() {
        return constructionAcceptanceCertDetailDTO;
    }

    public void setConstructionAcceptanceCertDetailDTO(
            ConstructionAcceptanceCertDetailDTO constructionAcceptanceCertDetailDTO) {
        this.constructionAcceptanceCertDetailDTO = constructionAcceptanceCertDetailDTO;
    }

    public SysUserRequest getSysUserRequest() {
        return sysUserRequest;
    }

    public void setSysUserRequest(SysUserRequest sysUserRequest) {
        this.sysUserRequest = sysUserRequest;
    }

    public ConstructionAcceptanceCertDTO getConstructionAcceptanceCertDTO() {
        return constructionAcceptanceCertDTO;
    }

    public void setConstructionAcceptanceCertDTO(ConstructionAcceptanceCertDTO constructionAcceptanceCertDTO) {
        this.constructionAcceptanceCertDTO = constructionAcceptanceCertDTO;
    }

}
