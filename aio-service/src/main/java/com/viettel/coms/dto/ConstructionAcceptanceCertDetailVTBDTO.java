package com.viettel.coms.dto;

import java.util.Date;
import java.util.List;

public class ConstructionAcceptanceCertDetailVTBDTO extends SynStockTransDetailDTO {

    private Double assetQuantity;
    private Double consQuantity;
    private Double remainQuantity;
    //	private Double amountReal;
    private Long merEntityId;
    private String serial;
    private String constructionCode;
    private Long constructionMerchadiseId;

    private Double numberXuat;
    private Double numberThuhoi;
    private Double numberSuDung;
    private Long employ;
    private Long constructionId;
    private Double quantity;
    private Double slcl;
    private Date realIeTransDate;
    private Long detailSerial;
    private Long workItemId;
    private String workItemName;
    ///

    private List<ConstructionAcceptanceCertItemTBDTO> listTBBDetail;
    private Long totalItemDetail;
    ///

    public Double getAssetQuantity() {
        return assetQuantity;
    }

    public List<ConstructionAcceptanceCertItemTBDTO> getListTBBDetail() {
        return listTBBDetail;
    }

    public void setListTBBDetail(List<ConstructionAcceptanceCertItemTBDTO> listTBBDetail) {
        this.listTBBDetail = listTBBDetail;
    }

    public Long getTotalItemDetail() {
        return totalItemDetail;
    }

    public void setTotalItemDetail(Long totalItemDetail) {
        this.totalItemDetail = totalItemDetail;
    }

    public void setAssetQuantity(Double assetQuantity) {
        this.assetQuantity = assetQuantity;
    }

    public Double getConsQuantity() {
        return consQuantity;
    }

    public void setConsQuantity(Double consQuantity) {
        this.consQuantity = consQuantity;
    }

    public Double getRemainQuantity() {
        return remainQuantity;
    }

    public void setRemainQuantity(Double remainQuantity) {
        this.remainQuantity = remainQuantity;
    }

    public Long getMerEntityId() {
        return merEntityId;
    }

    public void setMerEntityId(Long merEntityId) {
        this.merEntityId = merEntityId;
    }

    public String getSerial() {
        return serial;
    }

    public void setSerial(String serial) {
        this.serial = serial;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public Long getConstructionMerchadiseId() {
        return constructionMerchadiseId;
    }

    public void setConstructionMerchadiseId(Long constructionMerchadiseId) {
        this.constructionMerchadiseId = constructionMerchadiseId;
    }

    public Double getNumberXuat() {
        return numberXuat;
    }

    public void setNumberXuat(Double numberXuat) {
        this.numberXuat = numberXuat;
    }

    public Double getNumberThuhoi() {
        return numberThuhoi;
    }

    public void setNumberThuhoi(Double numberThuhoi) {
        this.numberThuhoi = numberThuhoi;
    }

    public Double getNumberSuDung() {
        return numberSuDung;
    }

    public void setNumberSuDung(Double numberSuDung) {
        this.numberSuDung = numberSuDung;
    }

    public Long getEmploy() {
        return employ;
    }

    public void setEmploy(Long employ) {
        this.employ = employ;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getSlcl() {
        return slcl;
    }

    public void setSlcl(Double slcl) {
        this.slcl = slcl;
    }

    public Date getRealIeTransDate() {
        return realIeTransDate;
    }

    public void setRealIeTransDate(Date realIeTransDate) {
        this.realIeTransDate = realIeTransDate;
    }

    public Long getDetailSerial() {
        return detailSerial;
    }

    public void setDetailSerial(Long detailSerial) {
        this.detailSerial = detailSerial;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

}
