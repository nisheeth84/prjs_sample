package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOConfigServiceBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190313_create
@XmlRootElement(name = "AIO_CONFIG_SERVICEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOConfigServiceDTO extends ComsBaseFWDTO<AIOConfigServiceBO> {

    private Long aioConfigServiceId;
    private String code;
    private String name;
    private Long type;
    private String status;
    private Long industryId;
    private String industryCode;
    private String industryName;
    private Double scale;
    private Double timePerform;

    // dto only
    private Long isInternal;
    private String parType;

    public Double getTimePerform() {
        return timePerform;
    }

    public void setTimePerform(Double timePerform) {
        this.timePerform = timePerform;
    }

    public Long getIndustryId() {
        return industryId;
    }

    public void setIndustryId(Long industryId) {
        this.industryId = industryId;
    }

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

    public Double getScale() {
        return scale;
    }

    public void setScale(Double scale) {
        this.scale = scale;
    }

    public String getParType() {
        return parType;
    }

    public void setParType(String parType) {
        this.parType = parType;
    }

    public Long getIsInternal() {
        return isInternal;
    }

    public void setIsInternal(Long isInternal) {
        this.isInternal = isInternal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getAioConfigServiceId() {
        return aioConfigServiceId;
    }

    public void setAioConfigServiceId(Long aioConfigServiceId) {
        this.aioConfigServiceId = aioConfigServiceId;
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

    public Long getType() {
        return type;
    }

    public void setType(Long type) {
        this.type = type;
    }

    @Override
    public AIOConfigServiceBO toModel() {
        AIOConfigServiceBO bo = new AIOConfigServiceBO();
        bo.setAioConfigServiceId(this.getAioConfigServiceId());
        bo.setCode(this.getCode());
        bo.setName(this.getName());
        bo.setType(this.getType());
        bo.setStatus(this.status);
        bo.setIndustryId(this.getIndustryId());
        bo.setIndustryCode(this.getIndustryCode());
        bo.setIndustryName(this.getIndustryName());
        bo.setScale(this.getScale());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioConfigServiceId;
    }

    @Override
    public String catchName() {
        return aioConfigServiceId.toString();
    }
}
