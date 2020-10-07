package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOErrorDetailBO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class AIOErrorDetailDTO extends BaseFWDTOImpl<AIOErrorDetailBO> {

    private Long aioErrorDetailId;
    private Long aioErrorId;
    private String contentPerformer;
    private Long errorHandlingStep;
    private String aioErrorName;
    private String aioErrorDetailName;
    private UtilAttachDocumentDTO image;
    private String imgPath;
    private String imgName;

    public UtilAttachDocumentDTO getImage() {
        return image;
    }

    public void setImage(UtilAttachDocumentDTO image) {
        this.image = image;
    }

    public String getImgPath() {
        return imgPath;
    }

    public void setImgPath(String imgPath) {
        this.imgPath = imgPath;
    }

    public String getImgName() {
        return imgName;
    }

    public void setImgName(String imgName) {
        this.imgName = imgName;
    }

    public Long getErrorHandlingStep() {
        return errorHandlingStep;
    }

    public void setErrorHandlingStep(Long errorHandlingStep) {
        this.errorHandlingStep = errorHandlingStep;
    }

    public Long getAioErrorDetailId() {
        return aioErrorDetailId;
    }

    public void setAioErrorDetailId(Long aioErrorDetailId) {
        this.aioErrorDetailId = aioErrorDetailId;
    }

    public String getAioErrorDetailName() {
        return aioErrorDetailName;
    }

    public void setAioErrorDetailName(String aioErrorDetailName) {
        this.aioErrorDetailName = aioErrorDetailName;
    }

    public Long getAioErrorId() {
        return aioErrorId;
    }

    public void setAioErrorId(Long aioErrorId) {
        this.aioErrorId = aioErrorId;
    }

    public String getAioErrorName() {
        return aioErrorName;
    }

    public void setAioErrorName(String aioErrorName) {
        this.aioErrorName = aioErrorName;
    }

    public String getContentPerformer() {
        return contentPerformer;
    }

    public void setContentPerformer(String contentPerformer) {
        this.contentPerformer = contentPerformer;
    }

    public List<UtilAttachDocumentDTO> listImageError;

    public List<UtilAttachDocumentDTO> getListImageError() {
        return listImageError;
    }

    public void setListImageError(List<UtilAttachDocumentDTO> listImageError) {
        this.listImageError = listImageError;
    }

    @Override
    public AIOErrorDetailBO toModel() {
        AIOErrorDetailBO aioErrorDetailBO = new AIOErrorDetailBO();
        aioErrorDetailBO.setAioErrorDetailId(this.aioErrorDetailId);
        aioErrorDetailBO.setAioErrorId(this.aioErrorId);
        aioErrorDetailBO.setContentPerformer(this.contentPerformer);
        aioErrorDetailBO.setErrorHandlingStep(this.errorHandlingStep);
        return aioErrorDetailBO;
    }

    @Override
    public Long getFWModelId() {
        return null;
    }

    @Override
    public String catchName() {
        return null;
    }

}
