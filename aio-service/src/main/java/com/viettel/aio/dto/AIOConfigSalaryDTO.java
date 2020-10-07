package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOConfigSalaryBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

//VietNT_20191105_create
@XmlRootElement(name = "AIO_CONFIG_SALARYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOConfigSalaryDTO extends ComsBaseFWDTO<AIOConfigSalaryBO> {

    private Long configSalaryId;
    private Long type;
    private Long objectType;
    private String objectTypeName;
    private Double managerChannels;
    private Double sale;
    private Double performer;
    private Double staffAio;
    private Double manager;
    private Long status;
    private Long createdUser;
    private Date createdDate;
    private Long updatedUser;
    private Date updatedDate;

    // dto only
    private List<AIOConfigSalaryDTO> configs;

    public List<AIOConfigSalaryDTO> getConfigs() {
        return configs;
    }

    public void setConfigs(List<AIOConfigSalaryDTO> configs) {
        this.configs = configs;
    }

    public Long getConfigSalaryId() {
        return configSalaryId;
    }

    public void setConfigSalaryId(Long configSalaryId) {
        this.configSalaryId = configSalaryId;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Long getObjectType() {
        return objectType;
    }

    public void setObjectType(Long objectType) {
        this.objectType = objectType;
    }

    public String getObjectTypeName() {
        return objectTypeName;
    }

    public void setObjectTypeName(String objectTypeName) {
        this.objectTypeName = objectTypeName;
    }

    public Double getManagerChannels() {
        return managerChannels;
    }

    public void setManagerChannels(Double managerChannels) {
        this.managerChannels = managerChannels;
    }

    public Double getSale() {
        return sale;
    }

    public void setSale(Double sale) {
        this.sale = sale;
    }

    public Double getPerformer() {
        return performer;
    }

    public void setPerformer(Double performer) {
        this.performer = performer;
    }

    public Double getStaffAio() {
        return staffAio;
    }

    public void setStaffAio(Double staffAio) {
        this.staffAio = staffAio;
    }

    public Double getManager() {
        return manager;
    }

    public void setManager(Double manager) {
        this.manager = manager;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    @Override
    public AIOConfigSalaryBO toModel() {
        AIOConfigSalaryBO bo = new AIOConfigSalaryBO();
        bo.setConfigSalaryId(this.getConfigSalaryId());
        bo.setType(this.getType());
        bo.setObjectType(this.getObjectType());
        bo.setObjectTypeName(this.getObjectTypeName());
        bo.setManagerChannels(this.getManagerChannels());
        bo.setSale(this.getSale());
        bo.setPerformer(this.getPerformer());
        bo.setStaffAio(this.getStaffAio());
        bo.setManager(this.getManager());
        bo.setStatus(this.getStatus());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setUpdatedUser(this.getUpdatedUser());
        bo.setUpdatedDate(this.getUpdatedDate());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return configSalaryId;
    }

    @Override
    public String catchName() {
        return configSalaryId.toString();
    }
}
