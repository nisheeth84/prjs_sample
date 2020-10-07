/*
 * Copyright 2011 Viettel Telecom. All rights reserved.
 * VIETTEL PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 */
package com.viettel.coms.bo;

import com.viettel.coms.dto.SynStockDailyImportExportDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "SYN_STOCK_DAILY_IMPORT_EXPORT")
public class SynStockDailyImportExportBO extends BaseFWModelImpl {

    @Override
    public BaseFWDTOImpl toDTO() {
        SynStockDailyImportExportDTO dto = new SynStockDailyImportExportDTO();
        dto.setSynStockDailyIeId(this.getSynStockDailyIeId());
        dto.setIeDate(this.getIeDate());
        dto.setStockTransType(this.getStockTransType());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setSysGroupCode(this.getSysGroupCode());
        dto.setSysGroupName(this.getSysGroupName());
        dto.setProvinceId(this.getProvinceId());
        dto.setProvinceCode(this.getProvinceCode());
        dto.setProvinceName(this.getProvinceName());
        dto.setCatStationCode(this.getCatStationCode());
        dto.setConstructionCode(this.getConstructionCode());
        dto.setConstructionState(this.getConstructionState());
        dto.setConstructionStateName(this.getConstructionStateName());
        dto.setContractCode(this.getContractCode());
        dto.setProvinceUserId(this.getProvinceUserId());
        dto.setProvinceUserName(this.getProvinceUserName());
        dto.setSysUserId(this.getSysUserId());
        dto.setSysUserName(this.getSysUserName());
        dto.setSynStockTransCode(this.getSynStockTransCode());
        dto.setRealIeTransDate(this.getRealIeTransDate());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setGoodsIsSerial(this.getGoodsIsSerial());
        dto.setGoodsState(this.getGoodsState());
        dto.setGoodsStateName(this.getGoodsStateName());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setAmountTotal(this.getAmountTotal());
        dto.setPrice(this.getPrice());
        dto.setTotalMoney(this.getTotalMoney());
        dto.setSerial(this.getSerial());
        dto.setFromSynStockTransCode(this.getFromSynStockTransCode());
        dto.setIsConfirm(this.getIsConfirm());
        dto.setCreateDateTime(this.getCreateDateTime());
        return dto;
    }

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "SYN_STOCK_DAILY_IE_SEQ")})
    @Column(name = "SYN_STOCK_DAILY_IE_ID", length = 10)
    private Long synStockDailyIeId;
    @Column(name = "IE_DATE", length = 22)
    private Date ieDate;
    @Column(name = "STOCK_TRANS_TYPE", length = 2 )
    private String stockTransType;
    @Column(name = "SYS_GROUP_ID", length = 10)
    private Long sysGroupId;
    @Column(name = "SYS_GROUP_CODE", length = 50)
    private String sysGroupCode;
    @Column(name = "SYS_GROUP_NAME", length = 10)
    private String sysGroupName;
    @Column(name = "PROVINCE_ID", length = 10)
    private Long provinceId;
    @Column(name = "PROVINCE_CODE", length = 50)
    private String provinceCode;
    @Column(name = "PROVINCE_NAME", length = 10)
    private String provinceName;
    @Column(name = "CAT_STATION_CODE", length = 50)
    private String catStationCode;
    @Column(name = "CONSTRUCTION_CODE", length = 50)
    private String constructionCode;
    @Column(name = "CONSTRUCTION_STATE", length = 1)
    private Long constructionState;
    @Column(name = "CONSTRUCTION_STATE_NAME", length = 10)
    private String constructionStateName;
    @Column(name = "CONTRACT_CODE", length = 50)
    private String contractCode;
    @Column(name = "PROVINCE_USER_ID", length = 10)
    private Long provinceUserId;
    @Column(name = "PROVINCE_USER_NAME", length = 10)
    private String provinceUserName;
    @Column(name = "SYS_USER_ID", length = 10)
    private Long sysUserId;
    @Column(name = "SYS_USER_NAME", length = 10)
    private String sysUserName;
    @Column(name = "SYN_STOCK_TRANS_CODE", length = 50)
    private String synStockTransCode;
    @Column(name = "REAL_IE_TRANS_DATE", length = 22)
    private Date realIeTransDate;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 50)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 50)
    private String goodsName;
    @Column(name = "GOODS_IS_SERIAL", length = 1 )
    private String goodsIsSerial;
    @Column(name = "GOODS_STATE", length = 1 )
    private String goodsState;
    @Column(name = "GOODS_STATE_NAME", length = 10)
    private String goodsStateName;
    @Column(name = "GOODS_UNIT_NAME", length = 10)
    private String goodsUnitName;
    @Column(name = "GOODS_UNIT_ID", length = 10)
    private Long goodsUnitId;
    @Column(name = "AMOUNT_TOTAL", length = 15)
    private Double amountTotal;
    @Column(name = "PRICE", length = 15)
    private Double price;
    @Column(name = "TOTAL_MONEY", length = 24)
    private Double totalMoney;
    @Column(name = "SERIAL", length = 10)
    private String serial;
    @Column(name = "FROM_SYN_STOCK_TRANS_CODE", length = 50)
    private String fromSynStockTransCode;
    @Column(name = "IS_CONFIRM", length = 1)
    private Long isConfirm;
    @Column(name = "CREATE_DATE_TIME", length = 22)
    private Date createDateTime;

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
