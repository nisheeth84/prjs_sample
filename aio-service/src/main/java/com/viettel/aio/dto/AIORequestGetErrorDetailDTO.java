package com.viettel.aio.dto;

import com.viettel.coms.dao.UtilAttachDocumentDAO;
import com.viettel.coms.dto.UtilAttachDocumentDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

@XmlRootElement
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIORequestGetErrorDetailDTO {
    private Long aioErrorID;
    private String contentError;
    private Long groupErrorId;
    private Long status;
    private String groupErrorName;
    private Long aioErrorDetailId;
    private Long aioErrorId;
    private String contentPerformer;
    private String name;
    private String filePath;
    private List<UtilAttachDocumentDTO> listImage;

    public List<UtilAttachDocumentDTO> getListImage() {
        return listImage;
    }

    public void setListImage(List<UtilAttachDocumentDTO> listImage) {
        this.listImage = listImage;
    }

    public Long getAioErrorID() {
        return aioErrorID;
    }

    public void setAioErrorID(Long aioErrorID) {
        this.aioErrorID = aioErrorID;
    }

    public String getContentError() {
        return contentError;
    }

    public void setContentError(String contentError) {
        this.contentError = contentError;
    }

    public Long getGroupErrorId() {
        return groupErrorId;
    }

    public void setGroupErrorId(Long groupErrorId) {
        this.groupErrorId = groupErrorId;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public String getGroupErrorName() {
        return groupErrorName;
    }

    public void setGroupErrorName(String groupErrorName) {
        this.groupErrorName = groupErrorName;
    }

    public Long getAioErrorDetailId() {
        return aioErrorDetailId;
    }

    public void setAioErrorDetailId(Long aioErrorDetailId) {
        this.aioErrorDetailId = aioErrorDetailId;
    }

    public Long getAioErrorId() {
        return aioErrorId;
    }

    public void setAioErrorId(Long aioErrorId) {
        this.aioErrorId = aioErrorId;
    }

    public String getContentPerformer() {
        return contentPerformer;
    }

    public void setContentPerformer(String contentPerformer) {
        this.contentPerformer = contentPerformer;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public AIORequestGetErrorDetailDTO(Long aioErrorID, String contentError, Long groupErrorId, Long status, String groupErrorName, Long aioErrorDetailId, Long aioErrorId, String contentPerformer, String name, String filePath) {
        this.aioErrorID = aioErrorID;
        this.contentError = contentError;
        this.groupErrorId = groupErrorId;
        this.status = status;
        this.groupErrorName = groupErrorName;
        this.aioErrorDetailId = aioErrorDetailId;
        this.aioErrorId = aioErrorId;
        this.contentPerformer = contentPerformer;
        this.name = name;
        this.filePath = filePath;
    }

    public AIORequestGetErrorDetailDTO() {
    }
}
