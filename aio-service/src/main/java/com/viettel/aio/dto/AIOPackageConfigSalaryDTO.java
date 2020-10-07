package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOPackageConfigSalaryBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20191109_create
@XmlRootElement(name = "AIO_PACKAGE_CONFIG_SALARYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPackageConfigSalaryDTO extends ComsBaseFWDTO<AIOPackageConfigSalaryBO> {

    private Long packageConfigSalaryId;
    private Long packageId;
    private Long packageDetailId;
    private Long type;
    private Long objectType;
    private Double managerChannels;
    private Double sale;
    private Double performer;
    private Double staffAio;
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
    public AIOPackageConfigSalaryBO toModel() {
        AIOPackageConfigSalaryBO bo = new AIOPackageConfigSalaryBO();
        bo.setPackageConfigSalaryId(this.getPackageConfigSalaryId());
        bo.setPackageId(this.getPackageId());
        bo.setPackageDetailId(this.getPackageDetailId());
        bo.setType(this.getType());
        bo.setObjectType(this.getObjectType());
        bo.setManagerChannels(this.getManagerChannels());
        bo.setSale(this.getSale());
        bo.setPerformer(this.getPerformer());
        bo.setStaffAio(this.getStaffAio());
        bo.setManager(this.getManager());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return packageConfigSalaryId;
    }

    @Override
    public String catchName() {
        return packageConfigSalaryId.toString();
    }
}
