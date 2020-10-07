package com.viettel.aio.bo;

import com.viettel.aio.dto.GoodsPriceDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190308_create
@Entity
@Table(name = "AIO_GOODS_PRICE")
public class GoodsPriceBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "GOODS_PRICE_SEQ")})
    @Column(name = "AIO_GOODS_PRICE_ID", length = 10)
    private Long goodsPriceId;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 50)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 50)
    private String goodsName;
    @Column(name = "GOODS_UNIT_ID", length = 10)
    private Long goodsUnitId;
    @Column(name = "GOODS_UNIT_NAME", length = 50)
    private String goodsUnitName;
    @Column(name = "PRICE", length = 15)
    private Double price;
    @Column(name = "STATUS", length = 1)
    private Long status;
    @Column(name = "GOODS_IS_SERIAL", length = 1)
    private String goodsIsSerial;

    @Override
    public BaseFWDTOImpl toDTO() {
        GoodsPriceDTO dto = new GoodsPriceDTO();
        dto.setGoodsPriceId(this.getGoodsPriceId());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setGoodsUnitId(this.getGoodsUnitId());
        dto.setGoodsUnitName(this.getGoodsUnitName());
        dto.setPrice(this.getPrice());
        dto.setStatus(this.getStatus());
        dto.setGoodsIsSerial(this.getGoodsIsSerial());
        return dto;
    }

    public String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
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
