package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOPackageDetailPriceBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190419_create
@XmlRootElement(name = "AIO_PACKAGE_DETAIL_PRICEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPackageDetailPriceDTO extends ComsBaseFWDTO<AIOPackageDetailPriceBO> {

    private Long packageDetailPriceId;
    private Long packageId;
    private Long packageDetailId;
    private Long provinceId;
    private String provinceCode;
    private String provinceName;
    private Double price;
    //VietNT_08/07/2019_start
    private Double departmentAssignment;
    private Double perDepartmentAssignment;
    private Long type;
    private Double sales;
    private Double performer;
    private Double staffAio;
    private Double manager;
    //VietNT_end

    public Long getPackageDetailPriceId() {
        return packageDetailPriceId;
    }

    public void setPackageDetailPriceId(Long packageDetailPriceId) {
        this.packageDetailPriceId = packageDetailPriceId;
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

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getDepartmentAssignment() {
        return departmentAssignment;
    }

    public void setDepartmentAssignment(Double departmentAssignment) {
        this.departmentAssignment = departmentAssignment;
    }

    public Double getPerDepartmentAssignment() {
        return perDepartmentAssignment;
    }

    public void setPerDepartmentAssignment(Double perDepartmentAssignment) {
        this.perDepartmentAssignment = perDepartmentAssignment;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Double getSales() {
        return sales;
    }

    public void setSales(Double sales) {
        this.sales = sales;
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
    public AIOPackageDetailPriceBO toModel() {
        AIOPackageDetailPriceBO bo = new AIOPackageDetailPriceBO();
        bo.setPackageDetailPriceId(this.getPackageDetailPriceId());
        bo.setPackageId(this.getPackageId());
        bo.setPackageDetailId(this.getPackageDetailId());
        bo.setProvinceId(this.getProvinceId());
        bo.setProvinceCode(this.getProvinceCode());
        bo.setProvinceName(this.getProvinceName());
        bo.setPrice(this.getPrice());
        bo.setDepartmentAssignment(this.getDepartmentAssignment());
        bo.setPerDepartmentAssignment(this.getPerDepartmentAssignment());
        bo.setType(this.getType());
        bo.setSales(this.getSales());
        bo.setPerformer(this.getPerformer());
        bo.setStaffAio(this.getStaffAio());
        bo.setManager(this.getManager());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return packageDetailPriceId;
    }

    @Override
    public String catchName() {
        return packageDetailPriceId.toString();
    }
}
