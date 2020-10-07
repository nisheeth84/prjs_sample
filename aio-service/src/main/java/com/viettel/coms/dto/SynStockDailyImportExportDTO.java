/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.viettel.coms.dto;

import com.viettel.coms.bo.SynStockDailyImportExportBO;
import com.viettel.coms.bo.SynStockTransBO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;
import java.util.List;

/**
 * @author thuannht
 */
@XmlRootElement(name = "SYN_STOCK_DAILY_IMPORT_EXPORTBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class SynStockDailyImportExportDTO extends ComsBaseFWDTO<SynStockDailyImportExportBO> {

    @Override
    public SynStockDailyImportExportBO toModel() {
        SynStockDailyImportExportBO bo = new SynStockDailyImportExportBO();
        bo.setSynStockDailyIeId(this.getSynStockDailyIeId());
        bo.setIeDate(this.getIeDate());
        bo.setStockTransType(this.getStockTransType());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setSysGroupCode(this.getSysGroupCode());
        bo.setSysGroupName(this.getSysGroupName());
        bo.setProvinceId(this.getProvinceId());
        bo.setProvinceCode(this.getProvinceCode());
        bo.setProvinceName(this.getProvinceName());
        bo.setCatStationCode(this.getCatStationCode());
        bo.setConstructionCode(this.getConstructionCode());
        bo.setConstructionState(this.getConstructionState());
        bo.setConstructionStateName(this.getConstructionStateName());
        bo.setContractCode(this.getContractCode());
        bo.setProvinceUserId(this.getProvinceUserId());
        bo.setProvinceUserName(this.getProvinceUserName());
        bo.setSysUserId(this.getSysUserId());
        bo.setSysUserName(this.getSysUserName());
        bo.setSynStockTransCode(this.getSynStockTransCode());
        bo.setRealIeTransDate(this.getRealIeTransDate());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setGoodsIsSerial(this.getGoodsIsSerial());
        bo.setGoodsState(this.getGoodsState());
        bo.setGoodsStateName(this.getGoodsStateName());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setAmountTotal(this.getAmountTotal());
        bo.setPrice(this.getPrice());
        bo.setTotalMoney(this.getTotalMoney());
        bo.setSerial(this.getSerial());
        bo.setFromSynStockTransCode(this.getFromSynStockTransCode());
        bo.setIsConfirm(this.getIsConfirm());
        bo.setCreateDateTime(this.getCreateDateTime());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return synStockDailyIeId;
    }

    @Override
    public String catchName() {
        return synStockDailyIeId.toString();
    }

    private Long synStockDailyIeId;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date ieDate;
    private String stockTransType;
    private Long sysGroupId;
    private String sysGroupCode;
    private String sysGroupName;
    private Long provinceId;
    private String provinceCode;
    private String provinceName;
    private String catStationCode;
    private String constructionCode;
    private Long constructionState;
    private String constructionStateName;
    private String contractCode;
    private Long provinceUserId;
    private String provinceUserName;
    private Long sysUserId;
    private String sysUserName;
    private String synStockTransCode;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date realIeTransDate;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private String goodsIsSerial;
    private String goodsState;
    private String goodsStateName;
    private String goodsUnitName;
    private Long goodsUnitId;
    private Double amountTotal;
    private Double price;
    private Double totalMoney;
    private String serial;
    private String fromSynStockTransCode;
    private Long isConfirm;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date createDateTime;

    //dto only
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateFrom;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date dateTo;

    private int filterSearch;

    private long[] countConstruction;
    private long countCancel;
    private long countPending;
    private long countConstructing;
    private long countDone;
    private long countTotal;

    private double[] sumMoney;
    private double sumCancel;
    private double sumPending;
    private double sumConstructing;
    private double sumDone;

    private int type;

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getFilterSearch() {
        return filterSearch;
    }

    public void setFilterSearch(int filterSearch) {
        this.filterSearch = filterSearch;
    }

    public double[] getSumMoney() {
        return sumMoney;
    }

    public void setSumMoney(double[] sumMoney) {
        this.sumMoney = sumMoney;
    }

    public double getSumCancel() {
        return sumCancel;
    }

    public void setSumCancel(double sumCancel) {
        this.sumCancel = sumCancel;
    }

    public double getSumPending() {
        return sumPending;
    }

    public void setSumPending(double sumPending) {
        this.sumPending = sumPending;
    }

    public double getSumConstructing() {
        return sumConstructing;
    }

    public void setSumConstructing(double sumConstructing) {
        this.sumConstructing = sumConstructing;
    }

    public double getSumDone() {
        return sumDone;
    }

    public void setSumDone(double sumDone) {
        this.sumDone = sumDone;
    }

    public long[] getCountConstruction() {
        return countConstruction;
    }

    public void setCountConstruction(long[] countConstruction) {
        this.countConstruction = countConstruction;
    }

    public long getCountCancel() {
        return countCancel;
    }

    public void setCountCancel(long countCancel) {
        this.countCancel = countCancel;
    }

    public long getCountPending() {
        return countPending;
    }

    public void setCountPending(long countPending) {
        this.countPending = countPending;
    }

    public long getCountConstructing() {
        return countConstructing;
    }

    public void setCountConstructing(long countConstructing) {
        this.countConstructing = countConstructing;
    }

    public long getCountDone() {
        return countDone;
    }

    public void setCountDone(long countDone) {
        this.countDone = countDone;
    }

    public long getCountTotal() {
        return countTotal;
    }

    public void setCountTotal(long countTotal) {
        this.countTotal = countTotal;
    }

    public Date getDateFrom() {
        return dateFrom;
    }

    public void setDateFrom(Date dateFrom) {
        this.dateFrom = dateFrom;
    }

    public Date getDateTo() {
        return dateTo;
    }

    public void setDateTo(Date dateTo) {
        this.dateTo = dateTo;
    }

    public Long getSynStockDailyIeId() {
        return synStockDailyIeId;
    }

    public void setSynStockDailyIeId(Long synStockDailyIeId) {
        this.synStockDailyIeId = synStockDailyIeId;
    }

    public Date getIeDate() {
        return ieDate;
    }

    public void setIeDate(Date ieDate) {
        this.ieDate = ieDate;
    }

    public String getStockTransType() {
        return stockTransType;
    }

    public void setStockTransType(String stockTransType) {
        this.stockTransType = stockTransType;
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

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public Long getConstructionState() {
        return constructionState;
    }

    public void setConstructionState(Long constructionState) {
        this.constructionState = constructionState;
    }

    public String getConstructionStateName() {
        return constructionStateName;
    }

    public void setConstructionStateName(String constructionStateName) {
        this.constructionStateName = constructionStateName;
    }

    public String getContractCode() {
        return contractCode;
    }

    public void setContractCode(String contractCode) {
        this.contractCode = contractCode;
    }

    public Long getProvinceUserId() {
        return provinceUserId;
    }

    public void setProvinceUserId(Long provinceUserId) {
        this.provinceUserId = provinceUserId;
    }

    public String getProvinceUserName() {
        return provinceUserName;
    }

    public void setProvinceUserName(String provinceUserName) {
        this.provinceUserName = provinceUserName;
    }

    public Long getSysUserId() {
        return sysUserId;
    }

    public void setSysUserId(Long sysUserId) {
        this.sysUserId = sysUserId;
    }

    public String getSysUserName() {
        return sysUserName;
    }

    public void setSysUserName(String sysUserName) {
        this.sysUserName = sysUserName;
    }

    public String getSynStockTransCode() {
        return synStockTransCode;
    }

    public void setSynStockTransCode(String synStockTransCode) {
        this.synStockTransCode = synStockTransCode;
    }

    public Date getRealIeTransDate() {
        return realIeTransDate;
    }

    public void setRealIeTransDate(Date realIeTransDate) {
        this.realIeTransDate = realIeTransDate;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
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

    public String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    public String getGoodsState() {
        return goodsState;
    }

    public void setGoodsState(String goodsState) {
        this.goodsState = goodsState;
    }

    public String getGoodsStateName() {
        return goodsStateName;
    }

    public void setGoodsStateName(String goodsStateName) {
        this.goodsStateName = goodsStateName;
    }

    public String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public Long getGoodsUnitId() {
        return goodsUnitId;
    }

    public void setGoodsUnitId(Long goodsUnitId) {
        this.goodsUnitId = goodsUnitId;
    }

    public Double getAmountTotal() {
        return amountTotal;
    }

    public void setAmountTotal(Double amountTotal) {
        this.amountTotal = amountTotal;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getTotalMoney() {
        return totalMoney;
    }

    public void setTotalMoney(Double totalMoney) {
        this.totalMoney = totalMoney;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getFromSynStockTransCode() {
        return fromSynStockTransCode;
    }

    public void setFromSynStockTransCode(String fromSynStockTransCode) {
        this.fromSynStockTransCode = fromSynStockTransCode;
    }

    public Long getIsConfirm() {
        return isConfirm;
    }

    public void setIsConfirm(Long isConfirm) {
        this.isConfirm = isConfirm;
    }

    public Date getCreateDateTime() {
        return createDateTime;
    }

    public void setCreateDateTime(Date createDateTime) {
        this.createDateTime = createDateTime;
    }
}
