package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOPackageGoodsAddBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;

//VietNT_20190308_create
@XmlRootElement(name = "AIO_PACKAGE_GOODS_ADDBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOPackageGoodsAddDTO extends ComsBaseFWDTO<AIOPackageGoodsAddBO> {

    private Long aioPackageGoodsAddId;
    private Long aioPackageId;
    private Long aioPackageDetailId;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Long goodsUnitId;
    private String goodsUnitName;
    private Double price;
    private Long goodsIsSerial;

    @Override
    public AIOPackageGoodsAddBO toModel() {
        AIOPackageGoodsAddBO bo = new AIOPackageGoodsAddBO();
        bo.setAioPackageGoodsAddId(this.getAioPackageGoodsAddId());
        bo.setAioPackageId(this.getAioPackageId());
        bo.setAioPackageDetailId(this.getAioPackageDetailId());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setGoodsUnitId(this.getGoodsUnitId());
        bo.setGoodsUnitName(this.getGoodsUnitName());
        bo.setPrice(this.getPrice());
        bo.setGoodsIsSerial(this.getGoodsIsSerial());

        return bo;
    }

    @Override
    public Long getFWModelId() {
        return aioPackageGoodsAddId;
    }

    @Override
    public String catchName() {
        return aioPackageGoodsAddId.toString();
    }

    public Long getAioPackageGoodsAddId() {
        return aioPackageGoodsAddId;
    }

    public void setAioPackageGoodsAddId(Long aioPackageGoodsAddId) {
        this.aioPackageGoodsAddId = aioPackageGoodsAddId;
    }

    public Long getAioPackageId() {
        return aioPackageId;
    }

    public void setAioPackageId(Long aioPackageId) {
        this.aioPackageId = aioPackageId;
    }

    public Long getAioPackageDetailId() {
        return aioPackageDetailId;
    }

    public void setAioPackageDetailId(Long aioPackageDetailId) {
        this.aioPackageDetailId = aioPackageDetailId;
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

    public Long getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(Long goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }
}
