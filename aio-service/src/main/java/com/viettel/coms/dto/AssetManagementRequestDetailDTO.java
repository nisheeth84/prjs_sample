package com.viettel.coms.dto;

import java.util.List;

public class AssetManagementRequestDetailDTO extends AssetManagementRequestDTO {
    private String catStationCode;
    private String codeOrders;
    private String constructionCode;

    private String requestGroupName;
    private String receiveGroupName;
    private String catName;
    private String catCode;
    private String goodsUnitNameEntity;
    private String serialEntity;
    private Long goodIdEntity;
    private Long quantityEntity;
    private String updateFullName;
    private String updateGroupName;
    private Long goodsIdEntity;
    private Double totalPrice;
    private Double amountGoodsCode;
    private String text;
    private Long catProvinceId;
    private String catProvinceCode;
    private String catProvinceName;
    private java.lang.Long stationId;
    private java.lang.String stationCode;

    public Long getCatProvinceId() {
        return catProvinceId;
    }

    public void setCatProvinceId(Long catProvinceId) {
        this.catProvinceId = catProvinceId;
    }

    public String getCatProvinceCode() {
        return catProvinceCode;
    }

    public void setCatProvinceCode(String catProvinceCode) {
        this.catProvinceCode = catProvinceCode;
    }

    public String getCatProvinceName() {
        return catProvinceName;
    }

    public void setCatProvinceName(String catProvinceName) {
        this.catProvinceName = catProvinceName;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Double getAmountGoodsCode() {
        return amountGoodsCode;
    }

    public void setAmountGoodsCode(Double amountGoodsCode) {
        this.amountGoodsCode = amountGoodsCode;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Long getGoodIdEntity() {
        return goodIdEntity;
    }

    public Long getGoodsIdEntity() {
        return goodsIdEntity;
    }

    public void setGoodsIdEntity(Long goodsIdEntity) {
        this.goodsIdEntity = goodsIdEntity;
    }

    public String getUpdateFullName() {
        return updateFullName;
    }

    public void setUpdateFullName(String updateFullName) {
        this.updateFullName = updateFullName;
    }

    public String getUpdateGroupName() {
        return updateGroupName;
    }

    public void setUpdateGroupName(String updateGroupName) {
        this.updateGroupName = updateGroupName;
    }

    public void setGoodIdEntity(Long goodIdEntity) {
        this.goodIdEntity = goodIdEntity;
    }

    public Long getQuantityEntity() {
        return quantityEntity;
    }

    public void setQuantityEntity(Long quantityEntity) {
        this.quantityEntity = quantityEntity;
    }

    public String getCatCode() {
        return catCode;
    }

    public String getSerialEntity() {
        return serialEntity;
    }

    public void setSerialEntity(String serialEntity) {
        this.serialEntity = serialEntity;
    }

    public String getGoodsUnitNameEntity() {
        return goodsUnitNameEntity;
    }

    public void setGoodsUnitNameEntity(String goodsUnitNameEntity) {
        this.goodsUnitNameEntity = goodsUnitNameEntity;
    }

    public void setCatCode(String catCode) {
        this.catCode = catCode;
    }

    public String getCatName() {
        return catName;
    }

    public void setCatName(String catName) {
        this.catName = catName;
    }

    public Long getCatStockId() {
        return catStockId;
    }

    public void setCatStockId(Long catStockId) {
        this.catStockId = catStockId;
    }

    private Long catStockId;
    //	private Long constructionId;
    List<AssetManageRequestEntityDTO> amrdDSVTDTOList1;

    public List<AssetManageRequestEntityDTO> getAmrdDSVTDTOList1() {
        return amrdDSVTDTOList1;
    }

    public void setAmrdDSVTDTOList1(List<AssetManageRequestEntityDTO> amrdDSVTDTOList1) {
        this.amrdDSVTDTOList1 = amrdDSVTDTOList1;
    }

    public String getCodeOrders() {
        return codeOrders;
    }

    public void setCodeOrders(String codeOrders) {
        this.codeOrders = codeOrders;
    }

    List<UtilAttachDocumentDTO> listFileTHVTTB;
    List<AssetManageRequestEntityDetailDTO> amrdDSVTDTOList;

    public List<AssetManageRequestEntityDetailDTO> getAmrdDSTBDTOList() {
        return amrdDSTBDTOList;
    }

    public void setAmrdDSTBDTOList(List<AssetManageRequestEntityDetailDTO> amrdDSTBDTOList) {
        this.amrdDSTBDTOList = amrdDSTBDTOList;
    }

    private List<AssetManageRequestEntityDetailDTO> amrdDSTBDTOList;

    public List<AssetManageRequestEntityDetailDTO> getAmrdDSVTDTOList() {
        return amrdDSVTDTOList;
    }

    public void setAmrdDSVTDTOList(List<AssetManageRequestEntityDetailDTO> amrdDSVTDTOList) {
        this.amrdDSVTDTOList = amrdDSVTDTOList;
    }

    public List<UtilAttachDocumentDTO> getListFileTHVTTB() {
        return listFileTHVTTB;
    }

    public void setListFileTHVTTB(List<UtilAttachDocumentDTO> listFileTHVTTB) {
        this.listFileTHVTTB = listFileTHVTTB;
    }

    public String getReasonName() {
        return reasonName;
    }

    public void setReasonName(String reasonName) {
        this.reasonName = reasonName;
    }

    private String reasonName;

    //	public Long getConstructionId() {
//		return constructionId;
//	}
//	public void setConstructionId(Long constructionId) {
//		this.constructionId = constructionId;
//	}
    private List<String> listStatus;

    public List<String> getListStatus() {
        return listStatus;
    }

    public void setListStatus(List<String> listStatus) {
        this.listStatus = listStatus;
    }

    public String getCatStationCode() {
        return catStationCode;
    }

    public void setCatStationCode(String catStationCode) {
        this.catStationCode = catStationCode;
    }

    public String getConstructionCode() {
        return constructionCode;
    }

    public void setConstructionCode(String constructionCode) {
        this.constructionCode = constructionCode;
    }

    public String getRequestGroupName() {
        return requestGroupName;
    }

    public void setRequestGroupName(String requestGroupName) {
        this.requestGroupName = requestGroupName;
    }

    public String getReceiveGroupName() {
        return receiveGroupName;
    }

    public void setReceiveGroupName(String receiveGroupName) {
        this.receiveGroupName = receiveGroupName;
    }

	public java.lang.Long getStationId() {
		return stationId;
	}

	public void setStationId(java.lang.Long stationId) {
		this.stationId = stationId;
	}

	public java.lang.String getStationCode() {
		return stationCode;
	}

	public void setStationCode(java.lang.String stationCode) {
		this.stationCode = stationCode;
	}

}
