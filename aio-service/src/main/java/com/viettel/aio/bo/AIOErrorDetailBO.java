package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOErrorDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "AIO_ERROR_DETAIL")
/**
 *
 * @author: tungmt92
 */
public class AIOErrorDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ERROR_DETAIL_SEQ")})
    @Column(name = "AIO_ERROR_DETAIL_ID", length = 22)
    private Long aioErrorDetailId;
    @Column(name = "AIO_ERROR_ID", length = 22)
    private Long aioErrorId;
    @Column(name = "CONTENT_PERFORMER", length = 200)
    private String contentPerformer;
    @Column(name = "ERROR_HANDLING_STEP", length = 11)
    private Long errorHandlingStep;

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

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOErrorDetailDTO dto = new AIOErrorDetailDTO();
        dto.setAioErrorDetailId(this.getAioErrorDetailId());
        dto.setAioErrorId(this.getAioErrorId());
        dto.setContentPerformer(this.getContentPerformer());
        dto.setErrorHandlingStep(this.getErrorHandlingStep());
        return dto;
    }
}
