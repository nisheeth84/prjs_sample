package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOConfigSalaryDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20191105_start
@Entity
@Table(name = "AIO_CONFIG_SALARY")
public class AIOConfigSalaryBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONFIG_SALARY_SEQ")})
    @Column(name = "CONFIG_SALARY_ID", length = 10)
    private Long configSalaryId;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "OBJECT_TYPE", length = 1)
    private Long objectType;
    @Column(name = "OBJECT_TYPE_NAME", length = 100)
    private String objectTypeName;
    @Column(name = "MANAGER_CHANNELS", length = 100)
    private Double managerChannels;
    @Column(name = "SALE", length = 30)
    private Double sale;
    @Column(name = "PERFORMER", length = 30)
    private Double performer;
    @Column(name = "STAFF_AIO", length = 30)
    private Double staffAio;
    @Column(name = "MANAGER", length = 30)
    private Double manager;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "UPDATED_USER", length = 10)
    private Long updatedUser;
    @Column(name = "UPDATED_DATE", length = 22)
    private Date updatedDate;

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
    public BaseFWDTOImpl toDTO() {
        AIOConfigSalaryDTO dto = new AIOConfigSalaryDTO();
        dto.setConfigSalaryId(this.getConfigSalaryId());
        dto.setType(this.getType());
        dto.setObjectType(this.getObjectType());
        dto.setObjectTypeName(this.getObjectTypeName());
        dto.setManagerChannels(this.getManagerChannels());
        dto.setSale(this.getSale());
        dto.setPerformer(this.getPerformer());
        dto.setStaffAio(this.getStaffAio());
        dto.setManager(this.getManager());
        dto.setStatus(this.getStatus());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setUpdatedUser(this.getUpdatedUser());
        dto.setUpdatedDate(this.getUpdatedDate());
        return dto;
    }
}
