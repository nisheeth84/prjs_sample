package com.viettel.aio.dto;

import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

//VietNT_20190308_create
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPackageRequest {

    private AIOPackageDTO aioPackageDTO;
    private List<AIOPackageDetailDTO> detailDTOS;

    public AIOPackageDTO getAioPackageDTO() {
        return aioPackageDTO;
    }

    public void setAioPackageDTO(AIOPackageDTO aioPackageDTO) {
        this.aioPackageDTO = aioPackageDTO;
    }

    public List<AIOPackageDetailDTO> getDetailDTOS() {
        return detailDTOS;
    }

    public void setDetailDTOS(List<AIOPackageDetailDTO> detailDTOS) {
        this.detailDTOS = detailDTOS;
    }
}
