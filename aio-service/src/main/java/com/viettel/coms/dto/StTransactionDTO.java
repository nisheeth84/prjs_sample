package com.viettel.coms.dto;

import com.viettel.coms.bo.StTransactionBO;

public class StTransactionDTO extends ComsBaseFWDTO<StTransactionBO> {
    private Long stTransactionId;
    private String confirmDate;
    private String description;
    private String updatedDate;
    private Long updatedUserId;
    private Long oldLastShipperId;
    private Long newLastShipperId;
    private Long stockTransId;
    private String type;
    private String confirm;
    private String createdDate;
    private Long createdUserId;
    private String stockTransCode;
    private Long synStockTransId;
    private String stockTransConstructionCode;
    private String stockTransName;
    private String stockTransCreatedByName;
    private String stockTransCreatedDate;

    private String synStockTransCode;
    private String synStockTransConstructionCode;
    private String synStockTransName;
    private String synStockTransCreatedByName;
    private String synStockTransCreatedDate;
    private String ConstructionCode;

    private String goodName;
    private String goodUnitName;
    private Double amountReal;

    @Override
    public StTransactionBO toModel() {
        StTransactionBO stTransactionBO = new StTransactionBO();
        stTransactionBO.setDescription(this.description);
        stTransactionBO.setUpdatedDate(this.updatedDate);
        stTransactionBO.setOldLastShipperId(this.oldLastShipperId);
        stTransactionBO.setNewLastShipperId(this.newLastShipperId);
        stTransactionBO.setStockTransId(this.stockTransId);
        stTransactionBO.setType(this.type);
        stTransactionBO.setConfirm(this.confirm);
        stTransactionBO.setCreatedDate(this.createdDate);
        stTransactionBO.setCreatedUserId(this.createdUserId);
        return stTransactionBO;
    }

    public Long getStTransactionId() {
        return stTransactionId;
    }

    public void setStTransactionId(Long stTransactionId) {
        this.stTransactionId = stTransactionId;
    }

    public String getConfirmDate() {
        return confirmDate;
    }

    public void setConfirmDate(String confirmDate) {
        this.confirmDate = confirmDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(String updatedDate) {
        this.updatedDate = updatedDate;
    }

    public Long getUpdatedUserId() {
        return updatedUserId;
    }

    public void setUpdatedUserId(Long updatedUserId) {
        this.updatedUserId = updatedUserId;
    }

    public Long getOldLastShipperId() {
        return oldLastShipperId;
    }

    public void setOldLastShipperId(Long oldLastShipperId) {
        this.oldLastShipperId = oldLastShipperId;
    }

    public Long getNewLastShipperId() {
        return newLastShipperId;
    }

    public void setNewLastShipperId(Long newLastShipperId) {
        this.newLastShipperId = newLastShipperId;
    }

    public Long getStockTransId() {
        return stockTransId;
    }

    public void setStockTransId(Long stockTransId) {
        this.stockTransId = stockTransId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getConfirm() {
        return confirm;
    }

    public void setConfirm(String confirm) {
        this.confirm = confirm;
    }

    public String getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(String createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCreatedUserId() {
        return createdUserId;
    }

    public void setCreatedUserId(Long createdUserId) {
        this.createdUserId = createdUserId;
    }

    public String getStockTransCode() {
        return stockTransCode;
    }

    public void setStockTransCode(String stockTransCode) {
        this.stockTransCode = stockTransCode;
    }

    public Long getSynStockTransId() {
        return synStockTransId;
    }

    public void setSynStockTransId(Long synStockTransId) {
        this.synStockTransId = synStockTransId;
    }

    public String getStockTransName() {
        return stockTransName;
    }

    public void setStockTransName(String stockTransName) {
        this.stockTransName = stockTransName;
    }

    public String getStockTransCreatedByName() {
        return stockTransCreatedByName;
    }

    public void setStockTransCreatedByName(String stockTransCreatedByName) {
        this.stockTransCreatedByName = stockTransCreatedByName;
    }

    public String getStockTransCreatedDate() {
        return stockTransCreatedDate;
    }

    public void setStockTransCreatedDate(String stockTransCreatedDate) {
        this.stockTransCreatedDate = stockTransCreatedDate;
    }

    public String getSynStockTransCode() {
        return synStockTransCode;
    }

    public void setSynStockTransCode(String synStockTransCode) {
        this.synStockTransCode = synStockTransCode;
    }

    public String getSynStockTransName() {
        return synStockTransName;
    }

    public void setSynStockTransName(String synStockTransName) {
        this.synStockTransName = synStockTransName;
    }

    public String getSynStockTransCreatedByName() {
        return synStockTransCreatedByName;
    }

    public void setSynStockTransCreatedByName(String synStockTransCreatedByName) {
        this.synStockTransCreatedByName = synStockTransCreatedByName;
    }

    public String getSynStockTransCreatedDate() {
        return synStockTransCreatedDate;
    }

    public void setSynStockTransCreatedDate(String synStockTransCreatedDate) {
        this.synStockTransCreatedDate = synStockTransCreatedDate;
    }

    public String getStockTransConstructionCode() {
        return stockTransConstructionCode;
    }

    public void setStockTransConstructionCode(String stockTransConstructionCode) {
        this.stockTransConstructionCode = stockTransConstructionCode;
    }

    public String getSynStockTransConstructionCode() {
        return synStockTransConstructionCode;
    }

    public void setSynStockTransConstructionCode(String synStockTransConstructionCode) {
        this.synStockTransConstructionCode = synStockTransConstructionCode;
    }

    public String getConstructionCode() {
        return ConstructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        ConstructionCode = constructionCode;
    }

    public String getGoodName() {
        return goodName;
    }

    public void setGoodName(String goodName) {
        this.goodName = goodName;
    }

    public String getGoodUnitName() {
        return goodUnitName;
    }

    public void setGoodUnitName(String goodUnitName) {
        this.goodUnitName = goodUnitName;
    }

    public Double getAmountReal() {
        return amountReal;
    }

    public void setAmountReal(Double amountReal) {
        this.amountReal = amountReal;
    }

    @Override
    public String catchName() {
        return getStTransactionId().toString();
    }

    @Override
    public Long getFWModelId() {
        return stTransactionId;
    }

}
