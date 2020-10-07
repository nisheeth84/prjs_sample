package com.viettel.aio.dto.report;

import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOReportDTO extends ComsBaseFWDTO {

    private Long contractId;
    private String contractCode;
    private Long packageId;
    private String packageName;
    private Double quantity;
    private Double amount;
    private Double costPrice;

    private String performerName;
    private String performerCode;
    private String performerText;

    private String goodsCode;
    private String goodsName;
    private String goodsText;

    private Long sysGroupId;
    private String sysGroupCode;
    private String sysGroupName;
    private String sysGroupText;

    private Long sysUserId;
    private String sysUserCode;
    private String sysUserName;

    private List<Long> statuses;

    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    //VietNT_27/06/2019_start
    //rp stock
    private String code;
    private Double amountReal;
    private Double costPriceImport;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date importDate;
    private Long stockTime;
    private Double sumAmount;
    private Double costPriceStock;
    private Double sumCostPriceStock;
    //VietNT_end
    //VietNT_11/07/2019_start
    private String cntContractCode;
    //VietNT_end
    //VietNT_23/07/2019_start
    private String stockName;
    private String serial;
    private Long isDetailRp;
    //VietNT_end
    //VietNT_13/07/2019_start
    // rp salary
    private Long contractDetailId;
    private String areaCode;
    private String provinceCode;
    private String groupNameLv3;
    private Long type;
    private Double salary;

    private Double pSales;
    private Double pPerformer;
    private Double pStaffAIO;
    private Double pManager;

    private Double cSales;
    private Double cPerformer;
    private Double cStaffAIO;
    private Double cManager;
    //VietNT_end
    //VietNT_26/07/2019_start
    // rp salary detail
    private Double unitPrice;
    //VietNT_end

    // for dashboard charts
    private List<String> chartList;
    private Long performerGroupId;
    private Integer year;
    private Integer month;
    private String pointName;
    private Long totalAmount;
    private BigDecimal goodCityAmount;
    private BigDecimal badCityAmount;
    private BigDecimal totalKh;
    private BigDecimal totalTh;
    private Map<String, BigDecimal> deploymentMap;
    private Map<String, BigDecimal> customerReuseMap;

    private Double pManagerChannels;
    private Double cManagerChannels;
    private Double sumSalary;

    private Long goodCityAmountV2;
    private Long badCityAmountV2;
    private Long totalKhV2;
    private Long totalThV2;
    //tatph-start-12/12/2019
    private String name;
    private Double price;
    private Double revenue;
    private Long areaId;
    private Long provinceId;
    private Long isProvinceBought;

    private Double salaryBh;
    private Double salaryTh;
    private Double salaryQl;
    private Double salaryAio;
    private Double salaryGd;

    private String sysUserCodeBh;
    private String sysUserCodeTh;
    private String sysUserCodeQl;
    private String sysUserCodeAio;
    private String sysUserCodeGd;

    private String startDateS;
    private String endDateS;
    private int reportType;
    //tatph-end-12/12/2019

    public Double getSumSalary() {
        return sumSalary;
    }

    public void setSumSalary(Double sumSalary) {
        this.sumSalary = sumSalary;
    }
    public Long getGoodCityAmountV2() {
        return goodCityAmountV2;
    }

    public void setGoodCityAmountV2(Long goodCityAmountV2) {
        this.goodCityAmountV2 = goodCityAmountV2;
    }

    public Long getBadCityAmountV2() {
        return badCityAmountV2;
    }

    public void setBadCityAmountV2(Long badCityAmountV2) {
        this.badCityAmountV2 = badCityAmountV2;
    }

    public Long getTotalKhV2() {
        return totalKhV2;
    }

    public void setTotalKhV2(Long totalKhV2) {
        this.totalKhV2 = totalKhV2;
    }

    public Long getTotalThV2() {
        return totalThV2;
    }

    public void setTotalThV2(Long totalThV2) {
        this.totalThV2 = totalThV2;
    }

    public Double getpManagerChannels() {
        return pManagerChannels;
    }

    public void setpManagerChannels(Double pManagerChannels) {
        this.pManagerChannels = pManagerChannels;
    }

    public Double getcManagerChannels() {
        return cManagerChannels;
    }

    public void setcManagerChannels(Double cManagerChannels) {
        this.cManagerChannels = cManagerChannels;
    }

    public Double getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(Double unitPrice) {
        this.unitPrice = unitPrice;
    }

    public Long getContractDetailId() {
        return contractDetailId;
    }

    public void setContractDetailId(Long contractDetailId) {
        this.contractDetailId = contractDetailId;
    }

    public Double getpSales() {
        return pSales;
    }

    public void setpSales(Double pSales) {
        this.pSales = pSales;
    }

    public Double getpPerformer() {
        return pPerformer;
    }

    public void setpPerformer(Double pPerformer) {
        this.pPerformer = pPerformer;
    }

    public Double getpStaffAIO() {
        return pStaffAIO;
    }

    public void setpStaffAIO(Double pStaffAIO) {
        this.pStaffAIO = pStaffAIO;
    }

    public Double getpManager() {
        return pManager;
    }

    public void setpManager(Double pManager) {
        this.pManager = pManager;
    }

    public Double getcSales() {
        return cSales;
    }

    public void setcSales(Double cSales) {
        this.cSales = cSales;
    }

    public Double getcPerformer() {
        return cPerformer;
    }

    public void setcPerformer(Double cPerformer) {
        this.cPerformer = cPerformer;
    }

    public Double getcStaffAIO() {
        return cStaffAIO;
    }

    public void setcStaffAIO(Double cStaffAIO) {
        this.cStaffAIO = cStaffAIO;
    }

    public Double getcManager() {
        return cManager;
    }

    public void setcManager(Double cManager) {
        this.cManager = cManager;
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

    public String getGroupNameLv3() {
        return groupNameLv3;
    }

    public void setGroupNameLv3(String groupNameLv3) {
        this.groupNameLv3 = groupNameLv3;
    }

    public Long getIsProvinceBought() {
        return isProvinceBought;
    }

    public void setIsProvinceBought(Long isProvinceBought) {
        this.isProvinceBought = isProvinceBought;
    }

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public String getCntContractCode() {
        return cntContractCode;
    }

    public void setCntContractCode(String cntContractCode) {
        this.cntContractCode = cntContractCode;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Double getAmountReal() {
        return amountReal;
    }

    public void setAmountReal(Double amountReal) {
        this.amountReal = amountReal;
    }

    public Double getCostPriceImport() {
        return costPriceImport;
    }

    public void setCostPriceImport(Double costPriceImport) {
        this.costPriceImport = costPriceImport;
    }

    public Date getImportDate() {
        return importDate;
    }

    public void setImportDate(Date importDate) {
        this.importDate = importDate;
    }

    public Long getStockTime() {
        return stockTime;
    }

    public void setStockTime(Long stockTime) {
        this.stockTime = stockTime;
    }

    public Double getSumAmount() {
        return sumAmount;
    }

    public void setSumAmount(Double sumAmount) {
        this.sumAmount = sumAmount;
    }

    public Double getCostPriceStock() {
        return costPriceStock;
    }

    public void setCostPriceStock(Double costPriceStock) {
        this.costPriceStock = costPriceStock;
    }

    public Double getSumCostPriceStock() {
        return sumCostPriceStock;
    }

    public void setSumCostPriceStock(Double sumCostPriceStock) {
        this.sumCostPriceStock = sumCostPriceStock;
    }

    public Long getPackageId() {
        return packageId;
    }

    public void setPackageId(Long packageId) {
        this.packageId = packageId;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public List<Long> getStatuses() {
        return statuses;
    }

    public void setStatuses(List<Long> statuses) {
        this.statuses = statuses;
    }

    public Double getCostPrice() {
        return costPrice;
    }

    public void setCostPrice(Double costPrice) {
        this.costPrice = costPrice;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupCode() {
        return sysGroupCode;
    }

    public void setSysGroupCode(String sysGroupCode) {
        this.sysGroupCode = sysGroupCode;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
    }

    public String getSysGroupText() {
        return sysGroupText;
    }

    public void setSysGroupText(String sysGroupText) {
        this.sysGroupText = sysGroupText;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getSysUserCode() {
        return sysUserCode;
    }

    public void setSysUserCode(String sysUserCode) {
        this.sysUserCode = sysUserCode;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public String getPerformerText() {
        return performerText;
    }

    public void setPerformerText(String performerText) {
        this.performerText = performerText;
    }

    public Long getContractId() {
        return contractId;
    }

    public void setContractId(Long contractId) {
        this.contractId = contractId;
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

    public String getPerformerName() {
        return performerName;
    }

    public void setPerformerName(String performerName) {
        this.performerName = performerName;
    }

    public String getPerformerCode() {
        return performerCode;
    }

    public void setPerformerCode(String performerCode) {
        this.performerCode = performerCode;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getGoodsText() {
        return goodsText;
    }

    public void setGoodsText(String goodsText) {
        this.goodsText = goodsText;
    }

    public BigDecimal getTotalKh() {
        return totalKh;
    }

    public void setTotalKh(BigDecimal totalKh) {
        this.totalKh = totalKh;
    }

    public BigDecimal getTotalTh() {
        return totalTh;
    }

    public void setTotalTh(BigDecimal totalTh) {
        this.totalTh = totalTh;
    }

    @Override
    public BaseFWModelImpl toModel() {
        return null;
    }

    @Override
    public Long getFWModelId() {
        return null;
    }

    @Override
    public String catchName() {
        return null;
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public Long getIsDetailRp() {
        return isDetailRp;
    }

    public void setIsDetailRp(Long detailRp) {
        isDetailRp = detailRp;
    }

    public List<String> getChartList() {
        return chartList;
    }

    public void setChartList(List<String> chartList) {
        this.chartList = chartList;
    }

    public Long getPerformerGroupId() {
        return performerGroupId;
    }

    public void setPerformerGroupId(Long performerGroupId) {
        this.performerGroupId = performerGroupId;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public String getPointName() {
        return pointName;
    }

    public void setPointName(String pointName) {
        this.pointName = pointName;
    }

    public Long getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Long totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getGoodCityAmount() {
        return goodCityAmount;
    }

    public void setGoodCityAmount(BigDecimal goodCityAmount) {
        this.goodCityAmount = goodCityAmount;
    }

    public BigDecimal getBadCityAmount() {
        return badCityAmount;
    }

    public void setBadCityAmount(BigDecimal badCityAmount) {
        this.badCityAmount = badCityAmount;
    }

    public Map<String, BigDecimal> getDeploymentMap() {
        return deploymentMap;
    }

    public void setDeploymentMap(Map<String, BigDecimal> deploymentMap) {
        this.deploymentMap = deploymentMap;
    }

    public Map<String, BigDecimal> getCustomerReuseMap() {
        return customerReuseMap;
    }

    public void setCustomerReuseMap(Map<String, BigDecimal> customerReuseMap) {
        this.customerReuseMap = customerReuseMap;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getRevenue() {
        return revenue;
    }

    public void setRevenue(Double revenue) {
        this.revenue = revenue;
    }

    public Double getSalaryBh() {
        return salaryBh;
    }

    public void setSalaryBh(Double salaryBh) {
        this.salaryBh = salaryBh;
    }

    public Double getSalaryTh() {
        return salaryTh;
    }

    public void setSalaryTh(Double salaryTh) {
        this.salaryTh = salaryTh;
    }

    public Double getSalaryQl() {
        return salaryQl;
    }

    public void setSalaryQl(Double salaryQl) {
        this.salaryQl = salaryQl;
    }

    public Double getSalaryAio() {
        return salaryAio;
    }

    public void setSalaryAio(Double salaryAio) {
        this.salaryAio = salaryAio;
    }

    public Double getSalaryGd() {
        return salaryGd;
    }

    public void setSalaryGd(Double salaryGd) {
        this.salaryGd = salaryGd;
    }

    public String getSysUserCodeBh() {
        return sysUserCodeBh;
    }

    public void setSysUserCodeBh(String sysUserCodeBh) {
        this.sysUserCodeBh = sysUserCodeBh;
    }

    public String getSysUserCodeTh() {
        return sysUserCodeTh;
    }

    public void setSysUserCodeTh(String sysUserCodeTh) {
        this.sysUserCodeTh = sysUserCodeTh;
    }

    public String getSysUserCodeQl() {
        return sysUserCodeQl;
    }

    public void setSysUserCodeQl(String sysUserCodeQl) {
        this.sysUserCodeQl = sysUserCodeQl;
    }

    public String getSysUserCodeAio() {
        return sysUserCodeAio;
    }

    public void setSysUserCodeAio(String sysUserCodeAio) {
        this.sysUserCodeAio = sysUserCodeAio;
    }

    public String getSysUserCodeGd() {
        return sysUserCodeGd;
    }

    public void setSysUserCodeGd(String sysUserCodeGd) {
        this.sysUserCodeGd = sysUserCodeGd;
    }

    public String getStartDateS() {
        return startDateS;
    }

    public void setStartDateS(String startDateS) {
        this.startDateS = startDateS;
    }

    public String getEndDateS() {
        return endDateS;
    }

    public void setEndDateS(String endDateS) {
        this.endDateS = endDateS;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public Long getProvinceId() {
        return provinceId;
    }

    public void setProvinceId(Long provinceId) {
        this.provinceId = provinceId;
    }

    public int getReportType() {
        return reportType;
    }

    public void setReportType(int reportType) {
        this.reportType = reportType;
    }
}
