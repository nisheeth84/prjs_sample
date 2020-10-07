package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOCommonMistakeRequest extends AIOBaseRequest {
    private Long idConfigService;
    private String contentError;
    private Long idError;
    private String industryCode;
    private Long status;
    private AIOErrorDTO aioErrorDTO;
    private List<AIOErrorDetailDTO> aioErrorDetailDTOList;

    public List<AIOErrorDetailDTO> getAioErrorDetailDTOList() {
        return aioErrorDetailDTOList;
    }

    public void setAioErrorDetailDTOList(List<AIOErrorDetailDTO> aioErrorDetailDTOList) {
        this.aioErrorDetailDTOList = aioErrorDetailDTOList;
    }

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public AIOErrorDTO getAioErrorDTO() {
        return aioErrorDTO;
    }

    public void setAioErrorBO(AIOErrorDTO aioErrorBO) {
        this.aioErrorDTO = aioErrorDTO;
    }


    public Long getIdConfigService() {
        return idConfigService;
    }

    public void setIdConfigService(Long idConfigService) {
        this.idConfigService = idConfigService;
    }

    public String getContentError() {
        return contentError;
    }

    public void setContentError(String contentError) {
        this.contentError = contentError;
    }

    public Long getIdError() {
        return idError;
    }

    public void setIdError(Long idError) {
        this.idError = idError;
    }

    public AIOCommonMistakeRequest(Long idConfigService, String contentError, Long idError) {
        this.idConfigService = idConfigService;
        this.contentError = contentError;
        this.idError = idError;
    }

    public AIOCommonMistakeRequest() {
    }
}
