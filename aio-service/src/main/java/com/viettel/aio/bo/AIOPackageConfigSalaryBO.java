package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOPackageConfigSalaryDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20191109_start
@Entity
@Table(name = "AIO_PACKAGE_CONFIG_SALARY")
public class AIOPackageConfigSalaryBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PACKAGE_CONFIG_SALARY_SEQ")})
    @Column(name = "PACKAGE_CONFIG_SALARY_ID", length = 10)
    private Long packageConfigSalaryId;
    @Column(name = "PACKAGE_ID", length = 10)
    private Long packageId;
    @Column(name = "PACKAGE_DETAIL_ID", length = 10)
    private Long packageDetailId;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "OBJECT_TYPE", length = 1)
    private Long objectType;
    @Column(name = "MANAGER_CHANNELS", length = 30)
    private Double managerChannels;
    @Column(name = "SALE", length = 30)
    private Double sale;
    @Column(name = "PERFORMER", length = 30)
    private Double performer;
    @Column(name = "STAFF_AIO", length = 30)
    private Double staffAio;
    @Column(name = "MANAGER", length = 30)
    private Double manager;

    public Long getPackageConfigSalaryId() {
        return packageConfigSalaryId;
    }

    public void setPackageConfigSalaryId(Long packageConfigSalaryId) {
        this.packageConfigSalaryId = packageConfigSalaryId;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public Long getPackageDetailId() {
        return packageDetailId;
    }

    public void setPackageDetailId(Long packageDetailId) {
        this.packageDetailId = packageDetailId;
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

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOPackageConfigSalaryDTO dto = new AIOPackageConfigSalaryDTO();
        dto.setPackageConfigSalaryId(this.getPackageConfigSalaryId());
        dto.setPackageId(this.getPackageId());
        dto.setPackageDetailId(this.getPackageDetailId());
        dto.setType(this.getType());
        dto.setObjectType(this.getObjectType());
        dto.setManagerChannels(this.getManagerChannels());
        dto.setSale(this.getSale());
        dto.setPerformer(this.getPerformer());
        dto.setStaffAio(this.getStaffAio());
        dto.setManager(this.getManager());
        return dto;
    }
}
