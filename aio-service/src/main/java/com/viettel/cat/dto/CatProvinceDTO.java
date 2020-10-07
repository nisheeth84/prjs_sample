package com.viettel.cat.dto;

//import com.viettel.Common.CommonDTO.wmsBaseDTO;

import com.viettel.cat.bo.CatProvinceBO;
import com.viettel.wms.dto.wmsBaseDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;
//import com.viettel.erp.constant.ApplicationConstants;

/**
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CAT_PROVINCEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatProvinceDTO extends wmsBaseDTO<CatProvinceBO> {

    private java.lang.Long catProvinceId;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String status;
    private int start;
    private int maxResult;
    private List<String> idList;

    @Override
    public CatProvinceBO toModel() {
        CatProvinceBO catProvinceBO = new CatProvinceBO();
        catProvinceBO.setCatProvinceId(this.catProvinceId);
        catProvinceBO.setCode(this.code);
        catProvinceBO.setName(this.name);
        catProvinceBO.setStatus(this.status);
        return catProvinceBO;
    }

    @Override
    public Long getFWModelId() {
        return catProvinceId;
    }

    @Override
    public String catchName() {
        return getCatProvinceId().toString();
    }

    public List<String> getIdList() {
        return idList;
    }

    public void setIdList(List<String> idList) {
        this.idList = idList;
    }

    @JsonProperty("catProvinceId")
    public java.lang.Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(java.lang.Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    @JsonProperty("code")
    public java.lang.String getCode() {
        return code;
    }

    public void setCode(java.lang.String code) {
        this.code = code;
    }

    @JsonProperty("name")
    public java.lang.String getName() {
        return name;
    }

    public void setName(java.lang.String name) {
        this.name = name;
    }

    @JsonProperty("status")
    public java.lang.String getStatus() {
        return status;
    }

    public void setStatus(java.lang.String status) {
        this.status = status;
    }

    @JsonProperty("start")
    public int getStart() {
        return start;
    }

    public void setStart(int start) {
        this.start = start;
    }

    @JsonProperty("maxResult")
    public int getMaxResult() {
        return maxResult;
    }

    public void setMaxResult(int maxResult) {
        this.maxResult = maxResult;
    }

}
