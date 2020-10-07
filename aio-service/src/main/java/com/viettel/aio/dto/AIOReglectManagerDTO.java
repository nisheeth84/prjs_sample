package com.viettel.aio.dto;

import com.viettel.aio.dto.AIOContractDTO;
import com.viettel.aio.dto.AIOContractDetailDTO;
import com.viettel.aio.dto.AIOCustomerDTO;
import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement(name = "AIO_REGLECT_MANAGERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOReglectManagerDTO {

    private List<AppParamDTO> serviceList;
    private List<AppParamDTO> areaList;
    private List<AppParamDTO> provinceList;
    private List<AppParamDTO> speciesList;
    private List<AppParamDTO> aioAreaListLv2;
    private List<AppParamDTO> appParamList;
    private Long contractId;

    private List<AIOReglectDetailDTO> detailDTOS;
    private AIOCustomerDTO customerDTOS;

    private AIOReglectDTO reglectDTO;


    public List<AppParamDTO> getAioAreaListLv2() {
        return aioAreaListLv2;
    }

    public void setAioAreaListLv2(List<AppParamDTO> aioAreaListLv2) {
        this.aioAreaListLv2 = aioAreaListLv2;
    }

    public List<AppParamDTO> getAppParamList() {
        return appParamList;
    }

    public void setAppParamList(List<AppParamDTO> appParamList) {
        this.appParamList = appParamList;
    }

    private List<UtilAttachDocumentDTO> imageDTOS;

    public List<UtilAttachDocumentDTO> getImageDTOS() {
        return imageDTOS;
    }

    public void setImageDTOS(List<UtilAttachDocumentDTO> imageDTOS) {
        this.imageDTOS = imageDTOS;
    }

    public List<AIOReglectDetailDTO> getDetailDTOS() {
        return detailDTOS;
    }

    public void setDetailDTOS(List<AIOReglectDetailDTO> detailDTOS) {
        this.detailDTOS = detailDTOS;
    }

    public AIOCustomerDTO getCustomerDTOS() {
        return customerDTOS;
    }

    public void setCustomerDTOS(AIOCustomerDTO customerDTOS) {
        this.customerDTOS = customerDTOS;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
    }

    public List<AppParamDTO> getServiceList() {
        return serviceList;
    }

    public void setServiceList(List<AppParamDTO> serviceList) {
        this.serviceList = serviceList;
    }

    public List<AppParamDTO> getAreaList() {
        return areaList;
    }

    public void setAreaList(List<AppParamDTO> areaList) {
        this.areaList = areaList;
    }

    public List<AppParamDTO> getProvinceList() {
        return provinceList;
    }

    public void setProvinceList(List<AppParamDTO> provinceList) {
        this.provinceList = provinceList;
    }

    public List<AppParamDTO> getSpeciesList() {
        return speciesList;
    }

    public void setSpeciesList(List<AppParamDTO> speciesList) {
        this.speciesList = speciesList;
    }

    public AIOReglectDTO getReglectDTO() {
        return reglectDTO;
    }

    public void setReglectDTO(AIOReglectDTO reglectDTO) {
        this.reglectDTO = reglectDTO;
    }
}
