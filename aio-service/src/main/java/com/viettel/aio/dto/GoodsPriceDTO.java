package com.viettel.aio.dto;

import com.viettel.aio.bo.GoodsPriceBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.List;

//VietNT_20190308_create
@XmlRootElement(name = "GOOD_PRICEBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoodsPriceDTO extends ComsBaseFWDTO<GoodsPriceBO> {

    private Long goodsPriceId;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Long goodsUnitId;
    private String goodsUnitName;
    private Double price;
    private Long status;
    private String goodsIsSerial;

    // dto only
    private List<GoodsPriceDTO> goodsPriceDTOS;

    @Override
    public GoodsPriceBO toModel() {
        GoodsPriceBO bo = new GoodsPriceBO();
        bo.setGoodsPriceId(this.getGoodsPriceId());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setPrice(this.getPrice());
        bo.setStatus(this.getStatus());
        bo.setGoodsIsSerial(this.getGoodsIsSerial());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return goodsPriceId;
    }

    @Override
    public String catchName() {
        return goodsPriceId.toString();
    }

    public String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    public List<GoodsPriceDTO> getGoodsPriceDTOS() {
        return goodsPriceDTOS;
    }

    public void setGoodsPriceDTOS(List<GoodsPriceDTO> goodsPriceDTOS) {
        this.goodsPriceDTOS = goodsPriceDTOS;
    }

    public Long getGoodsPriceId() {
        return goodsPriceId;
    }

    public void setGoodsPriceId(Long goodsPriceId) {
        this.goodsPriceId = goodsPriceId;
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

    public Long getGoodsUnitId() {
        return goodsUnitId;
    }

    public void setGoodsUnitId(Long goodsUnitId) {
        this.goodsUnitId = goodsUnitId;
    }

    public String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Long getStatus() {
        return status;
    }

    public void setStatus(Long status) {
        this.status = status;
    }
}
