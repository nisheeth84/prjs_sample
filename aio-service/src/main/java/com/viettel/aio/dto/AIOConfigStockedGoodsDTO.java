package com.viettel.aio.dto;

import com.viettel.aio.bo.AIOConfigStockedGoodsBO;
import com.viettel.coms.dto.ComsBaseFWDTO;
import org.codehaus.jackson.annotate.JsonIgnoreProperties;

import javax.xml.bind.annotation.XmlRootElement;
import java.util.Date;

//VietNT_20190530_create
@XmlRootElement(name = "AIO_CONFIG_STOCKED_GOODSBO")
@JsonIgnoreProperties(ignoreUnknown = true)
public class AIOConfigStockedGoodsDTO extends ComsBaseFWDTO<AIOConfigStockedGoodsBO> {

    private Long configStockedGoodsId;
    private Long sysGroupId;
    private String sysGroupName;
    private Long goodsId;
    private String goodsCode;
    private String goodsName;
    private Long catUnitId;
    private String catUnitName;
    private Double minQuantity;
    private Double maxQuantity;
    private Double timeStocked;
    private Date createdDate;
    private Long createdUser;
    private Date updatedDate;
    private Long updatedUser;

    private String catUnitCode;

    public String getCatUnitCode() {
        return catUnitCode;
    }

    public void setCatUnitCode(String catUnitCode) {
        this.catUnitCode = catUnitCode;
    }

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
    public AIOConfigStockedGoodsBO toModel() {
        AIOConfigStockedGoodsBO bo = new AIOConfigStockedGoodsBO();
        bo.setConfigStockedGoodsId(this.getConfigStockedGoodsId());
        bo.setSysGroupId(this.getSysGroupId());
        bo.setSysGroupName(this.getSysGroupName());
        bo.setGoodsId(this.getGoodsId());
        bo.setGoodsCode(this.getGoodsCode());
        bo.setGoodsName(this.getGoodsName());
        bo.setCatUnitId(this.getCatUnitId());
        bo.setCatUnitName(this.getCatUnitName());
        bo.setMinQuantity(this.getMinQuantity());
        bo.setMaxQuantity(this.getMaxQuantity());
        bo.setTimeStocked(this.getTimeStocked());
        bo.setCreatedDate(this.getCreatedDate());
        bo.setCreatedUser(this.getCreatedUser());
        bo.setUpdatedDate(this.getUpdatedDate());
        bo.setUpdatedUser(this.getUpdatedUser());
        return bo;
    }

    @Override
    public Long getFWModelId() {
        return configStockedGoodsId;
    }

    @Override
    public String catchName() {
        return configStockedGoodsId.toString();
    }
}
