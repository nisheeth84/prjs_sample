package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOErrorDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@SuppressWarnings("serial")
@Entity
@Table(name = "AIO_ERROR")
/**
 *
 * @author: tungmt92
 */
public class AIOErrorBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_ERROR_SEQ")})
    @Column(name = "AIO_ERROR_ID", length = 22)
    private Long aioErrorId;
    @Column(name = "CREATE_USER", length = 20)
    private Long createUser;
    @Column(name = "CREATE_DATE", length = 7)
    private Date createDate;
    @Column(name = "CONTENT_ERROR", length = 200)
    private String contentError;
    @Column(name = "GROUP_ERROR_ID", length = 22)
    private Long groupErrorId;
    @Column(name = "STATUS", length = 22)
    private Long status;
    @Column(name = "GROUP_ERROR_NAME", length = 100)
    private String groupErrorName;
    @Column(name = "UPDATE_USER", length = 20)
    private Long updateUser;
    @Column(name = "UPDATE_DATE", length = 7)
    private Date updateDate;
    @Column(name = "INDUSTRY_CODE", length = 200)
    private String industryCode;

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public Long getAioErrorId() {
        return aioErrorId;
    }

    public void setAioErrorId(Long aioErrorId) {
        this.aioErrorId = aioErrorId;
    }

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(Date createDate) {
        this.createDate = createDate;
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

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public AIOErrorDTO toDTO() {
        AIOErrorDTO aioErrorDTO = new AIOErrorDTO();
        aioErrorDTO.setAioErrorId(this.aioErrorId);
        aioErrorDTO.setCreateUser(this.createUser);
        aioErrorDTO.setCreateDate(this.createDate);
        aioErrorDTO.setContentError(this.contentError);
        aioErrorDTO.setGroupErrorId(this.groupErrorId);
        aioErrorDTO.setStatus(this.status);
        aioErrorDTO.setGroupErrorName(this.groupErrorName);
        aioErrorDTO.setUpdateUser(this.updateUser);
        aioErrorDTO.setUpdateDate(this.updateDate);
        aioErrorDTO.setIndustryCode(this.industryCode);
        return aioErrorDTO;
    }
}
