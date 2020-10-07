package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOReportSalaryBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

@XmlRootElement(name = "AIO_Report_Salary_BO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOReportSalaryDTO extends ComsBaseFWDTO<AIOReportSalaryBO> {

    private Long reportSaralyId ;
    private String areaCode;
    private String provinceCode;
    private String name;
    private String contractCode;
    private String packageName;
    private Long quantity;
    private Double price;
    private Double amount;
    private Double revenue;
    private Long isProvinceBought;
    private Double bh;
    private String maBh;
    private Double th;
    private String maTh;
    private Double qlk;
    private String maQlk;
    private Double aio;
    private String maAio;
    private Double gd;
    private String maGd;
    private Date endDate;

    private String tenBh;
    private String tenTh;
    private String tenQlk;
    private String tenAio;
    private String tenGd;

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

    public String getTenBh() {
        return tenBh;
    }

    public void setTenBh(String tenBh) {
        this.tenBh = tenBh;
    }

    public String getTenTh() {
        return tenTh;
    }

    public void setTenTh(String tenTh) {
        this.tenTh = tenTh;
    }

    public String getTenQlk() {
        return tenQlk;
    }

    public void setTenQlk(String tenQlk) {
        this.tenQlk = tenQlk;
    }

    public String getTenAio() {
        return tenAio;
    }

    public void setTenAio(String tenAio) {
        this.tenAio = tenAio;
    }

    public String getTenGd() {
        return tenGd;
    }

    public void setTenGd(String tenGd) {
        this.tenGd = tenGd;
    }

    @Override
    public AIOReportSalaryBO toModel() {
        AIOReportSalaryBO bo =new AIOReportSalaryBO();
        bo.setReportSaralyId(this.getReportSaralyId());
        bo.setAreaCode(this.getAreaCode());
        bo.setName(this.getName());
        bo.setProvinceCode(this.getProvinceCode());
        bo.setContractCode(this.getContractCode());
        bo.setPackageName( this.getPackageName());
        bo.setPrice(this.getPrice());
        bo.setAmount(this.getAmount());
        bo.setRevenue(this.getRevenue());
        bo.setIsProvinceBought(this.isProvinceBought);
        bo.setQuantity(this.getQuantity());
        bo.setBh(this.getBh());
        bo.setMaBh(this.getMaBh());
        bo.setGd(this.getGd());
        bo.setMaGd(this.getMaGd());
        bo.setAio(this.getAio());
        bo.setMaAio(this.getMaAio());
        bo.setTh(this.getTh());
        bo.setMaTh(this.getMaTh());
        bo.setQlk(this.getQlk());
        bo.setMaQlk(this.getMaQlk());
        bo.setEndDate(this.getEndDate());
        return bo;
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
