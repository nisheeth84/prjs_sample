package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOWoGoodsDetailBO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;
import org.codehaus.jackson.annotate.JsonProperty;

import javax.xml.bind.annotation.XmlRootElement;

/**
 * @author hailh10
 */
@SuppressWarnings("serial")
@XmlRootElement(name = "AIO_WO_GOODS_DETAILBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOWoGoodsDetailDTO extends ComsBaseFWDTO<AIOWoGoodsDetailBO> {

    private java.lang.Long woGoodsDetailId;
    private java.lang.String woGoodsDetailName;
    private java.lang.Long woGoodsId;
    private java.lang.String woGoodsName;
    private java.lang.Long goodsId;
    private java.lang.String goodsName;
    private java.lang.String goodsCode;
    private Double quantity;
    private Double quantityOrder;
    private Double quantityRemain;
    private int start;
    private int maxResult;

    @Override
    public AIOWoGoodsDetailBO toModel() {
        AIOWoGoodsDetailBO aioWoGoodsDetailBO = new AIOWoGoodsDetailBO();
        aioWoGoodsDetailBO.setWoGoodsDetailId(this.woGoodsDetailId);
        aioWoGoodsDetailBO.setWoGoodsId(this.woGoodsId);
        aioWoGoodsDetailBO.setGoodsId(this.goodsId);
        aioWoGoodsDetailBO.setGoodsCode(this.goodsCode);
        aioWoGoodsDetailBO.setGoodsName(this.goodsName);
        aioWoGoodsDetailBO.setQuantity(this.quantity);
        aioWoGoodsDetailBO.setQuantityOrder(this.quantityOrder);
        aioWoGoodsDetailBO.setQuantityRemain(this.quantityRemain);
        return aioWoGoodsDetailBO;
    }

    @JsonProperty("woGoodsDetailId")
    public java.lang.Long getWoGoodsDetailId() {
        return woGoodsDetailId;
    }

    public void setWoGoodsDetailId(java.lang.Long woGoodsDetailId) {
        this.woGoodsDetailId = woGoodsDetailId;
    }

    @JsonProperty("woGoodsDetailName")
    public java.lang.String getWoGoodsDetailName() {
        return woGoodsDetailName;
    }

    public void setWoGoodsDetailName(java.lang.String woGoodsDetailName) {
        this.woGoodsDetailName = woGoodsDetailName;
    }

    @JsonProperty("woGoodsId")
    public java.lang.Long getWoGoodsId() {
        return woGoodsId;
    }

    public void setWoGoodsId(java.lang.Long woGoodsId) {
        this.woGoodsId = woGoodsId;
    }

    @JsonProperty("woGoodsName")
    public java.lang.String getWoGoodsName() {
        return woGoodsName;
    }

    public void setWoGoodsName(java.lang.String woGoodsName) {
        this.woGoodsName = woGoodsName;
    }

    @JsonProperty("goodsId")
    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    @JsonProperty("goodsName")
    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
    }

    @JsonProperty("goodsCode")
    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    @JsonProperty("quantity")
    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getQuantityOrder() {
        return quantityOrder;
    }

    public void setQuantityOrder(Double quantityOrder) {
        this.quantityOrder = quantityOrder;
    }

    public Double getQuantityRemain() {
        return quantityRemain;
    }

    public void setQuantityRemain(Double quantityRemain) {
        this.quantityRemain = quantityRemain;
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
}
