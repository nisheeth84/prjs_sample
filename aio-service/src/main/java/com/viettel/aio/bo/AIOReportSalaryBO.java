package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOReportSalaryDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import java.util.Date;

@Entity
@Table(name = "AIO_REPORT_SARALY")
public class AIOReportSalaryBO extends BaseFWModelImpl {
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_REPORT_SARALY_SEQ")})
    @Column(name = "REPORT_SARALY_ID")
    private Long reportSaralyId ;
    @Column(name = "AREA_CODE")
    private String areaCode;
    @Column(name = "PROVINCE_CODE")
    private String provinceCode;
    @Column(name = "NAME")
    private String name;
    @Column(name = "CONTRACT_CODE")
    private String contractCode;
    @Column(name = "PACKAGE_NAME")
    private String packageName;
    @Column(name = "QUANTITY")
    private Long quantity;
    @Column(name = "PRICE")
    private Double price;
    @Column(name = "AMOUNT")
    private Double amount;
    @Column(name = "REVENUE")
    private Double revenue;
    @Column(name = "IS_PROVINCE_BOUGHT")
    private Long isProvinceBought;
    @Column(name = "BH")
    private Double bh;
    @Column(name = "MA_BH")
    private String maBh;
    @Column(name = "TH")
    private Double th;
    @Column(name = "MA_TH")
    private String maTh;
    @Column(name = "QLK")
    private Double qlk;
    @Column(name = "MA_QLK")
    private String maQlk;
    @Column(name = "AIO")
    private Double aio;
    @Column(name = "MA_AIO")
    private String maAio;
    @Column(name = "GD")
    private Double gd;
    @Column(name = "MA_GD")
    private String maGd;
    @Column(name = "END_DATE")
    private Date endDate;

    public Long getReportSaralyId() {
        return reportSaralyId;
    }

    public void setReportSaralyId(Long reportSaralyId) {
        this.reportSaralyId = reportSaralyId;
    }

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractCode) {
        this.contractCode = contractCode;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public Long getQuantity() {
        return quantity;
    }

    public void setQuantity(Long quantity) {
        this.quantity = quantity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Double getBh() {
        return bh;
    }

    public void setBh(Double bh) {
        this.bh = bh;
    }

    public String getMaBh() {
        return maBh;
    }

    public void setMaBh(String maBh) {
        this.maBh = maBh;
    }

    public Double getTh() {
        return th;
    }

    public void setTh(Double th) {
        this.th = th;
    }

    public String getMaTh() {
        return maTh;
    }

    public void setMaTh(String maTh) {
        this.maTh = maTh;
    }

    public Double getQlk() {
        return qlk;
    }

    public void setQlk(Double qlk) {
        this.qlk = qlk;
    }

    public String getMaQlk() {
        return maQlk;
    }

    public void setMaQlk(String maQlk) {
        this.maQlk = maQlk;
    }

    public Double getAio() {
        return aio;
    }

    public void setAio(Double aio) {
        this.aio = aio;
    }

    public String getMaAio() {
        return maAio;
    }

    public void setMaAio(String maAio) {
        this.maAio = maAio;
    }

    public Double getGd() {
        return gd;
    }

    public void setGd(Double gd) {
        this.gd = gd;
    }

    public String getMaGd() {
        return maGd;
    }

    public void setMaGd(String maGd) {
        this.maGd = maGd;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOReportSalaryDTO aioReportSalaryDTO = new AIOReportSalaryDTO();
        aioReportSalaryDTO.setReportSaralyId(this.getReportSaralyId());
        aioReportSalaryDTO.setAreaCode(this.getAreaCode());
        aioReportSalaryDTO.setProvinceCode(this.getProvinceCode());
        aioReportSalaryDTO.setName(this.getName());
        aioReportSalaryDTO.setContractCode(this.getContractCode());
        aioReportSalaryDTO.setPackageName(this.getPackageName());
        aioReportSalaryDTO.setQuantity(this.getQuantity());
        aioReportSalaryDTO.setPrice(this.getPrice());
        aioReportSalaryDTO.setAmount(this.getAmount());
        aioReportSalaryDTO.setRevenue(this.getRevenue());
        aioReportSalaryDTO.setIsProvinceBought(this.getIsProvinceBought());
        aioReportSalaryDTO.setBh(this.getBh());
        aioReportSalaryDTO.setMaBh(this.getMaBh());
        aioReportSalaryDTO.setTh(this.getTh());
        aioReportSalaryDTO.setMaTh(this.getMaTh());
        aioReportSalaryDTO.setAio(this.getAio());
        aioReportSalaryDTO.setMaAio(this.getMaAio());
        aioReportSalaryDTO.setQlk(this.getQlk());
        aioReportSalaryDTO.setMaQlk(this.getMaQlk());
        aioReportSalaryDTO.setGd(this.getGd());
        aioReportSalaryDTO.setMaGd(this.getMaGd());
        aioReportSalaryDTO.setEndDate(this.getEndDate());
        return aioReportSalaryDTO;
    }
}
