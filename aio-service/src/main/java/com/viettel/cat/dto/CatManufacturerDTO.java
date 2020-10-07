package com.viettel.cat.dto;

import com.viettel.cat.bo.CatManufacturerBO;
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
@XmlRootElement(name = "CAT_MANUFACTURERBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class CatManufacturerDTO extends wmsBaseDTO<CatManufacturerBO> {

    private java.lang.Long catManufacturerId;
    private java.lang.String code;
    private java.lang.String name;
    private java.lang.String status;


    @Override
    public CatManufacturerBO toModel() {
        CatManufacturerBO catManufacturerBO = new CatManufacturerBO();
        catManufacturerBO.setCatManufacturerId(this.catManufacturerId);
        catManufacturerBO.setCode(this.code);
        catManufacturerBO.setName(this.name);
        catManufacturerBO.setStatus(this.status);
        return catManufacturerBO;
    }

    @Override
    public Long getFWModelId() {
        return catManufacturerId;
    }

    @Override
    public String catchName() {
        return getCatManufacturerId().toString();
    }

    @JsonProperty("catManufacturerId")
    public java.lang.Long getCatManufacturerId() {
        return catManufacturerId;
    }

    public void setCatManufacturerId(java.lang.Long catManufacturerId) {
        this.catManufacturerId = catManufacturerId;
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
