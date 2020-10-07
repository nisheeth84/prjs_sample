package com.viettel.coms.bo;

import com.viettel.coms.dto.RequestGoodsDetailDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190401_created
@Entity
@Table(name = "REQUEST_GOODS_DETAIL")
public class RequestGoodsDetailBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "REQUEST_GOODS_DETAIL_SEQ")})
    @Column(name = "REQUEST_GOODS_DETAIL_ID", length = 10)
    private Long requestGoodsDetailId;
    @Column(name = "REQUEST_GOODS_ID", length = 10)
    private Long requestGoodsId;
    @Column(name = "GOODS_NAME", length = 20)
    private String goodsName;
    @Column(name = "SUGGEST_DATE", length = 22)
    private Date suggestDate;
    @Column(name = "CAT_UNIT_ID", length = 10)
    private Long catUnitId;
    @Column(name = "CAT_UNIT_NAME", length = 20)
    private String catUnitName;
    @Column(name = "QUANTITY", length = 18)
    private Double quantity;
    @Column(name = "DESCRIPTION", length = 40)
    private String description;

    @Override
    public BaseFWDTOImpl toDTO() {
        RequestGoodsDetailDTO dto = new RequestGoodsDetailDTO();
        dto.setRequestGoodsDetailId(this.getRequestGoodsDetailId());
        dto.setRequestGoodsId(this.getRequestGoodsId());
        dto.setGoodsName(this.getGoodsName());
        dto.setSuggestDate(this.getSuggestDate());
        dto.setCatUnitId(this.getCatUnitId());
        dto.setCatUnitName(this.getCatUnitName());
        dto.setQuantity(this.getQuantity());
        dto.setDescription(this.getDescription());
        return dto;
    }

    public Long getRequestGoodsDetailId() {
        return requestGoodsDetailId;
    }

    public void setRequestGoodsDetailId(Long requestGoodsDetailId) {
        this.requestGoodsDetailId = requestGoodsDetailId;
    }

    public Long getRequestGoodsId() {
        return requestGoodsId;
    }

    public void setRequestGoodsId(Long requestGoodsId) {
        this.requestGoodsId = requestGoodsId;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public Date getSuggestDate() {
        return suggestDate;
    }

    public void setSuggestDate(Date suggestDate) {
        this.suggestDate = suggestDate;
    }

    public Long getCatUnitId() {
        return catUnitId;
    }

    public void setCatUnitId(Long catUnitId) {
        this.catUnitId = catUnitId;
    }

    public String getCatUnitName() {
        return catUnitName;
    }

    public void setCatUnitName(String catUnitName) {
        this.catUnitName = catUnitName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
