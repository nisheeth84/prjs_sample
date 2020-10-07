package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOProductGoodsDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

//VietNT_20190724_start
@Entity
@Table(name = "AIO_PRODUCT_GOODS")
public class AIOProductGoodsBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_PRODUCT_GOODS_SEQ")})
    @Column(name = "PRODUCT_GOODS_ID", length = 10)
    private Long productGoodsId;
    @Column(name = "PRODUCT_INFO_ID", length = 10)
    private Long productInfoId;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 200)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 2000)
    private String goodsName;

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOProductGoodsDTO dto = new AIOProductGoodsDTO();
        dto.setProductGoodsId(this.getProductGoodsId());
        dto.setProductInfoId(this.getProductInfoId());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        return dto;
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
