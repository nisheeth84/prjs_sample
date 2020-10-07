package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOPackageDetailPriceDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190419_start
@Entity
@Table(name = "AIO_PACKAGE_DETAIL_PRICE")
public class AIOPackageDetailPriceBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PACKAGE_DETAIL_PRICE_SEQ")})
    @Column(name = "PACKAGE_DETAIL_PRICE_ID", length = 10)
    private Long packageDetailPriceId;
    @Column(name = "PACKAGE_ID", length = 10)
    private Long packageId;
    @Column(name = "PACKAGE_DETAIL_ID", length = 10)
    private Long packageDetailId;
    @Column(name = "PROVINCE_ID", length = 10)
    private Long provinceId;
    @Column(name = "PROVINCE_CODE", length = 50)
    private String provinceCode;
    @Column(name = "PROVINCE_NAME", length = 50)
    private String provinceName;
    @Column(name = "PRICE", length = 30)
    private Double price;
    @Column(name = "DEPARTMENT_ASSIGNMENT", length = 32)
    private Double departmentAssignment;
    @Column(name = "PER_DEPARTMENT_ASSIGNMENT", length = 32)
    private Double perDepartmentAssignment;
    @Column(name = "TYPE", length = 1)
    private Long type;
    @Column(name = "SALES", length = 32)
    private Double sales;
    @Column(name = "PERFORMER", length = 32)
    private Double performer;
    @Column(name = "STAFF_AIO", length = 32)
    private Double staffAio;
    @Column(name = "MANAGER", length = 32)
    private Double manager;

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
    public BaseFWDTOImpl toDTO() {
        AIOPackageDetailPriceDTO dto = new AIOPackageDetailPriceDTO();
        dto.setPackageDetailPriceId(this.getPackageDetailPriceId());
        dto.setPackageId(this.getPackageId());
        dto.setPackageDetailId(this.getPackageDetailId());
        dto.setProvinceId(this.getProvinceId());
        dto.setProvinceCode(this.getProvinceCode());
        dto.setProvinceName(this.getProvinceName());
        dto.setPrice(this.getPrice());
        dto.setDepartmentAssignment(this.getDepartmentAssignment());
        dto.setPerDepartmentAssignment(this.getPerDepartmentAssignment());
        dto.setType(this.getType());
        dto.setSales(this.getSales());
        dto.setPerformer(this.getPerformer());
        dto.setStaffAio(this.getStaffAio());
        dto.setManager(this.getManager());
        return dto;
    }
}
