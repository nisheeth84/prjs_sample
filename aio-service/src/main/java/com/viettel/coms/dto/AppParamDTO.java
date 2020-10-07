package com.viettel.coms.dto;

import com.viettel.service.base.model.BaseFWModelImpl;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.map.annotate.JsonSerialize;

@JsonIgnoreProperties(ignoreUnknown = true)
@JsonSerialize(include = JsonSerialize.Inclusion.NON_NULL)
public class AppParamDTO extends ComsBaseFWDTO<BaseFWModelImpl> {
    private String code;
    private String name;
    private String parOrder;
    private String parType;
    private String status;
    // phucvx_28/06/2018
    private Double amount;
    // chinhpxn_20180614_start
    private Long appParamId;
    // chinhpxn_20180614_end
    private String confirm;
    //	hoanm1_20180703_start
    private Long constructionTaskDailyId;

    private String industryName;
    private String industryCode;

    public String getIndustryCode() {
        return industryCode;
    }

    public void setIndustryCode(String industryCode) {
        this.industryCode = industryCode;
    }

    public String getIndustryName() {
        return industryName;
    }

    public void setIndustryName(String industryName) {
        this.industryName = industryName;
    }

    public Long getConstructionTaskDailyId() {
        return constructionTaskDailyId;
    }

    public void setConstructionTaskDailyId(Long constructionTaskDailyId) {
        this.constructionTaskDailyId = constructionTaskDailyId;
    }

    //	hoanm1_20180703_end
    // chinhpxn_20180614_start
    public Long getAppParamId() {
        return appParamId;
    }

    public void setAppParamId(Long appParamId) {
        this.appParamId = appParamId;
    }

    // chinhpxn_20180614_end
    public String getParOrder() {
        return parOrder;
    }

    public void setParOrder(String parOrder) {
        this.parOrder = parOrder;
    }

    public String getParType() {
        return parType;
    }

    public void setParType(String parType) {
        this.parType = parType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String catchName() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Long getFWModelId() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public BaseFWModelImpl toModel() {
        // TODO Auto-generated method stub
        return null;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getConfirm() {
        return confirm;
    }

    public void setConfirm(String confirm) {
        this.confirm = confirm;
    }

    //HuyPq-20190504-start
    private Long speciesId;
    private String speciesName;
    private Long areaId;
    private String areaName;

    public Long getSpeciesId() {
        return speciesId;
    }

    public void setSpeciesId(Long speciesId) {
        this.speciesId = speciesId;
    }

    public String getSpeciesName() {
        return speciesName;
    }

    public void setSpeciesName(String speciesName) {
        this.speciesName = speciesName;
    }

    public Long getAreaId() {
        return areaId;
    }

    public void setAreaId(Long areaId) {
        this.areaId = areaId;
    }

    public String getAreaName() {
        return areaName;
    }

    public void setAreaName(String areaName) {
        this.areaName = areaName;
    }

    //Huy-end
}
