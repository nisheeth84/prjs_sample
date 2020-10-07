package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOWoGoodsDetailDTO;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@SuppressWarnings("serial")
@Entity
@Table(name = "AIO_WO_GOODS_DETAIL")
/**
 *
 * @author: hailh10
 */
public class AIOWoGoodsDetailBO extends BaseFWModelImpl {
    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_WO_GOODS_DETAIL_SEQ")})
    @Column(name = "WO_GOODS_DETAIL_ID", length = 22)
    private java.lang.Long woGoodsDetailId;
    @Column(name = "WO_GOODS_ID", length = 22)
    private java.lang.Long woGoodsId;
    @Column(name = "GOODS_ID", length = 22)
    private java.lang.Long goodsId;
    @Column(name = "GOODS_CODE", length = 50)
    private java.lang.String goodsCode;
    @Column(name = "GOODS_NAME", length = 200)
    private java.lang.String goodsName;
    @Column(name = "QUANTITY", length = 22)
    private Double quantity;
    @Column(name = "QUANTITY_ORDER", length = 22)
    private Double quantityOrder;
    @Column(name = "QUANTITY_REMAIN", length = 22)
    private Double quantityRemain;

    public java.lang.Long getWoGoodsDetailId() {
        return woGoodsDetailId;
    }

    public void setWoGoodsDetailId(java.lang.Long woGoodsDetailId) {
        this.woGoodsDetailId = woGoodsDetailId;
    }

    public java.lang.Long getWoGoodsId() {
        return woGoodsId;
    }

    public void setWoGoodsId(java.lang.Long woGoodsId) {
        this.woGoodsId = woGoodsId;
    }

    public java.lang.Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(java.lang.Long goodsId) {
        this.goodsId = goodsId;
    }

    public java.lang.String getGoodsCode() {
        return goodsCode;
    }

    public void setGoodsCode(java.lang.String goodsCode) {
        this.goodsCode = goodsCode;
    }

    public java.lang.String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(java.lang.String goodsName) {
        this.goodsName = goodsName;
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

    @Override
    public AIOWoGoodsDetailDTO toDTO() {
        AIOWoGoodsDetailDTO aioWoGoodsDetailDTO = new AIOWoGoodsDetailDTO();
        aioWoGoodsDetailDTO.setWoGoodsDetailId(this.woGoodsDetailId);
        aioWoGoodsDetailDTO.setWoGoodsId(this.woGoodsId);
        aioWoGoodsDetailDTO.setGoodsId(this.goodsId);
        aioWoGoodsDetailDTO.setGoodsCode(this.goodsCode);
        aioWoGoodsDetailDTO.setGoodsName(this.goodsName);
        aioWoGoodsDetailDTO.setQuantity(this.quantity);
        aioWoGoodsDetailDTO.setQuantityOrder(this.quantityOrder);
        aioWoGoodsDetailDTO.setQuantityRemain(this.quantityRemain);
        return aioWoGoodsDetailDTO;
    }
}
