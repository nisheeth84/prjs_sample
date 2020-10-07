package com.viettel.aio.dto.report;

import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class AIORpImplementDTO extends ComsBaseFWDTO {

    public static final Integer LEVEL_PROVINCE = 1;
    public static final Integer LEVEL_GROUP = 2;

    public AIORpImplementDTO() {
        areaCodes = new ArrayList<>();
        groupIds = new ArrayList<>();
    }

    private Integer rpLevel;
    private List<String> areaCodes;
    private List<Long> groupIds;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;
    private String areaCode;
    private String provinceCode;
    private String provinceName;
    private String groupName;
    private Integer soKPIToi;
    private Double tyleTONG1;
    private Double soTT1;
    private Integer rankTT1;
    private Double tyleTM1;
    private Double soTTM1;
    private Double tyleDV1;
    private Double soTDV1;
    private Double tyleTONG2;
    private Double soTT2;
    private Integer rankTT2;
    private Double tyleTM2;
    private Double soTTM2;
    private Double tyleDV2;
    private Double soTDV2;
    private Double tyleTONG3;
    private Double soTT3;
    private Integer rankTT3;
    private Double tyleTM3;
    private Double soTTM3;
    private Double tyleDV3;
    private Double soTDV3;

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

    public Integer getSoKPIToi() {
        if (soKPIToi != null && soKPIToi != 0)
            return soKPIToi;

        if (soTDV1 == null &&
                soTTM1 == null &&
                soTDV2 == null &&
                soTTM2 == null &&
                soTDV3 == null &&
                soTTM3 == null) return null;

        Integer cnt = 0;
        if (soTDV1 != null && soTDV1 > 0) cnt++;
        if (soTTM1 != null && soTTM1 > 0) cnt++;
        if (soTDV2 != null && soTDV2 > 0) cnt++;
        if (soTTM2 != null && soTTM2 > 0) cnt++;
        if (soTDV3 != null && soTDV3 > 0) cnt++;
        if (soTTM3 != null && soTTM3 > 0) cnt++;
        soKPIToi = cnt;
        return soKPIToi;
    }

    public void setSoKPIToi(Integer soKPIToi) {
        this.soKPIToi = soKPIToi;
    }

    public Double getTyleTONG1() {
        return tyleTONG1;
    }

    public void setTyleTONG1(Double tyleTONG1) {
        this.tyleTONG1 = tyleTONG1;
    }

    public Double getSoTT1() {
        return soTT1;
    }

    public void setSoTT1(Double soTT1) {
        this.soTT1 = soTT1;
    }

    public Double getTyleTM1() {
        return tyleTM1;
    }

    public void setTyleTM1(Double tyleTM1) {
        this.tyleTM1 = tyleTM1;
    }

    public Double getSoTTM1() {
        return soTTM1;
    }

    public void setSoTTM1(Double soTTM1) {
        this.soTTM1 = soTTM1;
    }

    public Double getTyleDV1() {
        return tyleDV1;
    }

    public void setTyleDV1(Double tyleDV1) {
        this.tyleDV1 = tyleDV1;
    }

    public Double getSoTDV1() {
        return soTDV1;
    }

    public void setSoTDV1(Double soTDV1) {
        this.soTDV1 = soTDV1;
    }

    public Double getTyleTONG2() {
        return tyleTONG2;
    }

    public void setTyleTONG2(Double tyleTONG2) {
        this.tyleTONG2 = tyleTONG2;
    }

    public Double getSoTT2() {
        return soTT2;
    }

    public void setSoTT2(Double soTT2) {
        this.soTT2 = soTT2;
    }

    public Double getTyleTM2() {
        return tyleTM2;
    }

    public void setTyleTM2(Double tyleTM2) {
        this.tyleTM2 = tyleTM2;
    }

    public Double getSoTTM2() {
        return soTTM2;
    }

    public void setSoTTM2(Double soTTM2) {
        this.soTTM2 = soTTM2;
    }

    public Double getTyleDV2() {
        return tyleDV2;
    }

    public void setTyleDV2(Double tyleDV2) {
        this.tyleDV2 = tyleDV2;
    }

    public Double getSoTDV2() {
        return soTDV2;
    }

    public void setSoTDV2(Double soTDV2) {
        this.soTDV2 = soTDV2;
    }

    public Double getTyleTONG3() {
        return tyleTONG3;
    }

    public void setTyleTONG3(Double tyleTONG3) {
        this.tyleTONG3 = tyleTONG3;
    }

    public Double getSoTT3() {
        return soTT3;
    }

    public void setSoTT3(Double soTT3) {
        this.soTT3 = soTT3;
    }

    public Double getTyleTM3() {
        return tyleTM3;
    }

    public void setTyleTM3(Double tyleTM3) {
        this.tyleTM3 = tyleTM3;
    }

    public Double getSoTTM3() {
        return soTTM3;
    }

    public void setSoTTM3(Double soTTM3) {
        this.soTTM3 = soTTM3;
    }

    public Double getTyleDV3() {
        return tyleDV3;
    }

    public void setTyleDV3(Double tyleDV3) {
        this.tyleDV3 = tyleDV3;
    }

    public Double getSoTDV3() {
        return soTDV3;
    }

    public void setSoTDV3(Double soTDV3) {
        this.soTDV3 = soTDV3;
    }

    public Integer getRpLevel() {
        return rpLevel;
    }

    public void setRpLevel(Integer rpLevel) {
        this.rpLevel = rpLevel;
    }

    public Integer getRankTT1() {
        return rankTT1;
    }

    public void setRankTT1(Integer rankTT1) {
        this.rankTT1 = rankTT1;
    }

    public Integer getRankTT2() {
        return rankTT2;
    }

    public void setRankTT2(Integer rankTT2) {
        this.rankTT2 = rankTT2;
    }

    public Integer getRankTT3() {
        return rankTT3;
    }

    public void setRankTT3(Integer rankTT3) {
        this.rankTT3 = rankTT3;
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
