package com.viettel.aio.dto.report;

import com.viettel.coms.dto.ComsBaseFWDTO;
import com.viettel.erp.utils.JsonDateDeserializer;
import com.viettel.erp.utils.JsonDateSerializerDate;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonDeserialize;
import org.codehaus.jackson.map.annotate.JsonSerialize;

import java.util.Date;

/**
 * Created by HaiND on 9/26/2019 9:29 PM.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIORpIncidentDTO extends ComsBaseFWDTO {

    private String areaCode;
    private String text;
    private Long areaId;
    private Long groupId;
    private String groupCode;
    private String groupName;
    private String provinceCode;
    private String provinceName;
    private String clusterName;
    private Long incidentNo;
    private Double perform12h;
    private Double perform24h;
    private Double perform48h;
    private Double soTarget12h;
    private Double soTarget24h;
    private Double soTarget48h;
    private Long rank12h;
    private Long rank24h;
    private Long rank48h;
    private int isCluster;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date startDate;
    @JsonSerialize(using = JsonDateSerializerDate.class)
    @JsonDeserialize(using = JsonDateDeserializer.class)
    private Date endDate;

    public String getAreaCode() {
        return areaCode;
    }

    public void setAreaCode(String areaCode) {
        this.areaCode = areaCode;
    }

    @Override
    public String getText() {
        return text;
    }

    @Override
    public void setText(String text) {
        this.text = text;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getGroupCode() {
        return groupCode;
    }

    public void setGroupCode(String groupCode) {
        this.groupCode = groupCode;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
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

    public String getClusterName() {
        return clusterName;
    }

    public void setClusterName(String clusterName) {
        this.clusterName = clusterName;
    }

    public Long getIncidentNo() {
        return incidentNo;
    }

    public void setIncidentNo(Long incidentNo) {
        this.incidentNo = incidentNo;
    }

    public Double getPerform12h() {
        return perform12h;
    }

    public void setPerform12h(Double perform12h) {
        this.perform12h = perform12h;
    }

    public Double getPerform24h() {
        return perform24h;
    }

    public void setPerform24h(Double perform24h) {
        this.perform24h = perform24h;
    }

    public Double getPerform48h() {
        return perform48h;
    }

    public void setPerform48h(Double perform48h) {
        this.perform48h = perform48h;
    }

    public Double getSoTarget12h() {
        return soTarget12h;
    }

    public void setSoTarget12h(Double soTarget12h) {
        this.soTarget12h = soTarget12h;
    }

    public Double getSoTarget24h() {
        return soTarget24h;
    }

    public void setSoTarget24h(Double soTarget24h) {
        this.soTarget24h = soTarget24h;
    }

    public Double getSoTarget48h() {
        return soTarget48h;
    }

    public void setSoTarget48h(Double soTarget48h) {
        this.soTarget48h = soTarget48h;
    }

    public Long getRank12h() {
        return rank12h;
    }

    public void setRank12h(Long rank12h) {
        this.rank12h = rank12h;
    }

    public Long getRank24h() {
        return rank24h;
    }

    public void setRank24h(Long rank24h) {
        this.rank24h = rank24h;
    }

    public Long getRank48h() {
        return rank48h;
    }

    public void setRank48h(Long rank48h) {
        this.rank48h = rank48h;
    }

    public int getIsCluster() {
        return isCluster;
    }

    public void setIsCluster(int isCluster) {
        this.isCluster = isCluster;
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