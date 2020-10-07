package com.viettel.aio.bo;

import com.viettel.aio.dto.AIOConfigStockedGoodsDTO;
import com.viettel.service.base.dto.BaseFWDTOImpl;
import com.viettel.service.base.model.BaseFWModelImpl;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;

//VietNT_20190530_start
@Entity
@Table(name = "AIO_CONFIG_STOCKED_GOODS")
public class AIOConfigStockedGoodsBO extends BaseFWModelImpl {

    @Id
    @GeneratedValue(generator = "sequence")
    @GenericGenerator(name = "sequence", strategy = "sequence", parameters = {
            @org.hibernate.annotations.Parameter(name = "sequence", value = "AIO_CONFIG_STOCKED_GOODS_SEQ")})
    @Column(name = "CONFIG_STOCKED_GOODS_ID", length = 10)
    private Long configStockedGoodsId;
    @Column(name = "SYS_GROUP_ID", length = 10)
    private Long sysGroupId;
    @Column(name = "SYS_GROUP_NAME", length = 20)
    private String sysGroupName;
    @Column(name = "GOODS_ID", length = 10)
    private Long goodsId;
    @Column(name = "GOODS_CODE", length = 50)
    private String goodsCode;
    @Column(name = "GOODS_NAME", length = 20)
    private String goodsName;
    @Column(name = "CAT_UNIT_ID", length = 10)
    private Long catUnitId;
    @Column(name = "CAT_UNIT_NAME", length = 20)
    private String catUnitName;
    @Column(name = "MIN_QUANTITY", length = 15)
    private Double minQuantity;
    @Column(name = "MAX_QUANTITY", length = 15)
    private Double maxQuantity;
    @Column(name = "TIME_STOCKED", length = 15)
    private Double timeStocked;
    @Column(name = "CREATED_DATE", length = 22)
    private Date createdDate;
    @Column(name = "CREATED_USER", length = 10)
    private Long createdUser;
    @Column(name = "UPDATED_DATE", length = 22)
    private Date updatedDate;
    @Column(name = "UPDATED_USER", length = 10)
    private Long updatedUser;

    public Long getConfigStockedGoodsId() {
        return configStockedGoodsId;
    }

    public void setConfigStockedGoodsId(Long configStockedGoodsId) {
        this.configStockedGoodsId = configStockedGoodsId;
    }

    public Long getSysGroupId() {
        return sysGroupId;
    }

    public void setSysGroupId(Long sysGroupId) {
        this.sysGroupId = sysGroupId;
    }

    public String getSysGroupName() {
        return sysGroupName;
    }

    public void setSysGroupName(String sysGroupName) {
        this.sysGroupName = sysGroupName;
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

    public Double getMinQuantity() {
        return minQuantity;
    }

    public void setMinQuantity(Double minQuantity) {
        this.minQuantity = minQuantity;
    }

    public Double getMaxQuantity() {
        return maxQuantity;
    }

    public void setMaxQuantity(Double maxQuantity) {
        this.maxQuantity = maxQuantity;
    }

    public Double getTimeStocked() {
        return timeStocked;
    }

    public void setTimeStocked(Double timeStocked) {
        this.timeStocked = timeStocked;
    }

    public Date getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Date createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedUser() {
        return createdUser;
    }

    public void setCreatedUser(Long createdUser) {
        this.createdUser = createdUser;
    }

    public Date getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(Date updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdatedUser() {
        return updatedUser;
    }

    public void setUpdatedUser(Long updatedUser) {
        this.updatedUser = updatedUser;
    }

    @Override
    public BaseFWDTOImpl toDTO() {
        AIOConfigStockedGoodsDTO dto = new AIOConfigStockedGoodsDTO();
        dto.setConfigStockedGoodsId(this.getConfigStockedGoodsId());
        dto.setSysGroupId(this.getSysGroupId());
        dto.setSysGroupName(this.getSysGroupName());
        dto.setGoodsId(this.getGoodsId());
        dto.setGoodsCode(this.getGoodsCode());
        dto.setGoodsName(this.getGoodsName());
        dto.setCatUnitId(this.getCatUnitId());
        dto.setCatUnitName(this.getCatUnitName());
        dto.setMinQuantity(this.getMinQuantity());
        dto.setMaxQuantity(this.getMaxQuantity());
        dto.setTimeStocked(this.getTimeStocked());
        dto.setCreatedDate(this.getCreatedDate());
        dto.setCreatedUser(this.getCreatedUser());
        dto.setUpdatedDate(this.getUpdatedDate());
        dto.setUpdatedUser(this.getUpdatedUser());
        return dto;
    }
}
