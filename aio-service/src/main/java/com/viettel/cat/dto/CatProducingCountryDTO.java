package com.viettel.cat.dto;

import com.viettel.cat.bo.CatProducingCountryBO;
import com.viettel.wms.dto.wmsBaseDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;

//import com.viettel.Common.CommonDTO.wmsBaseDTO;
//import com.viettel.erp.constant.ApplicationConstants;

/**
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "CAT_PRODUCING_COUNTRYBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatProducingCountryDTO extends wmsBaseDTO<CatProducingCountryBO> {

    private java.lang.Long catProducingCountryId;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String status;

    @Override
    public CatProducingCountryBO toModel() {
        CatProducingCountryBO catProducingCountryBO = new CatProducingCountryBO();
        catProducingCountryBO.setCatProducingCountryId(this.catProducingCountryId);
        catProducingCountryBO.setCode(this.code);
        catProducingCountryBO.setName(this.name);
        catProducingCountryBO.setStatus(this.status);
        return catProducingCountryBO;
    }

    @Override
    public Long getFWModelId() {
        return catProducingCountryId;
    }

    @Override
    public String catchName() {
        return getCatProducingCountryId().toString();
    }

    @JsonProperty("catProducingCountryId")
    public java.lang.Long getCatProducingCountryId() {
        return catProducingCountryId;
    }

    public void setCatProducingCountryId(java.lang.Long catProducingCountryId) {
        this.catProducingCountryId = catProducingCountryId;
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


}
