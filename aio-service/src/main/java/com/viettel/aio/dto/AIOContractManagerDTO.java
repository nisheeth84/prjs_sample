package com.viettel.aio.dto;

import com.viettel.coms.dto.AppParamDTO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_CONTRACT_MANAGERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOContractManagerDTO {

    private List<AppParamDTO> serviceList;
    private List<AppParamDTO> areaList;
    private List<AppParamDTO> provinceList;
    private List<AppParamDTO> speciesList;
    private List<AppParamDTO> aioAreaListLv2;
    private List<AppParamDTO> appParamList;
    private Long contractId;

    private List<AIOContractDetailDTO> detailDTOS;
    private AIOCustomerDTO customerDTOS;
    private AIOContractDTO contractDTO;
    private List<AIOConfigServiceDTO> ddData;

    public List<AIOConfigServiceDTO> getDdData() {
        return ddData;
    }

    public void setDdData(List<AIOConfigServiceDTO> ddData) {
        this.ddData = ddData;
    }

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

    //VietNT_20190409_start
    private List<UtilAttachDocumentDTO> imageDTOS;

    public List<UtilAttachDocumentDTO> getImageDTOS() {
        return imageDTOS;
    }

    public void setImageDTOS(List<UtilAttachDocumentDTO> imageDTOS) {
        this.imageDTOS = imageDTOS;
    }
    //VietNT_end

    public AIOContractDTO getContractDTO() {
        return contractDTO;
    }

    public void setContractDTO(AIOContractDTO contractDTO) {
        this.contractDTO = contractDTO;
    }

    public List<AIOContractDetailDTO> getDetailDTOS() {
        return detailDTOS;
    }

    public void setDetailDTOS(List<AIOContractDetailDTO> detailDTOS) {
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
}
