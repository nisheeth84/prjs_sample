package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOProductGoodsBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190724_create
@XmlRootElement(name = "AIO_PRODUCT_GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOProductGoodsDTO extends ComsBaseFWDTO<AIOProductGoodsBO> {

    private Long productGoodsId;
    private Long productInfoId;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;

    @Override
    public AIOProductGoodsBO toModel() {
        AIOProductGoodsBO bo = new AIOProductGoodsBO();
        bo.setProductGoodsId(this.getProductGoodsId());
        bo.setProductInfoId(this.getProductInfoId());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return productGoodsId;
    }

    @Override
    public String catchName() {
        return productGoodsId.toString();
    }

    public Long getProductGoodsId() {
        return productGoodsId;
    }

    public void setProductGoodsId(Long productGoodsId) {
        this.productGoodsId = productGoodsId;
    }

    public Long getProductInfoId() {
        return productInfoId;
    }

    public void setProductInfoId(Long productInfoId) {
        this.productInfoId = productInfoId;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
    }

    public String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }
}
