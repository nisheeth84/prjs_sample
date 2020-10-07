package com.viettel.aio.dto.report;

import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIORpBacklogContractDTO extends ComsBaseFWDTO {

    public static final int LEVEL_PROVINCE = 1;
    public static final int LEVEL_GROUP = 2;

    public AIORpBacklogContractDTO() {
        areaCodes = new ArrayList<>();
        groupIds = new ArrayList<>();
    }

    private int rpLevel;
    private List<String> areaCodes;
    private List<Long> groupIds;

    private Long areaId;
    private String areaCode;
    private String provinceCode;
    private String provinceName;
    private String groupName;
    private long tongTon;
    private long ton1Ngay;
    private long ton2Ngay;
    private long ton3Ngay;
    private long tonQua3Ngay;
    private long choHuy;
    private long hdmTrongNgay;
    private long hdntTrongNgay;

    private List<Long> areaIds;

    public List<Long> getAreaIds() {
        return areaIds;
    }

    public void setAreaIds(List<Long> areaIds) {
        this.areaIds = areaIds;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public int getRpLevel() {
        return rpLevel;
    }

    public void setRpLevel(int rpLevel) {
        this.rpLevel = rpLevel;
    }

    public List<String> getAreaCodes() {
        return areaCodes;
    }

    public void setAreaCodes(List<String> areaCodes) {
        this.areaCodes = areaCodes;
    }

    public List<Long> getGroupIds() {
        return groupIds;
    }

    public void setGroupIds(List<Long> groupIds) {
        this.groupIds = groupIds;
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

    public String getProvinceName() {
        return provinceName;
    }

    public void setProvinceName(String provinceName) {
        this.provinceName = provinceName;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public long getTongTon() {
        return tongTon;
    }

    public void setTongTon(long tongTon) {
        this.tongTon = tongTon;
    }

    public long getTon1Ngay() {
        return ton1Ngay;
    }

    public void setTon1Ngay(long ton1Ngay) {
        this.ton1Ngay = ton1Ngay;
    }

    public long getTon2Ngay() {
        return ton2Ngay;
    }

    public void setTon2Ngay(long ton2Ngay) {
        this.ton2Ngay = ton2Ngay;
    }

    public long getTon3Ngay() {
        return ton3Ngay;
    }

    public void setTon3Ngay(long ton3Ngay) {
        this.ton3Ngay = ton3Ngay;
    }

    public long getTonQua3Ngay() {
        return tonQua3Ngay;
    }

    public void setTonQua3Ngay(long tonQua3Ngay) {
        this.tonQua3Ngay = tonQua3Ngay;
    }

    public long getChoHuy() {
        return choHuy;
    }

    public void setChoHuy(long choHuy) {
        this.choHuy = choHuy;
    }

    public long getHdmTrongNgay() {
        return hdmTrongNgay;
    }

    public void setHdmTrongNgay(long hdmTrongNgay) {
        this.hdmTrongNgay = hdmTrongNgay;
    }

    public long getHdntTrongNgay() {
        return hdntTrongNgay;
    }

    public void setHdntTrongNgay(long hdntTrongNgay) {
        this.hdntTrongNgay = hdntTrongNgay;
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
}
