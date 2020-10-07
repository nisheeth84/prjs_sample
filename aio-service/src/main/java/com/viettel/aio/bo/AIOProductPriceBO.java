package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOProductPriceDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190701_start
@Entity
@Table(name = "AIO_PRODUCT_PRICE")
public class AIOProductPriceBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PRODUCT_PRICE_SEQ")})
    @Column(name = "PRODUCT_PRICE_ID", length = 10)
    private Long productPriceId;
    @Column(name = "PRODUCT_INFO_ID", length = 10)
    private Long productInfoId;
    @Column(name = "CAT_PROVINCE_ID", length = 10)
    private Long catProvinceId;
    @Column(name = "PROVINCE_CODE", length = 50)
    private String provinceCode;
    @Column(name = "PROVINCE_NAME", length = 500)
    private String provinceName;
    @Column(name = "PRICE", length = 20)
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

    public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
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
    public BaseFWDTOImpl toDTO() {
        AIOProductPriceDTO dto = new AIOProductPriceDTO();
        dto.setProductPriceId(this.getProductPriceId());
        dto.setProductInfoId(this.getProductInfoId());
        dto.setProvinceId(this.getCatProvinceId());
        dto.setProvinceCode(this.getProvinceCode());
        dto.setProvinceName(this.getProvinceName());
        dto.setPrice(this.getPrice());
        return dto;
    }
}
