package com.viettel.coms.dto;

import java.util.List;

public class ConstructionAcceptanceCertDetailVTADTO extends SynStockTransDetailSerialDTO {
    private String goodsUnitName;
    private String realIeTransDate;
    private Long constructionId;
    private Long workItemId;
    private String workItemName;
    private String goodsIsSerial;
    private Double conMerquantity;
    private Double numberXuat;
    private Double numberThuhoi;
    private Double numberNghiemthu;
    //

    private Double numberNghiemThuKhac;
    private Double numberDaNghiemThu;
    private Long totalItemDetail;
//    hoanm1_20190131_start
    private Double numberNghiemthuDB;

    public Double getNumberNghiemthuDB() {
		return numberNghiemthuDB;
	}

	public void setNumberNghiemthuDB(Double numberNghiemthuDB) {
		this.numberNghiemthuDB = numberNghiemthuDB;
	}
//	hoanm1_20190131_end

	private Double quantity;
    private Long employ;
    private List<ConstructionAcceptanceCertItemTBDTO> listTBADetail;

    public Long getTotalItemDetail() {
        return totalItemDetail;
    }

    public void setTotalItemDetail(Long totalItemDetail) {
        this.totalItemDetail = totalItemDetail;
    }

    public List<ConstructionAcceptanceCertItemTBDTO> getListTBADetail() {
        return listTBADetail;
    }

    public void setListTBADetail(List<ConstructionAcceptanceCertItemTBDTO> listTBADetail) {
        this.listTBADetail = listTBADetail;
    }

    public Double getNumberDaNghiemThu() {
        return numberDaNghiemThu;
    }

    public void setNumberDaNghiemThu(Double numberDaNghiemThu) {
        this.numberDaNghiemThu = numberDaNghiemThu;
    }

    public Double getNumberNghiemThuKhac() {
        return numberNghiemThuKhac;
    }

    public void setNumberNghiemThuKhac(Double numberNghiemThuKhac) {
        this.numberNghiemThuKhac = numberNghiemThuKhac;
    }

    public Long getEmploy() {
        return employ;
    }

    public void setEmploy(Long employ) {
        this.employ = employ;
    }

    public String getWorkItemName() {
        return workItemName;
    }

    public void setWorkItemName(String workItemName) {
        this.workItemName = workItemName;
    }

    public String getGoodsUnitName() {
        return goodsUnitName;
    }

    public void setGoodsUnitName(String goodsUnitName) {
        this.goodsUnitName = goodsUnitName;
    }

    public String getRealIeTransDate() {
        return realIeTransDate;
    }

    public void setRealIeTransDate(String realIeTransDate) {
        this.realIeTransDate = realIeTransDate;
    }

    public Long getConstructionId() {
        return constructionId;
    }

    public void setConstructionId(Long constructionId) {
        this.constructionId = constructionId;
    }

    public Long getWorkItemId() {
        return workItemId;
    }

    public void setWorkItemId(Long workItemId) {
        this.workItemId = workItemId;
    }

    public String getGoodsIsSerial() {
        return goodsIsSerial;
    }

    public void setGoodsIsSerial(String goodsIsSerial) {
        this.goodsIsSerial = goodsIsSerial;
    }

    public Double getConMerquantity() {
        return conMerquantity;
    }

    public void setConMerquantity(Double conMerquantity) {
        this.conMerquantity = conMerquantity;
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

    public Double getNumberNghiemthu() {
        return numberNghiemthu;
    }

    public void setNumberNghiemthu(Double numberNghiemthu) {
        this.numberNghiemthu = numberNghiemthu;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

}
