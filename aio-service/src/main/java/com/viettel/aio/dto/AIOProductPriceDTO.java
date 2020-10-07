package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOProductPriceBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190701_create
@XmlRootElement(name = "AIO_PRODUCT_PRICEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOProductPriceDTO extends ComsBaseFWDTO<AIOProductPriceBO> {

    private Long productPriceId;
    private Long productInfoId;
    private Long provinceId;
    private String provinceCode;
    private String provinceName;
    private Double price;

    public Long getProductPriceId() {
        return productPriceId;
    }

    public void setProductPriceId(Long productPriceId) {
        this.productPriceId = productPriceId;
    }

    public Long getProductInfoId() {
        return productInfoId;
    }

    public void setProductInfoId(Long productInfoId) {
        this.productInfoId = productInfoId;
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    @Override
    public AIOProductPriceBO toModel() {
        AIOProductPriceBO bo = new AIOProductPriceBO();
        bo.setProductPriceId(this.getProductPriceId());
        bo.setProductInfoId(this.getProductInfoId());
        bo.setCatProvinceId(this.getProvinceId());
        bo.setProvinceCode(this.getProvinceCode());
        bo.setProvinceName(this.getProvinceName());
        bo.setPrice(this.getPrice());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return productPriceId;
    }

    @Override
    public String catchName() {
        return productPriceId.toString();
    }
}
