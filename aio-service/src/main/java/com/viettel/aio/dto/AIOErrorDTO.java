package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOErrorBO;
import com.viettel.erp.constant.ApplicationConstants;
import com.viettel.erp.utils.CustomJsonDateDeserializer;
import com.viettel.erp.utils.CustomJsonDateSerializer;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

/**
 * @author: tungmt92
 */
@XmlRootElement(name = "AIO_ERRORBO")
@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class AIOErrorDTO extends ComsBaseFWDTO<AIOErrorBO> {

    private Long aioErrorId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createDate;
    private Long createUser;
    private String contentError;
    private Long groupErrorId;
    private String groupErrorName;
    private Long status;
    private Long updateUser;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date updateDate;
    private List<AIOErrorDetailDTO> listErrorDetailDTO;
    private String sysUserName;
    private String updateUserName;
    private String aioErrorName;
    private String industryCode;

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public List<AIOErrorDetailDTO> getListErrorDetailDTO() {
        return listErrorDetailDTO;
    }

    public void setListErrorDetailDTO(List<AIOErrorDetailDTO> listErrorDetailDTO) {
        this.listErrorDetailDTO = listErrorDetailDTO;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public String getUpdateUserName() {
        return updateUserName;
    }

    public void setUpdateUserName(String updateUserName) {
        this.updateUserName = updateUserName;
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

    public Long getCreateUser() {
        return createUser;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public java.util.Date getCreateDate() {
        return createDate;
    }

    public void setCreateDate(java.util.Date createDate) {
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

    public String getGroupErrorName() {
        return groupErrorName;
    }

    public void setGroupErrorName(String groupErrorName) {
        this.groupErrorName = groupErrorName;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public java.util.Date getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(java.util.Date updateDate) {
        this.updateDate = updateDate;
    }

    @Override
    public AIOErrorBO toModel() {
        AIOErrorBO aioErrorBO = new AIOErrorBO();
        aioErrorBO.setAioErrorId(this.aioErrorId);
        aioErrorBO.setCreateUser(this.createUser);
        aioErrorBO.setCreateDate(this.createDate);
        aioErrorBO.setContentError(this.contentError);
        aioErrorBO.setGroupErrorId(this.groupErrorId);
        aioErrorBO.setStatus(this.status);
        aioErrorBO.setGroupErrorName(this.groupErrorName);
        aioErrorBO.setUpdateUser(this.updateUser);
        aioErrorBO.setUpdateDate(this.updateDate);
        aioErrorBO.setIndustryCode(this.getIndustryCode());
        return aioErrorBO;
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
